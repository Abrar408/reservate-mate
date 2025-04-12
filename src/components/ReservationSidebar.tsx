
import React from "react";
import { useDrag } from "react-dnd";
import { Table2, CircleIcon, Square, RectangleHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define table type templates
const tableTypes = [
  { id: "square", name: "Square Table", seats: 2, shape: "square", width: 80, height: 80, icon: Square },
  { id: "rectangle", name: "Rectangle Table", seats: 4, shape: "rectangle", width: 120, height: 80, icon: RectangleHorizontal },
  { id: "large-rectangle", name: "Large Table", seats: 6, shape: "rectangle", width: 150, height: 80, icon: Table2 },
  { id: "circle", name: "Round Table", seats: 2, shape: "circle", width: 80, height: 80, icon: CircleIcon },
];

// Component for a draggable table type item
const TableTypeItem = ({ type }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'NEW_TABLE',
    item: { tableType: type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 mb-2 bg-white border rounded-lg shadow-sm cursor-move transition-all ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-md">
          <type.icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{type.name}</h3>
          <p className="text-xs text-muted-foreground">Seats: {type.seats}</p>
        </div>
      </div>
    </div>
  );
};

const ReservationSidebar: React.FC = () => {
  return (
    <div className="w-full h-full bg-muted/20 p-4 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Table Types</h2>
        <p className="text-sm text-muted-foreground">Drag table types to the floor plan</p>
      </div>
      <div className="space-y-2">
        {tableTypes.map((type) => (
          <TableTypeItem key={type.id} type={type} />
        ))}
      </div>
    </div>
  );
};

export default ReservationSidebar;
