import { CustomerOrder } from "../types";

export const customerOrders: CustomerOrder[] = [
  {
    id: "c1",
    orderId: "ORD5001",
    status: "Delivered",
    date: "May 22, 2026",
    tracking: "TRK-5001",
    address: "56 Main Street",
    item: "Household goods",
  },
  {
    id: "c2",
    orderId: "ORD5002",
    status: "Pending",
    date: "May 25, 2026",
    tracking: "TRK-5002",
    address: "101 River Road",
    item: "Electronics",
  },
  {
    id: "c3",
    orderId: "ORD5003",
    status: "Cancelled",
    date: "May 20, 2026",
    tracking: "TRK-5003",
    address: "12 Garden Ave",
    item: "Books",
  },
  {
    id: "c4",
    orderId: "ORD5004",
    status: "Delivered",
    date: "May 24, 2026",
    tracking: "TRK-5004",
    address: "89 Valley Road",
    item: "Clothing",
  },
  {
    id: "c5",
    orderId: "ORD5005",
    status: "Pending",
    date: "May 26, 2026",
    tracking: "TRK-5005",
    address: "20 High Street",
    item: "Groceries",
  },
];
