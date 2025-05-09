# TanStack Query + Start Data Leakage Bug Demo

This project demonstrates a very sneaky bug that occurs when using TanStack Query with TanStack Start and a globally declared QueryClient.

## The Bug

When using TanStack Start with TanStack Query, declaring the QueryClient globally can cause a serious data leakage issue:

**Data from one user can leak to requests from another user on the same server instance.**

This happens because:
- The global QueryClient is shared across all server requests that hit the same server instance
- The query cache persists data on the server and avoids refetching until the staleTime is reached

## Getting Started

From your terminal:

```sh
# Install dependencies
pnpm install

# Start the development server
pnpm run dev
```

## How to Reproduce the Bug

1. Open the application in your browser
2. Note that initially there is no active user set
3. Set an active user (e.g., user_1) and reload the page
4. You should see that user's data appear
5. Now set a different active user (e.g., user_2) and reload again
6. With the global QueryClient (current setup), you'll see the first user's data

## The Solution

The fix is simple: create a new QueryClient for each router instance instead of using a global one.

```tsx
// GOOD: Create a new QueryClient per router instance
export function createRouter() {
  // Create a fresh query client for each request
  const queryClient = new QueryClient();

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient },
      // ... other options
    }),
    queryClient
  );
}
```

This ensures each server request gets its own isolated query cache and prevents data leakage between different users.

## Key Files

- `src/router.tsx` - Shows the problematic setup with a global QueryClient
- `src/queryClient.ts` - Contains the global QueryClient declaration
- `src/actions/getUserData.ts` - Simple server action to fetch user-specific data
- `src/hooks/activeUser.ts` - Hook to manage the active user state
- `src/routes/index.tsx` - Home page with the bug demonstration
