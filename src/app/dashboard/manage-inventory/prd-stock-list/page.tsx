import DashboardLayout from "../../components/DashboardLayout";
import InventoryHeader from "../components/InventoryHeader";
import ProductStock from "../components/PrdStockTable";

export default function ProductStockList() {
  return (
    <DashboardLayout>
      <InventoryHeader />
      <ProductStock className="mt-5" />
    </DashboardLayout>
  );
}
