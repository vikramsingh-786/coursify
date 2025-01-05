import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { toast } from "react-toastify";
import { PaymentVerificationLoader, PaymentSuccessContent } from "../../Spinner";

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const isPaymentVerified = useSelector((state) => state?.razorpay?.isPaymentVerified);
  const user = useSelector((state) => state?.auth?.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    toast.dismiss();
    if (!isPaymentVerified) {
      toast.error("Payment verification failed. Redirecting to checkout.");
      navigate('/checkout');
    } else {
      setLoading(false);
    }
  }, [isPaymentVerified, navigate]);

  const handleGoToCourses = (e) => {
    e.preventDefault();
    navigate('/courses', { 
      replace: true,
      state: { fromCheckout: true }
    });
  };

  if (loading) {
    return <PaymentVerificationLoader />;
  }

  return (
    <Layout>
      <PaymentSuccessContent 
        userName={user?.name}
        onGoToCourses={handleGoToCourses}
      />
    </Layout>
  );
}