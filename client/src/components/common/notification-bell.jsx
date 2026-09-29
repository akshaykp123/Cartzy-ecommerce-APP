import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, CheckCheck, Clock } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  fetchNotifications,
  markNotificationsRead,
} from "@/store/common-slice/notification-slice";

function formatTimeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

function NotificationBell() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const { notificationList = [], unreadCount = 0 } = useSelector(
    (state) => state.notifications || {}
  );

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchNotifications({ userId: user.id, role: user.role }));
    }
  }, [dispatch, user?.id, user?.role]);

  const handleMarkAllRead = () => {
    if (user?.id && unreadCount > 0) {
      dispatch(markNotificationsRead({ userId: user.id, role: user.role }));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full h-9 w-9 border-slate-200 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-slate-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-w-[92vw] p-0 shadow-xl rounded-xl border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50 rounded-t-xl">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-800">Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
          {notificationList.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
              <Bell className="w-8 h-8 text-slate-300 stroke-[1.5]" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notificationList.map((item) => (
              <DropdownMenuItem
                key={item._id}
                className={`p-3.5 flex flex-col items-start gap-1 cursor-default focus:bg-slate-50 ${
                  !item.isRead ? "bg-blue-50/50" : ""
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-semibold ${
                      !item.isRead ? "text-slate-900" : "text-slate-700"
                    }`}
                  >
                    {item.title}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(item.createdAt)}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed text-left">
                  {item.message}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationBell;
