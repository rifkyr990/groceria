"use client";
import { MonthYearPicker } from "@/components/MonthYearPicker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiCall } from "@/helper/apiCall";
import { IStoreProps } from "@/types/store";
import { formatIDRCurrency } from "@/utils/format";
import {
  BadgeDollarSign,
  Clipboard,
  RefreshCcw,
  Search,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const summaryCard = [
  {
    id: 1,
    name: "Total Sales",
    icon: <BadgeDollarSign className="text-green-500" />,
    border: "border-l-green-500 border-4 border-y ",
    total: (
      <span className="text-green-500 text-4xl font-bold ">
        {/* {summary.totalAddition} */} {formatIDRCurrency(50000)}
      </span>
    ),
    desc: "per month",
  },
  {
    id: 2,
    name: "Total Sold Product",
    icon: <ShoppingBag className="text-amber-500" />,
    border: "border-l-amber-500 border-4",
    total: <span className="text-amber-500 text-4xl font-bold ">50</span>,
    desc: "products per month",
  },
  {
    id: 3,
    name: "Total Order",
    icon: <Clipboard className="text-purple-500" />,
    border: "border-l-purple-500 border-4",
    total: <span className="text-purple-500 text-4xl font-bold ">100</span>,
    desc: "orders per month",
  },
  {
    id: 4,
    name: "Total Refund",
    icon: <RefreshCcw className="text-red-500" />,
    border: "border-l-red-500 border-4",
    total: (
      <span className="text-red-500 text-4xl font-bold ">
        {formatIDRCurrency(100000)}
      </span>
    ),
    desc: "per month",
  },
];
export default function SalesReport() {
  const router = useRouter();
  const [selectedStore, setSelectedStore] = useState("all");
  const [storeList, setStoreList] = useState<IStoreProps[]>([]);
  const [selectedDate, setSelectedDate] = useState<{
    month: number;
    year: number;
  }>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const getStoreList = async () => {
    try {
      const res = await apiCall.get("/api/store/all");
      const result = res.data.data;
      setStoreList(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStoreList();
  }, []);
  return (
    <DashboardLayout>
      <section
        id="store-selector"
        className="flex items-center gap-5 mb-5 justify-end"
      >
        <div>
          <Button
            onClick={() =>
              router.replace("/dashboard/manage-reporting/stock-report")
            }
          >
            Stock Report
          </Button>
        </div>
        <div>
          <Select
            value={selectedStore}
            onValueChange={(value) => setSelectedStore(value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Store Name"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Store Name</SelectLabel>
                <SelectItem value="all">All Stores</SelectItem>
                {storeList.map((store, idx) => (
                  <SelectItem key={idx} value={store.id.toString()}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <MonthYearPicker value={selectedDate} onChange={setSelectedDate} />
        </div>
      </section>
      <section id="summary-card" className="grid grid-cols-4 gap-6 mb-5">
        {summaryCard.map((s, idx) => (
          <Card key={idx} className={`${s.border}`}>
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="font-semibold text-lg">{s.name}</CardTitle>
              {s.icon}
            </CardHeader>
            <CardContent>
              <p className="text-center">{s.total}</p>
            </CardContent>
            <CardFooter className="text-gray-400">{s.desc}</CardFooter>
          </Card>
        ))}
      </section>
      <section id="stock-history-table">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Sales Report</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Reiciendis, nulla?
              </CardDescription>
            </div>
          </CardHeader>
          {/* Searchbar-filter-newprd */}
          <div className="flex max-md:flex-col justify-between gap-2 px-7">
            <div id="search-bar" className="w-full relative">
              <Search className="absolute top-2 right-2 size-5 text-gray-400" />
              <Input className="w-full" placeholder="Search product ..." />
            </div>
            <div className="flex justify-between gap-x-2">
              <div id="filter-category">
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Category"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      <SelectItem value="all">All</SelectItem>
                      {storeList.map((store, idx) => (
                        <SelectItem key={idx} value={store.id.toString()}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div id="filter-product">
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Product"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Product Name</SelectLabel>
                      <SelectItem value="all">All</SelectItem>
                      {storeList.map((store, idx) => (
                        <SelectItem key={idx} value={store.id.toString()}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Category</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Total Payment</TableHead>
                  <TableHead className="text-center">Store Name</TableHead>
                  <TableHead className="text-center">Created at</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              {/* <TableBody>
                {stockHistory.map((prd, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{prd.productStock.product.name}</TableCell>
                    <TableCell className="text-center">{prd.type}</TableCell>
                    <TableCell className="text-center">
                      {quantityColor(prd.quantity, prd.type)}
                    </TableCell>
                    <TableCell className="text-center">
                      {prd.prev_stock}
                    </TableCell>
                    <TableCell className="text-center">
                      {prd.updated_stock}
                    </TableCell>

                    <TableCell className="text-center">
                      {formatDate(prd.created_at)}
                    </TableCell>
                    <TableCell className="text-center">
                      {prd.productStock.store.name}
                    </TableCell>

                    <TableCell className="text-center">
                      {prd.created_by?.first_name ?? "John"}{" "}
                      {prd.created_by?.last_name ?? "Doe"}
                    </TableCell>
                    <TableCell className="text-center max-w-[150px] whitespace-normal break-words">
                      {prd.reason}
                    </TableCell>

                    {/* <TableCell>
                    <div className="flex justify-center gap-x-2">
                      <Button variant={"outline"} className="cursor-pointer">
                        <Edit />
                      </Button>
                      <Button
                        variant={"destructive"}
                        className="cursor-pointer"
                      >
                        <Trash />
                      </Button>
                    </div>
                  </TableCell> */}
              {/* </TableRow>
                ))}
              </TableBody> */}
            </Table>
          </CardContent>
        </Card>
      </section>
    </DashboardLayout>
  );
}
