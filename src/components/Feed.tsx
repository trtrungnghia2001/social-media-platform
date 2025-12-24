"use client";
import { memo, useMemo } from "react";
import PostCard from "./PostCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostsInfinity } from "@/lib/post";
import { PostType, usePostStore } from "../stores/post.store";
import { useAuthStore } from "../stores/auth.store";

const Feed = ({ username }: { username?: string }) => {
  const { posts } = usePostStore();
  const { auth } = useAuthStore();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", auth?.id],
      queryFn: async () =>
        await getPostsInfinity({
          currentUserId: auth?.id,
          where: username
            ? {
                author: {
                  username: username,
                },
              }
            : {},
        }),
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const postsCustom = useMemo(() => {
    const postData = data?.pages.flatMap((page) => page.posts) || [];

    const postResult = [...posts, ...postData];

    return postResult;
  }, [posts, data]);

  return (
    <div>
      {postsCustom.map((post) => (
        <PostCard key={post.id} post={post as PostType} />
      ))}
    </div>
  );
};

export default memo(Feed);
