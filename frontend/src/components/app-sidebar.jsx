// AppSidebar.jsx
import * as React from "react";
import { CirclePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { NavHandle } from "@/components/nav-handle";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "../store/useAuthStore";
import { useHandleStore } from "../store/useHandleStore";

import DisconnectHandlePopup from "@/components/ui/disconnect-popup";
import ConnectHandlePopup from "@/components/ui/connect-popup";
import VerifyHandlePopup from "@/components/ui/verify-popup";

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

  const {
    handle,
    verificationStarted,
    isLinking,
    isValidating,
    error,
    hydrateFromStorage,
    clearVerification,
  } = useHandleStore();
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [problemInfo] = React.useState({
    url: "https://codeforces.com/problemset/problem/2041/D",
    name: "Problem 2041D",
  });

  // hydrate on mount
  React.useEffect(() => {
    hydrateFromStorage();
  }, []);

  const providedCode =
    handle && `// Code submitted by ${handle} at ${new Date().toLocaleString()}\n// This will generate a compilation error\nint main() { return "error"; }`;
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        {/* <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} /> */}
      </SidebarContent>


      <SidebarFooter>
        {authUser?.handle ? <NavHandle user={{
          handle: authUser.handle,
          rating: "Rating"
        }
        } setPopupOpen={setPopupOpen} checkValue={true} /> :
          <NavHandle user={{
            handle:verificationStarted? "Verify Handle":"Connect Codeforces",
          }
          } setPopupOpen={setPopupOpen} checkValue={false} />
        }
      </SidebarFooter>

      {popupOpen && (
        <>
          {authUser?.handle ? (
            <DisconnectHandlePopup
              open={popupOpen}
              onClose={setPopupOpen}
              onConfirm={() => {
                clearVerification();
                setPopupOpen(false);
              }}
            />
          ) : verificationStarted ? (
            <VerifyHandlePopup
              open={popupOpen}
              onClose={setPopupOpen}
              handle={handle}
              problemUrl={problemInfo.url}
              problemName={problemInfo.name}
              providedCode={providedCode}
            />
          ) : (
            <ConnectHandlePopup open={popupOpen} onClose={setPopupOpen} />
          )}
        </>
      )}



      <SidebarFooter>
        <NavUser user={authUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}