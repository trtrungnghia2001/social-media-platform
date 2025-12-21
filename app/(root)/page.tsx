import Feed from "@/src/components/Feed";
import PostForm from "@/src/components/form/PostForm";
import Header from "@/src/components/layouts/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <PostForm />
      <Feed />
    </div>
  );
}
