import ButtonHistoryBack from "@/components/ButtonHistoryBack";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/form/CommentForm";
import PostCard from "@/components/PostCard";
import { getCommentsByPostId, getPostById } from "@/lib/actions";
import { notFound } from "next/navigation";

const StatusPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const post = await getPostById(id);
  const comments = await getCommentsByPostId(id);

  if (!post) return notFound();

  return (
    <div>
      {/* top nav */}
      <div className="z-10 sticky top-0 p-4 flex items-center gap-4 backdrop-blur-xl">
        <ButtonHistoryBack />
        <div className="space-y-1">
          <h3>Post</h3>
        </div>
      </div>
      <PostCard post={post} />
      <CommentForm postId={id} />
      <CommentList comments={comments} />
    </div>
  );
};

export default StatusPage;
