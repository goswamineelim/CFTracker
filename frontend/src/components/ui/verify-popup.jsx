import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useHandleStore } from "@/store/useHandleStore";
import { useAuthStore } from "@/store/useAuthStore";
export default function VerifyHandlePopup({
  open,
  onClose,
  handle,
  problemUrl,
  problemName,
  providedCode,
}) {
  const { timeRemaining, clearVerification, validateHandle } = useHandleStore();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);
  const animationFrameRef = useRef();

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const remaining = timeRemaining();
      if (remaining <= 0) {
        clearVerification();
        onClose(false);
        return;
      }
      const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
      const secs = String(remaining % 60).padStart(2, "0");
      if (timerRef.current) {
        timerRef.current.textContent = `${mins}:${secs}`;
      }
      animationFrameRef.current = requestAnimationFrame(update);
    };
    animationFrameRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [open, timeRemaining, clearVerification, onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(providedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const {getUser} = useAuthStore();

  const handleVerifyNow = async () => {
    const success = await validateHandle();
    if (success)
        {
          onClose(false);
          await getUser();
        } 
  };
  const {isValidating} = useHandleStore();
  const [verify, setVerify] = useState("Verify Now");

  useEffect(() => {
    if(isValidating) setVerify("Verifying...")
    else setVerify("Verify Now");
  }, [isValidating])

  return (
    
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-xs sm:max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto pt-10 p-2 sm:p-4" showCloseButton={true}>
        <DialogHeader>
          <DialogTitle className="text-base sm:text-sm mt-2">Verify your Codeforces Handle</DialogTitle>
          <DialogDescription>
            Submit a compilation error to complete verification.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm leading-relaxed">
          <div className="text-center text-muted-foreground">
            <div className="font-medium text-base">Codeforces Handle:</div>
            <div className="text-primary font-semibold break-words">{handle}</div>
          </div>

          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <span className="text-sm">Time remaining to submit:</span>
            <span ref={timerRef} className="text-lg font-semibold text-foreground">
              --:--
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">1</div>
              Submit a compilation error
            </div>
            <div>
              Go to{" "}
              <a
                href={problemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                {problemName}
              </a>{" "}
              and submit the provided code using your handle{" "}
              <span className="font-semibold">{handle}</span>.
            </div>
            <pre className="relative bg-muted p-2 sm:p-3 rounded-md text-sm sm:text-xs overflow-auto border break-words whitespace-pre-wrap max-w-full">
              <code className="break-words whitespace-pre-wrap max-w-full">{providedCode}</code>
            </pre>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">2</div>
              Verify your submission
            </div>
            <div>
              After submission, go to the <strong>Status</strong> tab and wait until the verdict is{" "}
              <strong>Compilation Error</strong>. Once done, return here and click{" "}
              <span className="underline text-primary">Verify Now</span>.
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row justify-end pt-4 gap-2">
          <Button disabled={isValidating}
                    className={(
                      "w-full sm:w-auto transition-colors",
                      isValidating
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary/90"
                    )} onClick={handleVerifyNow}>{verify}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
