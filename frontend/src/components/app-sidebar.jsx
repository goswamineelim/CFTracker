import * as React from "react";
import { CirclePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "../store/useAuthStore";

import DisconnectHandlePopup from "@/components/pop-up-window";
import ConnectHandlePopup from "@/components/connect-popup";
import VerifyHandlePopup from "@/components/verify-handle-popup";

const data = {
  navMain: [
    { title: "Greedy", url: "#", icon: CirclePlus, isActive: true, items: [] },
    { title: "Dynamic Programming", url: "#", icon: CirclePlus, items: [] },
    { title: "Graphs", url: "#", icon: CirclePlus, items: [] },
    { title: "Brute Force", url: "#", icon: CirclePlus, items: [] },
  ],
  projects: [
    { name: "Add Problem Tag", url: "#", icon: CirclePlus },
    { name: "Delete Problem Tag", url: "#", icon: Trash2 },
  ],
};

export function AppSidebar(props) {
  const { authUser } = useAuthStore();

  const [popupOpen, setPopupOpen] = React.useState(false);
  const [cfHandle, setCfHandle] = React.useState(() => localStorage.getItem("cf_verification_handle") || "");
  const [expiry, setExpiry] = React.useState(() => {
    const storedExpiry = parseInt(localStorage.getItem("cf_verification_expiry") || "0", 10);
    return isNaN(storedExpiry) ? 0 : storedExpiry;
  });
  const [verificationStarted, setVerificationStarted] = React.useState(() => Boolean(cfHandle && expiry > Date.now()));

  const [problemInfo] = React.useState({
    url: "https://codeforces.com/problemset/problem/1869/A",
    name: "Problem 1869A",
  });

  const startVerification = (newHandle) => {
    const newExpiry = Date.now() + 1 * 30 * 1000; // 5 minutes
    localStorage.setItem("cf_verification_handle", newHandle);
    localStorage.setItem("cf_verification_expiry", newExpiry.toString());

    setCfHandle(newHandle);
    setExpiry(newExpiry);
    setVerificationStarted(true);
  };

  const clearVerificationState = () => {
    localStorage.removeItem("cf_verification_handle");
    localStorage.removeItem("cf_verification_expiry");
    setCfHandle("");
    setExpiry(0);
    setVerificationStarted(false);
  };

  const handleDisconnect = () => {
    clearVerificationState();
    setPopupOpen(false);
  };

  const handleVerificationSuccess = () => {
    clearVerificationState();
    setPopupOpen(false);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>

      <div className="p-6">
        <Button onClick={() => setPopupOpen(true)}>
          {authUser.handle
            ? "Disconnect Handle"
            : verificationStarted
            ? "Verify Handle"
            : "Connect Handle"}
        </Button>

        {popupOpen && (
          <>
            {authUser.handle ? (
              <DisconnectHandlePopup open={popupOpen} onClose={setPopupOpen} onConfirm={handleDisconnect} />
            ) : verificationStarted ? (
              <VerifyHandlePopup
                open={popupOpen}
                onClose={setPopupOpen}
                handle={cfHandle}
                problemUrl={problemInfo.url}
                problemName={problemInfo.name}
                providedCode={`// Code submitted by ${cfHandle} at ${new Date().toLocaleString()}\n// This will generate a compilation error\nint main() { return "error"; }`}
                expiryTime={expiry}
                onVerificationSuccess={handleVerificationSuccess}
                onExpired={() => {
                  clearVerificationState(); // 🟢 Expired → fallback to Connect
                  setPopupOpen(true); // Show Connect Handle
                }}
              />
            ) : (
              <ConnectHandlePopup open={popupOpen} onClose={setPopupOpen} onConfirm={startVerification} />
            )}
          </>
        )}
      </div>

      <SidebarFooter>
        <NavUser user={authUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
