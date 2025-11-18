import { JSX } from "react";
import { Layout } from "react-grid-layout";
import { ReactElement } from "react";

export interface Widget {
  id: string;
  title: string;
  component: ReactElement;
}

export interface WidgetOnLayout {
  position: Layout;
  widget: Widget;
}

export interface UseResizeReturn {
  wrapperWidth: number;
  height: number;
}

export interface WidgetCardProps {
  children: React.ReactNode;
  className?: string;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}