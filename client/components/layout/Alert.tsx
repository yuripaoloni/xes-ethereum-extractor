import { Fragment } from "react";
import { useAlert } from "../../contexts/AlertContext";

const Alert = () => {
  const { showAlert, alertMessage, alertVariant } = useAlert();

  return showAlert ? (
    <div className="fixed z-10 right-0 mt-20 left-0 sm:left-auto mx-4 sm:mr-10 drop-shadow-md">
      <div
        className={`rounded-lg py-5 px-3 mb-3 text-base inline-flex items-center w-full ${
          alertVariant === "success"
            ? "bg-green-100 text-green-700"
            : alertVariant === "error"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
        } `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              alertVariant === "success"
                ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                : alertVariant === "error"
                ? "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            }
          />
        </svg>
        <p className="mx-4">{alertMessage}</p>
      </div>
    </div>
  ) : null;
};

export default Alert;
