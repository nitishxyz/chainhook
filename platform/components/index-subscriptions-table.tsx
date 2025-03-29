"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { IndexSubscription } from "@/services/api/index-subscriptions";

interface IndexSubscriptionsTableProps {
  subscriptions: IndexSubscription[];
}

export function IndexSubscriptionsTable({
  subscriptions,
}: IndexSubscriptionsTableProps) {
  if (!subscriptions?.length) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No index subscriptions found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Index Type</TableHead>
            <TableHead>Target Table</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Indexed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell className="font-medium">{subscription.name}</TableCell>
              <TableCell>
                {subscription.indexType?.name || "Unknown Index Type"}
              </TableCell>
              <TableCell>{subscription.targetTable}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    subscription.status === "active"
                      ? "default"
                      : subscription.status === "paused"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {subscription.status}
                </Badge>
              </TableCell>
              <TableCell>
                {subscription.lastIndexedAt
                  ? formatDistanceToNow(new Date(subscription.lastIndexedAt), {
                      addSuffix: true,
                    })
                  : "Never"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
