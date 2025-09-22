"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatIDRCurrency, formatDate } from "@/utils/format";

interface AdminOrderSummary {
  id: number;
  createdAt: string;
  customerName: string;
  storeName: string;
  totalPrice: string;
  totalItems: number;
  status: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = useMemo(
    () => ({
      PENDING_PAYMENT:
        "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100",
      PAID: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
      PROCESSING: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
      SHIPPED:
        "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-100",
      DELIVERED:
        "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
      CANCELLED: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
    }),
    []
  );

  return (
    <Badge
      className={cn(
        "px-2.5 py-1 text-xs font-medium rounded-full border pointer-events-none capitalize",
        statusConfig[status as keyof typeof statusConfig] ||
          "bg-gray-100 text-gray-800"
      )}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
};

interface OrderTableProps {
  orders: AdminOrderSummary[];
}

export default function OrderTable({ orders }: OrderTableProps) {
  return (
    <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Store</TableHead>
            <TableHead className="text-center">Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-center">
                  #{order.id}
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.storeName}</TableCell>
                <TableCell className="text-center">
                  {order.totalItems}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatIDRCurrency(Number(order.totalPrice))}
                </TableCell>
                <TableCell className="text-center">
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-center">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/manage-order/${order.id}`}>
                      View Details
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                No orders found for the selected criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}