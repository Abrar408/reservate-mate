
import React from "react";
import { useRestaurant } from "@/contexts/RestaurantContext";
import TableComponent from "./TableComponent";

const FloorPlan: React.FC = () => {
  const { tables } = useRestaurant();

  return (
    <div className="w-full h-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden relative">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">Floor Plan</h2>
        <p className="text-sm text-muted-foreground mb-4">Drag reservations to tables to assign them</p>
      </div>
      
      <div className="relative w-full h-[calc(100%-80px)] overflow-auto">
        <div style={{ position: 'relative', width: '800px', height: '600px' }}>
          {tables.map((table) => (
            <TableComponent key={table.id} table={table} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloorPlan;
