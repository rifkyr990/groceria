"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Sidebar from "../../Sidebar";
import { useOrderDetailStore } from "@/store/order-detail-store";
import { useUploadProofStore } from "@/store/upload-proof-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
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
import {
  AlertCircle,
  ArrowLeft,
  ClipboardList,
  CreditCard,
  Loader2,
  MapPin,
  Upload,
} from "lucide-react";
import { formatIDRCurrency } from "@/utils/format";
import StepIndicator from "@/components/cart/StepIndicator";
import { FiCheckCircle } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import OrderActions from "../OrderActions";
import ActionCenterCard from "../ActionCenterCard";
import StatusBadge from "@/components/shared/StatusBadge";

export default function OrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = Number(params.orderId);
  const {
    order,
    loading,
    error,
    fetchOrder,
    cancelOrder,
    confirmReceipt,
    repayOrder,
  } = useOrderDetailStore();
  const { token, user } = useAuthStore();
  const cameFromCheckout = searchParams.get("from") === "checkout";
  const [isClient, setIsClient] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "address" | "password"
  >("profile");

  const handlePayNow = async () => {
    if (!order) return;
    const result = await repayOrder(order.id);
    if (result.success && result.token) {
      window.snap.pay(result.token, {
        onSuccess: function (result: any) {
          toast.success("Payment successful!");
          fetchOrder(order.id);
        },
        onPending: function (result: any) {
          toast.info("Your payment is pending.");
          fetchOrder(order.id);
        },
        onError: function (result: any) {
          toast.error("Payment failed. Please try again.");
        },
      });
    }
  };

  const handleConfirmReceipt = async () => {
    if (!order) return;
    await confirmReceipt(order.id);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    if (!token) {
      toast.warn("You must be logged in to view this page.");
      router.replace("/login");
      return;
    }

    if (!user?.is_verified) {
      toast.warn("Please verify your email to view your orders.");
      router.replace("/");
      return;
    }

    if (orderId && !isNaN(orderId)) {
      fetchOrder(orderId).finally(() => setCheckingAuth(false));
    } else {
      toast.error("Invalid Order ID.");
      router.replace("/profile/orders");
    }
  }, [isClient, token, user, orderId, router, fetchOrder]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
          <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Order Not Found</h2>
          <p className="text-gray-500">
            We couldn't find an order with this ID.
          </p>
        </div>
      );
    }

    const confirmationStep = [
      {
        id: "confirmation",
        label: "Order Confirmation",
        icon: <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
      },
    ];

    return (
      <div className="w-full">
        {cameFromCheckout && (
          <div className="mb-6 space-y-4">
            <StepIndicator
              steps={confirmationStep}
              currentStep={0}
              variant="timeline"
            />
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {!cameFromCheckout && (
              <Button
                asChild
                variant="outline"
                size="icon"
                className="flex-shrink-0"
              >
                <Link href="/profile/orders" aria-label="Back to My Orders">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Order Details
              </h1>
              <p className="text-sm text-gray-500">
                Order #{order.id} &bull;{" "}
                {new Date(order.createdAt).toLocaleString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0 p-4 sm:p-8">
          <CardContent className="p-0 space-y-6">
            {!cameFromCheckout && (
              <>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    Shipping Address
                  </h3>
                  <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border space-y-2">
                    <div className="grid grid-cols-[80px_1fr]">
                      <span className="text-gray-500">Recipient</span>
                      <span className="font-semibold">
                        {order.destinationAddress.split(" (")[0]}
                      </span>
                    </div>
                    <div className="grid grid-cols-[80px_1fr]">
                      <span className="text-gray-500">Phone</span>
                      <span>
                        {order.destinationAddress.match(/\(([^)]+)\)/)?.[1]}
                      </span>
                    </div>
                    <div className="grid grid-cols-[80px_1fr]">
                      <span className="text-gray-500">Address</span>
                      <span className="leading-relaxed">
                        {order.destinationAddress.split("), ")[1]}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-dashed"></div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-gray-500" />
                    Items Ordered
                  </h3>
                  <div className="border border-dashed border-gray-300 rounded-xl p-4">
                    <ul className="space-y-4">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex items-center gap-4">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            width={56}
                            height={56}
                            className="w-14 h-14 object-cover rounded-lg border bg-white"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-800 truncate">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} x{" "}
                              {formatIDRCurrency(Number(item.priceAtPurchase))}
                            </p>
                          </div>
                          <p className="font-semibold text-sm text-gray-800 text-right">
                            {formatIDRCurrency(
                              item.quantity * Number(item.priceAtPurchase)
                            )}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="border-t border-dashed"></div>
              </>
            )}
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-500" />
                Order Information
              </h3>
              <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium text-gray-700">
                    {order.payment?.method || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping Method</span>
                  <span className="font-medium text-gray-700">
                    JNE Express (Placeholder)
                  </span>
                </div>
                <div className="border-t border-dashed my-2"></div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-700">
                    {formatIDRCurrency(Number(order.subtotal))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-gray-700">
                    {formatIDRCurrency(Number(order.shippingCost))}
                  </span>
                </div>
                {Number(order.discountAmount) > 0 && (
                  <div className="flex justify-between text-sm text-primary-green-600">
                    <span className="font-semibold">Discount</span>
                    <span className="font-semibold">
                      -{formatIDRCurrency(Number(order.discountAmount))}
                    </span>
                  </div>
                )}
                <div className="border-t border-dashed my-2"></div>
                <div className="flex justify-between items-center text-lg font-bold text-gray-800 bg-primary-green-50 p-3 rounded-lg">
                  <span>Total</span>
                  <span className="font-mono">
                    {formatIDRCurrency(Number(order.totalPrice))}
                  </span>
                </div>
              </div>
            </div>
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

        <AlertDialog
          open={isCancelAlertOpen}
          onOpenChange={setIsCancelAlertOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will cancel your order. This action cannot be undone and
                your items will be returned to stock.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Back</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (order) await cancelOrder(order.id);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Yes, Cancel Order
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

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
            {renderContent()}

            {order &&
              (!cameFromCheckout ||
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
    </div>
  );
}
