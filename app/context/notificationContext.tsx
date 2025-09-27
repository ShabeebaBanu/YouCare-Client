// src/context/NotificationContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { getUserId, getAccessToken } from "@/constants/config";
import axios from "axios";

const API = "http://YOUR_SERVER_IP:8080"; // replace with backend base url

type TContext = {
  totalUnread: number;
  setTotalUnread: (n: number) => void;
  resetUnread: () => Promise<void>;
  refreshUnread: () => Promise<void>;
};

const NotificationContext = createContext<TContext>({
  totalUnread: 0,
  setTotalUnread: () => {},
  resetUnread: async () => {},
  refreshUnread: async () => {}
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalUnread, setTotalUnread] = useState<number>(0);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const userId = await getUserId();
      if (!userId) return;

      // optionally pass token for verification
      const token = await getAccessToken().catch(() => null);

      const socket = io(API, {
        transports: ["websocket"],
        auth: { token }, // optional: server can verify token from handshake
        reconnection: true,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        // register user (simple approach)
        socket.emit("register", { userId, token }); // server should verify token or accept userId
      });

      socket.on("newNotification", (payload: any) => {
        // payload example: { type, message, postId, createdAt }
        setTotalUnread((prev) => prev + 1);
      });

      socket.on("disconnect", () => {
        console.log("socket disconnected");
      });

      // fetch initial unread count
      await refreshUnread();
    };

    init();

    return () => {
      mounted = false;
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const refreshUnread = async () => {
    try {
      const userId = await getUserId();
      if (!userId) return;
      const res = await axios.get(`${API}/api/notifications/unread-count/${userId}`);
      setTotalUnread(res.data.count || 0);
    } catch (err) {
      console.warn("refreshUnread error", err);
    }
  };

  // mark all as read (call backend, reset local state)
  const resetUnread = async () => {
    try {
      const userId = await getUserId();
      if (!userId) return;
      await axios.post(`${API}/api/notifications/mark-as-read/${userId}`);
      setTotalUnread(0);
    } catch (err) {
      console.warn("resetUnread error", err);
    }
  };

  return (
    <NotificationContext.Provider value={{ totalUnread, setTotalUnread, resetUnread, refreshUnread }}>
      {children}
    </NotificationContext.Provider>
  );
};
