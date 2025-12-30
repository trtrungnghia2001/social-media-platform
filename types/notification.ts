import { Prisma } from "@/app/generated/prisma/client";

export type NotificationDataType = Prisma.NotificationGetPayload<{
  include: {
    issuer: true;
  };
}>;
