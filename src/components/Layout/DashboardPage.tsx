import { Flex } from "@chakra-ui/react";
import { Header } from "../Header";
import { SideBar } from "../SideBar";

interface DashboardPageProps {
	children: React.ReactNode;
}

export function DashboardPage({ children }: DashboardPageProps) {
	return (
		<Flex direction="column" h="100vh">
			<Header />
			<Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
				<SideBar />
				{children}
			</Flex>
		</Flex>
	)
}