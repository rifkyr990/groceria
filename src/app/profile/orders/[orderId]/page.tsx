"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useOrderDetailStore } from "@/store/order-detail-store";
import { useUploadProofStore } from "@/store/upload-proof-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { OrderDetail } from "@/components/types";
import StepIndicator from "@/components/cart/StepIndicator";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FiCheckCircle, FiCreditCard } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
      REFUNDED: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
    }),
    []
  );

  return (
    <Badge
      className={cn(
        "px-3 py-1 text-sm font-medium rounded-full border pointer-events-none",
        statusConfig[status as keyof typeof statusConfig] ||
          "bg-gray-100 text-gray-800"
      )}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
};

const UploadProofCard = ({ orderId }: { orderId: number }) => {
  const { file, previewUrl, loading, error, setFile, uploadProof, reset } =
    useUploadProofStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    const result = await uploadProof(orderId);
    if (result.success) {
      reset();
    }
  };

  const paymentExpiryDate = new Date(
    new Date(useOrderDetailStore.getState().order!.createdAt).getTime() +
      60 * 60 * 1000
  ).toISOString();

  return (
    <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0 p-4 sm:p-8 mt-6">
      <CardContent className="p-0">
        <div className="space-y-4 text-center">
          <h3 className="text-lg font-bold text-gray-800">
            Complete Your Payment
          </h3>
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 text-sm text-cyan-800">
            <p className="font-semibold text-cyan-900">Bank BCA</p>
            <p>
              Account Number:{" "}
              <span className="font-bold text-cyan-900">1234567890</span>
            </p>
            <p>
              Account Holder:{" "}
              <span className="font-bold text-cyan-900">PT Groceria</span>
            </p>
          </div>

          <CountdownTimer expiryDate={paymentExpiryDate} />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/gif"
          />

          {!file ? (
            <div
              onClick={handleSelectFileClick}
              className="border border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50"
            >
              <Button
                size="lg"
                variant="ghost"
                className="w-full h-12 text-base font-bold text-primary-green-600 pointer-events-none"
              >
                <Upload className="w-5 h-5 mr-2" />
                Select Payment Proof
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center gap-3">
                {previewUrl && (
                  <Image
                    src={previewUrl}
                    alt="Payment proof preview"
                    width={128}
                    height={128}
                    className="max-h-32 w-auto rounded-md border"
                  />
                )}
                <p className="text-sm font-medium text-gray-700 truncate">
                  File: <span className="font-semibold">{file.name}</span>
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-primary-green-600 hover:bg-primary-green-700"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Submit Proof"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setFile(null)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

const CountdownTimer = ({ expiryDate }: { expiryDate: string }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(expiryDate) - +new Date();
    let timeLeft = { minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const isExpired = timeLeft.minutes <= 0 && timeLeft.seconds <= 0;

  return (
    <div className="text-center font-mono text-lg font-bold text-orange-600">
      {isExpired ? (
        <span>Payment time has expired</span>
      ) : (
        <span>
          {String(timeLeft.minutes).padStart(2, "0")}:
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
      )}
    </div>
  );
};

export default function OrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = Number(params.orderId);
  const { order, loading, error, fetchOrder } = useOrderDetailStore();
  const cameFromCheckout = searchParams.get("from") === "checkout";

  useEffect(() => {
    if (orderId && !isNaN(orderId)) {
      fetchOrder(orderId);
    }
  }, [orderId, fetchOrder]);

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
        <Button asChild variant="link" className="mt-4">
          <Link href="/profile/orders">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Orders
          </Link>
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Order Not Found</h2>
        <p className="text-gray-500">We couldn't find an order with this ID.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/profile/orders">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Orders
          </Link>
        </Button>
      </div>
    );
  }

  const showPaymentDetails =
    order.status === "PENDING_PAYMENT" &&
    order.payment?.method === "Manual Bank Transfer";

  // Create a mock expiry date 1 hour from creation for the countdown
  const paymentExpiryDate = new Date(
    new Date(order.createdAt).getTime() + 60 * 60 * 1000
  ).toISOString();

  const confirmationStep = [
    {
      id: "confirmation",
      label: "Order Confirmation",
      icon: <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        {cameFromCheckout && (
          <div className="mb-6 space-y-4">
            <StepIndicator
              steps={confirmationStep}
              currentStep={0}
              variant="timeline"
            />
            {/* <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Thank You For Your Order!
              </h2>
              <p className="text-gray-500">
                Your order has been placed successfully.
              </p>
            </div> */}
          </div>
        )}
        <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0 p-4 sm:p-8">
          <CardHeader className="p-0 mb-6 sm:mb-8">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-sans text-2xl sm:text-3xl font-bold text-gray-800">
                  Order Details
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Order #{order.id} &bull;{" "}
                  {new Date(order.createdAt).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            {/* Conditional Full Details View */}
            {!cameFromCheckout && (
              <>
                {/* Shipping Address */}
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

                {/* Product List */}
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

            {/* Payment Summary */}
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-500" />
                Order Information
              </h3>
              <div className=" p-4 bg-primary-green-50 rounded-xl border space-y-2">
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
                <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span className="font-mono">
                    {formatIDRCurrency(Number(order.totalPrice))}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conditional Payment Instructions & Upload Card */}
        {showPaymentDetails && <UploadProofCard orderId={order.id} />}

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
    </main>
  );
}
