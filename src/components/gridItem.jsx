"use client"

const GridItem = ({item, header, id, def, removeItem}) => {
  if (!def){
    return(
    <div className="status-section h-full">
    <div className="px-4 py-2 flex cursor-grab items-center justify-between  section-head">
    <div className="draggable-handle text-back font-semibold flex-1">
      {header}
      <div><button onClick={()=>removeItem(id)}>Item Löschen</button></div>
      
    </div>
    </div>
    <div>{item}</div>
    </div> 
    )}
  if (def){
    return(
    <div className="status-section h-full">
    <div className="px-4 py-2 flex cursor-grab items-center justify-between  section-head">
    <div className="draggable-handle text-back font-semibold flex-1">
      {header}
    </div>
    </div>
    <div>{item}</div>
    </div> 
    )
  }
  
}

export default GridItem