"use client";
import { useState } from "react";
import axios from "axios";
import { Button, Input, Card, CardHeader, CardContent, CardTitle } from "@/components/ui";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

declare global { interface Window { Razorpay: any; } }

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async (plan: string, amount: number) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/razorpay/order", { amount });
      const order = data.order;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Inventory Management",
        description: `Subscription: ${plan}`,
        order_id: order.id,
        handler: async (response: any) => {
          await axios.post("/api/razorpay/verify", response);
          alert("✅ Subscription Successful!");
          router.push("/dashboard");
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Subscribe Now</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Button
            disabled={loading}
            onClick={() => handleSubscribe("Professional", 29)}
            className="w-full"
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
            Subscribe for ₹29/month
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
