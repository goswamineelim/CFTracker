import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "../store/useAuthStore"
import { useEffect, useState } from "react"

export function VerifyOtp({
  className,
  ...props
}) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { email, username, password } = state || {};
  const [otp, setOtp] = useState("");
  const { authUser,getUser, validate } = useAuthStore();
  
  // change UI according to needs
  const handleSubmit = async (e) => {
  e.preventDefault(); 

  const user = await validate({ email, username, password, otp });

  if (user) {
    // Optionally re-fetch with getUser() or just use user directly
    console.log(user); // Confirm the user is available
    navigate("/");
  } else {
    console.error("OTP validation failed.");
    // Show a toast or UI error
  }
};

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xs">
        <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Enter verification code sent to {email}</h1>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Input id="otp" type="otp" placeholder="123456" required onChange={(e) => setOtp(e.target.value)}/>
          </div>
          <Button type="submit" className="w-full">
            Verify
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
}
