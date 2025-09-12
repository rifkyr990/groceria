"use client";
import { Input } from "@/components/ui/input";
import DashboardLayout from "../../components/DashboardLayout";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useProduct } from "@/store/useProduct";
import { useShallow } from "zustand/shallow";
import { formatIDRCurrency } from "@/utils/format";

export default function ProductList() {
  const { products, getProductList } = useProduct(
    useShallow((state) => ({
      products: state.products,
      getProductList: state.getProductList,
    }))
  );
  const productCategories = products.reduce(
    (acc, product) => {
      if (!acc.some((item) => item.id === product.category.id)) {
        acc.push(product.category);
      }
      return acc;
    },
    [] as (typeof products)[0]["category"][]
  );

  // console.log(productCategories.map((category) => category.category));
  useEffect(() => {
    getProductList();
  }, []);
  return (
    <DashboardLayout>
      <section className="bg-white p-5 rounded-md  shadow-sm">
        {/* Header */}
        <div id="header" className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold my-4">Product List</h1>
          </div>
          <div id="searchbar" className="relative w-[40%]">
            <Input placeholder="Search..." className="w-full "></Input>
            <Search
              className=" absolute top-2 right-2 text-gray-400 size-5
            "
            />
          </div>
          <div className="flex gap-x-3">
            <div id="newprdbtn">
              <Link href="/dashboard/manage-product/new-product">
                <Button>+ Add New Product</Button>
              </Link>
            </div>
            <div id="filter-category">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Category"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {productCategories.map((category) => (
                    <SelectGroup key={category.id}>
                      <SelectItem value={category.category}>
                        {category.category}
                      </SelectItem>
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div id="filter-options">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="highest-price">Highest Price</SelectItem>
                    <SelectItem value="lowest-price">Lowest Price</SelectItem>
                    <SelectItem value="highest-stock">Highest Stock</SelectItem>
                    <SelectItem value="lowest-stock">Lowest Stock</SelectItem>
                    <SelectItem value="active-product">
                      Active Product
                    </SelectItem>
                    <SelectItem value="inactive-product">
                      Inactive Product
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {/* Table */}
        <div id="prd-table-list">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox className="rounded-full" />
                </TableHead>
                <TableHead className="">Product Info</TableHead>
                <TableHead className="text-center">Category</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-center">Total Stock</TableHead>
                <TableHead className="text-center">Active</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox className="rounded-full" />
                  </TableCell>
                  <TableCell
                    id="product-profile"
                    className="flex items-center gap-x-5"
                  >
                    <div id="picture">
                      <Image
                        src={
                          product.images?.[0].image_url ??
                          "/assets/fallback.png"
                        }
                        alt="prdPic"
                        width={100}
                        height={100}
                      ></Image>
                    </div>
                    <div id="identity">
                      <p className="text-lg font-semibold">{product.name}</p>
                      <p>Product ID: {product.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {product.category.category}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatIDRCurrency(product.price)}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.stocks.reduce(
                      (acc, stock) => acc + stock.stock_quantity,
                      0
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={product.is_active} />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-x-2 justify-center items-center">
                      <Button>Edit</Button>
                      <Button variant={"destructive"}>Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </DashboardLayout>
  );
}
