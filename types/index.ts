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
        bookmarks: true;
        likes: true;
        comments: true;
        shares: true;
      };
    };
  };
}> & {
  isLiked: boolean;
  isBookmarked: boolean;
  isShared: boolean;
};

export type NotificationDataType = Prisma.NotificationGetPayload<{
  include: {
    issuer: true;
  };
}>;

export type CommentDataType = Prisma.CommentGetPayload<{
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
        replies: true;
      };
    };
  };
}>;

export type UserDataType = Prisma.UserGetPayload<{
  include: {
    _count: {
      select: {
        followers: true;
        followings: true;
        posts: true;
      };
    };
  };
}> & {
  isFollowing: boolean;
};
