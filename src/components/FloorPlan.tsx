
import React, { useState, useRef } from "react";
import { useRestaurant } from "@/contexts/RestaurantContext";
import TableComponent from "./TableComponent";
import { ZoomIn, ZoomOut, Move } from "lucide-react";
import { Button } from "@/components/ui/button";

const FloorPlan: React.FC = () => {
  const { tables, updateTablePosition } = useRestaurant();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle zoom functionality
  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  // Handle panning functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).classList.contains('floor-background')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full h-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden relative flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold mb-2">Floor Plan</h2>
        <p className="text-sm text-muted-foreground mb-4">Drag reservations to tables to assign them</p>
        
        <div className="flex space-x-2 items-center">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn size={16} className="mr-1" /> Zoom In
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut size={16} className="mr-1" /> Zoom Out
          </Button>
          <div className="ml-2 text-sm text-muted-foreground">
            Zoom: {Math.round(scale * 100)}%
          </div>
          <div className="ml-4 text-sm text-muted-foreground flex items-center">
            <Move size={16} className="mr-1" /> Click and drag to move floor plan
          </div>
        </div>
      </div>
      
      <div 
        className="relative flex-1 overflow-hidden cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        ref={containerRef}
      >
        <div 
          className="floor-background absolute w-[5000px] h-[5000px] bg-white"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          {tables.map((table) => (
            <TableComponent key={table.id} table={table} scale={scale} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloorPlan;
