import { memo } from "react";

const OnlineStatus = ({ status }: { status: boolean }) => {
  if (!status) return;
  return (
    <span className="inline-block absolute bottom-0 right-0 bg-green-500 rounded-full w-2.5 aspect-square border-2 border-background"></span>
  );
};

export default memo(OnlineStatus);
