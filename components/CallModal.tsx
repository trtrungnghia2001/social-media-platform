"use client";

import { useVideoCallContext } from "@/contexts/VideoCallContext";

export const CallModal = () => {
  const { incomingCall, handleAcceptCall, setIncomingCall } =
    useVideoCallContext();

  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 text-center animate-bounce-short">
        <div className="mb-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-3xl text-blue-600 font-bold">
              {incomingCall.from.charAt(0).toUpperCase()}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Cuộc gọi đến</h3>
          <p className="text-gray-500">ID: {incomingCall.from}</p>
        </div>

        <div className="flex justify-around gap-4 mt-6">
          <button
            onClick={() => setIncomingCall(null)}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium transition-all"
          >
            Từ chối
          </button>
          <button
            onClick={handleAcceptCall}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium animate-pulse"
          >
            Chấp nhận
          </button>
        </div>
      </div>
    </div>
  );
};
