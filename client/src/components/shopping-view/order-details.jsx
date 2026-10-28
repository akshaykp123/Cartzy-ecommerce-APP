import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { Clock, CheckCircle2, Truck, PackageCheck, AlertCircle } from "lucide-react";

const ORDER_STEPS = [
  { id: "pending", label: "Placed", icon: Clock },
  { id: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { id: "inShipping", label: "Shipping", icon: Truck },
  { id: "delivered", label: "Delivered", icon: PackageCheck },
];

function getActiveStepIndex(status) {
  const s = status?.toLowerCase();
  if (s === "delivered") return 3;
  if (s === "inshipping") return 2;
  if (s === "confirmed" || s === "inprocess") return 1;
  return 0;
}

function ShoppingOrderDetailsView({ orderDetails, selectedOrderId, isDetailsLoading }) {
  const { user } = useSelector((state) => state.auth);

  const isRejected = orderDetails?.orderStatus?.toLowerCase() === "rejected";
  const currentStepIndex = getActiveStepIndex(orderDetails?.orderStatus);

  return (
    <DialogContent className="sm:max-w-[620px] max-h-[85vh] overflow-y-auto">
      {/* Dialog Header: accessible title and description for modal */}
      <DialogHeader>
        <DialogTitle>Order #{orderDetails?._id || selectedOrderId}</DialogTitle>
        <DialogDescription>
          Live order tracking, purchased items, and delivery status.
        </DialogDescription>
      </DialogHeader>

      {/* Show skeleton if order details are loading and not yet in memory */}
      {!orderDetails && isDetailsLoading ? (
        <div className="space-y-4 py-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Animated Real-Time Status Stepper */}
          {isRejected ? (
            <div className="flex items-center gap-3 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Order Cancelled / Rejected</p>
                <p className="text-xs text-red-600">
                  This order was not approved or was cancelled. Contact support for help.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Live Order Progress
              </p>
              <div className="flex items-center justify-between relative">
                {ORDER_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = currentStepIndex >= index;
                  const isCurrent = currentStepIndex === index;

                  return (
                    <div key={step.id} className="flex-1 flex flex-col items-center relative z-10">
                      {/* Connecting Line between steps */}
                      {index > 0 && (
                        <div
                          className={`absolute top-4 -left-1/2 w-full h-1 -z-10 transition-colors duration-500 ${
                            currentStepIndex >= index ? "bg-green-500" : "bg-slate-200"
                          }`}
                        />
                      )}

                      {/* Step Circle Icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted
                            ? "bg-green-500 text-white shadow-md shadow-green-200 scale-105"
                            : isCurrent
                            ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110"
                            : "bg-white border-2 border-slate-300 text-slate-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Step Label */}
                      <span
                        className={`text-xs mt-2 font-medium transition-colors ${
                          isCompleted
                            ? "text-green-700 font-semibold"
                            : isCurrent
                            ? "text-primary font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order ID</p>
              <Label>{orderDetails?._id}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Date</p>
              <Label>
                {orderDetails?.orderDate ? orderDetails.orderDate.split("T")[0] : "N/A"}
              </Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Price</p>
              <Label>${orderDetails?.totalAmount}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Payment method</p>
              <Label>{orderDetails?.paymentMethod === "cod" ? "Cash on Delivery (COD)" : orderDetails?.paymentMethod}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Payment Status</p>
              <Label className="capitalize">{orderDetails?.paymentMethod === "cod" && orderDetails?.paymentStatus === "unpaid" ? "Unpaid (Pay on Delivery)" : orderDetails?.paymentStatus}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Status</p>
              <Label>
                <Badge
                  className={`py-1 px-3 ${
                    orderDetails?.orderStatus === "confirmed"
                      ? "bg-green-500"
                      : orderDetails?.orderStatus === "rejected"
                      ? "bg-red-600"
                      : orderDetails?.orderStatus === "delivered"
                      ? "bg-orange-500"
                      : "bg-black"
                  }`}
                >
                  {orderDetails?.orderStatus}
                </Badge>
              </Label>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="font-medium">Order Details</div>
              <ul className="grid gap-3">
                {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                  ? orderDetails?.cartItems.map((item, index) => (
                      <li key={item.productId || index} className="grid grid-cols-3 gap-4">
                        <span className="text-left">Title: {item.title}</span>
                        <span className="text-center">Quantity: {item.quantity}</span>
                        <span className="text-right">Price: ${item.price}</span>
                      </li>
                    ))
                  : null}
              </ul>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="font-medium">Shipping Info</div>
              <div className="grid gap-0.5 text-muted-foreground">
                <span>{user?.userName || "Customer"}</span>
                <span>{orderDetails?.addressInfo?.address}</span>
                <span>{orderDetails?.addressInfo?.city}</span>
                <span>{orderDetails?.addressInfo?.pincode}</span>
                <span>{orderDetails?.addressInfo?.phone}</span>
                <span>{orderDetails?.addressInfo?.notes}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;