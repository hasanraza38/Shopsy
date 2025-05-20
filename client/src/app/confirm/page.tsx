"use client"
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { api } from "@/helper/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";



type Product = {
  _id: string;
  name: string;
  price: number;
  userId: {
    username: string;
  };
}

type OrderData = {
  _id: string;
  totalPrice: number;
  products: Product[];
}
const Confirm = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<OrderData | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);


  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("session_id");
    setSessionId(id);
  }, []);
  
  useEffect(() => {
    const confirmOrder = async () => {
      if (!sessionId) {
        setError('No session ID found');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `order/confirm?session_id=${sessionId}`,
        );
        console.log('Order confirmed:', response.data.order);
        setData(response.data.order);
      } catch (err: any) {
        console.error('Error confirming order:', err);
        setError(err.response?.data?.message || 'Failed to confirm order');
      } finally {
        setLoading(false);
      }
    };

    confirmOrder();
  }, [sessionId]);

  if (loading) {
    return <div className="text-center mt-10">Confirming your order...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-white">
        <div className="flex flex-col items-center space-y-6">
          <CheckCircle2 className="text-green-600 w-24 h-24" />
          <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
          <h2 className="text-xl font-semibold text-gray-800">Order Confirmed</h2>

          {data && (
            <Card className="w-full max-w-xl bg-emerald-50 shadow-md">
              <CardContent className="p-6">
                <p className="mb-2">
                  <strong>Order ID:</strong> {data._id}
                </p>
                <p className="mb-4">
                  <strong>Total Price:</strong> ${data.totalPrice}
                </p>

                <h3 className="text-lg font-semibold mb-2">Products:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  <li key={data.products[0]?._id}>
                    {data.products[0].name} – USD {data.products[0]?.price}{" "}
                    <span className="text-gray-500">
                      (Added by: {data.products[0]?.userId.username})
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}

          <Button variant="default" className="mt-6" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
      
    </>
  )
};

export default Confirm;