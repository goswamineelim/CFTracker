"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  RefreshCw,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  CFRank
} from "@/components/ui/cf-rank"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/useAuthStore"
import { useHandleStore } from "@/store/useHandleStore"
import { useNavigate } from 'react-router-dom';
export function NavHandle({
  user, setPopupOpen, checkValue
}) {
  const { isMobile } = useSidebar()
  const { authUser, logout } = useAuthStore();
  const {updateCFDetails } = useHandleStore();
  const navigate = useNavigate();

  const handleDisconnect = () => {
    setPopupOpen(true);
  };

  const handleSelect = (e) => {
    window.open(`https://codeforces.com/profile/${user.handle}`, "_blank");
  };

  const handleRefresh = (e) => {
    updateCFDetails();
  };

  const connectPopup = (e) => {
    setPopupOpen(true);
  };
  return (
    <SidebarMenu >
      <SidebarMenuItem >
        <DropdownMenu >
          <DropdownMenuTrigger asChild >
            <SidebarMenuButton onClick={connectPopup}
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              {
                authUser.cfAvatar ?
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={authUser.cfAvatar} alt={authUser.handle} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>

                  :
                  <Avatar className="h-8 w-8 rounded-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="90%" height="100%">
                      <path fill="#F44336" d="M24 19.5V12a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 18 12v7.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5z"></path>
                      <path fill="#2196F3" d="M13.5 21a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 13.5 3h-3C9.673 3 9 3.672 9 4.5v15c0 .828.673 1.5 1.5 1.5h3z"></path>
                      <path fill="#FFC107" d="M0 19.5c0 .828.673 1.5 1.5 1.5h3A1.5 1.5 0 0 0 6 19.5V9a1.5 1.5 0 0 0-1.5-1.5h-3C.673 7.5 0 8.172 0 9v10.5z"></path>
                    </svg>
                  </Avatar>

              }
              {
                authUser.handle?
                  <CFRank handle={authUser.handle} rank ={authUser.cfRank} rating ={authUser.cfRating}/>:
                <CFRank handle={user.handle} />

              }
              

              {checkValue && <ChevronsUpDown className="ml-auto size-4" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {checkValue && <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {
                  authUser.cfAvatar ?
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={authUser.cfAvatar} alt={authUser.handle} />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar> :
                    <Avatar className="h-8 w-8 rounded-none">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="90%" height="100%">
                        <path fill="#F44336" d="M24 19.5V12a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 18 12v7.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5z"></path>
                        <path fill="#2196F3" d="M13.5 21a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 13.5 3h-3C9.673 3 9 3.672 9 4.5v15c0 .828.673 1.5 1.5 1.5h3z"></path>
                        <path fill="#FFC107" d="M0 19.5c0 .828.673 1.5 1.5 1.5h3A1.5 1.5 0 0 0 6 19.5V9a1.5 1.5 0 0 0-1.5-1.5h-3C.673 7.5 0 8.172 0 9v10.5z"></path>
                      </svg>
                    </Avatar>
                }
                <CFRank handle={authUser.handle} rank ={authUser.cfRank} rating ={authUser.cfRating}/>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={handleSelect} >
                <BadgeCheck />
                Codeforces profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={handleRefresh} >
                <RefreshCw />
                Update rating
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleDisconnect}>
              <LogOut />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
