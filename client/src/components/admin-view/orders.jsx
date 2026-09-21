import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
  setOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

function AdminOrdersView() {
  const [selectedOrderId, setSelectedOrderId] = useState(null); // track which order is selected
  // NOTE: isLoading is for the table list; isDetailsLoading is dedicated to the details dialog
  const { orderList, orderDetails, isLoading, isDetailsLoading } = useSelector(
    (state) => state.adminOrder
  );
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    setSelectedOrderId(getId);
    // NOTE: Instant 0ms popup — immediately display existing order details already cached in memory
    const existingOrder = orderList?.find((item) => item._id === getId);
    if (existingOrder) {
      dispatch(setOrderDetails(existingOrder));
    }
    // Also fetch latest details in the background to ensure sync without blocking the UI
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Table for medium+ screens */}
        <Table className="hidden md:table">
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="w-1/5 text-left">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // NOTE: Skeleton placeholder rows while admin orders are loading from the database
              [...Array(4)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="w-1/5 text-left"><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell className="w-1/5 text-left"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="w-1/5 text-left"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="w-1/5 text-left"><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="w-1/5 text-left"><Skeleton className="h-9 w-24 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <TableRow key={orderItem._id}>
                  <TableCell className="w-1/5 text-left">
                    {orderItem?._id}
                  </TableCell>
                  <TableCell className="w-1/5 text-left">
                    {orderItem?.orderDate.split("T")[0]}
                  </TableCell>
                  <TableCell className="w-1/5 text-left">
                    <Badge
                      className={`w-20 text-center py-1 px-3.5 ${
                        orderItem?.orderStatus === "confirmed"
                          ? "bg-green-500"
                          : orderItem?.orderStatus === "rejected"
                          ? "bg-red-600"
                          : orderItem?.orderStatus === "delivered"
                          ? "bg-orange-500"
                          : "bg-black"
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-1/5 text-left">
                    ${orderItem?.totalAmount}
                  </TableCell>
                  <TableCell className="w-1/5 text-left">
                    <Button
                      onClick={() => handleFetchOrderDetails(orderItem?._id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="5" className="text-center py-4">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Card layout for mobile screens */}
        <div className="md:hidden space-y-4">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <Card key={i} className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-9 w-full rounded-md" />
              </Card>
            ))
          ) : orderList?.length > 0 ? (
            orderList?.map((orderItem) => (
              <Card key={orderItem._id} className="p-4 shadow-md rounded-xl">
                <div>
                  <strong>Order ID:</strong> {orderItem._id}
                </div>
                <div>
                  <strong>Date:</strong> {orderItem.orderDate.split("T")[0]}
                </div>
                <div className="my-4">
                  <strong>Status:</strong>
                  <Badge
                    className={`ml-2 w-19 text-center ${
                      orderItem?.orderStatus === "confirmed"
                        ? "bg-green-500"
                        : orderItem?.orderStatus === "rejected"
                        ? "bg-red-600"
                        : orderItem?.orderStatus === "delivered"
                        ? "bg-orange-500"
                        : "bg-black"
                    }`}
                  >
                    {orderItem?.orderStatus}
                  </Badge>
                </div>
                <div>
                  <strong>Price:</strong> ${orderItem.totalAmount}
                </div>
                <Button
                  className="mt-2"
                  onClick={() => handleFetchOrderDetails(orderItem?._id)}
                >
                  View Details
                </Button>
              </Card>
            ))
          ) : (
            <p className="text-center py-4">No orders found</p>
          )}
        </div>
      </CardContent>

      {/* Single Dialog: rendered without duplicate DialogContent wrapper so Radix UI opens smoothly with zero conflicts */}
      <Dialog
        open={!!selectedOrderId}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedOrderId(null);
            dispatch(resetOrderDetails());
          }
        }}
      >
        {selectedOrderId && (
          <AdminOrderDetailsView
            orderDetails={orderDetails}
            selectedOrderId={selectedOrderId}
            isDetailsLoading={isDetailsLoading}
          />
        )}
      </Dialog>
    </Card>
  );
}

export default AdminOrdersView;
