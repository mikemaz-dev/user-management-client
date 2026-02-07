import { useMutation, useQueryClient } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useMemo, useState } from 'react'
import { useCookies } from 'react-cookie'
import { getSelectedIds } from '@/utils/getSelectedIds'
import { axiosClassic } from '@/api/axios'
import { COOKIE_OPTIONS } from '@/constants'
import authService, { EnumTokens } from '@/services/auth/auth.service'
import userService from '@/services/user.service'
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
	const { data: users = [], isLoading, isError } = useUsers(undefined, isAuthenticated)

	useEffect(() => {
  if (isError && isAuthenticated) {
    removeCookie(EnumTokens.ACCESS_TOKEN, COOKIE_OPTIONS)
    window.location.href = '/login'
  }
}, [isError, isAuthenticated])

	const currentUserId = useMemo(() => {
		if (typeof accessToken !== 'string') return null
		try { return jwtDecode<{ id: string }>(accessToken).id } catch { return null }
	}, [accessToken])

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

	const handleSelfLogout = () => {
		removeCookie(EnumTokens.ACCESS_TOKEN, COOKIE_OPTIONS)
		document.cookie = `${EnumTokens.ACCESS_TOKEN}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
		window.location.href = '/login'
	}

	const updateSelectedStatus = async (status: 'ACTIVE' | 'BLOCKED') => {
		const ids = getSelectedIds(selected)
		if (!ids.length) return
		
		await Promise.all(ids.map(id => updateUserStatus(id, status)))
		
		if (status === 'BLOCKED' && currentUserId && ids.includes(currentUserId)) {
			handleSelfLogout()
		}
		
		queryClient.invalidateQueries({ queryKey: ['users'] })
		setSelected({})
		setSelectAll(false)
	}

	const deleteSelected = async () => {
		const ids = getSelectedIds(selected)
		if (!ids.length) return
		
		await Promise.all(ids.map(id => deleteUser(id)))
		
		if (currentUserId && ids.includes(currentUserId)) {
			handleSelfLogout()
		}
		
		queryClient.invalidateQueries({ queryKey: ['users'] })
		setSelected({})
		setSelectAll(false)
	}

	const deleteAllUnverified = async () => {
		try {
			await deleteUnverifiedUsers()
			
			// Проверяем текущего пользователя
			const currentUser = users.find(u => u.id === currentUserId)
			if (currentUser?.status === 'UN_VERIFIED') {
				handleSelfLogout()
			}
			
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
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
		onError: () => alert('Failed to verify user'),
	})

	const { mutate: logout, isPending: isLogoutLoading } = useMutation({
		mutationFn: () => authService.logout(),
		onSuccess: () => {
			removeCookie(EnumTokens.ACCESS_TOKEN, COOKIE_OPTIONS)
			document.cookie = `${EnumTokens.ACCESS_TOKEN}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
			window.location.href = '/login'
		},
		onError: error => console.error('Logout failed:', error),
	})

	return {
		users, currentUserId, isLoading, isLogoutLoading, selected, selectAll,
		toggleSelect, toggleSelectAll, hasSelected: Object.values(selected).some(Boolean),
		blockSelected: () => updateSelectedStatus('BLOCKED'),
		unblockSelected: () => updateSelectedStatus('ACTIVE'),
		deleteSelected, deleteAllUnverified, verifyUser, isVerifyLoading, logout
	}
}