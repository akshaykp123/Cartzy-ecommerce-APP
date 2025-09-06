import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
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
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [selectedOrderId, setSelectedOrderId] = useState(null); // track which order is selected
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    setSelectedOrderId(getId);
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
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
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
              : null}
          </TableBody>
        </Table>

        {/* Card layout for mobile screens */}
        <div className="md:hidden space-y-4">
          {orderList?.map((orderItem) => (
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
          ))}
        </div>
      </CardContent>

      {/* Single Dialog rendered outside loop */}
      <Dialog
        open={!!selectedOrderId}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedOrderId(null);
            dispatch(resetOrderDetails());
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order #{selectedOrderId}</DialogTitle>
            <DialogDescription>
              Order details including items and quantities.
            </DialogDescription>
          </DialogHeader>
          <AdminOrderDetailsView orderDetails={orderDetails} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default AdminOrdersView;
