"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const [amount, setAmount] = useState<number>(500);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/razorpay/order", { amount });
      const order = data.order;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Inventory System",
        description: "Asset Purchase",
        order_id: order.id,
        handler: async (response: any) => {
          setLoading(false);
          await axios.post("/api/razorpay/verify", response);
          alert("✅ Payment Successful!");
        },
        prefill: {
          name: "Mozammil Rja",
          email: "mozammil@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg border border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            💳 Razorpay Checkout
          </CardTitle>
          <CardDescription className="text-center">
            Secure payments made easy
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount (₹)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              className="text-center"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            disabled={loading}
            onClick={handlePayment}
            className="w-full font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Processing...
              </>
            ) : (
              `Pay ₹${amount}`
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}