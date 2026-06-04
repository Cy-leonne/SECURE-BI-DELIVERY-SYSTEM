import { DeliveryRecord } from "../types";

export const todayDeliveries: DeliveryRecord[] = [
  { id: "d1", orderId: "ORD10234", recipient: "John Doe", address: "123 Park Avenue", status: "In Progress", time: "10:30 AM" },
  { id: "d2", orderId: "ORD10235", recipient: "Mary Smith", address: "45 Green Street", status: "Delivered", time: "11:15 AM" },
  { id: "d3", orderId: "ORD10236", recipient: "Robert Brown", address: "78 Hill Road", status: "Pending", time: "12:00 PM" },
];