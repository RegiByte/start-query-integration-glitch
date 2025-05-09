import { QueryClient } from "@tanstack/react-query";

/**
 * If this query client is declared globally,
 * The server will use the same query cache for all the requests
 * Which can cause data leaking from one user to another
 */
export const queryClient = new QueryClient();
