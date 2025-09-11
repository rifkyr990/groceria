"use client";
import { Input } from "@/components/ui/input";
import DashboardLayout from "../../components/DashboardLayout";
import { useState } from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, TicketPercent } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function NewProduct() {
  const [previews, setPreviews] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const handlerPreviews = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newPreviews = [...previews];
      newPreviews[index] = imageUrl;
      setPreviews(newPreviews);
      console.log(imageUrl);
    }
    console.log(file);
  };

  return (
    <DashboardLayout>
      <section className="flex flex-row gap-x-5 p-5">
        <section id="prd-details" className="flex basis-2/3 w-full gap-x-5">
          <section
            id="prd-info"
            className="bg-white w-full  rounded-md shadow-sm px-5 py-4"
          >
            <div id="prd-photo-uploader">
              <h1 className="text-xl font-semibold my-2">Product Picture</h1>
              <div className="grid grid-cols-4 gap-5">
                {[1, 2, 3, 4].map((item, index) => (
                  <div key={index}>
                    <label
                      htmlFor={`file-${index}`}
                      className="h-40 border-2 border-dashed border-black flex items-center justify-center text-gray-500 text-sm cursor-pointer rounded-md p-4 hover:bg-gray-100"
                    >
                      {previews[index] ? (
                        <Image
                          src={previews[index] as string}
                          alt="prd-preview"
                          width={100}
                          height={100}
                          className="w-full"
                          unoptimized
                        ></Image>
                      ) : (
                        `Upload Gambar ${index + 1}`
                      )}
                    </label>
                    <input
                      id={`file-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlerPreviews(e, index)}
                      className="hidden"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div id="prd-details">
              <h1 className="text-xl font-semibold my-5">
                Product Detail Information
              </h1>
              <div className="flex mb-5 items-center">
                <p className="w-full">Product Name</p>
                <Input className=""></Input>
              </div>
              <div className="flex flex-col gap-3">
                <p>Product Description</p>
                <Textarea />
              </div>
              <div id="submenu" className="flex gap-5 mt-10">
                <div id="submenu1" className="flex flex-col gap-5 w-full">
                  <div className="flex items-center">
                    <p className="w-full">Product Category</p>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Category"></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cat1">Cat1</SelectItem>
                        <SelectItem value="cat2">Cat2</SelectItem>
                        <SelectItem value="cat3">Cat3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex  items-center">
                    <p className="w-full">Product Price</p>
                    <Input placeholder="50.000 (in IDR)"></Input>
                  </div>
                  <div className="flex items-center">
                    <p className="w-full">Product Promo Code</p>
                    <Input></Input>
                  </div>
                </div>
                <div id="submenu2" className="flex flex-col gap-5 w-full">
                  <div className="flex items-center">
                    <p className="w-full">Product Stock</p>
                    <Input></Input>
                  </div>
                  <div className="flex items-center">
                    <p className="w-full">Stock at</p>
                    <Input></Input>
                  </div>
                </div>
              </div>
            </div>
            <div id="btn" className="my-5">
              <Button className="bg-blue-500 hover:bg-blue-600 shadow-sm cursor-pointer">
                Add Product
              </Button>
            </div>
          </section>
        </section>
        <section
          id="prd-preview"
          className="bg-white basis-1/3 w-full h-[80vh] overflow-auto rounded-md shadow-sm  "
        >
          <h1 className="text-xl font-semibold my-5 px-5 py-2">
            Product Preview
          </h1>
          <div id="banner-preview" className="relative w-full h-[250px] ">
            <Image
              src="/assets/produk/bayam.jpg"
              alt="banner-preview"
              fill
              className="object-cover"
            />
          </div>
          <div
            id="price-preview"
            className="flex flex-col gap-y-1.5 p-5 relative"
          >
            <p className="text-3xl font-bold">
              <span className="text-xl">Rp</span>50.000
            </p>
            <p className="text-xl font-semibold">Sayur Bayam Hidroponik</p>
            <p>Available Stock: 50</p>
            <div className="flex items-center justify-between">
              <Badge className="rounded-full h-7 bg-blue-500/80">
                Sayuran Segar
              </Badge>
              <Button className="bg-green-600 hover:bg-green-700 rounded-full p-5">
                <ShoppingCart /> Add to Cart
              </Button>
            </div>
            {/* Promo Code */}
            <div className="p-2 h-8 bg-red-500 absolute top-5 right-0  flex justify-center items-center">
              <TicketPercent className="text-white size-6" />
              <p className="mx-1 text-white font-semibold">SAYURANKU</p>
            </div>
          </div>
          <div className="w-[95%] bg-gray-300/80 h-0.5 mx-auto rounded-full"></div>
          <div id="desc-preview" className="p-4">
            <Accordion type="single" collapsible defaultValue="prd-desc">
              <AccordionItem value="prd-desc">
                <AccordionTrigger>
                  <p className="text-xl font-semibold">Product Description</p>
                </AccordionTrigger>
                <AccordionContent className="text-justify  transition-all duration-300 ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Distinctio eum adipisci numquam doloribus quibusdam labore at
                  voluptates excepturi voluptatibus a! Lorem ipsum dolor sit
                  amet consectetur, adipisicing elit. Ea sint commodi
                  repellendus doloribus accusamus quasi deleniti quis iste
                  dicta.Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Distinctio eum adipisci numquam doloribus quibusdam labore at
                  voluptates excepturi voluptatibus a! Lorem ipsum dolor sit
                  amet consectetur, adipisicing elit. Ea sint commodi
                  repellendus doloribus accusamus quasi deleniti quis iste
                  dicta.Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Distinctio eum adipisci numquam doloribus quibusdam labore at
                  voluptates excepturi voluptatibus a! Lorem ipsum dolor sit
                  amet consectetur, adipisicing elit. Ea sint commodi
                  repellendus doloribus accusamus quasi deleniti quis iste dicta
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </section>
    </DashboardLayout>
  );
}
