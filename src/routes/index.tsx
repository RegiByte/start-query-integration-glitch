import { createFileRoute } from "@tanstack/react-router";
import { useActiveUser } from "~/hooks/activeUser";
import { userDataQueryOptions, useUserData } from "~/queries/userData";

export const Route = createFileRoute("/")({
  component: Home,
  ssr: false,
  loader: async ({ context }) => {
    const { queryClient } = context;

    await queryClient.prefetchQuery(userDataQueryOptions());
  },
});

function Home() {
  const { activeUser, setUser, clearUser } = useActiveUser();

  const { data, isLoading, isFetching } = useUserData();
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">
        TanStack Query Bug Demonstration
      </h1>

      <div className="bg-gray-800 p-4 border border-gray-700 rounded-lg shadow mb-6 text-gray-100">
        <h2 className="text-xl font-semibold mb-3">Test Playground</h2>
        <div className="text-lg font-bold mb-4">
          Active User:{" "}
          <span className="px-2 py-1 bg-gray-700 rounded">
            {activeUser || "None"}
          </span>
        </div>
        <div className="flex gap-2 mb-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            onClick={() => setUser("user_1")}
          >
            Set user_1
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            onClick={() => setUser("user_2")}
          >
            Set user_2
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            onClick={clearUser}
          >
            Clear
          </button>
        </div>

        <div className="bg-gray-900 p-3 rounded">
          <div className="flex gap-2 mb-3">
            <p>
              Is Loading:{" "}
              <span
                className={isLoading ? "text-yellow-400" : "text-green-400"}
              >
                {isLoading ? "Yes" : "No"}
              </span>
            </p>
            <p>
              Is Fetching:{" "}
              <span
                className={isFetching ? "text-yellow-400" : "text-green-400"}
              >
                {isFetching ? "Yes" : "No"}
              </span>
            </p>
          </div>
          <p className="font-medium mb-2">User Data: </p>
          <div className="bg-black text-green-300 p-3 rounded overflow-auto">
            <pre>{JSON.stringify(data, null, 2) || "No data"}</pre>
          </div>
        </div>
      </div>

      <div className="mb-8 p-4 bg-yellow-900 border border-yellow-700 rounded-lg text-yellow-100">
        <h2 className="text-xl font-semibold mb-2">The Bug Explained</h2>
        <p className="mb-3">
          When using TanStack Start with TanStack Query, declaring the
          QueryClient globally can cause a serious bug:
        </p>
        <p className="mb-3 text-red-300 font-medium">
          Example: Data from one user can leak to requests from another user on
          the same server instance.
        </p>
        <p className="mb-2">This happens because:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>The global QueryClient is shared across all server requests</li>
          <li>
            The query cache persists data (on the server) and avoids refetching
            until the staleTime is reached
          </li>
        </ul>
        <p>
          <strong>Proper Solution:</strong> Create a new QueryClient instance
          for each router instance to ensure request isolation.
        </p>
      </div>

      <div className="mb-8 p-4 bg-blue-900 border border-blue-700 rounded-lg text-blue-100">
        <h2 className="text-xl font-semibold mb-4">Steps to Reproduce</h2>
        <ol className="list-decimal pl-6 mb-4">
          <li className="mb-2">
            Note that initially there is no active user set
          </li>
          <li className="mb-2">
            Set an active user above (e.g., user_1) and reload the page
          </li>
          <li className="mb-2">You should see that user's data appear</li>
          <li className="mb-2">
            Now set a different active user (e.g., user_2) and reload again
          </li>
          <li className="mb-2">
            With the global QueryClient (current setup), you may still see the
            first user's data in the second user's requested data.
          </li>
        </ol>
        <p className="text-sm italic text-blue-200">
          The query is set with a staleTime of 10 seconds, so the server cache
          persists between reloads.
        </p>
      </div>

      <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-gray-100">
        <h2 className="text-xl font-semibold mb-2">Solution Code</h2>
        <p className="mb-3">
          To fix this bug, modify the router.tsx file to create a new
          QueryClient for each router instance:
        </p>
        <div className="bg-black text-green-300 p-3 rounded overflow-auto">
          <pre>{`// GOOD: Create a new QueryClient per router instance
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
}`}</pre>
        </div>
        <p className="mt-3 text-sm italic text-gray-300">
          This ensures each server request gets its own isolated query cache.
        </p>
        <p className="mt-3 text-sm italic text-gray-300">
          Try reproducing the bug again with the new solution.
        </p>
      </div>
    </div>
  );
}
