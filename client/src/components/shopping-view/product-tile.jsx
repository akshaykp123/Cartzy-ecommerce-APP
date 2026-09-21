import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { brandOptionsMap, categoryOptionsMap } from "@/config";



function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart
}) {
  // Product Card: Stretches full-height (h-full) with flex-col to keep all row elements and buttons aligned
  return (
    <Card className="w-full max-w-sm mx-auto flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-shadow">
      <div 
        onClick={() => handleGetProductDetails(product?._id)}
        className="cursor-pointer flex-1 flex flex-col"
      >
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {
            product?.totalStock === 0 ? <Badge className="absolute top-2 left-2 bg-red-500">
                Out Of Stock
            </Badge> :  product?.totalStock <10 ? <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-500">
                {`Only ${product?.totalStock} items left`}
            </Badge> :

            product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-400">
                Sale
            </Badge> 
            ) : null
          }
        </div>
        {/* Content area: flex-1 ensures the card body fills space while keeping prices and footer aligned */}
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Title fixed to 2 lines (h-14 with line-clamp-2) so cards with 1-line or 2-line titles remain identical in height */}
            <h2 className="text-lg font-bold mb-2 line-clamp-2 h-14 leading-7" title={product?.title}>
              {product?.title}
            </h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[16px] text-muted-foreground">
                {categoryOptionsMap[product?.category]}
              </span>
              <span className="text-[16px] text-muted-foreground">
                {brandOptionsMap[product?.brand]}
              </span>
            </div>
          </div>
          {/* Price pinned at the bottom of the content area */}
          <div className="flex justify-between items-center mb-2 mt-auto">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through text-muted-foreground" : "text-primary"
              } text-lg font-semibold`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      {/* Pinned CardFooter (mt-auto) ensures Add to Cart buttons are horizontally aligned on the exact same line across all cards */}
      <CardFooter className="p-4 pt-0 mt-auto">
            {
              product?.totalStock === 0 ? <Button 
            className="w-full opacity-60 cursor-not-allowed"
            >
              Out Of Stock
              </Button>
            : <Button onClick={()=>handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full">Add to cart</Button>
            } 
      </CardFooter>
    </Card>
  )
}
export default ShoppingProductTile;