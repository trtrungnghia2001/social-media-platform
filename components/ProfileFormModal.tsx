"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Modal from "./layout/Modal";
import { updateAuth } from "@/lib/actions";
import toast from "react-hot-toast";
import Image from "next/image";
import { IMAGE_DEFAULT } from "@/helpers/constants";
import { Loader } from "lucide-react";
import { User } from "@/app/generated/prisma/client";
import { uploadToCloudinary } from "@/helpers/utils";

type ProfileFormModalType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: User;
};

const ProfileFormModal = ({ open, setOpen, user }: ProfileFormModalType) => {
  // form
  const [state, formAction, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      const username = formData.get("username") as string;
      const name = formData.get("name") as string;
      const websiteUrl = formData.get("websiteUrl") as string;
      const bio = formData.get("bio") as string;
      const avatarFile = formData.get("avatarFile") as File;
      const backgroundFile = formData.get("backgroundFile") as File;

      try {
        let avatarUrl = user.avatarUrl;
        let backgroundUrl = user.backgroundUrl;

        if (avatarFile && avatarFile.size > 0) {
          avatarUrl = await uploadToCloudinary(avatarFile);
        }
        if (backgroundFile && backgroundFile.size > 0) {
          backgroundUrl = await uploadToCloudinary(backgroundFile);
        }

        await updateAuth({
          username,
          name,
          websiteUrl,
          bio,
          avatarUrl,
          backgroundUrl,
        });
        toast.success(`Edit profile successfully!`);
        setOpen(false);
      } catch (error) {
        toast.error(`Edit profile failed!`);
        console.error(error);
      }
    },
    null
  );

  // file & preview
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const backgroundFileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<{
    avatarFile: File | null;
    backgroundFile: File | null;
  }>({ avatarFile: null, backgroundFile: null });

  const previewFiles = useMemo(() => {
    let avatarUrl = user.avatarUrl || "";
    let backgroundUrl = user.backgroundUrl || "";

    if (files.avatarFile) {
      avatarUrl = URL.createObjectURL(files.avatarFile);
    }
    if (files.backgroundFile) {
      backgroundUrl = URL.createObjectURL(files.backgroundFile);
    }

    return {
      avatarUrl,
      backgroundUrl,
    };
  }, [files, user]);

  useEffect(() => {
    return () => {
      if (files.avatarFile) URL.revokeObjectURL(previewFiles.avatarUrl);
      if (files.backgroundFile) URL.revokeObjectURL(previewFiles.backgroundUrl);
    };
  }, [previewFiles, files]);

  return (
    <Modal title="Edit Profile" open={open} setOpen={setOpen}>
      <form action={formAction} className="flex flex-col gap-4">
        <input
          type="file"
          name="backgroundFile"
          hidden
          ref={backgroundFileRef}
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
              setFiles((prev) => ({ ...prev, backgroundFile: selectedFile }));
            }
          }}
        />
        <input
          type="file"
          name="avatarFile"
          hidden
          ref={avatarFileRef}
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
              setFiles((prev) => ({ ...prev, avatarFile: selectedFile }));
            }
          }}
        />
        <div className="relative mb-12">
          <div
            onClick={() => {
              backgroundFileRef.current?.click();
            }}
          >
            <Image
              alt="backgroundUrl"
              src={previewFiles.backgroundUrl || IMAGE_DEFAULT.BACKGROUND}
              unoptimized
              width={1280}
              height={360}
              className="overflow-hidden cursor-pointer img"
            />
          </div>
          <div
            className="absolute bottom-0 translate-y-1/2 left-4 p-1 rounded-full bg-background"
            onClick={() => {
              avatarFileRef.current?.click();
            }}
          >
            <Image
              alt="avatar"
              src={previewFiles.avatarUrl || IMAGE_DEFAULT.AVATAR}
              unoptimized
              width={96}
              height={96}
              className="rounded-full aspect-square overflow-hidden cursor-pointer img"
            />
          </div>
        </div>

        <input
          name="name"
          type="text"
          className="input"
          placeholder="Name"
          defaultValue={user.name || ""}
        />
        <input
          name="username"
          type="text"
          className="input"
          placeholder="Username"
          defaultValue={user.username}
        />
        <input
          name="websiteUrl"
          type="text"
          className="input"
          placeholder="Website url"
          defaultValue={user.websiteUrl || ""}
        />
        <textarea
          name="bio"
          id="bio"
          rows={3}
          className="input"
          placeholder="Bio"
          defaultValue={user.bio || ""}
        ></textarea>
        <button disabled={isPending} className="btn rounded-lg">
          {isPending && <Loader size={16} className="animate-spin" />}
          Update profile
        </button>
      </form>
    </Modal>
  );
};

export default ProfileFormModal;
