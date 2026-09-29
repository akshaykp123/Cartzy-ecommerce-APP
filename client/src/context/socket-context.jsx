/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});

  useEffect(() => {
    // Only establish a WebSocket connection if the user is authenticated
    if (isAuthenticated && user?.id) {
      const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const newSocket = io(socketUrl, {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      newSocket.on("connect", () => {
        console.log("[Socket.io] Connected to server with ID:", newSocket.id);

        // Tell server who we are so we join the right rooms (admin-room and/or user_{userId})
        newSocket.emit("join", {
          userId: user.id,
          role: user.role,
        });
      });

      newSocket.on("connect_error", (error) => {
        console.warn("[Socket.io] Connection error:", error.message);
      });

      setSocket(newSocket);

      // Cleanup: Disconnect socket when user logs out or component unmounts
      return () => {
        console.log("[Socket.io] Disconnecting socket...");
        newSocket.disconnect();
        setSocket(null);
      };
    } else {
      setSocket(null);
    }
  }, [isAuthenticated, user?.id, user?.role]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
