import React, { ReactNode } from 'react';
import { Flex, FlexProps } from '@chakra-ui/react'

interface AuthenticateProps extends FlexProps {
	children: ReactNode
}


export function AuthenticateLayoutRight({ children }: AuthenticateProps) {
	return (
		<>
			{children}
		</>
	)
}


export function AuthenticateLayoutLeft({ children, ...rest }: AuthenticateProps) {
	return (
		<Flex flex="1" direction="column" px="6" {...rest}>
			{children}
		</Flex>
	)
}


export function AuthenticateLayout({ children }: AuthenticateProps) {
	return (
		<Flex
			w="100vw"
			h="calc(100vh - 92px)"
			align="center"
			justify="space-between"
			py="10"
			pb="8"
		>
			<Flex width="980px" mx="auto" my="0">
				{children}
			</Flex>
		</Flex>
	);
}

// partials
