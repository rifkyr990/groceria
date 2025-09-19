"use client";

import { useEffect } from "react";
import { useAddressStore } from "@/store/address-store";
import AddAddressModal from "./address/AddAddressModal";
import EditAddressModal from "./address/EditAddressModal";
import { useState } from "react";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";

export default function AddressList() {
  const {
    addresses,
    fetchAddress,
    deleteAddress,
    setPrimary,
    loading,
    error,
  } = useAddressStore();

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<Number | null>(null);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Alamat Saya</h2>
        <AddAddressModal /> {/* tombol + popup dari komponen modal */}
      </div>

      {loading && <p>Memuat alamat...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="border rounded-lg p-4 mb-4 flex flex-col gap-2"
        >
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <h3 className="font-semibold">{addr.name}</h3>
              <p className="text-gray-600">| {addr.phone}</p>
            </div>
            <div className="flex gap-4 text-blue-500 text-sm">
              <EditAddressModal address={addr} />
              <button
                onClick={() => {
                  setSelectedId(addr.id);
                  setOpen(true);
                }}
                className="text-red-600 hover:underline"
              >
                Hapus
            </button>
            </div>
          </div>

          <p className="text-gray-600">{addr.street} ({addr.detail})</p>
          <p className="text-gray-700">
            {addr.district}, {addr.city}, {addr.province}, ID,{" "}
            {addr.postal_code}
          </p>

          <div className="flex items-center gap-2 mt-2">
            {addr.is_primary ? (
              <span className="text-red-500 text-xs border border-red-500 px-2 py-0.5 rounded">
                Utama
              </span>
            ) : (
              <button
                onClick={() => setPrimary(addr.id)}
                className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
              >
                Atur sebagai utama
              </button>
            )}
            <span className="text-red-500 text-xs border border-red-500 px-2 py-0.5 rounded">
                {addr.label}
            </span>
          </div>
        </div>
      ))}
      <ConfirmDeleteDialog
        open={open}
        setOpen={setOpen}
        data={selectedId}
        onConfirm={(id) => {
          if (id) {
            deleteAddress(id);
          }
        }}
      />
    </div>
  );
}
