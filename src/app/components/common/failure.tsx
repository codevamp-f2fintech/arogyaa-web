import { useRouter } from "next/router";
import React, { useEffect } from "react";

const FailurePage = () => {
  const router = useRouter();

  useEffect(() => {
    const { txnid } = router.query;
    if (txnid) {
      
      console.log("Payment failed for Transaction ID:", txnid);
    }
  }, [router]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1 style={{ color: "red" }}>❌ Payment Failed</h1>
      <p>Unfortunately, your payment could not be processed.</p>
    </div>
  );
};

export default FailurePage;
