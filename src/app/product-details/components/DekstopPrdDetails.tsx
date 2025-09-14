import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useProduct } from "@/store/useProduct";
import { IProductProps } from "@/types/product";
import Autoplay from "embla-carousel-autoplay";
import { Headset, MapPin, ShoppingCart, Store } from "lucide-react";
import { handler } from "next/dist/build/templates/app-page";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IDesktopPrdDetails {
  allProduct: IProductProps[] | null;
  detailsData?: IProductProps | null;
  className?: string;
}

export default function DesktopPrdDetails({
  detailsData,
  className,
  allProduct,
}: IDesktopPrdDetails) {
  // const { selectedProductDetails } = useProduct();
  // console.log(selectedProductDetails);
  const dummyPrdImage = [
    {
      id: 1,
      picUrl: detailsData?.images,
    },
    {
      id: 2,
      picUrl: "/assets/produk/bayam.jpg",
    },
    {
      id: 3,
      picUrl: "/assets/produk/daging.png",
    },
    {
      id: 4,
      picUrl: "/assets/produk/tomat.jpg",
    },
  ];
  const filteredCategory = allProduct?.filter(
    (p) => p.category === detailsData?.category
  );
  const router = useRouter();

  // increment/decrement purchasement handler
  const [value, setValue] = useState(1);
  const handlerValue = (type: "inc" | "dec") => {
    if (type === "inc") {
      setValue((prev) => prev + 1);
    } else if (type === "dec" && value > 1) {
      setValue((prev) => prev - 1);
    }
  };

  // prd preview handler
  const [preview, setPreview] = useState("");
  const handlerPreview = (img: string) => {
    // console.log(img);
    setPreview(img);
  };

  // Stock handler
  const stock = detailsData?.stock ?? 0;
  const isOutOfStock = detailsData?.stock === 0;
  const isLowStock = detailsData?.stock && detailsData.stock <= 5;

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <section className={`${className}  `}>
      <section
        id="details"
        className="flex gap-x-10 2xl:gap-x-20 mt-10 px-10 xl:px-40 2xl:px-60  items-center   "
      >
        <div id="prd-picture" className="w-full 2xl:w-[60%] mt-10 ">
          <div
            id="preview"
            className="relative w-full h-70 lg:h-80 xl:h-90  rounded-lg overflow-hidden shadow-md  "
          >
            <Image
              src={preview || detailsData?.images[0]}
              alt="prd-picture"
              fill
              className="object-cover"
            />
          </div>
          <div
            id="prdPic-carousel"
            className="grid grid-cols-4 gap-x-2 xl:gap-x-4 my-3"
          >
            {dummyPrdImage.map((img, index) => (
              <div
                className="relative w-full h-15 lg:h-20  rounded-lg overflow-hidden shadow-sm cursor-pointer"
                key={index}
              >
                <Image
                  src={img.picUrl}
                  alt="pic"
                  fill
                  className="object-cover"
                  onClick={() => handlerPreview(img.picUrl)}
                />
              </div>
            ))}
          </div>
        </div>
        <div id="prd-profile" className="w-full ">
          <p className="text-2xl lg:text-3xl font-semibold">
            {detailsData?.name}
          </p>
          <Badge className="my-2 p-1.5 bg-amber-400">
            {detailsData?.category}
          </Badge>
          {/* Stock */}
          {isOutOfStock ? (
            <p className="text-red-500 ">Out of Stock</p>
          ) : (
            <p className={isLowStock ? "text-red-500" : "text-green-500"}>
              Available Stock : {stock}
            </p>
          )}
          {/*  */}
          <p className="my-4 text-orange-500 font-bold text-3xl">
            Rp
            <span className="text-5xl">
              {detailsData?.price.toLocaleString()}
            </span>
          </p>
          <div id="counter-cart" className="flex  flex-col gap-y-5">
            <div id="counter" className="flex gap-x-5 items-center">
              <p>Jumlah Pembelian</p>
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
                  disabled={value === stock || isOutOfStock}
                >
                  +
                </Button>
              </div>
            </div>
            {value == detailsData?.stock && (
              <p className="text-red-500 ">
                You have reached our maximum stock
              </p>
            )}
            <div id="add-cart">
              <Button
                className="bg-green-600 hover:bg-green-700 cursor-pointer"
                disabled={isOutOfStock}
              >
                <ShoppingCart />
                Add to Cart
              </Button>
            </div>
          </div>
          <div id="share-prd" className="my-5 flex justify-between">
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
      <section id="store-profile" className=" mt-10 p-5 xl:w-[75%] mx-auto ">
        <div className="border border-gray-200   p-5 flex rounded-xl shadow-md  items-center justify-between ">
          <div id="avatar-profile" className="flex gap-x-3 items-center">
            <div id="avatar">
              <Avatar className="size-10">
                <AvatarImage src={"/assets/user.png"} />
                <AvatarFallback>ID</AvatarFallback>
              </Avatar>
            </div>
            <div id="profile" className="w-full">
              <div className="flex gap-x-2">
                <p className="w-full font-semibold">
                  Groceria Semarang Official Store
                </p>
                <Badge className="bg-green-200 text-green-500">Verified</Badge>
              </div>
              <p className="flex text-xs gap-x-1 items-center">
                <MapPin className="size-5" />
                Semarang, Jawa Tengah{" "}
              </p>
            </div>
          </div>
          <div id="cta" className="flex gap-x-2 ">
            <Button className="border border-green-500  bg-white hover:bg-transparent cursor-pointer">
              <Store className="max-lg:text-xs  text-green-500" />
              <p className="max-lg:text-xs text-green-500">Visit Store</p>
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 cursor-pointer">
              <Headset />
              <p className="max-lg:text-xs">Contact Store</p>
            </Button>
          </div>
        </div>
      </section>

      <section id="description" className="px-10 lg:px-20 xl:px-30 py-10">
        <p className="text-2xl font-semibold">Product Description</p>
        <p className="my-5 text-justify">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta libero
          blanditiis incidunt iusto ipsa rerum cum tenetur odit nostrum
          perspiciatis, earum rem, suscipit debitis fuga omnis consectetur
          ipsam? Error, ipsam architecto dicta, ex adipisci doloribus dolorum
          soluta eaque nam animi quae. Porro adipisci illo enim cumque voluptate
          obcaecati similique neque? Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Nesciunt expedita perferendis, neque minima nobis
          natus recusandae consequatur laudantium laboriosam libero sapiente
          eligendi excepturi, molestiae officiis, eos assumenda? Esse in aperiam
          odit maxime. Consequatur minima esse, excepturi magnam tempora quae
          accusamus quas eligendi, ducimus error voluptatibus laborum natus eum
          nostrum, provident temporibus doloribus sit iste? Nulla odit
          reiciendis ipsa! Officia, laudantium eius adipisci nesciunt facere
          esse porro, provident distinctio blanditiis ipsum sit illo!
          Perspiciatis reiciendis, ipsum illo nesciunt quo debitis itaque
          voluptatum rerum saepe autem? Sequi at molestias voluptates tempore
          dolore illum praesentium veniam temporibus, iusto delectus facere modi
          architecto consequuntur est nisi doloribus voluptas minus, ipsa
          repellendus tempora nulla molestiae quos dolor? Provident dignissimos
          optio beatae consequuntur magni laboriosam fuga omnis repellat
          eligendi ex, eius culpa facere laudantium quam sunt, exercitationem
          itaque amet a nemo harum magnam voluptas obcaecati saepe? Possimus
          quidem dolor cupiditate nostrum sunt libero soluta ab facilis, tenetur
          quaerat, minima, quasi similique inventore nam? Nobis libero sint, cum
          deleniti facere hic harum explicabo error voluptatibus accusamus quas
          rem quia tenetur amet pariatur at perspiciatis praesentium sapiente
          assumenda modi et nam! Tempore nostrum pariatur culpa recusandae esse
          ex provident quas mollitia, illum laboriosam nam similique nemo qui
          facilis.
        </p>
      </section>
      <section
        id="similar-products"
        className="px-10 py-5 mt-10 bg-green-300/30"
      >
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
              <CarouselItem
                key={product.id}
                className="basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6"
              >
                <Card
                  className="p-0  rounded-md overflow-hidden gap-1"
                  onClick={() => router.push(`/product-details/${product.id}`)}
                >
                  <div className="relative w-full h-40 lg:h-50 xl:h-60 2xl:h-65 ">
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
