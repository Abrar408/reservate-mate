
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Reservation } from "@/types/restaurant";
import { useDrag } from "react-dnd";

interface ReservationCardProps {
  reservation: Reservation;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'RESERVATION',
    item: { id: reservation.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () => reservation.status === 'pending',
  }));

  return (
    <div
      ref={drag}
      className={`transition-all duration-200 ${isDragging ? 'opacity-40 transform scale-95' : ''} 
                  ${reservation.status !== 'pending' ? 'opacity-60' : ''}`}
    >
      <Card className={`mb-3 cursor-grab border-l-4 border-l-blue-500 ${
        reservation.status === 'pending' ? 'hover:shadow-md' : ''
      }`}>
        <CardContent className="p-3">
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{reservation.name}</span>
              <span className="text-sm text-muted-foreground">{reservation.time}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm">Party: {reservation.party}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                reservation.status === 'assigned' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {reservation.status}
              </span>
            </div>
            {reservation.status === 'pending' && (
              <div className="text-xs text-blue-700 mt-1">Drag to assign to a table</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationCard;
