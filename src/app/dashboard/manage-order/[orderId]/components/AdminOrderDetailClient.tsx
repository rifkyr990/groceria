"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AdminOrderDetail } from "@/components/types";
import { useAuthStore } from "@/store/auth-store";
import { apiCall } from "@/helper/apiCall";
import { toast } from "react-toastify";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ClipboardList,
  CreditCard,
  ImageIcon,
  Loader2,
  MapPin,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatIDRCurrency, formatDate } from "@/utils/format";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    PENDING_PAYMENT: "bg-orange-100 text-orange-800 border-orange-200",
    PAID: "bg-blue-100 text-blue-800 border-blue-200",
    PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
    SHIPPED: "bg-indigo-100 text-indigo-800 border-indigo-200",
    DELIVERED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Badge
      className={cn(
        "font-medium border pointer-events-none capitalize",
        statusConfig[status as keyof typeof statusConfig] ||
          "bg-gray-100 text-gray-800"
      )}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
};

=======
import StatusBadge from "@/components/shared/StatusBadge";
>>>>>>> 2b1669caedb962851817d77f02cb0146a921bb44
import { useAdminOrderDetailStore } from "@/store/admin-order-detail-store";
import AdminActionCard from "./AdminActionCard";
import PaymentProofCard from "./PaymentProofCard";

export default function AdminOrderDetailClient({
  orderId,
}: {
  orderId: number;
}) {
  const router = useRouter();
  const {
    order,
    loading,
    error,
    fetchOrder,
    confirmPayment,
    rejectPayment,
    sendOrder,
    cancelOrder,
<<<<<<< HEAD
=======
    markAsRefunded,
>>>>>>> 2b1669caedb962851817d77f02cb0146a921bb44
  } = useAdminOrderDetailStore();
  const { token } = useAuthStore();

  useEffect(() => {
    if (isNaN(orderId)) {
      return;
    }
    if (token) {
      fetchOrder(orderId);
    }
  }, [orderId, token, fetchOrder]);

  const renderActions = () => {
    if (!order) return null;

<<<<<<< HEAD
=======
    if (order.status === "CANCELLED" && order.payment.status === "SUCCESS") {
      return (
        <Button
          onClick={() => markAsRefunded(order.id)}
          disabled={loading}
          variant="secondary"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white h-10 text-sm px-4"
        >
          <CheckCircle className="w-4 h-4 mr-2" /> Mark as Refunded
        </Button>
      );
    }

>>>>>>> 2b1669caedb962851817d77f02cb0146a921bb44
    if (
      order.status === "PAID" &&
      order.payment.method === "Manual Bank Transfer"
    ) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={() => confirmPayment(order.id)}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" /> Confirm Payment
          </Button>
          <Button
            onClick={() => rejectPayment(order.id)}
            disabled={loading}
            variant="destructive"
          >
            <XCircle className="w-4 h-4 mr-2" /> Reject Payment
          </Button>
        </div>
      );
    }

    if (order.status === "PROCESSING") {
      return (
        <div className="space-y-3">
          <Button
            onClick={() => sendOrder(order.id)}
            disabled={loading}
            className="w-full bg-primary-green-600 hover:bg-primary-green-700"
          >
            <Truck className="w-4 h-4 mr-2" /> Mark as Shipped
          </Button>
          <Button
            onClick={() => cancelOrder(order.id)}
            disabled={loading}
            variant="outline"
            className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
          >
            <XCircle className="w-4 h-4 mr-2" /> Cancel Order
          </Button>
        </div>
      );
    }

    if (order.status === "PAID") {
      return (
        <Button
          onClick={() => cancelOrder(order.id)}
          disabled={loading}
          variant="outline"
          className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
        >
          <XCircle className="w-4 h-4 mr-2" /> Cancel Order
        </Button>
      );
    }

    return (
      <p className="text-center text-sm text-gray-500">
        No actions available for this order status.
      </p>
    );
  };

  if (loading && !order) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <AlertCircle className="mx-auto h-10 w-10 mb-2" />
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Order #{order.id}
            </h1>
            <p className="text-sm text-gray-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0">
            <CardHeader className="flex flex-row items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <CardTitle className="text-lg">Customer & Shipping</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="grid grid-cols-[100px_1fr]">
                <span className="text-gray-500">Name</span>
                <span className="font-semibold">{order.customer.name}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr]">
                <span className="text-gray-500">Phone</span>
                <span>{order.customer.phone || "N/A"}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr]">
                <span className="text-gray-500">Address</span>
                <span className="leading-relaxed">
                  {order.shipping.address}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0">
            <CardHeader className="flex flex-row items-center gap-3">
              <ClipboardList className="w-5 h-5 text-gray-500" />
              <CardTitle className="text-lg">Items Ordered</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 object-cover rounded-lg border bg-white"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x{" "}
                        {formatIDRCurrency(Number(item.price))}
                      </p>
                    </div>
                    <p className="font-semibold text-sm text-gray-800 text-right">
                      {formatIDRCurrency(item.quantity * Number(item.price))}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">
          <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0">
            <CardHeader className="flex flex-row items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <CardTitle className="text-lg">Payment & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-medium">
                  {formatIDRCurrency(Number(order.pricing.subtotal))}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="font-medium">
                  {formatIDRCurrency(Number(order.shipping.cost))}
                </span>
              </div>
              {Number(order.pricing.discount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">
                    - {formatIDRCurrency(Number(order.pricing.discount))}
                  </span>
                </div>
              )}
              <div className="border-t border-dashed border-gray-200 pt-2"></div>
              <div className="flex justify-between text-base font-bold text-gray-800">
                <span>Total</span>
                <span aria-live="polite">
                  {formatIDRCurrency(Number(order.pricing.total))}
                </span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-3 mt-3"></div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium">{order.payment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium capitalize">
                    {order.payment.status.toLowerCase()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.payment.proofUrl && (
            <PaymentProofCard proofUrl={order.payment.proofUrl} />
          )}

<<<<<<< HEAD
          <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0">
            <CardContent className="p-4 sm:p-6">{renderActions()}</CardContent>
          </Card>
=======
          <AdminActionCard
            order={order}
            disabled={loading}
            onConfirmPayment={() => confirmPayment(order.id)}
            onRejectPayment={() => rejectPayment(order.id)}
            onSendOrder={() => sendOrder(order.id)}
            onAdminCancelOrder={() => cancelOrder(order.id)}
            onCancelOrder={() => {}}
          />
>>>>>>> 2b1669caedb962851817d77f02cb0146a921bb44
        </div>
      </div>
    </div>
  );
}