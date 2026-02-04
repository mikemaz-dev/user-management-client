import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'

import { IUser } from '@/types/user.types'

interface Props {
	users: IUser[]
	selectAll: boolean
	toggleSelectAll: (users: IUser[]) => void
	sort: TSortState
	toggleEmailSort: () => void
}

export function TableHeader({ users, selectAll, toggleSelectAll, sort, toggleEmailSort }: Props) {
	return (
		<thead>
			<tr>
				<th>
					<input
						type='checkbox'
						checked={selectAll}
						onChange={() => toggleSelectAll(users)}
						className='form-check-input'
					/>
				</th>
				<th>Name</th>
				<th className='text-left'>
					<button
						type='button'
						onClick={toggleEmailSort}
						className='select-none p-0 btn btn-primary bg-transparent text-black border-0 d-flex gap-1 align-items-center'
					>
						Email
						{sort.field === 'email' && sort.order === 'asc' && (
							<ArrowUpIcon
								size={18}
								className='opacity-50'
							/>
						)}
						{sort.field === 'email' && sort.order === 'desc' && (
							<ArrowDownIcon
								size={18}
								className='opacity-50'
							/>
						)}
						{sort.field !== 'email' && (
							<ArrowUpDownIcon
								size={18}
								className='opacity-50'
							/>
						)}
					</button>
				</th>
				<th>Status</th>
				<th>Last login</th>
			</tr>
		</thead>
	)
}
