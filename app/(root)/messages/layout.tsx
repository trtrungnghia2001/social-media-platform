import MessageSidebarLeft from "@/components/layout/MessageSidebarLeft";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="h-screen flex items-stretch">
      <MessageSidebarLeft />
      <section className="h-full flex-1">{children}</section>
    </div>
  );
};

export default Layout;
