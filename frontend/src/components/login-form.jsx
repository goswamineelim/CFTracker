import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "../store/useAuthStore"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export function LoginForm({
  className,
  ...props
}) {
  const {loginGoogle, login, isLoggingIn} = useAuthStore();
  const navigate = useNavigate();
  async function handleLogin(formData) {
    const data ={
      email: formData.get("email"),
      password: formData.get("password")
    }
    login(data);
    navigate("/");
  }
  const handleLoginWithGoogle = (e) => {
    e.preventDefault();
    loginGoogle();
  }
  const [text, setText] = useState("Login");
  useEffect (() => {
    if(isLoggingIn) setText("Logging in...")
    else setText("Login");
  }, [isLoggingIn])
  return (
    <form className={cn("flex flex-col gap-6", className)} action={handleLogin} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email and password
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name ="email" type="email" placeholder="m@example.com" required/>
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input id="password" name="password" type="password" placeholder="******" required />
        </div>
        <Button disabled={isLoggingIn}
          className={cn(
            "w-full transition-colors",
            isLoggingIn
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90"
          )} type="submit">
          {text}
        </Button>
        <div
          className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or
          </span>
        </div>
        <Button variant="outline" className="w-full" onClick={handleLoginWithGoogle}>
          <img
            src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
            alt="Google logo"
            className="mr-2 h-5 w-5"
          />
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm ">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="link link-primary underline-offset-4 hover:underline">
          Sign up
        </Link>
      </div>
    </form>
  );
}
