
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ReservationSidebar from "./ReservationSidebar";
import FloorPlan from "./FloorPlan";
import { RestaurantProvider } from "@/contexts/RestaurantContext";

const RestaurantLayout: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <RestaurantProvider>
        <div className="flex flex-col h-screen">
          <div className="p-4 bg-white border-b">
            <h1 className="text-2xl font-bold">Restaurant Floor Plan</h1>
          </div>
          <div className="flex flex-1 overflow-hidden">
            <div className="w-80 border-r">
              <ReservationSidebar />
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <FloorPlan />
            </div>
          </div>
        </div>
      </RestaurantProvider>
    </DndProvider>
  );
};

export default RestaurantLayout;
