"use client";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import PaginationControls from "@/components/PaginationControls";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
import { IUserProps } from "@/types/user";
import { FileSearch, Search, Trash } from "lucide-react";
import { useState } from "react";
import UserDetailsDialog from "./btndetails/UserDetailsDialog";
import UsersDataCardStacks from "./CardStacksUsersData";
interface IUsersTable {
  className?: string;
  users: IUserProps[];
}

export default function UsersTableCard({ className, users }: IUsersTable) {
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState<
    "all" | "verified" | "unverified"
  >("all");
  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!orderStatus) return 0;
    if (orderStatus === "verified") {
      return Number(b.verifystatus) - Number(a.verifystatus);
    }
    if (orderStatus === "unverified") {
      return Number(a.verifystatus) - Number(b.verifystatus);
    }
    return 0;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<IUserProps | null>(null);
  const [deleteSelectedUser, setDeleteSelectedUser] =
    useState<IUserProps | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const usersPerPage = 3;
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const btnDelete = (user: IUserProps) => {
    // console.log(selectedUser);
    setDeleteSelectedUser(user);
    setDeleteConfirm((prev) => !prev);
  };

  const handlerDelete = (data: IUserProps) => {
    if (data) {
      console.log(data);
      alert(`Delete ${data.first_name}${data.last_name} Success`);
      setDeleteConfirm(false);
    }
  };

  return (
    <>
      <Card className={`${className} `}>
        <CardHeader className="flex max-lg:flex-col items-center justify-between ">
          <div className="w-full">
            <h1 className="font-semibold text-xl">Registered Users</h1>
          </div>
          <div className="flex max-lg:flex-col gap-x-2 w-full ">
            <div id="searcbar" className="relative w-full">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by first name/role ..."
                className="text-xs"
              ></Input>
              <Search className="absolute size-4 top-2.5 right-2 text-gray-400" />
            </div>
            <div className="flex gap-x-2 max-lg:justify-between max-lg:mt-5">
              <div id="newuser">
                <Button
                  className="bg-blue-500 hover:bg-blue-600
            "
                >
                  New User
                </Button>
              </div>
              <div id="filter">
                <Select
                  value={orderStatus}
                  onValueChange={(value) =>
                    setOrderStatus(value as "all" | "verified" | "unverified")
                  }
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Order By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="verified">Verified✅</SelectItem>
                      <SelectItem value="unverified">Unverified⚠️</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent
          className=" p-4
        "
        >
          {/* Desktop Version - Table */}
          <Table className="max-lg:hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">User ID</TableHead>
                <TableHead className="text-center">First Name</TableHead>
                <TableHead className="text-center">Last Name</TableHead>
                <TableHead className="text-center">Phone</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Role</TableHead>
                <TableHead className="text-center max-xl:hidden">
                  Status
                </TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="max-xl:hidden">
                    {user.verifystatus ? "Verified" : "Unverified"}
                  </TableCell>
                  <TableCell className="flex gap-x-2 items-center text-center justify-center">
                    <Button
                      className="bg-blue-500 hover:bg-blue-600
                  "
                      onClick={() => setSelectedUser(user)}
                    >
                      <FileSearch className="text-white" />
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={() => btnDelete(user)}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Mobile Version - Card Stacks */}
          <UsersDataCardStacks users={currentUsers} />
        </CardContent>
        <CardFooter className="max-lg:hidden">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardFooter>
      </Card>
      {/* UserDetails Dialog */}
      {selectedUser && (
        <UserDetailsDialog
          open={!!selectedUser}
          setOpen={(open) => {
            if (!open) setSelectedUser(null);
          }}
          users={selectedUser}
        />
      )}
      {/* Confirm Details  */}
      <ConfirmDeleteDialog
        open={deleteConfirm}
        setOpen={setDeleteConfirm}
        data={deleteSelectedUser}
        onConfirm={handlerDelete}
      />
    </>
  );
}
