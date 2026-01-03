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

type VideoCallContextType = {
  handleCall: () => Promise<void>;
  handleAcceptCall: () => Promise<void>;
  leaveCall: () => void;
  isCalling: boolean;
  incomingCall: { from: string; offer: RTCSessionDescriptionInit } | null;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  setIncomingCall: (
    val: { from: string; offer: RTCSessionDescriptionInit } | null
  ) => void;
};

const VideoCallContext = createContext<VideoCallContextType | null>(null);

export const VideoCallProvider = ({ children }: { children: ReactNode }) => {
  const { auth } = useAuthContext();
  const { currentUser } = useSocketContext();

  const [isCalling, setIsCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{
    from: string;
    offer: RTCSessionDescriptionInit;
  } | null>(null);

  const pc = useRef<RTCPeerConnection | null>(null);
  const candidateQueue = useRef<RTCIceCandidateInit[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentRemoteId = useRef<string | null>(null);

  // Ref để quản lý nhạc chuông
  const ringtoneAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 1. Khởi tạo nhạc chuông (Client-side)
    if (typeof window !== "undefined") {
      ringtoneAudioRef.current = new Audio("/sounds/ringtone.mp3");
      ringtoneAudioRef.current.loop = true;
    }

    // 2. Khởi tạo PeerConnection
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

    // 3. Lắng nghe tín hiệu Socket
    socket.on("receive-offer", ({ from, offer }) => {
      currentRemoteId.current = from;
      setIncomingCall({ from, offer });

      startRingtone();
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
      stopRingtone();
      socket.off("receive-offer");
      socket.off("receive-answer");
      socket.off("receive-ice");
      socket.off("call-ended");
      pc.current?.close();
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio();
      audio.src = "/sounds/ringtone.mp3"; // Gán src riêng thay vì bỏ vào constructor
      audio.loop = true;
      audio.preload = "auto"; // Ép trình duyệt tải trước dữ liệu

      // Kiểm tra xem trình duyệt có đọc được file này không
      audio.oncanplaythrough = () => console.log("Âm thanh đã sẵn sàng!");
      audio.onerror = () =>
        console.error(
          "Lỗi tải file âm thanh. Kiểm tra lại đường dẫn/định dạng."
        );

      ringtoneAudioRef.current = audio;
    }
  }, []);

  const startRingtone = async () => {
    if (ringtoneAudioRef.current) {
      try {
        // Ép trình duyệt load lại file để tránh lỗi "no supported sources" do cache
        ringtoneAudioRef.current.load();
        await ringtoneAudioRef.current.play();
        console.log("Nhạc chuông đang phát...");
      } catch (err) {
        console.warn(
          "Chưa phát được nhạc chuông. Lý do: Người dùng chưa tương tác với trang.",
          err
        );
      }
    }
  };

  const stopRingtone = () => {
    if (ringtoneAudioRef.current) {
      ringtoneAudioRef.current.pause();
      ringtoneAudioRef.current.currentTime = 0;
    }
  };

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
    socket.emit("send-offer", { to: currentUser.id, from: auth.id, offer });
  };

  const handleAcceptCall = async () => {
    if (!incomingCall || !pc.current) return;
    stopRingtone();
    setIsCalling(true);
    currentRemoteId.current = incomingCall.from;

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
      socket.emit("send-answer", { to: incomingCall.from, answer });
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
    stopRingtone();
    setIsCalling(false);
    setIncomingCall(null);

    // Tắt các track của camera/mic
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    // Reload để làm sạch hoàn toàn trạng thái PeerConnection
    window.location.reload();
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
            className="w-[320px] h-[240px] bg-gray-900 object-cover"
          />
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-[100px] h-[75px] absolute top-2 right-2 rounded border-2 border-white shadow-md object-cover bg-gray-800"
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
