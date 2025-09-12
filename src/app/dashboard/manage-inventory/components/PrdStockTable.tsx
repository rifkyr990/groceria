import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Edit, Search, Trash } from "lucide-react";
interface IProductStock {
  className?: string;
}
const dummyPrd = [
  {
    id: 1,
    name: "Sepatu Sandal Ori",
    currentStock: 20,
    minStock: 10,
    storeName: "Padil Store",
  },
  {
    id: 2,
    name: "Sayur Bayam",
    currentStock: 1,
    minStock: 5,
    storeName: "Padil Store",
  },
];
const stockStatus = (current: number, minStock: number) => {
  if (current > minStock) {
    return <Badge className="bg-green-500">Normal</Badge>;
  } else if (current < minStock && current !== 0) {
    return <Badge className="bg-yellow-400">Low Stock</Badge>;
  } else {
    return <Badge className="bg-red-500">Out of Stock</Badge>;
  }
};

export default function ProductStock({ className }: IProductStock) {
  return (
    <div className={`${className}`}>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Product Stock Table</CardTitle>
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
            <div id="filter-status">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Status"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Product Stock</SelectLabel>
                    <SelectItem value="a">All</SelectItem>
                    <SelectItem value="b">Normal</SelectItem>
                    <SelectItem value="b">Low</SelectItem>
                    <SelectItem value="b">Out of Stock</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
                <TableHead className="text-center">Current Stock</TableHead>
                <TableHead className="text-center">Min Stock</TableHead>
                <TableHead className="text-center">Store Name</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Updated at</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyPrd.map((prd, idx) => (
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
