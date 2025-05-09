import { useQuery, queryOptions } from "@tanstack/react-query";
import { getUserData } from "~/actions/getUserData";

export const userDataQueryOptions = () =>
  queryOptions({
    queryKey: ["userData"],
    staleTime: 10 * 1000, // the query result will be cached for 10 seconds
    queryFn: () => getUserData(),
  });

export const useUserData = () => {
  return useQuery(userDataQueryOptions());
};
