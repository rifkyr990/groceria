"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function OrderDetailPage() {
  const params = useParams();
  const { orderId } = params;

  return (
    <div className="container mx-auto max-w-md p-8">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">
            TEST CONFIRMATION PAGE
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Order creation successful. The redirect is working.
          </p>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-xs font-mono text-gray-500">
              Captured Order ID:
            </p>
            <pre className="text-xl font-mono text-black break-all">
              {orderId}
            </pre>
          </div>
          <div className="mt-6">
            <Link href="/" className="text-sm text-blue-600 hover:underline">
              &larr; Return to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
