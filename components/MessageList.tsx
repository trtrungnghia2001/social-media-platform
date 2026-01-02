"use client";
import { useSocketContext } from "@/contexts/SocketContext";
import MessageCard from "./MessageCard";
import { getMessagesInfinite } from "@/lib/actions";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";

const MessageList = () => {
  const { messages: socketMessages, currentUser } = useSocketContext();
  const { ref: topRef, inView } = useInView();
  const containerRef = useRef<HTMLElement>(null);
  const scrollBottomRef = useRef<HTMLLIElement>(null);

  // Ref để lưu chiều cao trước khi update
  const snapshotRef = useRef<{
    scrollHeight: number;
    scrollTop: number;
  } | null>(null);
  const isInitialLoad = useRef(true);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["chat", currentUser?.id],
      queryFn: ({ pageParam }) =>
        getMessagesInfinite({
          partnerId: currentUser?.id as string,
          cursor: pageParam,
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!currentUser?.id,
    });

  // Gộp tin nhắn (giữ nguyên logic của bro nhưng fix reverse)
  const allMessages = useMemo(() => {
    const socketFilter = socketMessages.filter(
      (m) => m.receiverId === currentUser?.id || m.senderId === currentUser?.id
    );
    if (!data) return socketFilter;
    const fetchMess = [...data.pages].reverse().flatMap((p) => p.messages);
    return [...fetchMess, ...socketFilter];
  }, [data, socketMessages, currentUser]);

  // 1. XỬ LÝ LOAD TIN CŨ (SCROLL ANCHORING)
  // Chạy TRƯỚC khi trình duyệt vẽ lại UI
  useLayoutEffect(() => {
    if (isFetchingNextPage && containerRef.current) {
      // Chụp ảnh chiều cao hiện tại trước khi tin nhắn mới (cũ hơn) đổ vào
      snapshotRef.current = {
        scrollHeight: containerRef.current.scrollHeight,
        scrollTop: containerRef.current.scrollTop,
      };
    }
  }, [isFetchingNextPage]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // Nếu là lần đầu tiên vào, cuộn xuống đáy ngay lập tức
    if (
      isInitialLoad.current &&
      allMessages.length > 0 &&
      !isFetchingNextPage
    ) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      isInitialLoad.current = false;
      return;
    }

    // Nếu vừa load xong tin nhắn cũ (isFetchingNextPage chuyển từ true sang false)
    if (snapshotRef.current && !isFetchingNextPage) {
      const { scrollHeight, scrollTop } = snapshotRef.current;
      const newScrollHeight = containerRef.current.scrollHeight;

      // Tính toán độ lệch và bù trừ để thanh scroll đứng yên
      containerRef.current.scrollTop =
        scrollTop + (newScrollHeight - scrollHeight);
      snapshotRef.current = null;
    }
  }, [allMessages.length, isFetchingNextPage]);

  // 2. XỬ LÝ TIN NHẮN MỚI (SOCKET)
  useEffect(() => {
    if (isInitialLoad.current || !containerRef.current) return;

    const container = containerRef.current;
    // Nếu đang ở gần đáy (trong khoảng 200px) thì mới tự cuộn xuống khi có tin mới
    const isAtBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 200;

    if (isAtBottom) {
      scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [socketMessages.length]);

  // 3. TRIGGER FETCH NEXT PAGE
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  return (
    <section
      ref={containerRef}
      className="flex-1 overflow-y-auto scrollbar-beauty p-4 relative"
      style={{ overflowAnchor: "none" }} // Tắt tính năng mặc định của trình duyệt để không xung đột logic
    >
      <ul className="space-y-4">
        <li ref={topRef} className="p-2 flex justify-center">
          {isFetchingNextPage && (
            <Loader2 className="animate-spin text-primary" />
          )}
          {!hasNextPage && allMessages.length > 0 && (
            <span className="text-xs text-muted-foreground">
              Đầu cuộc trò chuyện
            </span>
          )}
        </li>

        {allMessages.map((mess, idx) => (
          <li key={mess.id || idx}>
            <MessageCard message={mess} />
          </li>
        ))}
        <li ref={scrollBottomRef} className="h-0 w-0"></li>
      </ul>
    </section>
  );
};

export default MessageList;
