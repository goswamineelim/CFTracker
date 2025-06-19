import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "../store/useAuthStore"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export function SignupForm({
  className,
  ...props
}) {
  const navigate = useNavigate();
  const {signup, loginGoogle, isSigningUp} = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const handleSubmit = async (e) => {
    signup(formData);
    navigate("/verify-otp", {
      state: formData
    });
  }
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email and password below
        </p>
      </div>
      <div className="grid gap-6">
      <div className="grid gap-3">
          <Label htmlFor="email">Username</Label>
          <Input id="email" type="email" placeholder="m@example.com" required value={formData.username} onChange={(e)=>setFormData({...formData, username: e.target.value })}/>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value })}/>
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" required value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value })}/>
        </div>
        <Button type="submit" className="w-full">
          Create Account
        </Button>
        <div
          className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or
          </span>
        </div>
        <Button variant="outline" className="w-full" onClick={loginGoogle}>
          <img
            src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
            alt="Google logo"
            className="mr-2 h-5 w-5"
          />
          Continue with Google
        </Button>
      </div>
      <div className="text-center text-sm">
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="link link-primary">
          Log In
        </Link>
      </div>
    </form>
  );
}
