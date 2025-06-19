import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function DisconnectHandlePopup({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-primary">
            <X className="w-8 h-8 text-primary" />
          </div>

          <DialogHeader>
            <DialogTitle>Disconnect your Codeforces handle?</DialogTitle>
            <DialogDescription>
              This will remove the link to your account. You can reconnect anytime.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-center gap-4 pt-2">
            <Button variant="outline" onClick={() => onClose(false)} className="w-24">Cancel</Button>
            <Button onClick={onConfirm} className="w-24">Disconnect</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
