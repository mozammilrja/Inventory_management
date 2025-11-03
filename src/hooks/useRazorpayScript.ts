import { useEffect, useState } from "react";

export const useRazorpayScript = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (document.querySelector("#razorpay-script")) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return isLoaded;
};