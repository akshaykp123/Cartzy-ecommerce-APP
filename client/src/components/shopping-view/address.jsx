import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, editaAddress, fetchAllAddresses } from "@/store/shop/address-slice";
import { toast } from "sonner";
import AddressCard from "./address-card";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  // State to control visibility of the address form: hidden by default until 'Add New Address' or 'Edit' is clicked
  const [showAddressForm, setShowAddressForm] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  function handleManageAddress(event) {
    event.preventDefault();
    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast.warning("You can add maximum 3 addresses");
      return;
    }

    currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            // Hide the form upon successfully updating address
            setShowAddressForm(false);
            toast.success("Address updated successfully");
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setFormData(initialAddressFormData);
            // Hide the form upon successfully adding address
            setShowAddressForm(false);
            toast.success("Address added successfully");
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        if (currentEditedId === getCurrentAddress._id) {
          setCurrentEditedId(null);
          setFormData(initialAddressFormData);
          setShowAddressForm(false);
        }
        toast.success("Address deleted successfully");
      }
    });
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      ...formData,
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      phone: getCurrentAddress?.phone,
      pincode: getCurrentAddress?.pincode,
      notes: getCurrentAddress?.notes,
    });
    // Open the form when user clicks Edit on an existing address card
    setShowAddressForm(true);
  }

  function handleCancelForm() {
    setShowAddressForm(false);
    setCurrentEditedId(null);
    setFormData(initialAddressFormData);
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch, user?.id]);

  return (
    <Card className="shadow-sm">
      {/* Address Header: displays section title, counter, and the 'Add New Address' action button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 border-b">
        <div>
          <CardTitle className="text-xl font-bold">Saved Addresses</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your delivery locations ({addressList?.length || 0}/3)
          </p>
        </div>

        {/* Action Button: Opens the form or cancels when already open */}
        {!showAddressForm ? (
          <Button
            onClick={() => {
              if (addressList.length >= 3) {
                toast.warning("You can add maximum 3 addresses");
                return;
              }
              setCurrentEditedId(null);
              setFormData(initialAddressFormData);
              setShowAddressForm(true);
            }}
            className="flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handleCancelForm}
            className="self-start sm:self-auto cursor-pointer"
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Address Cards List Grid */}
      <div className="p-4 sm:p-6">
        {addressList && addressList.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
            {addressList.map((singleAddressItem) => (
              <AddressCard
                key={singleAddressItem._id}
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                handleEditAddress={handleEditAddress}
                addressInfo={singleAddressItem}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))}
          </div>
        ) : !showAddressForm ? (
          /* Empty state when no addresses exist */
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-muted-foreground mb-4">No saved addresses found.</p>
            <Button
              onClick={() => {
                setCurrentEditedId(null);
                setFormData(initialAddressFormData);
                setShowAddressForm(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Your First Address
            </Button>
          </div>
        ) : null}
      </div>

      {/* Address Form: Only displayed conditionally when showAddressForm is true */}
      {showAddressForm && (
        <div className="border-t p-4 sm:p-6 bg-muted/20">
          <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {currentEditedId !== null ? "Edit Address" : "Add New Address"}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelForm}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <CommonForm
              formControls={addressFormControls}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              onSubmit={handleManageAddress}
              isBtnDisabled={!isFormValid()}
            />
          </CardContent>
        </div>
      )}
    </Card>
  );
}

export default Address;