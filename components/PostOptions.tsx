"use client";
import { PostDataType } from "@/types";
import { Loader, Trash2 } from "lucide-react";
import { memo } from "react";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deletePostId } from "@/lib/actions";
import { useAuthContext } from "@/contexts/AuthContext";

interface PostPage {
  posts: PostDataType[];
  nextCursor: string | null;
}

const PostOptions = ({ post }: { post: PostDataType }) => {
  const queryClient = useQueryClient();
  const { auth } = useAuthContext();
  const isAuthor = auth?.id === post.authorId;

  const mutation = useMutation({
    mutationFn: () => deletePostId(post.id),
    onSuccess: () => {
      queryClient.setQueriesData(
        { queryKey: ["posts"] },
        (oldData: InfiniteData<PostPage>) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.filter((p) => p.id !== post.id),
            })),
          };
        }
      );
      alert("Xóa bài thành công!");
    },
    onError: (error) => {
      alert("Lỗi: " + error.message);
    },
  });

  if (!isAuthor) return null;

  return (
    <button
      onClick={() => {
        if (confirm("Bro chắc chắn muốn xóa bài này chứ?")) {
          mutation.mutate();
        }
      }}
      disabled={mutation.isPending}
      className="p-2 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors disabled:opacity-50"
    >
      {mutation.isPending ? (
        <Loader size={16} className="animate-spin" />
      ) : (
        <Trash2 size={16} />
      )}
    </button>
  );
};

export default memo(PostOptions);
