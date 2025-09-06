import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin } from "lucide-react";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Tabs */}
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <ShoppingOrders />
            </TabsContent>

            <TabsContent value="address">
              <Address />
            </TabsContent>

            
            <TabsContent value="contact">
              <div className="flex flex-col items-center text-center space-y-6  border rounded-lg ">
                <div>
                  <h2 className="text-xl font-semibold mt-3">Cartzy Help Desk</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    If you have any issues with your account or orders, please
                    reach out to our help line.
                  </p>
                </div>

                <div className="space-y-4 w-full max-w-md">
                  <div className="flex items-center gap-4 justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                    <div className="text-left"> 
                      <p className="text-sm text-muted-foreground">cartzy@example.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                    <div className="text-left"> 
                      <p className="text-sm text-muted-foreground">+91 9207376579</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-center">
                    <MapPin className="w-5 h-5 text-primary mb-3" />
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground mb-3">
                        TechSoft HQ, Bangalore, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>


          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
