
import { Reservation, Table } from "@/types/restaurant";

export const sampleReservations: Reservation[] = [
  { id: "r1", name: "John Smith", time: "18:00", party: 2, status: "pending" },
  { id: "r2", name: "Sarah Johnson", time: "18:30", party: 4, status: "pending" },
  { id: "r3", name: "Mike Williams", time: "19:00", party: 3, status: "pending" },
  { id: "r4", name: "Emily Davis", time: "19:30", party: 6, status: "pending" },
  { id: "r5", name: "Robert Wilson", time: "20:00", party: 2, status: "pending" },
];

export const sampleTables: Table[] = [
  { id: "t1", number: 1, seats: 2, x: 100, y: 100, status: "available", shape: "square", width: 80, height: 80 },
  { id: "t2", number: 2, seats: 2, x: 250, y: 100, status: "available", shape: "square", width: 80, height: 80 },
  { id: "t3", number: 3, seats: 4, x: 400, y: 100, status: "available", shape: "rectangle", width: 120, height: 80 },
  { id: "t4", number: 4, seats: 4, x: 100, y: 250, status: "available", shape: "rectangle", width: 120, height: 80 },
  { id: "t5", number: 5, seats: 6, x: 300, y: 250, status: "available", shape: "rectangle", width: 150, height: 80 },
  { id: "t6", number: 6, seats: 8, x: 100, y: 400, status: "available", shape: "rectangle", width: 180, height: 80 },
  { id: "t7", number: 7, seats: 2, x: 400, y: 400, status: "available", shape: "circle", width: 80, height: 80 },
];
