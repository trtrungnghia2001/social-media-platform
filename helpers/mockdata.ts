import { User } from "@/app/generated/prisma/client";
import { PostDataType } from "@/types";

const PHOTO_URL = "https://images.unsplash.com";

export const mockUsers: User[] = [
  {
    id: "user_1",
    clerkId: "clerk_1",
    username: "elonmusk",
    name: "Elon Musk",
    avatarUrl: `${PHOTO_URL}/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop`,
    backgroundUrl: `${PHOTO_URL}/photo-1451187580459-43490279c0fa?w=1500&h=500&fit=crop`,
    bio: "Owner of X, Tesla, SpaceX",
    websiteUrl: "x.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user_2",
    clerkId: "clerk_2",
    username: "tech_insider",
    name: "Tech Insider",
    avatarUrl: `${PHOTO_URL}/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop`,
    backgroundUrl: null,
    bio: "Latest updates from the tech world.",
    websiteUrl: "techinsider.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user_3",
    clerkId: "clerk_3",
    username: "dev_lifestyle",
    name: "Sarah Dev",
    avatarUrl: `${PHOTO_URL}/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop`,
    backgroundUrl: null,
    bio: "Fullstack Developer | Coffee Lover | Next.js Enthusiast",
    websiteUrl: "sarah.dev",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user_4",
    clerkId: "clerk_4",
    username: "nature_travel",
    name: "Global Traveler",
    avatarUrl: `${PHOTO_URL}/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop`,
    backgroundUrl: null,
    bio: "Exploring the world one pixel at a time.",
    websiteUrl: "travel.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user_5",
    clerkId: "clerk_5",
    username: "creative_ai",
    name: "AI Art Lab",
    avatarUrl: `${PHOTO_URL}/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop`,
    backgroundUrl: null,
    bio: "Pushing the boundaries of generative art.",
    websiteUrl: "aiart.io",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const postContents = [
  {
    text: "Just pushed my first Next.js 15 app to production. The performance is insane! 🚀",
    img: "photo-1555066931-4365d14bab8c",
  },
  {
    text: "Why does CSS feel like a puzzle game sometimes? Just trying to center a div... 😅",
    img: null,
  },
  {
    text: "Morning routine: Coffee, Git Pull, and a lot of debugging. Best way to start the day.",
    img: "photo-1495474472287-4d71bcdd2085",
  },
  {
    text: "TypeScript's type safety has saved me from at least 100 runtime errors today. Life saver!",
    img: null,
  },
  {
    text: "AI is not going to replace you, but a person using AI might. Keep learning!",
    img: "photo-1677442136019-21780ecad995",
  },
  {
    text: "Minimalist desk setup for the week. Clean space, clean code. ⌨️✨",
    img: "photo-1496181133206-80ce9b88a853",
  },
  {
    text: "React Server Components are a massive paradigm shift. Still wrapping my head around it.",
    img: null,
  },
  {
    text: "Finally moved my database to Prisma. The DX is miles ahead of anything else I've used.",
    img: "photo-1544383835-bda2bc66a55d",
  },
  {
    text: "Can we all agree that Dark Mode is the only way to code? 🌑",
    img: null,
  },
  {
    text: "Nothing beats the feeling of a 'Green' test suite. Everything is working perfectly!",
    img: "photo-1550751827-4bd374c3f58b",
  },
];

export const mockPosts: PostDataType[] = Array.from({ length: 30 }).map(
  (_, i) => {
    const content = postContents[i % postContents.length];
    const randomUser = mockUsers[i % mockUsers.length];

    return {
      id: `post_${i + 1}`,
      text: content.text,
      mediaUrl: content.img ? `${PHOTO_URL}/${content.img}?w=800&q=80` : null,
      authorId: randomUser.id,
      author: {
        id: randomUser.id,
        name: randomUser.name,
        username: randomUser.username,
        avatarUrl: randomUser.avatarUrl,
      },
      createdAt: new Date(Date.now() - i * 1000 * 60 * 60),
      updatedAt: new Date(Date.now() - i * 1000 * 60 * 60),
      isShared: i % 3 === 0,
      isLiked: i % 4 === 0,
      isBookmarked: i % 5 === 0,
      _count: {
        comments: Math.floor(Math.random() * 25),
        likes: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 10),
        bookmarks: Math.floor(Math.random() * 200),
      },
    };
  }
);
