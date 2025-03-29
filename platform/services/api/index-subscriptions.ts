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
    onSuccess: () => {
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
