
import React, { useState, useRef, useEffect } from "react";
import { useRestaurant } from "@/contexts/RestaurantContext";
import TableComponent from "./TableComponent";
import { ZoomIn, ZoomOut, Move, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

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

  const handleResetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault(); // This prevents the browser from zooming
    
    if (e.ctrlKey || e.metaKey) {
      // Zoom with wheel + ctrl/cmd key
      const delta = e.deltaY * -0.01;
      const newScale = Math.min(Math.max(scale + delta, 0.5), 3);
      
      // Calculate zoom center point (mouse position)
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Calculate new position to zoom towards mouse
        const oldScale = scale;
        const newX = position.x - (mouseX - position.x) * (newScale / oldScale - 1);
        const newY = position.y - (mouseY - position.y) * (newScale / oldScale - 1);
        
        setScale(newScale);
        setPosition({ x: newX, y: newY });
      } else {
        setScale(newScale);
      }
    } else {
      // Pan with wheel
      setPosition(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  };

  // Add effect to prevent browser zoom on the container
  useEffect(() => {
    const preventZoom = (e: WheelEvent) => {
      // Check if the event occurred within the container
      if (containerRef.current?.contains(e.target as Node)) {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
        }
      }
    };
    
    // Add the event listener to the window for better coverage
    window.addEventListener('wheel', preventZoom, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', preventZoom);
    };
  }, []);

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

  // Handle touch events for mobile gesture zooming
  const touchStartDistance = useRef<number | null>(null);
  const touchStartScale = useRef<number>(1);
  const touchStartPosition = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Store initial distance between two fingers for pinch zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDistance.current = Math.sqrt(dx * dx + dy * dy);
      touchStartScale.current = scale;
      
      // Calculate midpoint of the two touches
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      
      touchStartPosition.current = { x: midX, y: midY };
    } else if (e.touches.length === 1) {
      // Handle pan
      touchStartPosition.current = { 
        x: e.touches[0].clientX - position.x, 
        y: e.touches[0].clientY - position.y 
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent page scrolling
    
    if (e.touches.length === 2 && touchStartDistance.current !== null) {
      // Handle pinch zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate new scale based on the change in distance
      const newScale = Math.min(Math.max(touchStartScale.current * (distance / touchStartDistance.current), 0.5), 3);
      
      // Calculate midpoint of the two touches
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      
      // Adjust position to zoom around the touch midpoint
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setScale(newScale);
      }
    } else if (e.touches.length === 1) {
      // Handle pan
      setPosition({
        x: e.touches[0].clientX - touchStartPosition.current.x,
        y: e.touches[0].clientY - touchStartPosition.current.y,
      });
    }
  };

  const handleTouchEnd = () => {
    touchStartDistance.current = null;
  };

  return (
    <div className="w-full h-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden relative flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold mb-2">Floor Plan</h2>
        <p className="text-sm text-muted-foreground mb-4">Drag reservations to tables to assign them</p>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn size={16} className="mr-1" /> Zoom In
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut size={16} className="mr-1" /> Zoom Out
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetView}>
            <RefreshCw size={16} className="mr-1" /> Reset View
          </Button>
          <div className="ml-2 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Zoom:</span>
            <div className="w-24">
              <Slider
                value={[scale * 100]}
                min={50}
                max={300}
                step={10}
                onValueChange={([value]) => setScale(value / 100)}
              />
            </div>
            <span className="text-sm text-muted-foreground">{Math.round(scale * 100)}%</span>
          </div>
          <div className="text-sm text-muted-foreground flex items-center">
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
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={containerRef}
      >
        <div 
          className="floor-background absolute"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            width: '10000px',
            height: '10000px',
            left: '-5000px',
            top: '-5000px',
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
