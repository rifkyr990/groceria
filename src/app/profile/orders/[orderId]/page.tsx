"use client";

import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Sidebar from "../../Sidebar";
import ActionCenterCard from "../ActionCenterCard";
import { useOrderDetail } from "@/hooks/use-order-detail";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import OrderDetailHeader from "./components/OrderDetailHeader";
import OrderShippingInfo from "./components/OrderShippingInfo";
import OrderItemsInfo from "./components/OrderItemsInfo";
import OrderPricingInfo from "./components/OrderPricingInfo";
import { Card, CardContent } from "@/components/ui/card";

export default function OrderDetailPage() {
  const {
    order,
    loading,
    error,
    cameFromCheckout,
    isCancelAlertOpen,
    activeTab,
    setActiveTab,
    setIsCancelAlertOpen,
    handleCancelOrder,
    handleConfirmReceipt,
    handlePayNow,
  } = useOrderDetail();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">
          Failed to load order
        </h2>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Order Not Found</h2>
        <p className="text-gray-500">We couldn't find an order with this ID.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full flex-shrink-0 bg-white dark:bg-gray-800">
        <Navbar />
      </div>
      <div
        className={cn(
          "flex-1 mx-auto p-4 sm:p-6 w-full",
          cameFromCheckout ? "max-w-4xl" : "max-w-7xl flex gap-6"
        )}
      >
        {!cameFromCheckout && (
          <aside className="w-64 sticky top-6 self-start h-fit hidden lg:block">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </aside>
        )}
        <main className="flex-1">
          <div className={cn(!cameFromCheckout && "max-w-4xl mx-auto")}>
            <div className="w-full space-y-6">
              <OrderDetailHeader
                order={order}
                cameFromCheckout={cameFromCheckout}
              />

              {/* Unified Card for all details */}
              <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0 p-4 sm:p-8">
                <CardContent className="p-0 space-y-6">
                  <OrderShippingInfo order={order} />
                  <div className="border-t border-dashed"></div>
                  <OrderItemsInfo items={order.items} />
                  <div className="border-t border-dashed"></div>
                  <OrderPricingInfo order={order} />
                </CardContent>
              </Card>

              <div className="text-center mt-6">
                {cameFromCheckout && (
                  <Link
                    href="/"
                    className="text-sm text-gray-500 hover:underline inline-flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
                  </Link>
                )}
              </div>
            </div>

            {(!cameFromCheckout ||
              (cameFromCheckout &&
                order.status === "PENDING_PAYMENT" &&
                order.payment?.method === "Manual Bank Transfer")) && (
              <ActionCenterCard
                order={order}
                onCancel={() => setIsCancelAlertOpen(true)}
                onConfirm={handleConfirmReceipt}
                onPay={handlePayNow}
              />
            )}
          </div>
        </main>
      </div>
      <div className="w-full flex-shrink-0">
        <Footer />
      </div>

      <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel your order. This action cannot be undone and your
              items will be returned to stock.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
