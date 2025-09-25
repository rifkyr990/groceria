"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { formatDate } from "@/utils/format";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import { useAdminOrderDetailStore } from "@/store/admin-order-detail-store";
import AdminActionCard from "./AdminActionCard";
import PaymentProofCard from "./PaymentProofCard";
import ItemsOrderedCard from "./ItemsOrderedCard";
import CustomerShippingCard from "./CustomerShippingCard";
import PaymentPricingCard from "./PaymentPricingCard";

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
    markAsRefunded,
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
          <CustomerShippingCard
            customer={order.customer}
            shipping={order.shipping}
          />

          <ItemsOrderedCard items={order.items} />
        </div>

        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">
          <PaymentPricingCard payment={order.payment} pricing={order.pricing} />

          {order.payment.proofUrl && (
            <PaymentProofCard proofUrl={order.payment.proofUrl} />
          )}

          <AdminActionCard
            order={order}
            disabled={loading}
            onConfirmPayment={() => confirmPayment(order.id)}
            onRejectPayment={() => rejectPayment(order.id)}
            onSendOrder={() => sendOrder(order.id)}
            onAdminCancelOrder={() => cancelOrder(order.id)}
            onMarkAsRefunded={() => markAsRefunded(order.id)}
          />
        </div>
      </div>
    </div>
  );
}
