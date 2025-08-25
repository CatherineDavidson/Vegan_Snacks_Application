import React, { useEffect } from 'react';

const PopUp = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    if (message && type !== "question") { // question type stays until closed manually
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose, type]);

  if (!message) return null;

  const icon =
    type === "success" ? (
      <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) : type === "error" ? (
      <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) : (
      // Question icon (yellow)
      <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M8 10a4 4 0 118 0c0 2-4 3-4 5m0 4h.01" />
      </svg>
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <div
        className={`relative bg-white p-6 rounded-xl shadow-2xl w-[90%] max-w-sm animate-fade-in border-l-8 ${
          type === "success"
            ? "border-green-500"
            : type === "error"
            ? "border-red-500"
            : "border-yellow-500"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-lg font-bold rounded-full px-2 shadow hover:bg-gray-500 hover:text-white transition"
        >
          &times;
        </button>

        {/* Content */}
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">{icon}</div>
          <div className="flex-1 text-left">
            <h3 className="text-gray-700 font-semibold text-base">{message}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
