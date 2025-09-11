import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { IProductProps } from "@/types/product";
import { ChevronDown, Headset, Phone, ShoppingCart, Store } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface IMobilePrdDetails {
  allProduct: IProductProps[] | null;
  detailsData?: IProductProps | null;
  className?: string;
}

export default function MobilePrdDetails({
  allProduct,
  detailsData,
  className,
}: IMobilePrdDetails) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const stock = detailsData?.stock ?? 0;
  const isOutOfStock = detailsData?.stock === 0;
  const isLowStock = detailsData?.stock && detailsData.stock <= 5;

  const filteredCategory = allProduct?.filter(
    (p) => p.category === detailsData?.category
  );
  const router = useRouter();

  // console.log(filteredCategory);
  // increment/decrement purchasement handler
  const [value, setValue] = useState(1);
  const handlerValue = (type: "inc" | "dec") => {
    if (type === "inc") {
      setValue((prev) => prev + 1);
    } else if (type === "dec" && value > 1) {
      setValue((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className={`${className}`}>
      <section id="prd-picture-carousel">
        <Image
          src={
            detailsData?.image
              ? detailsData.image
              : "/assets/defaultbanner2.svg"
          }
          alt="prdPic"
          width={500}
          height={500}
          className="w-full"
        />
      </section>
      <section id="prd-profile" className=" gap-5 px-5 py-3">
        <div className="relative ">
          <p className="font-bold text-xl text-orange-500">
            Rp
            <span className="text-3xl">
              {detailsData?.price.toLocaleString()}
            </span>
          </p>
          <p className="my-2 text-xl font-semibold">{detailsData?.name}</p>
          {isOutOfStock ? (
            <p className="text-red-500 ">Out of Stock</p>
          ) : (
            <p className={isLowStock ? "text-red-500" : "text-green-500"}>
              Available Stock : {stock}
            </p>
          )}
          <Badge className="my-2 p-1.5 bg-amber-400">
            {detailsData?.category}
          </Badge>

          <div id="counter-cart" className="flex my-5 justify-between">
            <div id="counter">
              <div className="w-25 grid grid-cols-3 gap-x-2  items-center h-8 ">
                <Button
                  className=" cursor-pointer select-none bg-emerald-500 hover:bg-emerald-600"
                  id="decrement"
                  onClick={() => handlerValue("dec")}
                  disabled={value <= 1 || isOutOfStock}
                >
                  -
                </Button>
                <div className="text-center border-b-2 select-none border-gray-200 h-full flex items-center justify-center ">
                  <p>{value}</p>
                </div>
                <Button
                  className="cursor-pointer select-none bg-emerald-500 hover:bg-emerald-600"
                  id="increment"
                  onClick={() => handlerValue("inc")}
                  disabled={value === detailsData?.stock || isOutOfStock}
                >
                  +
                </Button>
              </div>
            </div>
            <div id="cart">
              <Button
                className="w-full h-9 bg-green-600 hover:bg-green-700"
                disabled={isOutOfStock}
              >
                <ShoppingCart /> Add to Cart
              </Button>
            </div>
          </div>
          {value === detailsData?.stock && (
            <p className="text-red-500 text-xs my-2 ">
              You have reached our maximum stock
            </p>
          )}

          <div id="share-prd" className="flex justify-between">
            <div className="flex items-center">
              <p className="text-sm">Share:</p>
              <div id="icon-social" className="flex items-center">
                <Image
                  src="/assets/sosmed/fb.png"
                  alt="fb"
                  width={1000}
                  height={1000}
                  className="size-6"
                />
                <Image
                  src="/assets/sosmed/instagram.png"
                  alt="ig"
                  width={1000}
                  height={1000}
                  className="size-6"
                />
                <Image
                  src="/assets/sosmed/wa.png"
                  alt="wa"
                  width={50}
                  height={50}
                  className="size-6"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="store-cta"
        className="flex justify-between px-5 py-3 items-center my-5 bg-gray-300/30"
      >
        <div id="store-profile" className="flex gap-x-2 items-center">
          <div id="avatar">
            <Avatar className="size-10">
              <AvatarImage src={"/assets/user.png"} />
              <AvatarFallback>ID</AvatarFallback>
            </Avatar>
          </div>
          <div id="profile">
            <p className="font-semibold">Groceria Semarang</p>
            <p className="text-xs">Semarang, Jawa Tengah</p>
          </div>
        </div>
        <div id="cta">
          <Button className="h-8 bg-orange-600 hover:bg-orange-500">
            {/* <Store className="text-xs" /> */}
            <Headset className="text-xs" />
            <p className="text-xs">Contact</p>
          </Button>
        </div>
      </section>
      <section id="prd-desc" className="px-5 ">
        <Accordion type="single" collapsible defaultValue="prd-desc">
          <AccordionItem value="prd-desc">
            <AccordionTrigger className="text-lg font-semibold">
              Product Description
            </AccordionTrigger>
            <AccordionContent className="text-justify">
              {" "}
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Exercitationem quia fugiat quo, autem id neque provident quam
              pariatur ipsa incidunt! Lorem ipsum dolor sit, amet consectetur
              adipisicing elit. Accusamus accusantium delectus dolores optio
              expedita ipsam id a, consequuntur repellendus itaque. Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Dolorem, blanditiis?
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      <section id="similar-products" className="p-5 mt-10 bg-green-300/30">
        <p className="font-semibold text-xl">Similar Products</p>
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          className="mt-5"
        >
          <CarouselContent>
            {filteredCategory?.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2">
                <Card
                  className="p-0  rounded-md overflow-hidden gap-1"
                  onClick={() => router.push(`/product-details/${product.id}`)}
                >
                  <div className="relative w-full h-25 ">
                    <Image
                      src={product.image || ""}
                      alt="prd-filtered-image"
                      fill
                      className="object-cover "
                    />
                  </div>
                  <CardContent className="p-3">
                    <p className="text-xs font-semibold">{product.name}</p>
                    <p className="mt-2 font-bold text-green-600">
                      Rp.{product.price.toLocaleString()}
                    </p>
                  </CardContent>
                  <Button className="text-xs h-7 w-[85%] mx-auto my-3 bg-green-600 ">
                    <ShoppingCart className="size-3" /> Add to Cart
                  </Button>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    </section>
  );
}
