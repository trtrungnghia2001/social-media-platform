"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSocketContext } from "./SocketContext";
import { socket, useAuthContext } from "./AuthContext";
import { CallModal } from "@/components/CallModal";
import { UserDataType } from "@/types";
import { playRingtone } from "@/helpers/utils";

type VideoCallContextType = {
  handleCall: () => Promise<void>;
  handleAcceptCall: () => Promise<void>;
  leaveCall: () => void;
  isCalling: boolean;
  incomingCall: { from: UserDataType; offer: RTCSessionDescriptionInit } | null;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  setIncomingCall: (
    val: { from: UserDataType; offer: RTCSessionDescriptionInit } | null
  ) => void;
};

const VideoCallContext = createContext<VideoCallContextType | null>(null);

export const VideoCallProvider = ({ children }: { children: ReactNode }) => {
  const { auth } = useAuthContext();
  const { currentUser } = useSocketContext();

  // state
  const [isCalling, setIsCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{
    from: UserDataType;
    offer: RTCSessionDescriptionInit;
  } | null>(null);

  const pc = useRef<RTCPeerConnection | null>(null);
  const candidateQueue = useRef<RTCIceCandidateInit[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentRemoteId = useRef<string | null>(null);
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (incomingCall && !isCalling) {
      // Chỉ tạo mới nếu chưa có nhạc đang phát
      if (!ringtoneRef.current) {
        ringtoneRef.current = playRingtone();
      }
    } else {
      // Tắt nhạc khi đã nghe máy hoặc không còn cuộc gọi đến
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current.currentTime = 0;
        ringtoneRef.current = null;
      }
    }

    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current = null;
      }
    };
  }, [incomingCall, isCalling]);

  // ring
  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
      ringtoneRef.current = null;
    }
  };

  useEffect(() => {
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.current.onicecandidate = (event) => {
      if (event.candidate && currentRemoteId.current) {
        socket.emit("send-ice", {
          to: currentRemoteId.current,
          candidate: event.candidate,
        });
      }
    };

    socket.on("receive-offer", ({ from, offer }) => {
      currentRemoteId.current = from;
      setIncomingCall({ from, offer });
    });

    socket.on("receive-answer", async ({ answer }) => {
      if (pc.current) {
        await pc.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    socket.on("receive-ice", async ({ candidate }) => {
      if (candidate && pc.current) {
        if (pc.current.remoteDescription) {
          await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          candidateQueue.current.push(candidate);
        }
      }
    });

    socket.on("call-ended", () => {
      stopStreamsAndReset();
    });

    return () => {
      socket.off("receive-offer");
      socket.off("receive-answer");
      socket.off("receive-ice");
      socket.off("call-ended");
      pc.current?.close();
    };
  }, []);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true,
      });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      stream
        .getTracks()
        .forEach((track) => pc.current?.addTrack(track, stream));
      return stream;
    } catch (err) {
      console.error("Lỗi truy cập camera/mic:", err);
    }
  };

  const handleCall = async () => {
    if (!auth || !currentUser) return;
    currentRemoteId.current = currentUser.id;
    setIsCalling(true);
    await startLocalStream();
    const offer = await pc.current?.createOffer();
    await pc.current?.setLocalDescription(offer);
    socket.emit("send-offer", { to: currentUser, from: auth, offer });
  };

  const handleAcceptCall = async () => {
    if (!incomingCall || !pc.current) return;
    stopRingtone();
    setIsCalling(true);
    currentRemoteId.current = incomingCall.from.id;

    setTimeout(async () => {
      await startLocalStream();
      await pc.current!.setRemoteDescription(
        new RTCSessionDescription(incomingCall.offer)
      );

      candidateQueue.current.forEach(async (candidate) => {
        await pc.current?.addIceCandidate(new RTCIceCandidate(candidate));
      });
      candidateQueue.current = [];

      const answer = await pc.current!.createAnswer();
      await pc.current!.setLocalDescription(answer);
      socket.emit("send-answer", { to: incomingCall.from.id, answer });
      setIncomingCall(null);
    }, 50);
  };

  const leaveCall = () => {
    if (currentRemoteId.current) {
      socket.emit("end-call", { to: currentRemoteId.current });
    }
    stopStreamsAndReset();
  };

  const stopStreamsAndReset = () => {
    setIsCalling(false);
    setIncomingCall(null);

    // Tắt các track của camera/mic
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  return (
    <VideoCallContext.Provider
      value={{
        handleCall,
        handleAcceptCall,
        leaveCall,
        isCalling,
        incomingCall,
        localVideoRef,
        remoteVideoRef,
        setIncomingCall,
      }}
    >
      {children}
      <CallModal />

      {/* Giao diện Video Call */}
      <div
        className={`fixed bottom-4 right-4 flex flex-col gap-2 z-40 bg-black p-3 rounded-xl shadow-2xl transition-all duration-300 ${
          isCalling
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative overflow-hidden rounded-lg">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-80 aspect-video bg-gray-900 object-cover"
          />
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-28 aspect-video absolute top-2 right-2 rounded border-2 border-white shadow-md object-cover bg-gray-800"
          />
        </div>

        <button
          onClick={leaveCall}
          className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold transition-colors"
        >
          Kết thúc
        </button>
      </div>
    </VideoCallContext.Provider>
  );
};

export const useVideoCallContext = () => {
  const ctx = useContext(VideoCallContext);
  if (!ctx) throw Error(`useVideoCallContext not working!`);
  return ctx;
};
