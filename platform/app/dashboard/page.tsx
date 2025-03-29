"use client";

import { useConnections } from "@/services/api/connections";
import { useIndexSubscriptions } from "@/services/api/index-subscriptions";
import { useState } from "react";
import { IconDatabase, IconTable } from "@tabler/icons-react";
import { CreateConnectionDialog } from "@/components/dialogs/create-connection-dialog";
import { CreateIndexSubscriptionDialog } from "@/components/dialogs/create-index-subscription-dialog";
import { IndexSubscriptionsTable } from "@/components/index-subscriptions-table";

export default function Page() {
  const [selectedConnectionId, setSelectedConnectionId] = useState<
    string | null
  >(null);
  const { data: connectionsData, isLoading: isLoadingConnections } =
    useConnections();
  const { data: subscriptions, isLoading: isLoadingSubscriptions } =
    useIndexSubscriptions();

  const filteredSubscriptions = subscriptions?.filter(
    (sub) => sub.connection.id === selectedConnectionId
  );

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Database Connections</h2>
          <CreateConnectionDialog />
        </div>

        {isLoadingConnections ? (
          <div className="text-center py-4">Loading connections...</div>
        ) : !connectionsData?.connections?.length ? (
          <div className="text-center py-4 text-muted-foreground">
            No database connections found. Create one to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectionsData.connections.map((connection) => (
              <div
                key={connection.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedConnectionId === connection.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedConnectionId(connection.id)}
              >
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
            ))}
          </div>
        )}
      </div>

      {selectedConnectionId && (
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <IconTable className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Index Subscriptions</h2>
            </div>
            <CreateIndexSubscriptionDialog />
          </div>

          {isLoadingSubscriptions ? (
            <div className="text-center py-4">Loading subscriptions...</div>
          ) : !filteredSubscriptions?.length ? (
            <div className="text-center py-4 text-muted-foreground">
              No index subscriptions found for this connection. Create one to
              get started.
            </div>
          ) : (
            <IndexSubscriptionsTable subscriptions={filteredSubscriptions} />
          )}
        </div>
      )}
    </div>
  );
}
