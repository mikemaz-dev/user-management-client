import { LogOut } from 'lucide-react'
import { useMemo, useState } from 'react'

import { cn } from '@/utils/cn.util'
import { formatLastSeen } from '@/utils/FormatLastSeen'
import { getUniqIdValue } from '@/utils/getUniqIdValue'

import { TableHeader } from './TableHeader'
import { Toolbar } from './Toolbar'
import { useUserActions } from './useUserAction'

export function HomePage() {
	const {
		users,
		isLoading,
		isLogoutLoading,
		currentUserId,
		selected,
		selectAll,
		toggleSelect,
		toggleSelectAll,
		hasSelected,
		blockSelected,
		unblockSelected,
		deleteSelected,
		deleteAllUnverified,
		verifyUser,
		isVerifyLoading,
		logout
	} = useUserActions()

	const [sort, setSort] = useState<TSortState>({
		field: null,
		order: null
	})

	const toggleEmailSort = () => {
		setSort(prev => {
			if (prev.field !== 'email') {
				return { field: 'email', order: 'asc' }
			}

			if (prev.order === 'asc') {
				return { field: 'email', order: 'desc' }
			}

			return { field: null, order: null }
		})
	}

	const sortedUsers = useMemo(() => {
		if (!sort.field || !sort.order) return users

		return [...users].sort((a, b) => {
			const aValue = a.email.toLowerCase()
			const bValue = b.email.toLowerCase()

			if (aValue < bValue) return sort.order === 'asc' ? -1 : 1
			if (aValue > bValue) return sort.order === 'asc' ? 1 : -1
			return 0
		})
	}, [users, sort])

	const hasUnverifiedUsers = users.some(user => user.status === 'UN_VERIFIED')

	const checkboxId = useMemo(() => getUniqIdValue(), [])

	if (isLoading) return <div className='container py-5'>Loading...</div>

	return (
		<div className='container py-5'>
			<h2 className='mb-4 text-center'>User Management</h2>

			<Toolbar
				hasSelected={hasSelected}
				hasUnverifiedUsers={hasUnverifiedUsers}
				blockSelected={blockSelected}
				unblockSelected={unblockSelected}
				deleteSelected={deleteSelected}
				deleteAllUnverified={deleteAllUnverified}
			/>

			<div className='table-responsive'>
				<table className='table'>
					<TableHeader
						users={users}
						selectAll={selectAll}
						toggleSelectAll={toggleSelectAll}
						sort={sort}
						toggleEmailSort={toggleEmailSort}
					/>
					<tbody>
						{sortedUsers.map(user => (
							<tr
								key={user.id}
								className={cn(currentUserId === user.id && 'table-primary')}
							>
								<td>
									<input
										type='checkbox'
										id={checkboxId}
										checked={!!selected[user.id]}
										onChange={() => toggleSelect(user.id)}
										className={'form-check-input'}
									/>
								</td>
								<td
									className={cn(
										user.status === 'BLOCKED' && 'text-decoration-line-through opacity-25'
									)}
								>
									{user.name ?? '—'}
								</td>
								<td className={cn(user.status === 'BLOCKED' && 'opacity-50')}>{user.email}</td>
								<td className={cn(user.status === 'BLOCKED' && 'opacity-50')}>{user.status}</td>
								<td className={cn(user.status === 'BLOCKED' && 'opacity-50')}>
									{formatLastSeen(user.lastSeen)}
								</td>
								<td>
								{user.status === 'UN_VERIFIED' ? (
									<button
										className='btn btn-sm btn-outline-success'
										onClick={() => verifyUser(user.id)}
										disabled={isVerifyLoading}
									>
										Emulate verification
									</button>
								) : (
									user.status
								)}
							</td>

							</tr>
						))}
					</tbody>
				</table>
				<button
					className='btn btn-secondary d-flex align-items-center justify-items-center gap-2'
					onClick={() => logout()}
					disabled={isLogoutLoading}
				>
					Logout
					<LogOut size={18} />
				</button>
			</div>
		</div>
	)
}
