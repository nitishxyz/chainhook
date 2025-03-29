"use client";

import * as React from "react";
import { IconDatabase, IconTable } from "@tabler/icons-react";
import Link from "next/link";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CreateConnectionDialog } from "@/components/dialogs/create-connection-dialog";
import { useConnections } from "@/services/api/connections";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDatabase,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: connectionsData } = useConnections();

  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-4"
              >
                <a href="#" className="flex items-center gap-3">
                  <IconTable className="!size-7" />
                  <span className="text-xl font-semibold">Chainhook</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="!text-lg">
          <CreateConnectionDialog buttonClassName="w-full mb-4" />

          <div className="space-y-2 px-4">
            {!connectionsData?.connections?.length ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No connections found
              </div>
            ) : (
              connectionsData.connections.map((connection) => (
                <Link
                  key={connection.id}
                  href={`/dashboard/connections/${connection.id}`}
                  className="block"
                >
                  <div className="p-4 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <IconDatabase className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">{connection.name}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {connection.host}:{connection.port}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {connection.database}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </SidebarContent>
        <SidebarFooter className="!text-lg">
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
