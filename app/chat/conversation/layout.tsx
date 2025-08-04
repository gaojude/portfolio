export default function ChatLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="overflow-y-hidden flex">
      {sidebar}
      <div className="flex-1">{children}</div>
    </div>
  );
}
