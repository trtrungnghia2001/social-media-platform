"use client";

import { useVideoCallContext } from "@/contexts/VideoCallContext";
import { IMAGE_DEFAULT } from "@/helpers/constants";
import Image from "next/image";

export const CallModal = () => {
  const { incomingCall, handleAcceptCall, setIncomingCall } =
    useVideoCallContext();

  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 text-center animate-bounce-short">
        <div className="flex flex-col justify-center items-center gap-1">
          <Image
            alt="avatar"
            src={incomingCall.from.avatarUrl || IMAGE_DEFAULT.AVATAR}
            width={80}
            height={80}
            unoptimized
            className="aspect-square rounded-full overflow-hidden img"
          />
          <h3 className="text-xl font-bold text-gray-800">Cuộc gọi đến</h3>
          <p className="text-gray-500 text-13">ID: {incomingCall.from.id}</p>
          <p className="font-semibold">{incomingCall.from.name}</p>
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
