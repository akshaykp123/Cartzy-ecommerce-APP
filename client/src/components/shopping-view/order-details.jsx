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

function ShoppingOrderDetailsView({ orderDetails, selectedOrderId, isDetailsLoading }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
      {/* Dialog Header: accessible title and description for modal */}
      <DialogHeader>
        <DialogTitle>Order #{orderDetails?._id || selectedOrderId}</DialogTitle>
        <DialogDescription>
          Order summary, purchased items, and delivery address.
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
              <Label>{orderDetails?.paymentMethod}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Payment Status</p>
              <Label>{orderDetails?.paymentStatus}</Label>
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