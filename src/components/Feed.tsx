import { memo } from "react";
import { MOCK_POSTS } from "../data";
import PostCard from "./PostCard";

const Feed = () => {
  return (
    <div>
      {MOCK_POSTS.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default memo(Feed);
