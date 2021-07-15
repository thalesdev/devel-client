import { Box, Stack, Text } from "@chakra-ui/react";

interface NavSectionProps {
	children: React.ReactNode;
	title: string;
}

export function NavSection({ children, title }: NavSectionProps) {
	return (
		<Box>
			<Text fontWeight="bold" color="gray.400" fontSize="samll">{title}</Text>
			<Stack spacing="4" mt="8" align="stretch">
				{children}
			</Stack>
		</Box >
	)
}