"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/store/hooks";
import { useRazorpayScript } from "@/hooks/useRazorpayScript";

// ✅ Payment handler
const handlePayment = async (amount: number, planName: string) => {
  try {
    const res = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();
    if (!data?.order?.id) throw new Error("Failed to create order");

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "Inventory Management System",
      description: `${planName} Plan Payment`,
      order_id: data.order.id,
      handler: function (response: any) {
        toast.success(
          `✅ Payment successful! Payment ID: ${response.razorpay_payment_id}`
        );
        console.log("Payment success:", response);
      },
      prefill: {
        name: "John Doe",
        email: "john@example.com",
        contact: "9999999999",
      },
      theme: { color: "#1E293B" },
    };

    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error(error);
    toast.error("❌ Something went wrong while starting payment.");
  }
};

export default function PricingSection() {
  useRazorpayScript();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // ✅ Handle plan click (check login or start payment)
  const handlePlanClick = async (plan: any) => {
    if (!isAuthenticated) {
      toast.error("Please login to continue with payment.");
      router.push("/login");
      return;
    }

    await handlePayment(plan.price * 100, plan.name);
  };

  const plans = [
    {
      name: "Starter",
      price: 0,
      description: "Perfect for small teams getting started",
      features: [
        "Up to 100 assets",
        "Basic reporting",
        "Email support",
        "Mobile app access",
      ],
      button: {
        text: "Get Started Free",
        variant: "outline",
        link: "/register",
      },
    },
    {
      name: "Professional",
      price: 29,
      description: "For growing teams with advanced needs",
      features: [
        "Unlimited assets",
        "Advanced analytics",
        "Priority support",
        "API access",
        "Custom integrations",
      ],
      button: { text: "Start Free Trial", variant: "solid" },
      popular: true,
    },
    {
      name: "Enterprise",
      price: 99,
      description: "For large organizations with custom needs",
      features: [
        "Everything in Pro",
        "Dedicated support",
        "Custom training",
        "SLA guarantee",
        "On-premise option",
      ],
      button: { text: "Contact Sales", variant: "outline", link: "/register" },
    },
  ];

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center mb-12 sm:mb-16">
        <Badge className="mb-3 sm:mb-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-50 border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm">
          <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
          Simple Pricing
        </Badge>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400 bg-clip-text text-transparent px-4">
          Choose Your Plan
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
          Start free and scale as you grow. No hidden fees.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`border-2 hover:shadow-xl transition-all ${
              plan.popular
                ? "border-slate-900 dark:border-slate-50 shadow-2xl relative"
                : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-gradient-to-br from-blue-600 to-purple-600 text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-bl-lg">
                POPULAR
              </div>
            )}

            <CardContent className="p-6 sm:p-8">
              <div className="mb-5 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                  <span className="text-3xl sm:text-4xl font-bold">
                    {plan.price === 0 ? "$0" : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                      /month
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {plan.description}
                </p>
              </div>

              {/* ✅ Conditional button */}
              {plan.button.link ? (
                <Button
                  asChild
                  className="w-full mb-5 sm:mb-6 h-10 sm:h-11 text-sm sm:text-base"
                  variant={
                    plan.button.variant === "solid" ? "default" : "outline"
                  }
                >
                  <Link href={plan.button.link}>{plan.button.text}</Link>
                </Button>
              ) : (
                <Button
                  onClick={() => handlePlanClick(plan)}
                  className="w-full mb-5 sm:mb-6 h-10 sm:h-11 text-sm sm:text-base bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900"
                >
                  {plan.button.text}
                </Button>
              )}

              <ul className="space-y-2 sm:space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}