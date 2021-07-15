import Icon from "@chakra-ui/icon";
import { Input } from "@chakra-ui/input";
import { Flex } from "@chakra-ui/layout";
import { RiSearchLine } from "react-icons/ri";

export function SearchBox() {
	return (
		<Flex
			as="label"
			flex="1"
			py="4"
			px="8"
			ml="6"
			maxWidth="400"
			alignSelf="center"
			color="gray.500"
			position="relative"
			bg="gray.50"
			borderRadius="full"
		>
			<Input
				color="gray.800"
				variant="unstyled"
				px="4"
				mr="4"
				placeholder="Search assets, units or companies"
				_placeholder={{
					color: "gray.400"
				}}
			/>
			<Icon as={RiSearchLine} fontSize="20" />
		</Flex>
	)
}