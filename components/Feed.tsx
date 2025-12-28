import { mockPosts } from "@/helpers/mockdata";
import { memo } from "react";
import PostCard from "./PostCard";

const Feed = () => {
  return (
    <ul>
      {mockPosts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
};

export default memo(Feed);
