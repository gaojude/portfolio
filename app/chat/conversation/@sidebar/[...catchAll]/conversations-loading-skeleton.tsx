export default function ConversationsLoadingSkeleton() {
  return (
    <div className="hidden md:block w-64 border-r border-gray-200 bg-white h-[calc(100vh-60px)] overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Conversations
        </h2>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 rounded-md bg-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
