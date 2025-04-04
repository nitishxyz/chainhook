import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const testConnectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  host: z.string().min(1, "Host is required"),
  port: z.coerce.number().min(1, "Port must be a positive number"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  database: z.string().min(1, "Database name is required"),
  sslMode: z
    .enum(["disable", "require", "verify-ca", "verify-full"])
    .default("require"),
});

export type TestConnectionInput = z.infer<typeof testConnectionSchema>;
export type CreateConnectionInput = TestConnectionInput;

export type TestConnectionResponse = {
  success: boolean;
  message: string;
  data?: {
    version: string;
    schemas: string[];
    tables?: { schema: string; name: string }[];
    extensions?: { name: string; version: string }[];
  };
};

export type CreateConnectionResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
  };
};

export type Connection = {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  database: string;
  sslMode: "disable" | "require" | "verify-ca" | "verify-full";
  createdAt: string;
  updatedAt: string;
};

export type ConnectionListResponse = {
  connections: Connection[];
};

export type ConnectionDetailResponse = {
  connection: Connection;
};

async function testConnection(
  data: TestConnectionInput
): Promise<TestConnectionResponse> {
  const validatedData = testConnectionSchema.parse(data);
  const response = await fetch("/api/connections/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to test connection");
  }

  return response.json();
}

async function createConnection(
  data: CreateConnectionInput
): Promise<CreateConnectionResponse> {
  const validatedData = testConnectionSchema.parse(data);
  const response = await fetch("/api/database-connections", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create connection");
  }

  return response.json();
}

async function getConnections(): Promise<ConnectionListResponse> {
  const response = await fetch("/api/database-connections");

  if (!response.ok) {
    throw new Error("Failed to fetch connections");
  }

  return response.json();
}

async function getConnection(id: string): Promise<ConnectionDetailResponse> {
  const response = await fetch(`/api/database-connections/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch connection details");
  }

  return response.json();
}

export function useTestConnection() {
  return useMutation({
    mutationFn: testConnection,
  });
}

export function useCreateConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConnection,
    onMutate: async (newConnection) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["connections"] });

      // Snapshot the previous value
      const previousConnections =
        queryClient.getQueryData<ConnectionListResponse>(["connections"]);

      // Optimistically update to the new value
      if (previousConnections) {
        queryClient.setQueryData<ConnectionListResponse>(["connections"], {
          connections: [
            ...previousConnections.connections,
            {
              id: "temp-" + Date.now(),
              name: newConnection.name,
              host: newConnection.host,
              port: newConnection.port,
              username: newConnection.username,
              database: newConnection.database,
              sslMode: newConnection.sslMode,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        });
      }

      // Return a context object with the snapshotted value
      return { previousConnections };
    },
    onError: (err, newConnection, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousConnections) {
        queryClient.setQueryData(["connections"], context.previousConnections);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });
}

export function useConnections() {
  return useQuery({
    queryKey: ["connections"],
    queryFn: getConnections,
  });
}

export function useConnection(id: string) {
  return useQuery({
    queryKey: ["connections", id],
    queryFn: () => getConnection(id),
    enabled: !!id,
  });
}
