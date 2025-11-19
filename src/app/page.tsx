"use client"

import React from 'react'
import CheckboxList from '../components/checkbox.jsx'
import HintsBox from '../components/hintsBox.jsx'
import CountdownTimer from '../components/timer.jsx'
import VidSection from '../components/cameraSection.jsx'

import { useCallback, useEffect, useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";

import { v4 as uuidv4 } from 'uuid';
let uuid = uuidv4(); 

import "react-grid-layout/css/styles.css";
import "./ReportsGridResizeHandle.css";
import {
  UseResizeReturn,
  Widget,
  WidgetCardProps,
  WidgetOnLayout,
} from "../components/types";

// Custom hook to handle responsive resizing of the grid container
const useResize = (): UseResizeReturn => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Get the main container element
    const reportsElement = document.getElementById("reports");

    // Update dimensions when container size changes
    const handleResize = () => {
      if (!reportsElement) return;
      setDimensions({
        width: reportsElement.offsetWidth,
        height: reportsElement.offsetHeight,
      });
    };

    // Use ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(handleResize);
    if (reportsElement) {
      resizeObserver.observe(reportsElement);
    }

    // Cleanup observer on unmount
    return () => resizeObserver.disconnect();
  }, []);

  // Calculate the height of each grid box accounting for gaps
  const totalGapHeight = (GRID_CONFIG.MAX_ROWS - 1) * GRID_CONFIG.GAP;
  const boxHeight = (dimensions.height - totalGapHeight) / GRID_CONFIG.MAX_ROWS;

  return { wrapperWidth: dimensions.width, height: boxHeight };
};

// Header component for each widget with drag handle
const HeaderItem = ({ title }: { title: string }) => (
  <div className="px-4 py-2 flex cursor-grab items-center justify-between border-b border-silver">
    <div className="draggable-handle text-back font-semibold flex-1">
      {title}
    </div>
  </div>
);

// Sample widget content component showing a large number
  
const Timer = () => (

  <div className = "wrapper">
        <CountdownTimer/>
      </div>
);



// Container component for widgets with drag functionality
const WidgetCard = ({
  children,
  className = "",
  draggable,
  onDragStart,
}: WidgetCardProps) => (
  <div
    className={`rounded-sm flex flex-col border border-silver bg-yellow-500 ${className}`}
    draggable={draggable}
    onDragStart={onDragStart}
  >
    {children}
  </div>
);

// Grid configuration constants
const GRID_CONFIG = {
  COLS: 10,
  MAX_ROWS: 10,
  GAP: 20,
} as const;



