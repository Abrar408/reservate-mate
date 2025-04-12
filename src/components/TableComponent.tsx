
import React, { useRef } from "react";
import { Table } from "@/types/restaurant";
import { useDrop, useDrag } from "react-dnd";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TableComponentProps {
  table: Table;
  scale: number;
}

const TableComponent: React.FC<TableComponentProps> = ({ table, scale }) => {
  const { assignReservation, unassignReservation, updateTablePosition } = useRestaurant();
  const ref = useRef<HTMLDivElement>(null);

  // Handle reservation dropping on table
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'RESERVATION',
    drop: (item: { id: string }) => {
      assignReservation(item.id, table.id);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
    canDrop: () => table.status === 'available',
  }));

  // Handle table dragging
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TABLE',
    item: { id: table.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      const offset = monitor.getDifferenceFromInitialOffset();
      
      if (offset) {
        // Convert the offset back to floor plan coordinates considering the scale
        const newX = table.x + (offset.x / scale);
        const newY = table.y + (offset.y / scale);
        updateTablePosition(table.id, newX, newY);
      }
    }
  }));

  // Connect the drop and drag refs to the same component
  drag(drop(ref));

  // Determine the table style based on shape and status
  const getTableStyle = () => {
    let baseStyle = "flex items-center justify-center relative transition-all duration-200 ";
    
    // Add shape styles
    if (table.shape === 'circle') {
      baseStyle += "rounded-full ";
    } else if (table.shape === 'square' || table.shape === 'rectangle') {
      baseStyle += "rounded-lg ";
    }
    
    // Add status colors
    if (isOver && canDrop) {
      baseStyle += "bg-green-200 border-2 border-green-500 shadow-lg transform scale-105 ";
    } else if (canDrop) {
      baseStyle += "bg-blue-50 border border-blue-300 ";
    } else if (table.status === 'available') {
      baseStyle += "bg-white border border-gray-300 ";
    } else if (table.status === 'reserved') {
      baseStyle += "bg-blue-100 border border-blue-500 ";
    } else if (table.status === 'occupied') {
      baseStyle += "bg-gray-200 border border-gray-500 ";
    }

    if (isDragging) {
      baseStyle += "opacity-50 cursor-grabbing ";
    } else {
      baseStyle += "cursor-grab ";
    }
    
    return baseStyle;
  };

  return (
    <div 
      ref={ref}
      style={{
        position: 'absolute',
        left: `${table.x}px`,
        top: `${table.y}px`,
        width: `${table.width}px`,
        height: `${table.height}px`,
      }}
      className={getTableStyle()}
    >
      <div className="text-center">
        <div className="font-bold">Table {table.number}</div>
        <div className="text-xs">Seats: {table.seats}</div>
        {isOver && canDrop && (
          <div className="text-xs text-green-700 font-semibold mt-1">Drop to assign</div>
        )}
      </div>
      
      {table.status === 'reserved' && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-100 hover:bg-red-200"
          onClick={() => unassignReservation(table.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default TableComponent;
