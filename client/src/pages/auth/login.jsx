import CommonForm from "@/components/common/form";
import { toast } from "sonner";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ShoppingBag, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
      } else {
        toast.error(data?.payload?.message);
      }
    });
  }

  return (
    <div className="w-full space-y-6">
      {/* NOTE: Mobile-only Cartzy brand badge so visitors on phones/tablets have an attractive branded header */}
      <div className="flex flex-col items-center text-center lg:hidden mb-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/20 mb-2">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-foreground">Cartzy</h2>
        <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
          Premium E-Commerce
        </p>
      </div>

      {/* NOTE: Elevated modern card container with subtle border, soft shadow, and clean spacing */}
      <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
        
        {/* Card Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-400/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Welcome Back</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-card-foreground">
            Sign In to Cartzy
          </h1>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              className="font-semibold text-amber-600 hover:text-amber-500 dark:text-amber-400 underline-offset-4 hover:underline transition-colors inline-flex items-center gap-1"
              to="/auth/register"
            >
              Register here
              <ArrowRight className="h-3 w-3" />
            </Link>
          </p>
        </div>

        {/* Form controls */}
        <CommonForm
          formControls={loginFormControls}
          buttonText={"Sign In"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />

        {/* Security / Trust Guarantee Footer */}
        <div className="pt-3 border-t border-border/60 text-center">
          <p className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>256-bit SSL Encrypted • Safe &amp; Secure Access</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthLogin;