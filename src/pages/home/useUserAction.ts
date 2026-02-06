import { useMutation, useQueryClient } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { useMemo, useState } from 'react'
import { useCookies } from 'react-cookie'

import { getSelectedIds } from '@/utils/getSelectedIds'

import { axiosClassic } from '@/api/axios'

import { COOKIE_OPTIONS } from '@/constants'
import authService, { EnumTokens } from '@/services/auth/auth.service'
import userService from '@/services/user.service'
import { doLogout } from '@/utils/doLogout'
import { useLastSeen } from './useLastSeen'
import { useUsers } from './useUsers'

export function useUserActions() {
	const queryClient = useQueryClient()
	const [selected, setSelected] = useState<Record<string, boolean>>({})
	const [selectAll, setSelectAll] = useState(false)
	const [cookies, removeCookie] = useCookies([EnumTokens.ACCESS_TOKEN])

	useLastSeen()

	const accessToken = cookies[EnumTokens.ACCESS_TOKEN]
	const isAuthenticated = typeof accessToken === 'string' && accessToken.length > 0
	const { data: users = [], isLoading } = useUsers(undefined, isAuthenticated)

	const currentUserId = useMemo(() => {
		const token = cookies[EnumTokens.ACCESS_TOKEN]
		if (typeof token !== 'string') return null
		try {
			return jwtDecode<{ id: string }>(token).id
		} catch {
			return null
		}
	}, [cookies])

	const toggleSelect = (id: string) => setSelected(prev => ({ ...prev, [id]: !prev[id] }))

	const toggleSelectAll = (users: { id: string }[]) => {
		const value = !selectAll
		setSelectAll(value)
		setSelected(Object.fromEntries(users.map(u => [u.id, value])))
	}

	const updateUserStatus = async (userId: string, status: 'ACTIVE' | 'BLOCKED') =>
		axiosClassic.patch(`/users/${userId}/status`, { status })

	const deleteUser = async (userId: string) => axiosClassic.delete(`/users/${userId}`)
	const deleteUnverifiedUsers = async () => axiosClassic.delete('/users/unverified/all')

	const updateSelectedStatus = async (status: 'ACTIVE' | 'BLOCKED') => {
		const ids = getSelectedIds(selected)
		if (!ids.length) return
		await Promise.all(ids.map(id => updateUserStatus(id, status)))
		queryClient.invalidateQueries({ queryKey: ['users'] })
		setSelected({})
		setSelectAll(false)
	}

	const deleteSelected = async () => {
		const ids = getSelectedIds(selected)
		if (!ids.length) return
		await Promise.all(ids.map(id => deleteUser(id)))
		if (currentUserId && ids.includes(currentUserId)) {
			removeCookie(EnumTokens.ACCESS_TOKEN, COOKIE_OPTIONS)
			window.location.href = '/login'
		}
		queryClient.invalidateQueries({ queryKey: ['users'] })
		setSelected({})
		setSelectAll(false)
	}

	const deleteAllUnverified = async () => {
		try {
			await deleteUnverifiedUsers()
			queryClient.invalidateQueries({ queryKey: ['users'] })
			setSelected({})
			setSelectAll(false)
		} catch (err) {
			console.error(err)
			alert('Failed to delete unverified users')
		}
	}

	const { mutate: verifyUser, isPending: isVerifyLoading } = useMutation({
		mutationFn: (userId: string) => userService.verifyUser(userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] })
		},
		onError: err => {
			console.error(err)
			alert('Failed to verify user')
		},
	})


	const { mutate: logout, isPending: isLogoutLoading } = useMutation({
		mutationFn: () => authService.logout(),
		onSuccess: doLogout,
		onError: error => console.error('Logout failed:', error),
	})

	return {
		users,
		currentUserId,
		isLoading,
		isLogoutLoading,
		selected,
		selectAll,
		toggleSelect,
		toggleSelectAll,
		hasSelected: Object.values(selected).some(Boolean),
		blockSelected: () => updateSelectedStatus('BLOCKED'),
		unblockSelected: () => updateSelectedStatus('ACTIVE'),
		deleteSelected,
		deleteAllUnverified,
		verifyUser,
		isVerifyLoading,
		logout
	}
}
