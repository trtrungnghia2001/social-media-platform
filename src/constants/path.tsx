import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  Briefcase,
  Users,
  Star,
  User,
  // MoreHorizontal,
} from "lucide-react";

export interface SidebarItem {
  label: string;
  href: string;
  icon: any;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "Homepage",
    href: "/",
    icon: Home,
  },
  {
    label: "Explore",
    href: "/explore",
    icon: Search,
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    label: "Messages",
    href: "/messages",
    icon: Mail,
  },
  {
    label: "Bookmarks",
    href: "/bookmarks",
    icon: Bookmark,
  },
  {
    label: "Jobs",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    label: "Communities",
    href: "/communities",
    icon: Users,
  },
  {
    label: "Premium",
    href: "/premium",
    icon: Star,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
  // {
  //   label: "More",
  //   href: "/more",
  //   icon: MoreHorizontal,
  // },
];

export const FEED_PATHS = [
  {
    label: "For You",
    path: "/",
  },
  {
    label: "Following",
    path: "/following",
  },
];
