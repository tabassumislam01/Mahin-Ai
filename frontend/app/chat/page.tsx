import Sidebar from '@/components/Sidebar';
import ChatPanel from '@/components/ChatPanel';

export default function ChatPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-4 p-4 md:grid-cols-[260px_1fr]">
      <Sidebar />
      <ChatPanel />
    </main>
  );
}
