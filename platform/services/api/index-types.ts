import { useQuery } from "@tanstack/react-query";

export type IndexType = {
  id: string;
  name: string;
  description: string;
  schema: string;
  createdAt: string;
  updatedAt: string;
};

export type IndexTypesResponse = {
  indexTypes: IndexType[];
};

async function getIndexTypes(): Promise<IndexTypesResponse> {
  const response = await fetch("/api/index-types");

  if (!response.ok) {
    throw new Error("Failed to fetch index types");
  }

  return response.json();
}

export function useIndexTypes() {
  return useQuery({
    queryKey: ["index-types"],
    queryFn: getIndexTypes,
  });
}
