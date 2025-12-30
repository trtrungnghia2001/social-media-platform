import { memo } from "react";
import PostCard from "./PostCard";
import { getPosts } from "@/lib/actions";

const Feed = async ({ username }: { username?: string }) => {
  const posts = await getPosts(username);

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
};

export default memo(Feed);
