import Feed from "@/components/Feed";
import PostForm from "@/components/form/PostForm";
import Header from "@/components/layout/Header";

const HomePage = () => {
  return (
    <div>
      <Header />
      <PostForm />
      <Feed />
    </div>
  );
};

export default HomePage;
