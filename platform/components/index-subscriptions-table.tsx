"use client";

import * as React from "react";
import {
  IconTable,
  IconChevronDown,
  IconChevronRight,
  IconClock,
  IconAlertCircle,
  IconInfoCircle,
  IconEdit,
  IconX,
} from "@tabler/icons-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { IndexSubscription } from "@/services/api/index-subscriptions";
import { useState } from "react";
import {
  useUpdateSubscriptionAddresses,
  useRemoveSubscriptionAddresses,
} from "@/services/api/index-subscriptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SubscriptionDetails({
  subscription,
}: {
  subscription: IndexSubscription;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [addressesToAdd, setAddressesToAdd] = useState<string[]>([]);
  const [addressesToRemove, setAddressesToRemove] = useState<string[]>([]);

  const updateAddresses = useUpdateSubscriptionAddresses();
  const removeAddresses = useRemoveSubscriptionAddresses();

  const handleAddAddress = () => {
    if (!newAddress.trim()) {
      setError("Address cannot be empty");
      return;
    }
    if (
      subscription.addresses.includes(newAddress) ||
      addressesToAdd.includes(newAddress)
    ) {
      setError("Address already exists");
      return;
    }
    setAddressesToAdd([...addressesToAdd, newAddress]);
    setNewAddress("");
    setError(null);
  };

  const handleRemoveAddress = (address: string) => {
    if (addressesToAdd.includes(address)) {
      setAddressesToAdd(addressesToAdd.filter((a) => a !== address));
    } else {
      setAddressesToRemove([...addressesToRemove, address]);
    }
  };

  const handleSave = async () => {
    try {
      if (addressesToAdd.length > 0) {
        await updateAddresses.mutateAsync({
          id: subscription.id,
          addresses: addressesToAdd,
        });
      }
      if (addressesToRemove.length > 0) {
        await removeAddresses.mutateAsync({
          id: subscription.id,
          addresses: addressesToRemove,
        });
      }
      setIsEditing(false);
      setError(null);
      setAddressesToAdd([]);
      setAddressesToRemove([]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update addresses"
      );
    }
  };

  const handleCancel = () => {
    setNewAddress("");
    setError(null);
    setAddressesToAdd([]);
    setAddressesToRemove([]);
    setIsEditing(false);
  };

  const currentAddresses = [
    ...subscription.addresses.filter(
      (addr) => !addressesToRemove.includes(addr)
    ),
    ...addressesToAdd,
  ];

  return (
    <div className="p-4 bg-muted/50">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Description</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {subscription.indexType.description || "No description available"}
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <IconClock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Created</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(subscription.createdAt + "Z"), {
              addSuffix: true,
            })}
          </p>
        </div>
        <div className="space-y-2 col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <IconTable className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Addresses</span>
            </div>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8"
              >
                <IconEdit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="h-8"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="h-8"
                  disabled={
                    updateAddresses.isPending || removeAddresses.isPending
                  }
                >
                  {updateAddresses.isPending || removeAddresses.isPending
                    ? "Saving..."
                    : "Save"}
                </Button>
              </div>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Enter Solana address"
                  className="font-mono text-xs"
                />
                <Button
                  size="sm"
                  onClick={handleAddAddress}
                  disabled={!newAddress.trim()}
                >
                  Add
                </Button>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex flex-wrap gap-2">
                {currentAddresses.map((address) => (
                  <Badge
                    key={address}
                    variant="outline"
                    className="font-mono text-xs flex items-center gap-1"
                  >
                    {address}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveAddress(address)}
                    >
                      <IconX className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {subscription.addresses.map((address) => (
                <Badge
                  key={address}
                  variant="outline"
                  className="font-mono text-xs"
                >
                  {address}
                </Badge>
              ))}
            </div>
          )}
        </div>
        {subscription.lastError && (
          <div className="space-y-2 col-span-2">
            <div className="flex items-center gap-2 text-sm">
              <IconAlertCircle className="h-4 w-4 text-destructive" />
              <span className="font-medium">Last Error</span>
            </div>
            <p className="text-sm text-destructive">{subscription.lastError}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SubscriptionsTableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Index Type</TableHead>
            <TableHead>Target Table</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Index Count</TableHead>
            <TableHead>Last Indexed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface IndexSubscriptionsTableProps {
  subscriptions: IndexSubscription[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function IndexSubscriptionsTable({
  subscriptions,
  isLoading = false,
  emptyMessage = "No index subscriptions found. Create one to get started.",
}: IndexSubscriptionsTableProps) {
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(
    new Set()
  );

  const toggleRow = (subscriptionId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(subscriptionId)) {
        next.delete(subscriptionId);
      } else {
        next.add(subscriptionId);
      }
      return next;
    });
  };

  if (isLoading) {
    return <SubscriptionsTableSkeleton />;
  }

  if (!subscriptions?.length) {
    return (
      <div className="rounded-lg border border-dashed p-8">
        <div className="text-center text-muted-foreground">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Index Type</TableHead>
            <TableHead>Target Table</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Index Count</TableHead>
            <TableHead>Last Indexed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <React.Fragment key={subscription.id}>
              <TableRow
                className={cn(
                  "cursor-pointer hover:bg-muted/50",
                  expandedRows.has(subscription.id) && "bg-muted/50"
                )}
                onClick={() => toggleRow(subscription.id)}
              >
                <TableCell>
                  {expandedRows.has(subscription.id) ? (
                    <IconChevronDown className="h-4 w-4" />
                  ) : (
                    <IconChevronRight className="h-4 w-4" />
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {subscription.indexType.name}
                </TableCell>
                <TableCell>
                  {subscription.targetSchema}.{subscription.targetTable}
                </TableCell>
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
                <TableCell>{subscription.indexCount || 0}</TableCell>
                <TableCell>
                  {subscription.lastIndexedAt
                    ? (() => {
                        const date = new Date(subscription.lastIndexedAt + "Z");
                        return formatDistanceToNow(date, {
                          addSuffix: true,
                        });
                      })()
                    : "Never"}
                </TableCell>
              </TableRow>
              {expandedRows.has(subscription.id) && (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <SubscriptionDetails subscription={subscription} />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
