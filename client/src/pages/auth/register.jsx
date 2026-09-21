import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShoppingBag, Sparkles, ShieldCheck, ArrowLeft } from "lucide-react";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        navigate("/auth/login");
      } else {
        toast.error(data?.payload?.message);
      }
    });
  }

  return (
    <div className="w-full space-y-6">
      {/* NOTE: Mobile-only Cartzy brand badge */}
      <div className="flex flex-col items-center text-center lg:hidden mb-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/20 mb-2">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-foreground">Cartzy</h2>
        <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
          Premium E-Commerce
        </p>
      </div>

      {/* NOTE: Matching elevated modern card for registration */}
      <div className="rounded-3xl border border-border/80 bg-card p-7 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-5">
        
        {/* Card Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-400/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Join Cartzy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-card-foreground">
            Create Your Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              className="font-semibold text-amber-600 hover:text-amber-500 dark:text-amber-400 underline-offset-4 hover:underline transition-colors inline-flex items-center gap-1"
              to="/auth/login"
            >
              <ArrowLeft className="h-3 w-3" />
              Sign In
            </Link>
          </p>
        </div>

        {/* Common Form for registration */}
        <CommonForm
          formControls={registerFormControls}
          buttonText={"Sign Up"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />

        {/* Security / Trust Footer */}
        <div className="pt-3 border-t border-border/60 text-center">
          <p className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>100% Free Registration • Instant Access</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthRegister;