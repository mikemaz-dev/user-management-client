export function formatLastSeen(date?: string | null) {
	if (!date) return '—'

	const diffMs = Date.now() - new Date(date).getTime()
	const diffSec = Math.floor(diffMs / 1000)

	if (diffSec < 60) return 'online'
	if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`
	if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} h ago`
	return `${Math.floor(diffSec / 86400)} d ago`
}
