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
import { useAuthStore } from "../stores/auth.store";

export interface SidebarItem {
  label: string;
  href: string;
  icon: any;
  show?: boolean;
}

const authRouteProtected = useAuthStore.getState().auth ? true : false;

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "Homepage",
    href: "/",
    icon: Home,
    show: true,
  },
  {
    label: "Explore",
    href: "/explore",
    icon: Search,
    show: true,
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
    show: authRouteProtected,
  },
  {
    label: "Messages",
    href: "/messages",
    icon: Mail,
    show: authRouteProtected,
  },
  {
    label: "Bookmarks",
    href: "/bookmarks",
    icon: Bookmark,
    show: authRouteProtected,
  },
  {
    label: "Jobs",
    href: "/jobs",
    icon: Briefcase,
    show: true,
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
    show: true,
  },
  {
    label: "Profile",
    href: "/" + useAuthStore.getState().auth?.username,
    icon: User,
    show: authRouteProtected,
  },
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
