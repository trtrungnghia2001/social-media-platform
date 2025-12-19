import Feed from "@/src/components/Feed";
import FeedHeader from "@/src/components/FeedHeader";
import PostForm from "@/src/components/form/PostForm";

export default function Home() {
  return (
    <div>
      <FeedHeader />
      <PostForm />
      <Feed />
    </div>
  );
}
