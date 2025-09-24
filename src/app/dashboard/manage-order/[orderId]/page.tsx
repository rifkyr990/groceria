import DashboardLayout from "../../components/DashboardLayout";
import AdminOrderDetailClient from "./components/AdminOrderDetailClient";

interface PageProps {
  params: {
    orderId: string;
  };
}

export default function AdminOrderDetailPage({ params }: PageProps) {
  const orderId = parseInt(params.orderId, 10);

  return (
    <DashboardLayout>
      <AdminOrderDetailClient orderId={orderId} />
    </DashboardLayout>
  );
}
