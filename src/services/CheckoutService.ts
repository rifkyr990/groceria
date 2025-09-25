import { toast } from "react-toastify";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ShippingOption, PaymentMethod, PromoCode } from "@/components/types";
import { useOrderStore } from "@/store/order-store";

type OrderStoreActions = Pick<
  ReturnType<typeof useOrderStore.getState>,
  "placeOrder" | "getMidtransToken"
>;

interface ProcessOrderPlacementArgs extends OrderStoreActions {
  router: AppRouterInstance;
  selectedAddressId: number | null;
  selectedShipping: ShippingOption | null;
  selectedPaymentMethod: PaymentMethod | null;
  storeId: number | null;
  total: number;
  appliedPromo: PromoCode | null;
}

export const processOrderPlacement = async ({
  router,
  selectedAddressId,
  selectedShipping,
  selectedPaymentMethod,
  storeId,
  total,
  appliedPromo,
  placeOrder,
  getMidtransToken,
}: ProcessOrderPlacementArgs): Promise<void> => {
  if (
    !selectedAddressId ||
    !selectedShipping ||
    !selectedPaymentMethod ||
    !storeId
  ) {
    toast.error("Please ensure all selections are made.");
    return;
  }

  const paymentMethodIdMap: { [key: string]: number } = {
    manual_transfer: 1,
    payment_gateway: 2,
  };
  const paymentMethodId = paymentMethodIdMap[selectedPaymentMethod.id];
  if (!paymentMethodId) {
    toast.error("Invalid payment method.");
    return;
  }

  const orderPayload = {
    addressId: selectedAddressId,
    storeId,
    shippingCost: selectedShipping.cost,
    paymentMethodId,
    promoCode: appliedPromo?.code,
  };

  if (total === 0) {
    const orderResult = await placeOrder(orderPayload);
    if (orderResult.success && orderResult.orderId) {
      router.push(`/profile/orders/${orderResult.orderId}?from=checkout`);
    }
    return;
  }

  const orderResult = await placeOrder(orderPayload);
  if (!orderResult.success || !orderResult.orderId) {
    return;
  }

  const newOrderId = orderResult.orderId;

  if (selectedPaymentMethod.id === "manual_transfer") {
    router.push(`/profile/orders/${newOrderId}?from=checkout`);
  } else if (selectedPaymentMethod.id === "payment_gateway") {
    const paymentResult = await getMidtransToken(newOrderId);
    if (paymentResult.success && paymentResult.token) {
      window.snap.pay(paymentResult.token, {
        onSuccess: () =>
          router.push(`/profile/orders/${newOrderId}?from=checkout`),
        onPending: () =>
          router.push(`/profile/orders/${newOrderId}?from=checkout`),
        onError: () => toast.error("Payment failed. Please try again."),
      });
    }
  }
};