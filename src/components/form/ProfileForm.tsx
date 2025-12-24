"use client";
import { updateAuth } from "@/lib/auth";
import { IMAGES_DEFAULT } from "@/src/constants/img";
import { queryClient } from "@/src/contexts/Provider";
import { AuthType, useAuthStore } from "@/src/stores/auth.store";
import { uploadToCloudinary } from "@/src/utils/upload";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { Camera, Loader, X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ChangeEvent, memo, useEffect, useState } from "react";
import toast from "react-hot-toast";

type ProfileFormType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ProfileForm = ({ open, setOpen }: ProfileFormType) => {
  const params = useParams();
  const username = params.username as string;
  const { user } = useUser();
  const { auth, setAuth } = useAuthStore();

  const [formValue, setFormValue] = useState({
    name: auth?.name || "",
    username: auth?.username || "",
    avatarUrl: auth?.avatarUrl || "",
    backgroundUrl: auth?.backgroundUrl || "",
    bio: auth?.bio || "",
    websiteUrl: auth?.websiteUrl || "",
  });

  //   file
  const [files, setFiles] = useState<{
    avatar: File | null;
    background: File | null;
  }>({
    avatar: null,
    background: null,
  });

  const [previews, setPreviews] = useState({
    avatar: auth?.avatarUrl || "",
    background: auth?.backgroundUrl || "",
  });

  useEffect(() => {
    const avatarUrl = files.avatar
      ? URL.createObjectURL(files.avatar)
      : auth?.avatarUrl || "";
    const backgroundUrl = files.background
      ? URL.createObjectURL(files.background)
      : auth?.backgroundUrl || "";

    setPreviews({
      avatar: avatarUrl,
      background: backgroundUrl,
    });

    return () => {
      if (files.avatar) URL.revokeObjectURL(avatarUrl);
      if (files.background) URL.revokeObjectURL(backgroundUrl);
    };
  }, [files, auth?.avatarUrl, auth?.backgroundUrl]);

  //   api
  const { mutate, isPending } = useMutation({
    mutationFn: async (clerkId: string) => {
      let avatarUrl = auth?.avatarUrl;
      let backgroundUrl = auth?.backgroundUrl;
      if (files.avatar) {
        avatarUrl = await uploadToCloudinary(files.avatar);
      }
      if (files.background) {
        backgroundUrl = await uploadToCloudinary(files.background);
      }

      return updateAuth(clerkId, { ...formValue, avatarUrl, backgroundUrl });
    },
    onSuccess: (data) => {
      toast.success("Updated profile successfully!");
      setAuth({ ...auth, ...(data as AuthType) });
      setOpen(false);
      queryClient.setQueryData(["user", username], (oldData: AuthType) => {
        if (!oldData) return oldData;

        return { ...oldData, user: data };
      });
    },
    onError: (error) => toast.error(error.message),
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const onSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formValue.name || !formValue.username || !user) return;
    mutate(user?.id);
  };

  const handleFormClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 -z-10"
        onClick={handleFormClose}
      ></div>
      <div className="relative max-w-xl w-full overflow-hidden overflow-y-auto scrollbar-beauty h-full bg-secondary-bg rounded-lg p-4">
        <button
          type="button"
          className="absolute top-4 right-4"
          onClick={handleFormClose}
        >
          <X />
        </button>
        <h4 className="font-semibold text-lg">Edit profile</h4>
        <form onSubmit={onSubmit} className="mt-8 relative flex flex-col gap-4">
          {/* file */}
          {/* background */}
          <label
            className="relative cursor-pointer group w-full h-40 block rounded-xl overflow-hidden bg-main-bg border border-gray-700"
            title="Click to change background"
          >
            <input
              type="file"
              accept="image/*"
              hidden
              id="background-upload"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFiles((prev) => ({ ...prev, background: file }));
                }
              }}
            />

            <div className="relative w-full h-full">
              <Image
                src={previews.background || IMAGES_DEFAULT.BACKGROUND}
                alt="background preview"
                fill
                className="object-cover group-hover:brightness-75 transition-all"
              />

              {/* Overlay icon máy ảnh */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <div className="flex flex-col items-center gap-1 text-white">
                  <Camera size={28} />
                  <span className="text-xs font-medium">Thay đổi ảnh bìa</span>
                </div>
              </div>
            </div>
          </label>

          {/* avatar */}
          <label
            className="relative cursor-pointer group w-32 h-32 block mx-auto"
            title="Click to change avatar"
          >
            <input
              type="file"
              accept="image/*"
              hidden
              id="avatar-upload"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFiles((prev) => ({ ...prev, avatar: file }));
                }
              }}
            />

            <div className="relative w-full h-full">
              <Image
                src={previews.avatar || IMAGES_DEFAULT.AVATAR}
                alt="avatar preview"
                fill
                className="rounded-full object-cover border-4 border-secondary-bg group-hover:brightness-75 transition-all"
              />

              <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
              </div>
            </div>
          </label>

          {/* text */}
          <input
            type="text"
            name="name"
            value={formValue.name}
            onChange={handleInputChange}
            className="input"
            placeholder="Name"
            required
          />
          <input
            type="text"
            name="username"
            value={formValue.username}
            onChange={handleInputChange}
            className="input"
            placeholder="Username"
            required
          />
          <input
            type="text"
            name="websiteUrl"
            value={formValue.websiteUrl}
            onChange={handleInputChange}
            className="input"
            placeholder="Website url"
          />
          <textarea
            name="bio"
            value={formValue.bio}
            onChange={handleInputChange}
            className="input"
            placeholder="Bio"
            rows={5}
          />
          <button className="btn rounded-lg" disabled={isPending}>
            Edit
            {isPending && <Loader className="animate-spin" size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default memo(ProfileForm);
