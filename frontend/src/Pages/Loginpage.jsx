import { GalleryVerticalEnd } from "lucide-react"
import { FaCode } from "react-icons/fa";
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="mb-6 flex items-center gap-2 font-medium">
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <FaCode />
        </div>
        CF Tracker
      </div>
      <div className="w-full max-w-xs">
        <LoginForm />
      </div>
    </div>
  )
}