export default function App() {


  const[hints, setHints] = useState([
    {"id": 0, 
        "text": "Test1",
        "hint": "Hint1",
        "display": false}, 
    {"id": 1,
        "text": "Test2",
        "hint": "Hint2",
        "display": false},
    {"id":2,
        "text": "Test3",
        "hint": "Hint3",
        "display": false}]);

const [changedDisplay, setChangedDisplay] =useState(true);
const [hintId, setHintId] = useState(0);
const [urls, setUrls] = useState(["http://192.168.6.2:8083/stream/R14C/channel/0/webrtc", "http://192.168.6.2:8083/stream/Z-Immun/channel/0/webrtc"])
    
/*const progCheck = (searchID) => {
  const newHints = hints;
  newHints[searchID].display = !hints[searchID].display;
  setHints(newHints);
  setChangedDisplay(!changedDisplay);
}*/

const progCheck = (searchID) => {
  setChangedDisplay(!changedDisplay);
  setHintId(searchID);
}

// Initial available widgets data
const INITIAL_WIDGETS: Widget[] = [
  {
    id: "1",
    title: "Spiel-Progress",
    component: <CheckboxList progCheck = {progCheck} hints= {hints}/>,
  },
  {
    id: "2",
    title: "Spielzeit",
    component: <Timer />,
  },
  {
    id: "3",
    title: "Hinweise",
    component: <HintsBox hints = {hints} id = {hintId} changed = {changedDisplay} />,
  },
  {
    id: "4",
    title: "Hinweise",
    component: <HintsBox hints = {hints} id = {hintId} changed = {changedDisplay} />,
  },
  {
    id: "5",
    title: "Videos",
    component: <VidSection urls = {urls}/>,
  }
  
];

// Initial layout configuration
const INITIAL_LAYOUT: WidgetOnLayout[] = [
  {
    position: { i: "0", x: 0, y: 0, w: 1, h: 2 },
    widget: { id: "0", title: "Line Chart", component: <CheckboxList progCheck = {progCheck} hints = {hints} /> },
  },
  {
    position: { i: "2", x: 1, y: 0, w: 2, h: 5 },
    widget: { id: "2", title: "Work orders", component: <Timer /> },
  },
];


  // Get responsive dimensions from custom hook
  const { wrapperWidth, height } = useResize();

  // State for tracking widgets in the grid and available widgets
  const [widgetsOnLayout, setWidgetsOnLayout] =
    useState<WidgetOnLayout[]>(INITIAL_LAYOUT);
  const [availableWidgets, setAvailableWidgets] =
    useState<Widget[]>(INITIAL_WIDGETS);

  // Handle dropping a widget from the sidebar onto the grid
  const handleOndrop = (
    _l: GridLayout.Layout[],
    i: GridLayout.Layout,
    e: Event
  ) => {
    const id = (e as DragEvent).dataTransfer?.getData("text/plain");
    if (!id) throw new Error("Invalid widget id");

    // Find the dragged widget from available widgets
    const draggedWidget = availableWidgets.find((widget) => widget.id === id);
    if (draggedWidget === undefined) throw new Error("Widget not found");

    // Add widget to grid and remove from available widgets
    setWidgetsOnLayout((prev) => [
      ...prev,
      {
        position: { i: uuid, x: i.x, y: i.y, w: 1, h: 1 },
        widget: draggedWidget,
      },
    ]);
    setAvailableWidgets((prev) => prev.filter((widget) => widget.id !== id));
  };

  // Update layout state when widgets are moved or resized
  const handleLayoutChange = useCallback((newLayout: Layout[]) => {
    setWidgetsOnLayout((prev) =>
      newLayout.map((layout) => {
        const widget = prev.find((w) => w.position.i === layout.i)?.widget;
        if (!widget) throw new Error(`Widget not found for layout ${layout.i}`);
        return { position: layout, widget };
      })
    );
  }, []);

  // Create placeholder grid layout
  const placeholderLayout = Array.from({
    length: GRID_CONFIG.COLS * GRID_CONFIG.MAX_ROWS,
  }).map((_, index) => ({
    i: index.toString(),
    x: index % GRID_CONFIG.COLS,
    y: Math.floor(index / GRID_CONFIG.COLS),
    w: 1,
    h: 1,
  }));

  return (
    <div className="gap-2 flex h-full w-full flex-1 bg-red-900">
      {/* Main grid container */}
      <div className="relative h-auto w-full bg-blue-900" id="reports">
        {/* Placeholder grid showing empty spaces */}
        <div className="top-0 left-0 absolute h-full w-full">
          <GridLayout
            layout={placeholderLayout}
            cols={4}
            rowHeight={height}
            width={wrapperWidth}
            isDraggable={false}
            isResizable={false}
            maxRows={3}
          >
            {placeholderLayout.map((item) => (
              <div key={item.i} className="rounded-sm bg-white" />
            ))}
          </GridLayout>
        </div>

        {/* Active grid with widgets */}
        <GridLayout
          layout={widgetsOnLayout.map((widget) => widget.position)}
          cols={GRID_CONFIG.COLS}
          rowHeight={height}
          width={wrapperWidth}
          maxRows={GRID_CONFIG.MAX_ROWS}
          isDroppable={true}
          onDrop={handleOndrop}
          resizeHandles={["s", "e", "w"]}
          onResizeStop={handleLayoutChange}
          onDragStop={handleLayoutChange}
          preventCollision={true}
          compactType={"vertical"}
          draggableHandle=".draggable-handle"
        >
          {widgetsOnLayout.map((widget) => (
            <div key={widget.position.i}>
              <WidgetCard className="h-full">
                <HeaderItem title={widget.widget.title} />
                {widget.widget.component}
              </WidgetCard>
            </div>
          ))}
        </GridLayout>
      </div>

      <div>
        <VidSection urls = {urls}/>
        <HintsBox hints = {hints} id = {hintId} changed = {changedDisplay} />
        <CheckboxList progCheck = {progCheck} hints = {hints} />
      </div>

      {/* Sidebar with available widgets */}
      <aside className="w-96 p-4 bg-green-600 h-screen overflow-auto">
        <h2 className="font-semibold">Available Widgets</h2>
        {availableWidgets.map((widget) => (
          <WidgetCard
            key={widget.id}
            className="mt-2"
            draggable={true}
            onDragStart={(e: React.DragEvent) => {
              e.dataTransfer.setData("text/plain", widget.id);
            }}
          >
            <HeaderItem title={widget.title} />
            <div className="p-4 flex-1 overflow-auto">{widget.component}</div>
          </WidgetCard>
        ))}
      </aside>
    </div>
  );
}

