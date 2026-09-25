import type {
  Highlight,
  Message,
  NotificationItem,
  ScheduledMessage,
  Story,
  User,
} from "../types";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const isForm = options?.body instanceof FormData;
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: isForm
      ? options?.headers
      : {
          "Content-Type": "application/json",
          ...(options?.headers || {}),
        },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "Request failed");
  }
  return data as T;
}

export const api = {
  register: (username: string, password: string, birthday: string) =>
    request<{ success: boolean; user: User }>("/register", {
      method: "POST",
      body: JSON.stringify({ username, password, birthday }),
    }),
  login: (username: string, password: string) =>
    request<{ success: boolean; user: User }>("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  logout: (userId: string) =>
    request("/logout", {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),
  users: () => request<User[]>("/users"),
  updateUser: (id: string, body: Partial<User>) =>
    request<User>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  messages: (userId: string) =>
    request<Message[]>(`/messages?userId=${encodeURIComponent(userId)}`),
  sendMessage: (senderId: string, receiverId: string, text: string) =>
    request<Message>("/message", {
      method: "POST",
      body: JSON.stringify({ senderId, receiverId, text }),
    }),
  deleteMessage: (id: string) =>
    request(`/message/${id}`, { method: "DELETE" }),
  stories: (userId: string) =>
    request<Story[]>(`/stories?userId=${encodeURIComponent(userId)}`),
  uploadStory: (senderId: string, file: File) => {
    const body = new FormData();
    body.append("senderId", senderId);
    body.append("image", file);
    return request<Story>("/story", { method: "POST", body });
  },
  viewStory: (id: string, userId: string) =>
    request<Story>(`/story/${id}/view`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),
  highlights: (userId: string) =>
    request<Highlight[]>(`/highlights?userId=${encodeURIComponent(userId)}`),
  addHighlight: (userId: string, storyId: string, title: string) =>
    request<Highlight>("/highlight", {
      method: "POST",
      body: JSON.stringify({ userId, storyId, title }),
    }),
  schedules: (userId: string) =>
    request<ScheduledMessage[]>(
      `/schedule?userId=${encodeURIComponent(userId)}`,
    ),
  scheduleMessage: (
    senderId: string,
    receiverId: string,
    text: string,
    sendAt: string,
  ) =>
    request<ScheduledMessage>("/schedule", {
      method: "POST",
      body: JSON.stringify({ senderId, receiverId, text, sendAt }),
    }),
  cancelSchedule: (id: string) =>
    request(`/schedule/${id}`, { method: "DELETE" }),
  notifications: (userId: string) =>
    request<NotificationItem[]>(
      `/notifications?userId=${encodeURIComponent(userId)}`,
    ),
  readNotification: (id: string) =>
    request(`/notifications/${id}/read`, { method: "PATCH" }),
};
