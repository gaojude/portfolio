export default function ChatLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="overflow-y-hidden flex bg-gradient-to-br from-gray-50/30 via-white to-indigo-50/20">
      <div className="sidebar-modern w-80 flex-shrink-0 hidden md:block">
        {sidebar}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
