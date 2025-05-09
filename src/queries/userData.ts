import { useQuery, queryOptions } from "@tanstack/react-query"
import { getUserData } from "actions/getUserData"

const userDataQueryOptions = () => queryOptions({
    queryKey: ['userData'],
    queryFn: () => getUserData()
})

export const useUserData = () => {
    return useQuery(userDataQueryOptions())
}