"use client";

import { useEffect, useState } from "react";
import { useAdminOrderStore } from "@/store/admin-order-store";
import { useAuthStore } from "@/store/auth-store";
import { apiCall } from "@/helper/apiCall";
import AdminOrderCard2 from "./AdminOrderCard2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DatePicker from "@/components/DatePicker";
import PaginationControls from "@/components/PaginationControls";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  Loader2,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import { IStoreProps } from "@/types/store";
import AdminOrderCard from "./AdminOrderCard";
import SummaryCards from "./SummaryCards";

const OrderDashboardClient = () => {
  const { user } = useAuthStore();
  const {
    orders,
    pagination,
    loading,
    error,
    fetchOrders,
    filters,
    setFilters,
    summary,
    summaryLoading,
    fetchSummary,
  } = useAdminOrderStore();

  // Local state for filter inputs
  const [localSearch, setLocalSearch] = useState(filters.searchTerm);
  const [localStatus, setLocalStatus] = useState(filters.statusFilter);
  const [localDateRange, setLocalDateRange] = useState(filters.dateRange);
  const [localStoreId, setLocalStoreId] = useState(filters.storeId);
  const [stores, setStores] = useState<IStoreProps[]>([]);

  // Fetch orders and summary on mount
  useEffect(() => {
    fetchOrders(1);
    fetchSummary();
  }, [fetchOrders, fetchSummary]);

  // Fetch stores for Super Admin filter
  useEffect(() => {
    if (user?.role === "SUPER_ADMIN") {
      const fetchStores = async () => {
        try {
          const res = await apiCall.get("/api/store/all");
          setStores(res.data.data);
        } catch (error) {
          console.error("Failed to fetch stores", error);
        }
      };
      fetchStores();
    }
  }, [user]);

  const handleApplyFilters = () => {
    setFilters({
      searchTerm: localSearch,
      statusFilter: localStatus,
      dateRange: localDateRange,
      storeId: localStoreId,
    });
  };

  const handleResetFilters = () => {
    setLocalSearch("");
    setLocalStatus("ALL");
    setLocalDateRange({ from: undefined, to: undefined });
    setLocalStoreId("all");
    setFilters({
      searchTerm: "",
      statusFilter: "ALL",
      dateRange: { from: undefined, to: undefined },
      storeId: "all",
    });
  };

  const handlePageChange = (page: number) => {
    fetchOrders(page);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Order Management</h1>

      <SummaryCards summary={summary} loading={summaryLoading} />

      {/* --- Filter Toolbar --- */}
      <div className="bg-white p-4 rounded-2xl shadow-lg shadow-gray-200/50">
        <div className="flex flex-col md:flex-row md:flex-wrap md:items-end md:gap-4">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="search" className="text-xs font-semibold">
              Search by Order ID / Customer
            </Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="search"
                placeholder="e.g. 123 or John Doe"
                className="pl-9"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <Label htmlFor="status" className="text-xs font-semibold">
              Status
            </Label>
            <Select value={localStatus} onValueChange={setLocalStatus}>
              <SelectTrigger id="status" className="mt-1 w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {user?.role === "SUPER_ADMIN" && (
            <div className="mt-4 md:mt-0">
              <Label htmlFor="store" className="text-xs font-semibold">
                Store
              </Label>
              <Select value={localStoreId} onValueChange={setLocalStoreId}>
                <SelectTrigger id="store" className="mt-1 w-full md:w-48">
                  <SelectValue placeholder="Filter by store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id.toString()}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="mt-4 md:mt-0">
            <Label className="text-xs font-semibold">Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-64 justify-start text-left font-normal mt-1"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {localDateRange?.from ? (
                    localDateRange.to ? (
                      <>
                        {format(localDateRange.from, "LLL dd")} -{" "}
                        {format(localDateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(localDateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <DatePicker
                  range={localDateRange}
                  setRange={setLocalDateRange}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button variant="ghost" onClick={handleResetFilters}>
              Reset
            </Button>
            <Button onClick={handleApplyFilters}>Apply</Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24 rounded-2xl bg-white shadow-lg shadow-gray-200/50">
          <Loader2 className="h-10 w-10 animate-spin text-primary-green-600" />
        </div>
      ) : error ? (
        <div className="text-center py-24 rounded-2xl bg-white shadow-lg shadow-gray-200/50">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Error Loading Orders
          </h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <AdminOrderCard key={order.id} order={order} />
            ))
          ) : (
            <div className="text-center py-24 rounded-2xl bg-white shadow-lg shadow-gray-200/50">
              <p className="font-semibold">No Orders Found</p>
              <p className="text-sm text-gray-500">
                No orders were found that match your criteria.
              </p>
            </div>
          )}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDashboardClient;