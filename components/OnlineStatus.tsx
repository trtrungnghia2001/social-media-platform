const OnlineStatus = ({ status }: { status: boolean }) => {
  if (!status) return null;
  return (
    <div className="absolute bottom-0 right-0 inline-block w-3 aspect-square bg-green-500 rounded-full border-2 border-background"></div>
  );
};

export default OnlineStatus;
