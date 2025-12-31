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
          <p className="text-13 text-secondary">Post</p>
        </div>
      </div>
      <PostCard post={post} />
      <div className="pt-4 border-t border-t-border">
        <CommentForm postId={id} />
      </div>
      <CommentList comments={comments} />
    </div>
  );
};

export default StatusPage;
