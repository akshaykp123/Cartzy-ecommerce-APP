import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg"
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "sonner";
import { clearCart } from "@/store/shop/cart-slice";
import { useNavigate } from "react-router-dom";
import { CreditCard, Banknote } from "lucide-react";



function ShoppingCheckout() {
    const { cartItems } = useSelector((state) => state.shopCart);
    const { user } = useSelector((state) => state.auth);
    const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
    const dispatch = useDispatch();
    const [isPaymentStart, setIsPaymemntStart] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("paypal");
    const navigate = useNavigate();
    const { approvalURL } = useSelector((state) => state.shopOrder);
    
     const totalCartAmount =
        cartItems && cartItems.items && cartItems.items.length > 0
        ? cartItems.items.reduce(
            (sum, currentItem) =>
                sum +
                (currentItem?.salePrice > 0
                ? currentItem?.salePrice
                : currentItem?.price) *
                currentItem?.quantity,
            0
            )
        : 0;
      
      

    function handleInitiatePayment() {
        if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
  toast.warning("Your cart is empty. Please add items to proceed");
  return;
}


        if(currentSelectedAddress === null) {
            toast.warning("Please select one address to proceed")
            return ;
        }

        const isCod = paymentMethod === "cod";

        const orderData = {
            userId: user?.id,
            cartId: cartItems?._id,
            cartItems: cartItems.items.map((singleCartItem) => ({
                productId: singleCartItem?.productId,
                title: singleCartItem?.title,
                image: singleCartItem?.image,
                price:
                singleCartItem?.salePrice > 0
                    ? singleCartItem?.salePrice
                    : singleCartItem?.price,
                quantity: singleCartItem?.quantity,
            })),
            addressInfo: {
                addressId: currentSelectedAddress?._id,
                address: currentSelectedAddress?.address,
                city: currentSelectedAddress?.city,
                pincode: currentSelectedAddress?.pincode,
                phone: currentSelectedAddress?.phone,
                notes: currentSelectedAddress?.notes,
            },
            orderStatus: isCod ? "confirmed" : "pending",
            paymentMethod: paymentMethod,
            paymentStatus: isCod ? "unpaid" : "pending",
            totalAmount: totalCartAmount,
            orderDate: new Date(),
            orderUpdateDate: new Date(),
            paymentId: isCod ? "COD" : "",
            payerId: "",
            };

         dispatch(createNewOrder(orderData)).then((data) => {
            console.log(data, "payment");
            if (data?.payload?.success) {
                if (isCod) {
                    dispatch(clearCart());
                    toast.success("Order placed successfully via Cash on Delivery!");
                    setIsPaymemntStart(false);
                    navigate("/shop/payment-success");
                } else {
                    setIsPaymemntStart(true);
                }
            } else {
                setIsPaymemntStart(false);
            }
            });
            
     }
     if (approvalURL) {
    window.location.href = approvalURL;
  }



    return (
        <div className="flex flex-col">
            <div className="relative h-[300px] w-full overflow-hidden">
                <img src={img} className="h-full w-full object-cover object-center" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
                <Address selectedId={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress} />
                <div className="flex flex-col gap-4">
                {cartItems && cartItems.items && cartItems.items.length > 0
                    ? cartItems.items.map((item) => (
                        <UserCartItemsContent cartItem={item} />
                    ))
                    : null}
                <div className="mt-8 space-y-4">
                    <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">${totalCartAmount}</span>
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    <p className="font-semibold text-sm text-gray-700">Select Payment Method</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod("paypal")}
                            className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                                paymentMethod === "paypal"
                                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            <div className="flex items-center gap-1.5 font-semibold text-sm">
                                <CreditCard className="w-4 h-4 text-blue-600" />
                                <span>PayPal</span>
                            </div>
                            <span className="text-[11px] text-muted-foreground">Pay online</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setPaymentMethod("cod")}
                            className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                                paymentMethod === "cod"
                                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            <div className="flex items-center gap-1.5 font-semibold text-sm">
                                <Banknote className="w-4 h-4 text-emerald-600" />
                                <span>Cash on Delivery</span>
                            </div>
                            <span className="text-[11px] text-muted-foreground">Pay at doorstep</span>
                        </button>
                    </div>
                </div>

                <div className="mt-4 w-full">
                    <Button onClick={handleInitiatePayment} disabled={isPaymentStart} className="w-full">
                       {isPaymentStart
                        ? paymentMethod === "cod"
                            ? "Placing Order..."
                            : "Processing Paypal Payment..."
                        : paymentMethod === "cod"
                        ? "Place Order (Cash on Delivery)"
                        : "Checkout with Paypal"}
                    </Button>
                </div>
                </div>
            </div>
        </div>
    )
}

export default ShoppingCheckout;