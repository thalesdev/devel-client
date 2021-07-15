import { ChakraProvider } from '@chakra-ui/react'

import { theme } from '../styles/theme'
import { AuthProvider } from '../contexts/AuthContext'
import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext'
import { CompanyProvider } from '../contexts/CompanyContext'


function MyApp({ Component, pageProps }) {
	return (
		<ChakraProvider theme={theme}>
			<AuthProvider>
				<CompanyProvider>
					<SidebarDrawerProvider>
						<Component {...pageProps} />
					</SidebarDrawerProvider>
				</CompanyProvider>
			</AuthProvider>
		</ChakraProvider>
	)
}

export default MyApp
