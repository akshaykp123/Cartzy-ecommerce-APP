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
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
  setOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth) || {};
  // NOTE: isLoading is for the table; isDetailsLoading is dedicated to the details dialog
  const { orderList = [], orderDetails, isLoading, isDetailsLoading } = useSelector(
    (state) => state.shopOrder || {}
  );

  function handleFetchOrderDetails(orderId) {
    setSelectedOrderId(orderId);
    // NOTE: Instant 0ms popup — immediately show order data already cached in memory
    const existingOrder = orderList?.find((order) => order._id === orderId);
    if (existingOrder) {
      dispatch(setOrderDetails(existingOrder));
    }
    // Also fetch fresh details in background
    dispatch(getOrderDetails(orderId));
    setOpenDetailsDialog(true);
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Table for medium+ screens */}
        <Table className="hidden md:table">
          <TableHeader>
            <TableRow className="w-1/5 text-left ">
              <TableHead >Order ID</TableHead>
              <TableHead >Order Date</TableHead>
              <TableHead >Order Status</TableHead>
              <TableHead >Order Price</TableHead>
              <TableHead >Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // NOTE: Skeleton placeholder rows while orders are loading from the database
              [...Array(4)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-9 w-24 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <TableRow className="w-1/5 text-left" key={orderItem?._id}>
                  <TableCell>{orderItem?._id}</TableCell>
                  <TableCell>{orderItem?.orderDate?.split("T")[0]}</TableCell>
                  <TableCell>
                    <Badge
                      className={`w-24 text-center py-1 px-5 ${
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
                  <TableCell>${orderItem?.totalAmount}</TableCell>
                  <TableCell>
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

        {/* Card view for small screens */}
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
          ) : orderList.length > 0 ? (
            orderList.map((orderItem) => (
              <Card key={orderItem._id} className="p-4">
                <div>
                  <strong>Order ID:</strong> {orderItem._id}
                </div>
                <div>
                  <strong>Date:</strong> {orderItem?.orderDate?.split("T")[0]}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <Badge
                    className={`w-24 text-center ${
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
                <Button onClick={() => handleFetchOrderDetails(orderItem?._id)}>
                  View Details
                </Button>
              </Card>
            ))
          ) : (
            <p className="text-center py-4">No orders found</p>
          )}
        </div>
      </CardContent>

      {/* ✅ One Dialog for all orders */}
      <Dialog
        open={openDetailsDialog}
        onOpenChange={(isOpen) => {
          setOpenDetailsDialog(isOpen);
          if (!isOpen) {
            setSelectedOrderId(null);
            dispatch(resetOrderDetails());
          }
        }}
      >
        {selectedOrderId && (
          <ShoppingOrderDetailsView
            orderDetails={orderDetails}
            selectedOrderId={selectedOrderId}
            isDetailsLoading={isDetailsLoading}
          />
        )}
      </Dialog>
    </Card>
  );
}

export default ShoppingOrders;
