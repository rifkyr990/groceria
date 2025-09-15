"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
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

const MockShippingOptions: ShippingOption[] = [
  {
    id: 1,
    courier: "JNE",
    service: "Reguler",
    cost: 20000,
    estimated: "2-3 days",
  },
  {
    id: 2,
    courier: "SiCepat",
    service: "Express",
    cost: 35000,
    estimated: "1-2 days",
  },
];

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
  const { placeOrder, loading: isPlacingOrder } = useOrderStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(MockShippingOptions[0]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(MockPaymentMethods[0]);

  const shippingCost = useMemo(
    () => selectedShipping?.cost || 0,
    [selectedShipping]
  );

  const {
    items,
    appliedPromo: appliedPromoCode,
    promoCodes,
    storeName,
    tryApplyPromoCode,
    removePromoCode,
    fetchCart,
  } = useCartStore();

  const { token } = useAuthStore.getState();

  useEffect(() => {
    if (token) {
      fetchCart(token);
    }
  }, [fetchCart, token]);

  useEffect(() => {
    setPromoInputText(appliedPromoCode || "");
  }, [appliedPromoCode]);

  const [promoInputText, setPromoInputText] = useState(appliedPromoCode || "");
  const [promoStatus, setPromoStatus] = useState<"idle" | "invalid">("idle");

  const appliedPromo = appliedPromoCode
    ? promoCodes.find((p) => p.code === appliedPromoCode) || null
    : null;

  const handleApplyPromo = () => {
    const success = tryApplyPromoCode(promoInputText);
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
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discountCut = appliedPromo
      ? appliedPromo.type === "percentage"
        ? Math.round((subtotal * appliedPromo.value) / 100)
        : appliedPromo.value
      : 0;
    const total = Math.max(0, subtotal - discountCut + shippingCost);
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

    const payload = {
      addressId: selectedAddressId,
      shippingCost: selectedShipping.cost,
      paymentMethodId,
    };

    const result = await placeOrder(payload);

    if (result.success && result.orderId) {
      router.push(`/profile/orders/${result.orderId}`);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 pb-28 lg:pb-8">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Checkout
              </h1>
              <AddressSelector
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
                promoCodes={promoCodes}
                onInputChange={handlePromoInputChange}
                onApply={handleApplyPromo}
                onRemove={handleRemovePromo}
              />
              <div className="hidden lg:block">
                <CheckoutButton
                  mode="checkout"
                  onClick={handlePlaceOrder}
                  total={total}
                  disabled={isPlacingOrder}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

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
          total={total}
          disabled={isPlacingOrder}
        />
      </div>

      <ShippingMethodModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        shippingOptions={MockShippingOptions}
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
