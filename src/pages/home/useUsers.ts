import { useQuery } from '@tanstack/react-query'

import userService from '@/services/user.service'

type TUseUsersParams = {
	status?: string
	role?: string
}

export function useUsers(params?: TUseUsersParams, enabled = true) {
	return useQuery({
		queryKey: ['users', params],
		queryFn: async () => {
			const { data } = await userService.fetchList(params)
			return data
		},
		staleTime: 1000 * 30,
		enabled
	})
}
