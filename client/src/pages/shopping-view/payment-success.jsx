import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="p-8 max-w-md w-full text-center flex flex-col items-center shadow-lg rounded-2xl border">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-2xl font-bold">Order Confirmed!</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Thank you for shopping with us. Your order has been placed and is being processed.
          </CardDescription>
        </CardHeader>
        <Button className="mt-6 w-full" onClick={() => navigate("/shop/account")}>
          View Order History
        </Button>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
