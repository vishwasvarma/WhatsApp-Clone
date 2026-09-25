import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "../services/api";
import socket from "../socket/socket";
import {
  getCurrentUser,
  logoutCurrentUser,
  setCurrentUser,
} from "../auth/auth";
import type { NotificationItem, User } from "../types";

type AppContextValue = {
  user: User | null;
  users: User[];
  notifications: NotificationItem[];
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    birthday: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  updateProfile: (body: Partial<User>) => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const refreshUsers = useCallback(async () => {
    const list = await api.users();
    setUsers(list);
  }, []);

  const refreshNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const list = await api.notifications(user.id);
    setNotifications(list);
  }, [user]);

  useEffect(() => {
    if (!user) {
      socket.disconnect();
      setUsers([]);
      setNotifications([]);
      return;
    }
    if (!socket.connected) socket.connect();
    socket.emit("identify", { userId: user.id });
    void refreshUsers();
    void refreshNotifications();
  }, [user, refreshUsers, refreshNotifications]);

  useEffect(() => {
    const onUsers = (list: User[]) => setUsers(list);
    const onBirthday = (item: NotificationItem) => {
      if (!user || item.userId !== user.id) return;
      setNotifications((prev) =>
        prev.some((entry) => entry.id === item.id) ? prev : [item, ...prev],
      );
    };
    socket.on("users-updated", onUsers);
    socket.on("birthday-notification", onBirthday);
    const onConnect = () => {
      if (user) socket.emit("identify", { userId: user.id });
    };
    socket.on("connect", onConnect);
    return () => {
      socket.off("users-updated", onUsers);
      socket.off("birthday-notification", onBirthday);
      socket.off("connect", onConnect);
    };
  }, [user]);

  const login = useCallback(async (username: string, password: string) => {
    const res = await api.login(username, password);
    setCurrentUser(res.user);
    setUser(res.user);
  }, []);

  const register = useCallback(
    async (username: string, password: string, birthday: string) => {
      await api.register(username, password, birthday);
    },
    [],
  );

  const logout = useCallback(async () => {
    if (user) {
      try {
        await api.logout(user.id);
      } catch {
        /* local logout still proceeds */
      }
    }
    socket.disconnect();
    logoutCurrentUser();
    setUser(null);
  }, [user]);

  const markNotificationRead = useCallback(async (id: string) => {
    await api.readNotification(id);
    setNotifications((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, read: true } : entry)),
    );
  }, []);

  const updateProfile = useCallback(
    async (body: Partial<User>) => {
      if (!user) return;
      const next = await api.updateUser(user.id, body);
      setCurrentUser(next);
      setUser(next);
    },
    [user],
  );

  const value = useMemo(
    () => ({
      user,
      users,
      notifications,
      login,
      register,
      logout,
      refreshUsers,
      refreshNotifications,
      markNotificationRead,
      updateProfile,
    }),
    [
      user,
      users,
      notifications,
      login,
      register,
      logout,
      refreshUsers,
      refreshNotifications,
      markNotificationRead,
      updateProfile,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
