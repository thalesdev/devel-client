import { Avatar } from "@chakra-ui/avatar";
import { IoCaretDown } from "react-icons/io5";
import { HiLogout, HiOutlineCog, HiUserCircle } from 'react-icons/hi'
import { Box, Text, Menu, MenuButton, MenuList, PopoverArrow, IconButton, Icon, HStack } from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import { MenuNavItem } from "../Navigation";

interface ProfileProps {
	showProfileData?: boolean;
}
export function Profile({ showProfileData = true }: ProfileProps) {

	const { user, signOut } = useAuth()

	return (
		<Menu>
			<MenuButton>
				<HStack spacing="4" align="center"  >
					{showProfileData && (
						<Box textAlign="right">
							<Text>{user?.fullname}</Text>
							<Text color="gray.300" fontSize="small">
								{user?.email}
							</Text>
						</Box>
					)}
					<Avatar size="md" name="Thales de Oliveira" src="https://github.com/thalesdev.png" />
					<IconButton
						icon={<Icon as={IoCaretDown} color="gray.200" />}
						aria-label="Down Icon"
						variant="unstyled"
					/>
				</HStack>
			</MenuButton>
			<MenuList
				borderColor="rgba(0,0,0,0.05)"
				p={4}
			>
				<MenuNavItem Icon={HiUserCircle} title="My Profile" />
				<MenuNavItem Icon={HiLogout} title="Sign Out" onClick={(e) => signOut()} />
			</MenuList>
		</Menu>
	)
}