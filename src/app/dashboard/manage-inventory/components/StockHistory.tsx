"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiCall } from "@/helper/apiCall";
import { IStockHistory } from "@/types/stock";
import { formatDate } from "@/utils/format";
import { ChevronDown, Edit, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";

const quantityColor = (value: number) => {
  if (value < 0) {
    return <p className="text-red-500">{value}</p>;
  }
  return <p className="text-green-500">+{value}</p>;
};
export default function StockHistory() {
  const [stockHistory, setStockHistory] = useState<IStockHistory[]>([]);
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const getStockHistory = async () => {
    try {
      const res = await apiCall.get("/api/stock/stock-history");
      const result = res.data.data;
      setStockHistory(result);
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    getStockHistory();
  }, []);
  return (
    <div>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Product Stock History</CardTitle>
            <CardDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Reiciendis, nulla?
            </CardDescription>
          </div>
          <div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Store Name"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Store Name</SelectLabel>
                  <SelectItem value="a">A</SelectItem>
                  <SelectItem value="b">B</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        {/* Searchbar-filter-newprd */}
        <div className="flex max-md:flex-col justify-between gap-2 px-7">
          <div id="search-bar" className="w-full relative">
            <Search className="absolute top-2 right-2 size-5 text-gray-400" />
            <Input className="w-full" placeholder="Search product ..." />
          </div>
          <div className="flex justify-between gap-x-2">
            <div id="date-picker">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button>
                    Select Date
                    <ChevronDown />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="range"
                    captionLayout="dropdown"
                    selected={range}
                    onSelect={(newRange) => {
                      if (!newRange) {
                        setRange({ from: undefined, to: undefined });
                      } else {
                        setRange({ from: newRange.from, to: newRange.to });
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div id="btn-newprd">
              <Button>New Product</Button>
            </div>
          </div>
        </div>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-center">Previous Stock</TableHead>
                <TableHead className="text-center">Actual Stock</TableHead>

                <TableHead className="text-center">Created at</TableHead>
                <TableHead className="text-center">Store Name</TableHead>
                <TableHead className="text-center">PIC</TableHead>
                <TableHead className="text-center">Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockHistory.map((prd, idx) => (
                <TableRow key={idx}>
                  <TableCell>{prd.productStock.product.name}</TableCell>
                  <TableCell className="text-center">{prd.type}</TableCell>
                  <TableCell className="text-center">
                    {quantityColor(prd.quantity)}
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
                    {prd.created_by.first_name} {prd.created_by.last_name}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
