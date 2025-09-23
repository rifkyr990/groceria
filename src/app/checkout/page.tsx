"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { useAddressStore } from "@/store/address-store";
import { useShippingStore } from "@/store/shipping-store";
import { toast } from "react-toastify";
import { MoreHorizontal } from "lucide-react";
import AddressSelector from "@/components/checkout/AddressSelector";
import PaymentMethodDrawer from "@/components/checkout/PaymentMethodDrawer";
import OrderReview from "@/components/checkout/OrderReview";
import PaymentSummary from "@/components/checkout/PaymentSummary";
import PromoInput from "@/components/cart/PromoInput";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import CheckoutButton from "@/components/cart/CheckoutButton";
import { ShippingOption, PaymentMethod } from "@/components/types";
import ShippingMethodModal from "@/components/checkout/ShippingMethodModal";
import StepIndicator from "@/components/cart/StepIndicator";
import { FiCreditCard } from "react-icons/fi";
import { useAuthStore } from "@/store/auth-store";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

declare global {
  interface Window {
    snap: any;
  }
}

const MockPaymentMethods: PaymentMethod[] = [
  {
    id: "manual_transfer",
    name: "Manual Bank Transfer",
    description: "Pay via ATM or mobile banking.",
  },
  {
    id: "payment_gateway",
    name: "Payment Gateway",
    description: "Credit/Debit Card, Virtual Account, etc.",
  },
];

