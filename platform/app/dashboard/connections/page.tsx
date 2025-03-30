"use client";

import * as React from "react";
import { useConnections } from "@/services/api/connections";
import { CreateConnectionDialog } from "@/components/dialogs/create-connection-dialog";
import { CreateIndexSubscriptionDialog } from "@/components/dialogs/create-index-subscription-dialog";
import { IconDatabase } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

function ConnectionsTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Host</TableHead>
          <TableHead>Port</TableHead>
          <TableHead>Database</TableHead>
          <TableHead>SSL Mode</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <div className="flex items-center gap-2">
                <IconDatabase className="h-4 w-4 text-primary" />
                <Skeleton className="h-4 w-32" />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-8 rounded-md" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function ConnectionsPage() {
  const { data, isLoading, error } = useConnections();

  if (error) {
    return <div>Error loading connections: {error.message}</div>;
  }

  const connections = data?.connections || [];

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <IconDatabase className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">Database Connections</h1>
        </div>
        <CreateConnectionDialog />
      </div>
      <div className="px-4 lg:px-6">
        {isLoading ? (
          <ConnectionsTableSkeleton />
        ) : connections.length === 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Database</TableHead>
                <TableHead>SSL Mode</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No connections found. Create your first connection to get
                  started.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Database</TableHead>
                <TableHead>SSL Mode</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connections.map((connection) => (
                <TableRow key={connection.id}>
                  <TableCell className="font-medium">
                    {connection.name}
                  </TableCell>
                  <TableCell>{connection.host}</TableCell>
                  <TableCell>{connection.port}</TableCell>
                  <TableCell>{connection.database}</TableCell>
                  <TableCell>{connection.sslMode}</TableCell>
                  <TableCell>
                    <CreateIndexSubscriptionDialog />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
