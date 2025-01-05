import { AiFillCheckCircle } from "react-icons/ai";

export const LoadingSpinner = ({ className = "h-5 w-5" }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4" 
      fill="none" 
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
    />
  </svg>
);

// Loading button component for form submissions
export const LoadingButton = ({ 
  isLoading, 
  children, 
  className = "", 
  disabled = false,
  type = "button",
  onClick
}) => (
  <button
    type={type}
    disabled={isLoading || disabled}
    onClick={onClick}
    className={`flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {isLoading ? (
      <>
        <LoadingSpinner />
        <span className="ml-2">Loading...</span>
      </>
    ) : children}
  </button>
);

export const LoadingOverlay = ({ 
  isTransparent = true,
  message = "" 
}) => (
  <div className={`absolute inset-0 ${isTransparent ? 'bg-white/50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'} flex flex-col items-center justify-center z-10`}>
    <LoadingSpinner className="h-12 w-12" />
    {message && (
      <p className="mt-4 text-gray-600 dark:text-gray-300">{message}</p>
    )}
  </div>
);

export const PaymentVerificationLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
      <div className="flex flex-col items-center space-y-6">
        <LoadingSpinner className="h-16 w-16 text-green-500" />
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Verifying Payment
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we confirm your payment...
          </p>
        </div>
      </div>
    </div>
  </div>
);
export const FormLoadingOverlay = ({ message = "Please wait..." }) => (
  <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
    <LoadingSpinner className="h-12 w-12 text-blue-500" />
    <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">{message}</p>
  </div>
);

// Payment success content component
export const PaymentSuccessContent = ({ userName, onGoToCourses }) => (
  <div className="flex flex-col gap-6 items-center py-14 px-3 min-h-[100vh]">
    <div className="flex flex-col dark:bg-gray-800 bg-white gap-12 rounded-lg md:py-10 py-7 md:px-8 md:pt-3 px-3 md:w-[500px] w-full shadow-custom dark:shadow-xl transition duration-300">
      <h1 className="bg-green-500 text-center w-full py-4 text-3xl font-inter font-bold rounded-tl-lg rounded-tr-lg text-white">
        Payment Successful
      </h1>

      <div className="px-4 flex flex-col items-center justify-center space-y-4 text-center text-gray-600 dark:text-gray-300">
        <AiFillCheckCircle className="text-green-500 text-8xl" />
        <h2 className="text-xl font-semibold font-lato">Welcome to the Pro Bundle</h2>
        <p className="font-nunito-sans">Now you can enjoy all the courses.</p>
        {userName && (
          <p className="font-nunito-sans mt-2">Hello, {userName}!</p>
        )}
      </div>

      <button
        onClick={onGoToCourses}
        className="bg-green-500 hover:bg-green-600 transition-all ease-in-out duration-300 w-full py-3 text-xl font-semibold text-white text-center rounded-bl-lg rounded-br-lg"
      >
        Go to Courses
      </button>
    </div>
  </div>
);