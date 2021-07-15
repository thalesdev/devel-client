import React, { useMemo } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Menu, MenuDivider, MenuList, Stack, Button, Badge, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter } from "@chakra-ui/react";
import { FaUsers, FaWarehouse } from 'react-icons/fa'
import { GoSettings } from 'react-icons/go'
import { RiDashboardLine } from "react-icons/ri";

import { useAuth } from "../../hooks/useAuth";
import { useCompany } from "../../hooks/useCompany";
import { MenuNavButton, MenuNavItem } from "../Navigation";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";
// import { EditablePopover } from "../EditablePopover";
import { CreateCompanyModal } from "../Modal/Company";
import { HiOutlineBriefcase, HiViewGridAdd } from "react-icons/hi";


export function SidebarNav() {

	const { user } = useAuth()

	const { isOpen, onOpen, onClose } = useDisclosure()

	const { isCompanyOwner, company, setCompany } = useCompany()

	const initialRef = React.useRef()
	const finalRef = React.useRef()

	const companies = useMemo(() => {
		if (user?.owns.length) {
			return user?.owns.map(c => ({ ...c, own: true })) || []
		} else {
			return user?.works.map(c => ({ ...c, own: false })) || []
		}
	}, [user])

	return (
		<Stack spacing="12" align="flex-start">

			<Menu>
				<MenuNavButton
					as={Button}
					rightIcon={<ChevronDownIcon />}
					ref={finalRef}
				>
					{company ? company.name : "Choose a Company"}
				</MenuNavButton>
				<MenuList
					borderColor="rgba(0,0,0,0.1)"
					p={6}
				>
					{companies.map(company => (
						<MenuNavItem
							hoverEffects
							Icon={HiOutlineBriefcase}
							title={company.name}
							key={company._id}
							extraContent={
								<Badge ml="1" colorScheme="green">
									{company.own ? "Owner" : "Employee"}
								</Badge>
							}
							onClick={() => setCompany(company._id)}
						/>
					))}
					<MenuDivider bg="gray.100" />
					<MenuNavItem onClick={onOpen} Icon={HiViewGridAdd} title="Create a Company" />

				</MenuList>
			</Menu>
			{company && (
				<>
					<NavSection title="GENERAL">
						<NavLink icon={RiDashboardLine} href="/dashboard">Overview</NavLink>
						<NavLink icon={FaWarehouse} href="/units">Units</NavLink>

					</NavSection>
					{isCompanyOwner && (
						<NavSection title="COMPANY">
							<NavLink icon={FaUsers} href="/company/employees" >Employees</NavLink>
							<NavLink icon={GoSettings} href="/company/settings">Settings</NavLink>
						</NavSection>
					)}
				</>
			)}

			<CreateCompanyModal
				onClose={onClose}
				isOpen={isOpen}
				initialRef={initialRef}
				finalRef={finalRef}
			/>


		</Stack>
	)
}