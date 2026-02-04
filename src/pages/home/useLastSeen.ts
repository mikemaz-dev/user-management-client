import { useEffect, useRef } from 'react'

import { axiosClassic } from '@/api/axios'

export function useLastSeen() {
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		const updateLastSeen = () => axiosClassic.post('/users/last-seen')
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				updateLastSeen()
				intervalRef.current = setInterval(updateLastSeen, 60_000)
			} else {
				if (intervalRef.current) clearInterval(intervalRef.current)
			}
		}

		document.addEventListener('visibilitychange', handleVisibilityChange)
		handleVisibilityChange()

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange)
			if (intervalRef.current) clearInterval(intervalRef.current)
		}
	}, [])
}
