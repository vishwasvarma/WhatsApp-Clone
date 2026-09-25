export type User = {
  id: string;
  username: string;
  birthday?: string;
  about?: string;
  online?: boolean;
};

export type Message = {
  id: string;
  sender: string;
  senderId: string;
  receiver: string;
  receiverId: string;
  chat: string;
  text: string;
  time: number;
  scheduled?: boolean;
};

export type Story = {
  id: string;
  sender: string;
  senderId: string;
  image: string;
  createdAt: number;
  viewedBy: string[];
  expired?: boolean;
  viewedByMe?: boolean;
  canView?: boolean;
};

export type Highlight = {
  id: string;
  user: string;
  userId: string;
  story: string;
  storyId: string;
  title: string;
  image: string;
  sender: string;
  createdAt: number;
};

export type ScheduledMessage = {
  id: string;
  sender: string;
  senderId: string;
  receiver: string;
  receiverId: string;
  text: string;
  sendAt: number;
  status: "pending" | "sent" | "cancelled" | "failed";
  createdAt: number;
};

export type NotificationItem = {
  id: string;
  userId: string;
  aboutUserId?: string;
  text: string;
  type: string;
  createdAt: number;
  read?: boolean;
};
