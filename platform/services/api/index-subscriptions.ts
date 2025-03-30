import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const createSubscriptionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  connectionId: z.string().min(1, "Database connection is required"),
  indexTypeId: z.string().min(1, "Index type is required"),
  targetTable: z.string().min(1, "Target table is required"),
  addresses: z.array(z.string()).min(1, "At least one address is required"),
  description: z.string().optional(),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;

export type CreateSubscriptionResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
  };
};

async function createSubscription(
  data: CreateSubscriptionInput
): Promise<CreateSubscriptionResponse> {
  const response = await fetch("/api/index-subscriptions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create subscription");
  }

  return response.json();
}

export function useCreateIndexSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubscription,
    onMutate: async (newSubscription) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["index-subscriptions"] });

      // Snapshot the previous value
      const previousSubscriptions = queryClient.getQueryData<
        IndexSubscription[]
      >(["index-subscriptions"]);

      // Optimistically update to the new value
      if (previousSubscriptions) {
        queryClient.setQueryData<IndexSubscription[]>(
          ["index-subscriptions"],
          [
            ...previousSubscriptions,
            {
              id: "temp-" + Date.now(),
              name: newSubscription.name,
              status: "active",
              targetSchema: "public", // Default value, will be updated by server
              targetTable: newSubscription.targetTable,
              addresses: newSubscription.addresses,
              indexCount: 0,
              lastIndexedAt: null,
              lastError: null,
              createdAt: new Date().toISOString(),
              updatedAt: null,
              connection: {
                id: newSubscription.connectionId,
                name: "Loading...", // Will be updated by server
              },
              indexType: {
                id: newSubscription.indexTypeId,
                name: "Loading...", // Will be updated by server
                description: null,
              },
            },
          ]
        );
      }

      // Return a context object with the snapshotted value
      return { previousSubscriptions };
    },
    onError: (err, newSubscription, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSubscriptions) {
        queryClient.setQueryData(
          ["index-subscriptions"],
          context.previousSubscriptions
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ["index-subscriptions"] });
    },
  });
}

export type IndexSubscription = {
  id: string;
  name: string;
  status: "active" | "paused" | "error";
  targetSchema: string;
  targetTable: string;
  addresses: string[];
  lastIndexedAt: string | null;
  indexCount: number;
  lastError: string | null;
  createdAt: string;
  updatedAt: string | null;
  connection: {
    id: string;
    name: string;
  };
  indexType: {
    id: string;
    name: string;
    description: string | null;
  };
};

type ApiSubscriptionResponse = {
  index_subscriptions: {
    id: string;
    name: string;
    status: "active" | "paused" | "error";
    targetSchema: string;
    targetTable: string;
    addresses: string[];
    lastIndexedAt: string | null;
    lastError: string | null;
    createdAt: string;
    updatedAt: string | null;
  };
  database_connections: {
    id: string;
    name: string;
  };
  index_types: {
    id: string;
    name: string;
    description: string | null;
  };
};

export function useIndexSubscriptions() {
  return useQuery({
    queryKey: ["index-subscriptions"],
    queryFn: async () => {
      const response = await fetch("/api/index-subscriptions");
      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions");
      }
      const data = await response.json();

      // Transform the response to match our expected format
      return data.map((sub: ApiSubscriptionResponse) => ({
        ...sub.index_subscriptions,
        connection: {
          id: sub.database_connections.id,
          name: sub.database_connections.name,
        },
        indexType: {
          id: sub.index_types.id,
          name: sub.index_types.name,
          description: sub.index_types.description,
        },
      })) as IndexSubscription[];
    },
  });
}

export function useUpdateSubscriptionAddresses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      addresses,
    }: {
      id: string;
      addresses: string[];
    }) => {
      const response = await fetch(`/api/index-subscriptions/${id}/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addresses }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update addresses");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["index-subscriptions"] });
    },
  });
}

export function useRemoveSubscriptionAddresses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      addresses,
    }: {
      id: string;
      addresses: string[];
    }) => {
      const response = await fetch(`/api/index-subscriptions/${id}/addresses`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addresses }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove addresses");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["index-subscriptions"] });
    },
  });
}
