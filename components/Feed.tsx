"use client";

import { memo, useEffect } from "react";
import PostCard from "./PostCard";
import { getPostInfinite } from "@/lib/actions";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

const Feed = ({
  username,
  following,
  q,
}: {
  username?: string;
  following?: boolean;
  q?: string;
}) => {
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["posts", username || "all", String(following), q],
      queryFn: ({ pageParam }) =>
        getPostInfinite({ cursor: pageParam, username, following, q }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending")
    return <div className="py-4 text-center">Đang tải bài viết...</div>;
  if (status === "error")
    return <div className="py-4 text-center">Lỗi rồi bro ơi!</div>;

  return (
    <ul>
      {data.pages.map((page) =>
        page.posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
      <div ref={ref} className="py-4 text-center">
        {isFetchingNextPage ? (
          <p>Đang tải thêm...</p>
        ) : hasNextPage ? (
          <p>Cuộn để xem thêm</p>
        ) : (
          <p>Hết bài rồi, không còn gì đâu bro!</p>
        )}
      </div>
    </ul>
  );
};

export default memo(Feed);
