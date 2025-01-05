import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { BiRupee } from "react-icons/bi";
import {
  getRazorPayId,
  purchaseCourseBundle,
  verifyUserPayment,
} from "../../redux/slices/razorpay.slice";
import { toast } from "react-toastify";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  const { key: razorpayKey, subscription_id } = useSelector(
    (state) => state.razorpay
  );
  const userData = useSelector((state) => state.auth?.user);

  const handleSubscription = async (e) => {
    e.preventDefault();

    if (!razorpayKey || !subscription_id) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    const loadingToastId = toast.loading("Processing payment...");
    setLoading(true);

    const options = {
      key: razorpayKey,
      subscription_id,
      name: "Coursify Pvt Ltd",
      description: "Subscription Bundle",
      theme: { color: "#fff" },
      prefill: {
        email: userData?.email,
        name: userData?.fullName,
      },
      handler: async (response) => {
        try {
          const paymentDetails = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            razorpay_subscription_id: response.razorpay_subscription_id,
          };

          const res = await dispatch(verifyUserPayment(paymentDetails));

          toast.dismiss(loadingToastId);

          if (res?.payload?.success) {
            toast.success("Payment successful!");
            navigate("/checkout/success");
          } else {
            navigate("/checkout/fail");
          }
        } catch (error) {
          toast.dismiss(loadingToastId);
          toast.error("Payment verification failed");
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: function () {
          toast.dismiss(loadingToastId);
          setLoading(false);
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await dispatch(getRazorPayId());

      if (!userData) {
        toast.error("User data is unavailable. Please log in.");
        navigate("/login");
        return;
      }

      if (!userData.subscription) {
        toast.error("No subscription data available.");
        return;
      }

      switch (userData.subscription.status) {
        case "active":
          toast.info("You already have an active subscription!");
          navigate("/courses");
          break;
        case "inactive":
          await dispatch(purchaseCourseBundle());
          break;
        case "created":
          await dispatch(purchaseCourseBundle());
          break;
        default:
          toast.error(
            "Unexpected subscription status: " + userData.subscription.status
          );
          break;
      }
    };

    fetchInitialData();
  }, [dispatch, navigate, userData]);

  // Enable the button after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonEnabled(true);
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);

  return (
    <Layout>
      <section className="min-h-[90vh] md:pt-12 pt-2 px-4 lg:px-20 flex flex-col items-center text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-900">
        <form
          onSubmit={handleSubscription}
          className="flex flex-col gap-4 rounded-lg md:py-10 py-7 md:px-8 md:pt-3 px-3 md:w-[500px] w-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300"
        >
          <div>
            <h1 className="bg-yellow-500 w-full text-center py-4 text-2xl font-bold rounded-tl-lg rounded-tr-lg text-white">
              Subscription Bundle
            </h1>
            <div className="px-4 space-y-7 text-center text-gray-600 dark:text-gray-300">
              <p className="text-lg mt-5">
                Unlock access to all available courses on our platform for{" "}
                <span className="text-yellow-500 font-bold">1 Month</span>. This
                includes both existing and new courses.
              </p>

              <p className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-500">
                <BiRupee />
                <span>150</span>
              </p>

              <div className="text-xs">
                <p className="text-blue-600 dark:text-yellow-500">
                  100% refund on cancellation
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  * Terms and conditions apply *
                </p>
              </div>

              <button
                type="submit"
                className={`bg-orange-500 dark:bg-orange-600 text-white text-xl rounded-md font-bold px-5 py-3 w-full transition-all ease-in-out duration-300 hover:bg-orange-600 dark:hover:bg-orange-700 ${
                  loading || !buttonEnabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading || !buttonEnabled}
              >
                {loading ? "Processing..." : "Buy now"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </Layout>
  );
}
