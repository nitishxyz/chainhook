export interface User {
  username: string;
  id: string;
  email: string;
}

export async function getUser(): Promise<User | null> {
  try {
    const response = await fetch("/api/user");
    if (!response.ok) {
      if (response.status === 401) return null;
      throw new Error("Failed to fetch user");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
