"use client";

import * as React from "react";
import { useConnection } from "@/services/api/connections";
import { useIndexSubscriptions } from "@/services/api/index-subscriptions";
import { useParams } from "next/navigation";
import {
  IconDatabase,
  IconArrowLeft,
  IconSettings,
  IconTable,
} from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateIndexSubscriptionDialog } from "@/components/dialogs/create-index-subscription-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { IndexSubscriptionsTable } from "@/components/index-subscriptions-table";

function ConnectionDetailsSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <IconSettings className="h-4 w-4 text-muted-foreground" />
          <CardTitle>Connection Details</CardTitle>
        </div>
        <CardDescription>Database connection configuration</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Host</label>
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Port</label>
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Database</label>
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Username</label>
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">SSL Mode</label>
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ConnectionDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useConnection(id as string);
  const { data: subscriptions, isLoading: isLoadingSubscriptions } =
    useIndexSubscriptions();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-destructive">Error: {error.message}</div>
      </div>
    );
  }

  if (!data && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Connection not found</div>
      </div>
    );
  }

  const connection = data?.connection;
  const connectionSubscriptions = subscriptions?.filter(
    (sub) => sub.connection.id === id
  );

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="space-y-8">
        <Button variant="ghost" asChild className="-ml-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <IconArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        {isLoading ? (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <IconDatabase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        ) : connection ? (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <IconDatabase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{connection.name}</h1>
              <p className="text-muted-foreground">
                {connection.host}:{connection.port} • {connection.database}
              </p>
            </div>
          </div>
        ) : null}

        {isLoading ? (
          <ConnectionDetailsSkeleton />
        ) : connection ? (
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <IconSettings className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Connection Details</CardTitle>
              </div>
              <CardDescription>
                Database connection configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Host</label>
                    <p className="text-sm text-muted-foreground">
                      {connection.host}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Port</label>
                    <p className="text-sm text-muted-foreground">
                      {connection.port}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Database</label>
                  <p className="text-sm text-muted-foreground">
                    {connection.database}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Username</label>
                  <p className="text-sm text-muted-foreground">
                    {connection.username}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">SSL Mode</label>
                  <p className="text-sm text-muted-foreground">
                    {connection.sslMode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconTable className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Index Subscriptions</h2>
            </div>
            <CreateIndexSubscriptionDialog />
          </div>

          <IndexSubscriptionsTable
            subscriptions={connectionSubscriptions || []}
            isLoading={isLoadingSubscriptions}
            emptyMessage="No index subscriptions found for this connection. Create one to get started."
          />
        </div>
      </div>
    </div>
  );
}
