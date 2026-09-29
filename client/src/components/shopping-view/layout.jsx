import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import { useEffect } from "react";
import { useSocket } from "@/context/socket-context";
import { useDispatch } from "react-redux";
import { updateCustomerOrderStatus } from "@/store/shop/order-slice";
import { addLiveNotification } from "@/store/common-slice/notification-slice";
import { toast } from "sonner";
import { playNotificationChime } from "@/utils/audio";

function ShoppingLayout() {
  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = (data) => {
      console.log("[Socket.io] Customer received orderStatusUpdated:", data);

      // 1. Play Web Audio chime
      playNotificationChime();

      // 2. Display rich toast notification
      const shortId = data?.orderId ? data.orderId.slice(-6).toUpperCase() : "YOUR";
      const status = data?.orderStatus || "updated";
      toast.info(`📦 Order Status Updated!`, {
        description: `Order #${shortId} is now marked as "${status}".`,
        duration: 6000,
      });

      // 3. Update Redux store live (both table and modal update instantly)
      if (data?.orderId && data?.orderStatus) {
        dispatch(
          updateCustomerOrderStatus({
            orderId: data.orderId,
            orderStatus: data.orderStatus,
          })
        );
      }

      // 4. Increment notification bell with live notification
      if (data?.notification) {
        dispatch(addLiveNotification(data.notification));
      }
    };

    socket.on("orderStatusUpdated", handleStatusUpdate);

    return () => {
      socket.off("orderStatusUpdated", handleStatusUpdate);
    };
  }, [socket, dispatch]);

  return (
    <div className="flex flex-col bg-white overflow-hidden">
      <ShoppingHeader />
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;