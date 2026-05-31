'use client';

import { FormEvent, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import api from '@/lib/api';
import { Conversation, Message } from '@/lib/types';

export default function ChatPanel() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    api.get('/api/chat/conversations').then((res) => setConversations(res.data.conversations));
  }, []);

  useEffect(() => {
    if (!selected) return;
    api.get(`/api/chat/conversations/${selected}/messages`).then((res) => setMessages(res.data.messages));
  }, [selected]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', { auth: { token } });
    socket.on('chat:response', (payload) => {
      setMessages((prev) => [...prev, payload.userMessage, payload.assistantMessage]);
      setSelected(payload.conversation._id);
      setConversations((prev) => {
        if (prev.find((c) => c._id === payload.conversation._id)) return prev;
        return [payload.conversation, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setText('');
    const res = await api.post('/api/chat/message', { content, conversationId: selected || undefined });
    setSelected(res.data.conversation._id);
    setMessages((prev) => [...prev, res.data.userMessage, res.data.assistantMessage]);
    setConversations((prev) => {
      if (prev.find((c) => c._id === res.data.conversation._id)) return prev;
      return [res.data.conversation, ...prev];
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-[280px_1fr]">
      <div className="rounded-xl bg-white p-4 shadow dark:bg-slate-900">
        <h2 className="mb-3 font-semibold">Conversations</h2>
        <div className="space-y-2">
          {conversations.map((c) => (
            <button
              key={c._id}
              className={`w-full rounded px-3 py-2 text-left text-sm ${selected === c._id ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
              onClick={() => setSelected(c._id)}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-white p-4 shadow dark:bg-slate-900">
        <div className="mb-4 h-96 space-y-3 overflow-y-auto rounded border p-3">
          {messages.map((m) => (
            <div key={m._id} className={m.role === 'assistant' ? 'text-brand-700 dark:text-brand-50' : ''}>
              <span className="text-xs uppercase text-slate-500">{m.role}</span>
              <p>{m.content}</p>
            </div>
          ))}
        </div>
        <form onSubmit={onSubmit} className="flex gap-2">
          <input className="flex-1 rounded border p-2" value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask Mahin AI..." />
          <button className="rounded bg-brand-500 px-4 py-2 text-white">Send</button>
        </form>
      </div>
    </div>
  );
}
