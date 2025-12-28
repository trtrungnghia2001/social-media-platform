import { Prisma } from "@/app/generated/prisma/client";

export type PostDataType = Prisma.PostGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        username: true;
        avatarUrl: true;
      };
    };

    _count: {
      select: {
        comments: true;
        likes: true;
        shares: true;
        bookmarks: true;
      };
    };
  };
}> & {
  isLiked: boolean;
  isBookmarked: boolean;
  isShared: boolean;
};
