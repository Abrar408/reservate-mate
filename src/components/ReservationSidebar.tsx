
import React from "react";
import { useRestaurant } from "@/contexts/RestaurantContext";
import ReservationCard from "./ReservationCard";

const ReservationSidebar: React.FC = () => {
  const { reservations } = useRestaurant();

  return (
    <div className="w-full h-full bg-muted/20 p-4 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Reservations</h2>
        <p className="text-sm text-muted-foreground">Drag reservations to tables</p>
      </div>
      <div className="space-y-2">
        {reservations.map((reservation) => (
          <ReservationCard key={reservation.id} reservation={reservation} />
        ))}
      </div>
    </div>
  );
};

export default ReservationSidebar;
