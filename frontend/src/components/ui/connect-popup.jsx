import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useHandleStore } from "../../store/useHandleStore"
export default function ConnectHandlePopup({ open, onClose}) {
  const [handle, setHandle] = useState("");
  const {linkHandle} = useHandleStore();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (handle.trim() !== "") {
      // onConfirm(handle.trim());
      linkHandle(handle.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Codeforces Handle</DialogTitle>
          <DialogDescription>
            Enter your Codeforces handle to start the verification process.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter your Codeforces handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            required
          />
          <div className="text-sm text-muted-foreground">
            Don&apos;t have a Codeforces account?{" "}
            <a
              href="https://codeforces.com/register"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary"
            >
              Create Now
            </a>
          </div>

          <div variant="outline"  className="flex justify-end gap-4 pt-2">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>
              Cancel
            </Button>
            <Button className="w-24" type="submit">Next</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
