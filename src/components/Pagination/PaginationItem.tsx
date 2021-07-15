import { Button } from "@chakra-ui/react";

interface PaginationItemProps {
	isCurrent?: boolean;
	number: number;
}

export function PaginationItem(
	{
		isCurrent = false,
		number
	}: PaginationItemProps) {

	if (isCurrent) {
		return (
			<Button
				size="sm"
				fontSize="xs"
				width="4"
				colorScheme="teal"
				disabled
				_disabled={{
					bgColor: 'teal',
					cursor: 'default'
				}}
			>
				{number}
			</Button>
		)
	}
	return (
		<Button
			size="sm"
			fontSize="xs"
			width="4"
			bg="gray.100"
			_hover={{ bg: "gray.200" }}
		>
			{number}
		</Button>
	)
}