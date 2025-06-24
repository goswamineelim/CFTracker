"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { OTPInput, OTPInputContext } from "input-otp";
import { FaLock } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const InputOTP = React.forwardRef(({ className = "", containerClassName = "", ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={`flex items-center gap-2 has-[:disabled]:opacity-50 ${containerClassName}`}
    className={`disabled:cursor-not-allowed ${className}`}
    {...props}
  />
));



InputOTP.displayName = "InputOTP";

const InputOTPSlot = React.forwardRef(({ index, className = "", ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={`relative flex h-12 w-12 items-center justify-center rounded-md border text-center text-xl font-semibold outline-none transition-all
        ${isActive ? "border-primary shadow" : "border-neutral-300"}
        ${className}
      `}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-caret-blink bg-foreground" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPGroup = ({ children }) => (
  <div className="flex items-center gap-2">{children}</div>
);

const FormSchema = z.object({
  pin: z.string().min(6, { message: "Your one-time password must be 6 characters." }),
});

export default function OTPPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { email, username, password } = state || {};

  // Initialize OTP state
  const [otp, setOtp] = useState("");
  const { getUser, validate, resendOTP } = useAuthStore();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const onSubmit = async (data) => {

    try {
      const validationResult = await validate({
        email,
        username,
        password,
        otp: data.pin
      });
      if (validationResult) {
        navigate("/");
      } else {
        toast.error("Invalid OTP or Credentials!");
      }
    } catch (error) {
      console.error("Validation error", error);
      toast.error("An error occurred during validation. Please try again later.");
    }
  };

  // OTP expiry timer logic
  const [timeLeft, setTimeLeft] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const storedExpiry = localStorage.getItem("otp_expiry");
    let expiry = storedExpiry ? parseInt(storedExpiry, 10) : null;

    if (!expiry || isNaN(expiry) || expiry < Date.now()) {
      expiry = Date.now() + 5 * 60 * 1000; // 5 minutes from now
      localStorage.setItem("otp_expiry", expiry.toString());
    }

    const interval = setInterval(() => {
      const newTimeLeft = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [localStorage.getItem("otp_expiry")]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isResendEnabled = timeLeft <= 240; // enable when <= 4 min left (after 1 min)

  const handleResendOTP = async () => {
    if (!isResendEnabled) return;
    await resendOTP(email)
    const newExpiry = Date.now() + 5 * 60 * 1000;
    localStorage.setItem("otp_expiry", newExpiry.toString());
    toast.success("OTP resent successfully");
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
    }, 5000);
  };
  const [verify, setVerify] = useState("Verify OTP");
  const { isValidating } = useAuthStore();

  useEffect(() => {
    if (isValidating) setVerify("Verifying...");
    else setVerify("Verify OTP");
  }, [isValidating])
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="mb-6 flex items-center gap-2 font-medium text-lg">
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <FaLock size={15} />
        </div>
        Verify OTP
      </div>

      <div className="w-full max-w-xs space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>

                  <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                    <span>Enter the OTP sent to your email.</span>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={!isResendEnabled || isResending}
                      className={`ml-2 underline-offset-2 ${isResendEnabled
                        ? "hover:underline text-primary"
                        : "cursor-not-allowed text-muted-foreground"
                        }`}
                    >
                      Resend OTP
                    </button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {verify}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-muted-foreground mt-2">
          Time remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
      </div>
    </div>
  );
}
