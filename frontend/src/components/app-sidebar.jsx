import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  CirclePlus ,
  Trash2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuthStore } from "../store/useAuthStore"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Greedy",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "1000",
          url: "#",
        },
        {
          title: "1200",
          url: "#",
        },
        {
          title: "1700",
          url: "#",
        },
      ],
    },
    {
      title: "Dynamic Programing",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "1500",
          url: "#",
        },
        {
          title: "1600",
          url: "#",
        },
        {
          title: "1800",
          url: "#",
        },
      ],
    },
    {
      title: "Graphs",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "1300",
          url: "#",
        },
        {
          title: "1400",
          url: "#",
        },
        {
          title: "1600",
          url: "#",
        },
        {
          title: "1700",
          url: "#",
        },
      ],
    },
    {
      title: "Brute Force",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "800",
          url: "#",
        },
        {
          title: "1000",
          url: "#",
        },
        {
          title: "1500",
          url: "#",
        },
        {
          title: "1600",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Add Problem Tag",
      url: "#",
      icon: CirclePlus,
    },
    {
      name: "Delete Problem Tag",
      url: "#",
      icon: Trash2,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  const {authUser} = useAuthStore();
  return (
    <Sidebar collapsible="icon" {...props}>

      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={authUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
