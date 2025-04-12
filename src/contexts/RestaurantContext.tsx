
import React, { createContext, useContext, useState } from "react";
import { Reservation, Table } from "@/types/restaurant";
import { sampleReservations, sampleTables } from "@/data/sampleData";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

interface RestaurantContextType {
  reservations: Reservation[];
  tables: Table[];
  assignReservation: (reservationId: string, tableId: string) => void;
  unassignReservation: (tableId: string) => void;
  updateTablePosition: (tableId: string, newX: number, newY: number) => void;
  addNewTable: (tableType: { id: string, seats: number, shape: string, width: number, height: number, x: number, y: number }) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
};

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>(sampleReservations);
  const [tables, setTables] = useState<Table[]>(sampleTables);
  const [tableCounter, setTableCounter] = useState<number>(sampleTables.length);
  const { toast } = useToast();

  const assignReservation = (reservationId: string, tableId: string) => {
    // Find the reservation and table
    const reservation = reservations.find(r => r.id === reservationId);
    const table = tables.find(t => t.id === tableId);

    if (!reservation || !table) {
      toast({
        title: "Error",
        description: "Reservation or table not found",
        variant: "destructive"
      });
      return;
    }

    // Check if table has enough seats
    if (table.seats < reservation.party) {
      toast({
        title: "Cannot assign reservation",
        description: `Table ${table.number} has only ${table.seats} seats, but the party size is ${reservation.party}`,
        variant: "destructive"
      });
      return;
    }

    // Check if table is available
    if (table.status !== "available") {
      toast({
        title: "Table not available",
        description: `Table ${table.number} is already ${table.status}`,
        variant: "destructive"
      });
      return;
    }

    // Update reservation
    setReservations(prev => prev.map(r => 
      r.id === reservationId ? 
        { ...r, status: "assigned", tableId } : 
        r
    ));

    // Update table
    setTables(prev => prev.map(t => 
      t.id === tableId ? 
        { ...t, status: "reserved", reservationId } : 
        t
    ));

    toast({
      title: "Reservation assigned",
      description: `${reservation.name}'s reservation has been assigned to Table ${table.number}`,
    });
  };

  const unassignReservation = (tableId: string) => {
    // Find the table
    const table = tables.find(t => t.id === tableId);
    
    if (!table || !table.reservationId) {
      toast({
        title: "Error",
        description: "Table not found or no reservation assigned",
        variant: "destructive"
      });
      return;
    }

    // Update the reservation
    setReservations(prev => prev.map(r => 
      r.id === table.reservationId ? 
        { ...r, status: "pending", tableId: undefined } : 
        r
    ));

    // Update the table
    setTables(prev => prev.map(t => 
      t.id === tableId ? 
        { ...t, status: "available", reservationId: undefined } : 
        t
    ));

    toast({
      title: "Reservation unassigned",
      description: `Reservation has been removed from Table ${table.number}`,
    });
  };

  const updateTablePosition = (tableId: string, newX: number, newY: number) => {
    setTables(prev => prev.map(t => 
      t.id === tableId ? 
        { ...t, x: newX, y: newY } : 
        t
    ));
  };

  const addNewTable = (tableType: { id: string, seats: number, shape: string, width: number, height: number, x: number, y: number }) => {
    const newTableNumber = tableCounter + 1;
    
    const newTable: Table = {
      id: `t${uuidv4().substring(0, 8)}`,
      number: newTableNumber,
      seats: tableType.seats,
      x: tableType.x,
      y: tableType.y,
      status: 'available',
      shape: tableType.shape as 'square' | 'circle' | 'rectangle',
      width: tableType.width,
      height: tableType.height,
    };
    
    setTables(prev => [...prev, newTable]);
    setTableCounter(newTableNumber);
    
    toast({
      title: "Table added",
      description: `Table ${newTableNumber} has been added to the floor plan`,
    });
  };

  return (
    <RestaurantContext.Provider value={{ 
      reservations, 
      tables, 
      assignReservation, 
      unassignReservation,
      updateTablePosition,
      addNewTable
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};
