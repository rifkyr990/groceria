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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";

interface IStockHistory {
  className?: string;
}

export default function StockHistory({ className }: IStockHistory) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  return (
    <div className={`${className}`}>
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
                <TableHead className="text-center">Reason</TableHead>
                <TableHead className="text-center">Created at</TableHead>
                <TableHead className="text-center">Store Name</TableHead>
                <TableHead className="text-center">PIC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {dummyPrd.map((prd, idx) => (
                <TableRow key={idx}>
                  <TableCell>{prd.name}</TableCell>
                  <TableCell className="text-center">
                    {prd.currentStock}
                  </TableCell>
                  <TableCell className="text-center">{prd.minStock}</TableCell>
                  <TableCell className="text-center">{prd.storeName}</TableCell>
                  <TableCell className="text-center">
                    {stockStatus(prd.currentStock, prd.minStock)}
                  </TableCell>
                  <TableCell className="text-center">
                    20 September 2022
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
