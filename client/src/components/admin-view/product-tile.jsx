import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete
}) {
  // Product Card: Stretches full-height (h-full) with flex-col to keep all cards and action buttons aligned
  return (
    <Card className="w-full max-w-sm mx-auto flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-1 flex flex-col">
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
        {/* Content area: flex-1 ensures consistent card body height with prices and actions aligned */}
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          {/* Title fixed to 2 lines (h-14 with line-clamp-2) so cards with varying title lengths stay identical in height */}
          <h2 className="text-lg font-bold mb-2 line-clamp-2 h-14 leading-7" title={product?.title}>
            {product?.title}
          </h2>
          {/* Price aligned to the bottom of the card content */}
          <div className="flex justify-between items-center mb-2 mt-auto">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through text-muted-foreground" : "text-primary"
              } text-lg font-semibold`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold text-primary">${product?.salePrice}</span>
            ) : null}
          </div>
        </CardContent>
      </div>
      {/* Pinned CardFooter (mt-auto) ensures Edit and Delete buttons are aligned on the exact same line */}
      <CardFooter className="flex justify-between items-center p-4 pt-0 mt-auto">
        <Button
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product);
          }}
        >
          Edit
        </Button>
        <Button onClick={()=>handleDelete(product?._id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;