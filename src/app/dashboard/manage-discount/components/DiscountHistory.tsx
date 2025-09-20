import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
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
import { useDiscountStore } from "@/store/useDiscount";
import { IDiscountProps } from "@/types/discount";
import { formatDate } from "@/utils/format";
import { Eye, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const discountStatusbyDate = (start_date: Date, end_date: Date) => {
  const today = new Date();
  if (today < start_date) {
    return <Badge className="bg-amber-500">Upcoming</Badge>;
  }
  if (today >= start_date && today <= end_date) {
    return <Badge className="bg-green-500">Active</Badge>;
  }
  if (today > end_date) {
    return <Badge variant={"destructive"}>Expired</Badge>;
  }
  return null;
};
export default function DiscountHistory() {
  const discounts = useDiscountStore((state) => state.discounts);
  const removeDiscount = useDiscountStore((state) => state.removeDiscount);
  const deleteDiscount = async (id: number) => {
    const confirm = window.confirm("Anda yakin delete discount ini ?");
    if (!confirm) return;
    try {
      const res = await apiCall.patch(`/api/discount/delete/${id}`);
      toast.success("Delete Discount History Success");
      removeDiscount(id);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   setDiscounts(data);
  // }, [data]);

  return (
    <section className="p-4 mt-5">
      <h1 className="text-xl font-semibold">Filter and Search Bar</h1>
      <div id="filter-search" className="flex gap-x-5">
        <div className="w-full relative">
          <Input placeholder="Search . . . ." />
          <Search className="absolute text-gray-300 top-1.5 right-2 size-5" />
        </div>
        {/* Filter Store */}
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select Store" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">A</SelectItem>
            <SelectItem value="b">B</SelectItem>
            <SelectItem value="c">C</SelectItem>
          </SelectContent>
        </Select>
        {/* Filter Types */}
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Discount Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MANUAL">Manual per Product</SelectItem>
            <SelectItem value="MIN_PURCH">Minimum Total Payment</SelectItem>
            <SelectItem value="B1G1">Buy One Get One</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div id="content" className="mt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Discount Name</TableHead>
              <TableHead className="text-center">Code</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-center">Total Usage</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Created by</TableHead>
              <TableHead className="text-center">Store Name</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="text-center">{d.name}</TableCell>
                <TableCell className="text-center">{d.code}</TableCell>
                <TableCell className="text-center">{d.type}</TableCell>
                <TableCell className="text-center">
                  {d.usage?.length || 0}
                </TableCell>
                <TableCell className="text-center">
                  {discountStatusbyDate(
                    new Date(d.start_date),
                    new Date(d.end_date)
                  )}
                </TableCell>
                <TableCell className="text-center">John Doe</TableCell>
                <TableCell className="text-center">
                  {d.store?.name || "-"}
                </TableCell>
                <TableCell className="flex gap-x-3 justify-center">
                  {/* <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer">
                    <Eye />
                  </Button> */}
                  <Button
                    variant={"destructive"}
                    className="cursor-pointer"
                    onClick={() => deleteDiscount(d.id)}
                  >
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
