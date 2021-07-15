/* eslint-disable react/display-name */
import { forwardRef } from "react"
import { ButtonProps, Button, MenuButton, MenuButtonProps, MenuItem, Flex, Text, MenuItemProps } from "@chakra-ui/react"




interface NavButtonProps extends ButtonProps {
	children: React.ReactNode;
}
interface MenuNavButtonProps extends MenuButtonProps, ButtonProps {
	children: React.ReactNode;
}

interface MenuNavItemProps extends MenuItemProps {
	Icon: any;
	title: string;
	hoverEffects?: boolean;
	extraContent?: React.ReactNode;
	description?: string;
}


export const NavButton = forwardRef(({ children, ...rest }: NavButtonProps, ref) => (
	<Button
		variant="solid"
		bg="transparent !important"
		_hover={{ color: "gray.800" }}
		color="gray.500"
		{...rest}
	>
		{children}
	</Button>
))

export const MenuNavButton = forwardRef(({ children, ...rest }: MenuNavButtonProps, ref) => (
	<MenuButton
		as={Button}
		variant="solid"
		bg="transparent !important"
		_hover={{ color: "gray.800" }}
		color="gray.500"
		{...rest}
	>
		{children}
	</MenuButton>
))

export const MenuNavItem = forwardRef(({ Icon, title, description, hoverEffects, extraContent, ...rest }: MenuNavItemProps, ref: any) => {
	return (
		<MenuItem
			{...rest}
			ref={ref}
			icon={<Icon as={Icon} color="teal" fontSize="28px" />}
			py={4}
			bg="transparent !important"
			_hover={{ opacity: hoverEffects ? "0.7" : "transparent" }}
		>
			<Flex direction="column" ml="2">
				<Text
					fontWeight={500}
					fontSize="1rem"
				>
					{title}
				</Text>
				{description && (
					<Text color="gray.500">
						{description}
					</Text>
				)}
			</Flex>
			{extraContent}
		</MenuItem>
	)
}
);
