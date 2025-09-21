"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderDetail } from "@/components/types";
import { cn } from "@/lib/utils";
import {
  Bolt,
  CreditCard,
  Loader2,
  Truck,
  Upload,
  XCircle,
} from "lucide-react";
import { useUploadProofStore } from "@/store/upload-proof-store";
import CountdownTimer from "./CountdownTimer";

interface ActionCenterCardProps {
  order: OrderDetail;
  onCancel: () => void;
  onConfirm: () => void;
  onPay: () => void;
}

export default function ActionCenterCard({
  order,
  onCancel,
  onConfirm,
  onPay,
}: ActionCenterCardProps) {
  const { file, previewUrl, loading, error, setFile, uploadProof, reset } =
    useUploadProofStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmitProof = async () => {
    const result = await uploadProof(order.id);
    if (result.success) {
      reset();
    }
  };

  if (order.status === "PENDING_PAYMENT") {
    const paymentExpiryDate = new Date(
      new Date(order.createdAt).getTime() + 60 * 60 * 1000
    ).toISOString();

    if (order.payment?.method === "Manual Bank Transfer") {
      return (
        <Card className="mt-6 rounded-2xl shadow-lg shadow-gray-200/50 border-0">
          <CardHeader className="flex flex-row items-center gap-3 px-4 pt-4 sm:px-6 sm:pt-6 pb-2">
            <div className="w-8 h-8 flex items-center justify-center bg-primary-green-100 rounded-full">
              <Bolt className="w-4 h-4 text-primary-green-600" />
            </div>
            <CardTitle className="text-base sm:text-lg font-bold">
              Complete Your Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-800 text-center">
              <p className="font-semibold text-orange-900">Bank BCA</p>
              <p>
                Account Number:{" "}
                <span className="font-bold text-orange-900">1234567890</span>
              </p>
              <p>
                Account Holder:{" "}
                <span className="font-bold text-orange-900">PT Groceria</span>
              </p>
            </div>

            <CountdownTimer expiryDate={paymentExpiryDate} />

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/gif"
            />

            {!file ? (
              <div
                onClick={handleSelectFileClick}
                className="border border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50"
              >
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full h-12 text-base font-bold text-primary-green-600 pointer-events-none"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Select Payment Proof
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center gap-3">
                  {previewUrl && (
                    <Image
                      src={previewUrl}
                      alt="Payment proof preview"
                      width={128}
                      height={128}
                      className="max-h-32 w-auto rounded-md border"
                    />
                  )}
                  <p className="text-sm font-medium text-gray-700 truncate">
                    File: <span className="font-semibold">{file.name}</span>
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSubmitProof}
                      disabled={loading}
                      className="bg-primary-green-600 hover:bg-primary-green-700 h-12 text-base"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Submit Proof"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setFile(null)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="border-t border-dashed pt-4">
              <Button
                onClick={onCancel}
                variant="outline"
                className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 h-12 text-base"
              >
                Cancel Order
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      // Payment Gateway
      return (
        <Card className="mt-6 rounded-2xl shadow-lg shadow-gray-200/50 border-0">
          <CardHeader className="flex flex-row items-center gap-3 px-4 pt-4 sm:px-6 sm:pt-6 pb-2">
            <div className="w-8 h-8 flex items-center justify-center bg-primary-green-100 rounded-full">
              <Bolt className="w-4 h-4 text-primary-green-600" />
            </div>
            <CardTitle className="text-base sm:text-lg font-bold">
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={onPay}
              className="w-full bg-primary-green-600 hover:bg-primary-green-700 h-12 text-base"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Now
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 h-12 text-base"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancel Order
            </Button>
          </CardContent>
        </Card>
      );
    }
  }

  if (order.status === "SHIPPED") {
    return (
      <Card className="mt-6 rounded-2xl shadow-lg shadow-gray-200/50 border-0">
        <CardHeader className="flex flex-row items-center gap-3 px-4 pt-4 sm:px-6 sm:pt-6 pb-2">
          <div className="w-8 h-8 flex items-center justify-center bg-primary-green-100 rounded-full">
            <Bolt className="w-4 h-4 text-primary-green-600" />
          </div>
          <CardTitle className="text-base sm:text-lg font-bold">
            Confirm Delivery
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <Button
            onClick={onConfirm}
            className="w-full bg-primary-green-600 hover:bg-primary-green-700 h-12 text-base"
          >
            <Truck className="w-4 h-4 mr-2" />
            I've Received My Order
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}