const checkoutStep = [
  {
    id: "payment",
    label: "Checkout & Payment",
    icon: <FiCreditCard className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    placeOrder,
    getMidtransToken,
    loading: isPlacingOrder,
  } = useOrderStore();
  const {
    addresses,
    loading: addressesLoading,
    fetchAddress,
  } = useAddressStore();
  const {
    fetchOptions,
    options: shippingOptions,
    loading: shippingLoading,
  } = useShippingStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );

  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(MockPaymentMethods[0]);

  const shippingCost = useMemo(
    () => selectedShipping?.cost || "0",
    [selectedShipping]
  );

  const {
    items,
    appliedPromo,
    storeName,
    storeId,
    tryApplyPromoCode,
    removePromoCode,
    fetchCart,
  } = useCartStore();

  const { token, user } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !token) {
      toast.warn("You must be logged in to view the checkout page.");
      router.replace("/login");
    }
  }, [isClient, token, router]);

  useEffect(() => {
    if (token) {
      fetchCart(token);
      fetchAddress();
    }
  }, [token, fetchCart, fetchAddress]);

  useEffect(() => {
    if (selectedAddressId && storeId) {
      const getOptions = async () => {
        const options = await fetchOptions(selectedAddressId, storeId);
        if (options && options.length > 0) {
          setSelectedShipping(options[0]);
        } else {
          setSelectedShipping(null);
        }
      };
      getOptions();
    }
  }, [selectedAddressId, fetchOptions]);

  useEffect(() => {
    setPromoInputText(appliedPromo?.code || "");
  }, [appliedPromo]);

  const [promoInputText, setPromoInputText] = useState(
    appliedPromo?.code || ""
  );
  const [promoStatus, setPromoStatus] = useState<"idle" | "invalid">("idle");

  const handleApplyPromo = async () => {
    const success = await tryApplyPromoCode(promoInputText);
    if (!success) {
      setPromoStatus("invalid");
    }
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setPromoInputText("");
    setPromoStatus("idle");
  };

  const { total } = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    const isFreeShipping = appliedPromo?.type === "free_shipping";

    const discountCut =
      appliedPromo && appliedPromo.type !== "free_shipping"
        ? appliedPromo.type === "percentage"
          ? Math.round((subtotal * appliedPromo.value) / 100)
          : appliedPromo.value
        : 0;

    const finalShippingCost = isFreeShipping ? 0 : Number(shippingCost);

    const total = Math.max(0, subtotal - discountCut + finalShippingCost);
    return { total };
  }, [items, appliedPromo, shippingCost]);

  const handlePromoInputChange = (value: string) => {
    setPromoInputText(value);
    if (promoStatus === "invalid") {
      setPromoStatus("idle");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address.");
      return;
    }
    if (!selectedShipping) {
      toast.error("Please select a shipping method.");
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    const paymentMethodIdMap: { [key: string]: number } = {
      manual_transfer: 1,
      payment_gateway: 2,
    };
    const paymentMethodId = paymentMethodIdMap[selectedPaymentMethod.id];
    if (!paymentMethodId) {
      toast.error("Invalid payment method selected.");
      return;
    }

    const orderPayload = {
      addressId: selectedAddressId,
      shippingCost: selectedShipping.cost,
      paymentMethodId,
      promoCode: appliedPromo?.code,
    };

    const orderResult = await placeOrder(orderPayload);

    if (!orderResult.success || !orderResult.orderId) {
      toast.error("Failed to create order. Please try again.");
      return;
    }

    const newOrderId = orderResult.orderId;

    if (selectedPaymentMethod.id === "payment_gateway") {
      const paymentResult = await getMidtransToken(newOrderId);

      if (!paymentResult.success || !paymentResult.token) {
        toast.error("Could not initialize payment. Please try again later.");
        return;
      }

      window.snap.pay(paymentResult.token, {
        onSuccess: function (result: any) {
          console.log("Midtrans success:", result);
          toast.success("Payment successful!");
          router.push(`/profile/orders/${newOrderId}?from=checkout`);
        },
        onPending: function (result: any) {
          console.log("Midtrans pending:", result);
          toast.info("Your payment is pending. We will update you soon.");
          router.push(`/profile/orders/${newOrderId}?from=checkout`);
        },
        onError: function (result: any) {
          console.error("Midtrans error:", result);
          toast.error(
            "Payment failed. Please try again or use another method."
          );
        },
        onClose: function () {
          console.log(
            "Customer closed the popup without finishing the payment"
          );
          toast.warn(
            "You closed the payment window without completing the payment."
          );
        },
      });
    } else {
      // Manual transfer flow
      toast.success("Order placed! Please upload your payment proof.");
      router.push(`/profile/orders/${newOrderId}?from=checkout`);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="w-full flex-shrink-0">
          <Navbar />
        </div>
        <main className="flex-1 bg-gray-50 p-4 sm:p-6 md:p-8 pb-28 lg:pb-8">
          <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Checkout
                </h1>
                <AddressSelector
                  addresses={addresses}
                  loading={addressesLoading}
                  selectedAddressId={selectedAddressId}
                  setSelectedAddressId={setSelectedAddressId}
                />
                <OrderReview
                  items={items}
                  storeName={storeName}
                  selectedShipping={selectedShipping}
                  onOpenModal={() => setIsModalOpen(true)}
                />
                <div className="hidden lg:block">
                  <PaymentMethodSelector
                    paymentMethods={MockPaymentMethods}
                    selectedMethod={selectedPaymentMethod}
                    onSelectMethod={setSelectedPaymentMethod}
                  />
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-6 lg:h-fit">
                <StepIndicator steps={checkoutStep} currentStep={0} />
                <PaymentSummary
                  items={items}
                  appliedPromo={appliedPromo}
                  shippingCost={shippingCost}
                />
                <PromoInput
                  inputText={promoInputText}
                  status={promoStatus}
                  appliedPromo={appliedPromo}
                  onInputChange={handlePromoInputChange}
                  onApply={handleApplyPromo}
                  onRemove={handleRemovePromo}
                />
                {/* Spacer div to push content up on mobile, preventing overlap with the fixed button bar */}
                <div className="h-24 lg:hidden" />
                <div className="hidden lg:block">
                  <CheckoutButton
                    mode="checkout"
                    onClick={handlePlaceOrder}
                    total={total.toString()}
                    disabled={isPlacingOrder}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
        <div className="hidden lg:block">
          <Footer />
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 pt-5 bg-white/80 backdrop-blur-sm border-t border-gray-200 space-y-3 rounded-t-2xl shadow-[0_-4px_16px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium text-gray-600">
            Select Payment Method
          </p>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-7 h-7 flex items-center justify-center bg-gray-800 text-white rounded-full"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        <CheckoutButton
          mode="checkout"
          onClick={handlePlaceOrder}
          total={total.toString()}
          disabled={isPlacingOrder}
        />
      </div>

      <ShippingMethodModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        shippingOptions={shippingOptions}
        loading={shippingLoading}
        selectedOption={selectedShipping}
        onSelectOption={setSelectedShipping}
      />

      <PaymentMethodDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        paymentMethods={MockPaymentMethods}
        selectedMethod={selectedPaymentMethod}
        onSelectMethod={setSelectedPaymentMethod}
      />
    </>
  );
}
