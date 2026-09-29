import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useEffect, useState } from "react";
import { useSocket } from "@/context/socket-context";
import { useDispatch } from "react-redux";
import { addNewOrder } from "@/store/admin/order-slice";
import { addLiveNotification } from "@/store/common-slice/notification-slice";
import { toast } from "sonner";
import { playNotificationChime } from "@/utils/audio";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (data) => {
      console.log("[Socket.io] Admin received newOrderPlaced:", data);

      // 1. Play Web Audio chime
      playNotificationChime();

      // 2. Display rich toast notification
      const shortId = data?.order?._id ? data.order._id.slice(-6).toUpperCase() : "NEW";
      const amount = data?.order?.totalAmount ? `$${data.order.totalAmount}` : "";
      toast.success(`🎉 New Order #${shortId} Received!`, {
        description: `Customer order confirmed${amount ? ` for ${amount}` : ""}.`,
        duration: 6000,
      });

      // 3. Prepend into Redux store (table updates live without refreshing)
      if (data?.order) {
        dispatch(addNewOrder(data.order));
      }

      // 4. Increment notification bell with live notification
      if (data?.notification) {
        dispatch(addLiveNotification(data.notification));
      }
    };

    socket.on("newOrderPlaced", handleNewOrder);

    return () => {
      socket.off("newOrderPlaced", handleNewOrder);
    };
  }, [socket, dispatch]);

  return (
    <div className="flex min-h-screen w-full">
      {/* admin sidebar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* admin header */}
        <AdminHeader setOpen={setOpenSidebar} />
        <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;