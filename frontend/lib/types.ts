export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
};

export type Conversation = {
  _id: string;
  title: string;
  isArchived: boolean;
  isPinned: boolean;
};

export type Message = {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};
