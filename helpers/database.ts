import "dotenv/config";
import prisma from "../lib/prisma";

const PHOTO_URL = "https://images.unsplash.com";

async function addUsers() {
  console.log("Seeding users...");

  const usersData = [
    {
      clerkId: "user_2pX1",
      username: "alex_dev",
      name: "Alex Johnson",
      avatarUrl: `${PHOTO_URL}/photo-1535713875002-d1d0cf377fde?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1506744038136-46273834b3fb?w=800`,
      bio: "Fullstack Developer | Coffee Lover ☕",
    },
    {
      clerkId: "user_2pX2",
      username: "sarah_art",
      name: "Sarah Miller",
      avatarUrl: `${PHOTO_URL}/photo-1494790108377-be9c29b29330?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1501785888041-af3ef285b470?w=800`,
      bio: "Digital Artist & Dreamer ✨",
    },
    {
      clerkId: "user_2pX3",
      username: "mike_fit",
      name: "Michael Chen",
      avatarUrl: `${PHOTO_URL}/photo-1599566150163-29194dcaad36?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1517836357463-d25dfeac3438?w=800`,
      bio: "Gym Rat | Fitness Coach 💪",
    },
    {
      clerkId: "user_2pX4",
      username: "emily_travels",
      name: "Emily Davis",
      avatarUrl: `${PHOTO_URL}/photo-1438761681033-6461ffad8d80?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1476514525535-07fb3b4ae5f1?w=800`,
      bio: "Exploring the world, one city at a time 🌍",
    },
    {
      clerkId: "user_2pX5",
      username: "ryan_code",
      name: "Ryan Wilson",
      avatarUrl: `${PHOTO_URL}/photo-1500648767791-00dcc994a43e?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1555066931-4365d14bab8c?w=800`,
      bio: "Building cool things with React & Next.js",
    },
    {
      clerkId: "user_2pX6",
      username: "lisa_photo",
      name: "Lisa Wong",
      avatarUrl: `${PHOTO_URL}/photo-1544005313-94ddf0286df2?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1493612276216-ee3925520721?w=800`,
      bio: "Capturing moments 📸",
    },
    {
      clerkId: "user_2pX7",
      username: "david_chef",
      name: "David Smith",
      avatarUrl: `${PHOTO_URL}/photo-1472099645785-5658abf4ff4e?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1556910103-1c02745aae4d?w=800`,
      bio: "Foodie | Home Chef 🍳",
    },
    {
      clerkId: "user_2pX8",
      username: "anna_yoga",
      name: "Anna Brown",
      avatarUrl: `${PHOTO_URL}/photo-1554151228-14d9def656e4?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1544367567-0f2fcb009e0b?w=800`,
      bio: "Inner peace & Yoga 🧘‍♀️",
    },
    {
      clerkId: "user_2pX9",
      username: "james_tech",
      name: "James Taylor",
      avatarUrl: `${PHOTO_URL}/photo-1507003211169-0a1dd7228f2d?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1518770660439-4636190af475?w=800`,
      bio: "Tech Enthusiast | Gadget Reviewer",
    },
    {
      clerkId: "user_2pX10",
      username: "sophia_music",
      name: "Sophia Garcia",
      avatarUrl: `${PHOTO_URL}/photo-1517841905240-472988babdf9?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1511379938547-c1f69419868d?w=800`,
      bio: "Music is life 🎶",
    },
    {
      clerkId: "user_2pX11",
      username: "kevin_skate",
      name: "Kevin Lee",
      avatarUrl: `${PHOTO_URL}/photo-1506794778202-cad84cf45f1d?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1520156584121-21394abb7db5?w=800`,
      bio: "Skate or die 🛹",
    },
    {
      clerkId: "user_2pX12",
      username: "chloe_fashion",
      name: "Chloe Martin",
      avatarUrl: `${PHOTO_URL}/photo-1534528741775-53994a69daeb?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1490481651871-ab68de25d43d?w=800`,
      bio: "Style is a way to say who you are",
    },
    {
      clerkId: "user_2pX13",
      username: "tom_gamer",
      name: "Tom White",
      avatarUrl: `${PHOTO_URL}/photo-1527980965255-d3b416303d12?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1542751371-adc38448a05e?w=800`,
      bio: "Gaming 24/7 🎮",
    },
    {
      clerkId: "user_2pX14",
      username: "maria_reads",
      name: "Maria Lopez",
      avatarUrl: `${PHOTO_URL}/photo-1531123897727-8f129e1688ce?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1512820790803-83ca734da794?w=800`,
      bio: "Bookworm 📚",
    },
    {
      clerkId: "user_2pX15",
      username: "brian_adventure",
      name: "Brian Scott",
      avatarUrl: `${PHOTO_URL}/photo-1463453091185-61582044d556?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1464822759023-fed622ff2c3b?w=800`,
      bio: "Mountain Climber | Nature 🏔️",
    },
    {
      clerkId: "user_2pX16",
      username: "olivia_garden",
      name: "Olivia Green",
      avatarUrl: `${PHOTO_URL}/photo-1567532939604-b6b5b0db2604?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1466692476868-aef1dfb1e735?w=800`,
      bio: "Plant Mom 🌿",
    },
    {
      clerkId: "user_2pX17",
      username: "leo_design",
      name: "Leo Clark",
      avatarUrl: `${PHOTO_URL}/photo-1504257432389-52343af06ae3?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1558655146-d09347e92766?w=800`,
      bio: "UI/UX Designer",
    },
    {
      clerkId: "user_2pX18",
      username: "nina_dance",
      name: "Nina Hill",
      avatarUrl: `${PHOTO_URL}/photo-1524504388940-b1c1722653e1?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1508700115892-45ecd05ae2ad?w=800`,
      bio: "Keep dancing 💃",
    },
    {
      clerkId: "user_2pX19",
      username: "sam_surf",
      name: "Sam Wright",
      avatarUrl: `${PHOTO_URL}/photo-1501196354995-cbb51c65aaea?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1502680390469-be75c86b636f?w=800`,
      bio: "Catching waves 🏄‍♂️",
    },
    {
      clerkId: "user_2pX20",
      username: "zara_vogue",
      name: "Zara Khan",
      avatarUrl: `${PHOTO_URL}/photo-1488426862026-3ee34a7d66df?w=400`,
      backgroundUrl: `${PHOTO_URL}/photo-1441986300917-64674bd600d8?w=800`,
      bio: "Fashion & Lifestyle Blogger",
    },
  ];

  for (const user of usersData) {
    await prisma.user.upsert({
      where: { clerkId: user.clerkId },
      update: {},
      create: user,
    });
  }
  console.log("Seeding finished!");
}
async function addPosts() {
  console.log("🚀 Đang nạp 100 bài Post với nội dung text phong phú...");

  await prisma.post.deleteMany();

  const allUsers = await prisma.user.findMany({ select: { id: true } });
  if (allUsers.length === 0) return;

  const sentences = [
    "Hôm nay vừa hoàn thành xong tính năng chat realtime, cảm giác thật tuyệt vời! 💻",
    "Có ai cảm thấy Next.js 15 chạy nhanh hơn hẳn không mọi người?",
    "Học lập trình không khó, quan trọng là phải kiên trì mỗi ngày. Đừng bỏ cuộc nhé anh em!",
    "Sáng nay làm ly cà phê sữa đá rồi ngồi debug, thấy cuộc đời vẫn đẹp sao. ☕️",
    "Mọi người thường dùng thư viện nào để quản lý state trong React? Redux, Zustand hay Context API?",
    "Vừa đọc được một bài viết rất hay về kiến trúc Microservices, kiến thức đúng là vô tận.",
    "Cuối tuần này có ai đi cafe offline hội lập trình viên ở Hà Nội không?",
    "Cái lỗi 'undefined' này nó ám mình cả buổi sáng rồi, cứu tui với! 😭",
    "Đang tìm hiểu về Prisma 7, thấy cái Driver Adapter cho Postgres xịn thực sự.",
    "Bí kíp để code nhanh là gì? Đó là đừng code khi đang buồn ngủ. Chúc anh em ngủ ngon!",
    "Thế giới này rộng lớn quá, còn bao nhiêu framework mình chưa kịp học.",
    "Ai rồi cũng phải học SQL thôi, không chạy đi đâu được đâu.",
    "Mới đổi sang dùng phím cơ, gõ code cảm giác như đang đánh đàn ấy. 🎹",
    "Dự án này mà xong chắc mình phải đi du lịch một chuyến cho khuây khỏa.",
    "Yêu một lập trình viên là bạn sẽ không bao giờ lo họ ngoại tình, vì họ bận debug hết thời gian rồi. 😂",
    "Hôm nay mình vừa commit một đống code rác, hy vọng reviewer sẽ không thấy...",
    "Deep learning, AI, Machine Learning... nghe thì sang chảnh nhưng thực chất là toán học cả thôi.",
    "Vừa setup xong bộ rule cho Cursor AI, gõ code sướng như bay!",
  ];

  const postsData = [];

  for (let i = 1; i <= 100; i++) {
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];

    // Tạo nội dung text ngẫu nhiên (ghép từ 1 đến 3 câu trong mảng trên)
    const numSentences = Math.floor(Math.random() * 3) + 1;
    let textContent = "";
    for (let j = 0; j < numSentences; j++) {
      textContent +=
        sentences[Math.floor(Math.random() * sentences.length)] + " ";
    }

    // Tỉ lệ có ảnh thấp (khoảng 25-30%)
    const hasImage = Math.random() > 0.75;
    const randomImageId = Math.floor(Math.random() * 5000) + i;
    const mediaUrl = hasImage
      ? `https://picsum.photos/seed/${randomImageId}/1000/600`
      : null;

    postsData.push({
      text: textContent.trim(),
      mediaUrl: mediaUrl,
      authorId: randomUser.id,
      createdAt: new Date(Date.now() - i * 1800000), // Mỗi post cách nhau 30p để timeline dày đặc hơn
    });
  }

  await prisma.post.createMany({
    data: postsData,
  });

  console.log("✅ Thành công: 100 posts với text đa dạng đã sẵn sàng!");
}
async function addInteractions() {
  console.log("🚀 Đang tạo Like và Bookmark ngẫu nhiên...");

  const allUsers = await prisma.user.findMany({ select: { id: true } });
  const allPosts = await prisma.post.findMany({ select: { id: true } });

  if (allUsers.length === 0 || allPosts.length === 0) return;

  const likesData: { authorId: string; postId: string }[] = [];
  const bookmarksData: { authorId: string; postId: string }[] = [];

  // Dùng Set để đảm bảo không tạo trùng cặp (User - Post) trong cùng một mảng
  const likeSet = new Set<string>();
  const bookmarkSet = new Set<string>();

  for (const user of allUsers) {
    // Mỗi user sẽ Like ngẫu nhiên từ 5 đến 15 bài
    const numLikes = Math.floor(Math.random() * 11) + 5;
    for (let i = 0; i < numLikes; i++) {
      const randomPost = allPosts[Math.floor(Math.random() * allPosts.length)];
      const key = `${user.id}-${randomPost.id}`;

      if (!likeSet.has(key)) {
        likesData.push({ authorId: user.id, postId: randomPost.id });
        likeSet.add(key);
      }
    }

    // Mỗi user sẽ Bookmark ngẫu nhiên từ 2 đến 5 bài
    const numBookmarks = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < numBookmarks; i++) {
      const randomPost = allPosts[Math.floor(Math.random() * allPosts.length)];
      const key = `${user.id}-${randomPost.id}`;

      if (!bookmarkSet.has(key)) {
        bookmarksData.push({ authorId: user.id, postId: randomPost.id });
        bookmarkSet.add(key);
      }
    }
  }

  // Nạp vào DB
  await Promise.all([
    prisma.like.createMany({ data: likesData, skipDuplicates: true }),
    prisma.bookmark.createMany({ data: bookmarksData, skipDuplicates: true }),
  ]);

  console.log(
    `✅ Đã nạp xong: ${likesData.length} Likes và ${bookmarksData.length} Bookmarks!`
  );
}
async function addComments() {
  console.log("🚀 Đang tạo Comment cho các bài viết...");

  const allUsers = await prisma.user.findMany({ select: { id: true } });
  const allPosts = await prisma.post.findMany({ select: { id: true } });

  if (allUsers.length === 0 || allPosts.length === 0) return;

  const commentsData: { text: string; authorId: string; postId: string }[] = [];

  const commentTemplates = [
    "Bài viết hay quá bro ơi! 🚀",
    "Đúng thứ mình đang tìm, cảm ơn tác giả nhé.",
    "Cái này dùng Prisma 7 có bị lỗi gì không bạn?",
    "Next.js 15 chạy mượt thật sự, không đùa được.",
    "Mình cũng gặp lỗi này, fix mãi không được...",
    "Giải thích dễ hiểu quá, hóng bài tiếp theo của bạn!",
    "Làm sao để tối ưu cái này hơn nữa nhỉ? 🤔",
    "Code chất lượng quá, xin phép clone về học hỏi nha.",
    "Cho mình hỏi là cái này có scale được không?",
    "Đỉnh của chóp! #codinglife",
    "Vừa nãy mình cũng mới làm thử, chạy ngon lành cành đào.",
    "Có tutorial chi tiết không bạn ơi? 😍",
  ];

  for (const post of allPosts) {
    // Mỗi bài post có tỉ lệ 70% là có comment, mỗi bài từ 1-5 cái
    if (Math.random() > 0.3) {
      const numComments = Math.floor(Math.random() * 5) + 1;

      for (let i = 0; i < numComments; i++) {
        const randomUser =
          allUsers[Math.floor(Math.random() * allUsers.length)];
        commentsData.push({
          text: commentTemplates[
            Math.floor(Math.random() * commentTemplates.length)
          ],
          authorId: randomUser.id,
          postId: post.id,
        });
      }
    }
  }

  await prisma.comment.createMany({
    data: commentsData,
  });

  console.log(`✅ Đã nạp xong ${commentsData.length} Comments!`);
}
async function main() {
  // await addUsers();
  // await addPosts();
  // await addInteractions();
  await addComments();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
