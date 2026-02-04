import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { CookiesProvider } from 'react-cookie'

export default function Providers({ children }: { children: ReactNode }) {
	const [client] = useState(new QueryClient())

	return (
		<QueryClientProvider client={client}>
			<CookiesProvider>
				<div className='min-h-screen'>{children}</div>
			</CookiesProvider>
		</QueryClientProvider>
	)
}
