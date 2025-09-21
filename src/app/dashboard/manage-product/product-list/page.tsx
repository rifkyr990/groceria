"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
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
import { useProduct } from "@/store/useProduct";
import { formatIDRCurrency, upperFirstCharacter } from "@/utils/format";
import { Eye, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import DashboardLayout from "../../components/DashboardLayout";
import EditProductCategory from "../components/EditProductCategory";
import { Switch } from "@/components/ui/switch";
import EditProductDetails from "../components/EditProductDetails";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ProductList() {
  // check role
  const [role, setRole] = useState("");
  useEffect(() => {
    const jsonData = JSON.parse(localStorage.getItem("user")!);
    if (!jsonData) return;
    if (jsonData.role === "STORE_ADMIN") {
      setRole(jsonData.role);
    }
  }, []);
  const { products, getProductList } = useProduct(
    useShallow((state) => ({
      products: state.products,
      getProductList: state.getProductList,
    }))
  );
  const { setSelectedProductDetails } = useProduct();
  const productCategories = products.reduce(
    (acc, product) => {
      if (!acc.some((item) => item.id === product.category.id)) {
        acc.push(product.category);
      }
      return acc;
    },
    [] as (typeof products)[0]["category"][]
  );
  const [editCategory, setEditCategory] = useState(false);
  const [editDetails, setEditDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "all"
  );
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number[]>([]);
  // router
  const router = useRouter();

  const toggleActiveStatus = async (productId: number, newStatus: boolean) => {
    try {
      // update UI
      useProduct.setState((state) => ({
        products: state.products.map((product) =>
          product.id === productId
            ? { ...product, is_active: newStatus }
            : product
        ),
      }));

      // Update backend
      const res = await apiCall.patch(
        `/api/product/change-status/${productId}`,
        {
          is_active: { newStatus },
        }
      );
      await getProductList();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSelectedProduct = (id: number) => {
    setSelectedProduct((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredProduct = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) => {
      if (!selectedCategory || selectedCategory === "all") return true;
      return product.category.category === selectedCategory;
    })
    .filter((product) => {
      if (selectedSort === "active-product") return product.is_active === true;
      if (selectedSort === "inactive-product")
        return product.is_active === false;
      return true;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case "highest-price":
          return b.price - a.price;
        case "lowest-price":
          return a.price - b.price;
        case "highest-stock":
          return (
            b.stocks.reduce((acc, s) => acc + s.stock_quantity, 0) -
            a.stocks.reduce((acc, s) => acc + s.stock_quantity, 0)
          );
        case "highest-stock":
          return (
            a.stocks.reduce((acc, s) => acc + s.stock_quantity, 0) -
            b.stocks.reduce((acc, s) => acc + s.stock_quantity, 0)
          );
        default:
          return 0;
      }
    });

  const deleteSelectedProduct = async () => {
    try {
      const confirm = window.confirm(
        `Apa Anda yakin ingin hapus ${selectedProduct.length} produk? Produk akan dihapus dari seluruh store`
      );
      if (!confirm) return;
      const res = await apiCall.patch("/api/product/soft-delete", {
        data: selectedProduct,
      });
      toast.success("Delete Product Success");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductList();
  }, []);
  useEffect(() => {
    console.log(selectedProduct);
  }, [selectedProduct]); // debugging selected

  return (
    <DashboardLayout>
      <section className="bg-white p-5 rounded-md  shadow-sm">
        {/* Header */}
        <div id="header" className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold my-4">Product List</h1>
          </div>
          <div id="searchbar" className="relative w-[40%]">
            <Input
              placeholder="Search product name . . . "
              className="w-full "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            ></Input>
            <Search
              className=" absolute top-2 right-2 text-gray-400 size-5
            "
            />
          </div>
          <div className="flex gap-x-3 items-center">
            <div id="newprdbtn">
              <Button hidden={role ? true : false}>
                <Link href="/dashboard/manage-product/new-product">
                  + Add New Product
                </Link>
              </Button>
            </div>
            <div id="edit-category">
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => setEditCategory((prev) => !prev)}
              >
                Add/Edit Category
              </Button>
            </div>
            <div id="filter-category">
              <Select onValueChange={(value) => setSelectedCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {productCategories.map((category) => (
                    <SelectGroup key={category.id}>
                      <SelectItem value={category.category}>
                        {upperFirstCharacter(category.category)}
                      </SelectItem>
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div id="filter-options">
              <Select onValueChange={(value) => setSelectedSort(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter/Sort by"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All</SelectItem>
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
        <div>
          <Button
            variant={"destructive"}
            hidden={selectedProduct.length === 0}
            onClick={deleteSelectedProduct}
          >
            Delete Selected Product
          </Button>
        </div>
        {/* Table */}
        <div id="prd-table-list">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    className="rounded-full"
                    hidden={role ? true : false}
                    checked={selectedProduct.length === filteredProduct.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedProduct(filteredProduct.map((p) => p.id));
                      } else {
                        setSelectedProduct([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead className="">Product Info</TableHead>
                <TableHead className="text-center">Category</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-center">Total Stock</TableHead>
                <TableHead className="text-center">Active/Inactive</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProduct.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      className="rounded-full"
                      hidden={role ? true : false}
                      checked={selectedProduct.includes(product.id)}
                      onCheckedChange={() => toggleSelectedProduct(product.id)}
                    />
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
                    {upperFirstCharacter(product.category.category)}
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
                    <Switch
                      disabled={role ? true : false}
                      checked={product.is_active}
                      onCheckedChange={(checked) =>
                        toggleActiveStatus(product.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-x-2 justify-center items-center">
                      <Button
                        hidden={role ? true : false}
                        onClick={() => {
                          setSelectedProductDetails(product); // simpan produk yang dipilih ke Zustand
                          router.push(`/dashboard/manage-product/edit-product`); // pindah ke halaman edit
                        }}
                      >
                        Edit Product
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedProductDetails(product);
                          router.push(`/product-details/${product.id}`);
                        }}
                      >
                        <Eye />
                        Preview
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
      {/* Add/Edit Category Dialog */}
      <EditProductCategory open={editCategory} setOpen={setEditCategory} />
      <EditProductDetails open={editDetails} setOpen={setEditDetails} />
    </DashboardLayout>
  );
}
