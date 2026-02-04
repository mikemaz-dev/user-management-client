import { Brush, Lock, LockOpen, Trash2 } from 'lucide-react'

interface Props {
	hasSelected: boolean
	hasUnverifiedUsers: boolean

	blockSelected: () => void
	unblockSelected: () => void
	deleteSelected: () => void
	deleteAllUnverified: () => void
}

export function Toolbar({
	hasSelected,
	hasUnverifiedUsers,
	blockSelected,
	unblockSelected,
	deleteSelected,
	deleteAllUnverified
}: Props) {
	return (
		<div className='d-flex gap-2 p-2 bg-body-tertiary'>
			<button
				className='btn btn-outline-primary'
				disabled={!hasSelected}
				onClick={blockSelected}
			>
				<Lock size={15} /> Block
			</button>
			<button
				className='btn btn-outline-primary'
				disabled={!hasSelected}
				onClick={unblockSelected}
			>
				<LockOpen size={15} />
			</button>
			<button
				className='btn btn-outline-danger'
				disabled={!hasSelected}
				onClick={deleteSelected}
			>
				<Trash2 size={15} />
			</button>
			<button
				className='btn btn-outline-danger'
				onClick={deleteAllUnverified}
				disabled={!hasUnverifiedUsers}
			>
				<Brush size={15} />
			</button>
		</div>
	)
}
