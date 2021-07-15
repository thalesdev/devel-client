/* eslint-disable jsx-a11y/alt-text */
import Image from 'next/image';
import Link from 'next/link';
import {
	Flex,
	HStack,
	Menu,
	MenuList,
	Button,
} from "@chakra-ui/react";
import {
	HiOutlineChartBar,
	HiOutlineCursorClick,
	HiOutlineRefresh,
	HiOutlineShieldCheck,
	HiOutlineViewGrid
} from 'react-icons/hi'
import { NavButton, MenuNavButton, MenuNavItem } from '../Navigation';
import { ChevronDownIcon } from '@chakra-ui/icons';


import logo from '../../../public/images/devel.svg';
interface InstitutionalHeaderProps {
	hideSign?: boolean;
}


export function InstitutionalHeader({ hideSign }: InstitutionalHeaderProps) {
	return (
		<Flex
			w="100vw"
			h="92px"
			align="center"
			justify="space-between"
			px="16"
			borderColor="gray.50"
			borderBottomWidth="2px"
			borderBottomStyle="solid">

			<Link href="/" passHref>
				<Image src={logo} height="62px" width="62px" />
			</Link>

			<HStack>
				<Menu>
					<MenuNavButton rightIcon={<ChevronDownIcon />}>
						Solutions
					</MenuNavButton>
					<MenuList
						borderColor="rgba(0,0,0,0.1)"
						p={5}
					>
						<MenuNavItem
							title="Analytics"
							description="Get a better understanding of where your traffic is coming from."
							Icon={HiOutlineChartBar}
						/>
						<MenuNavItem
							title="Engagement"
							description="Speak directly to your customers in a more meaningful way."
							Icon={HiOutlineCursorClick}
						/>
						<MenuNavItem
							title="Security"
							description="Your customers' data will be safe and secure."
							Icon={HiOutlineShieldCheck}
						/>
						<MenuNavItem
							title="Integrations"
							description="Connect with third-party tools that you're already using."
							Icon={HiOutlineViewGrid}
						/>

						<MenuNavItem
							title="Automations"
							description="Build strategic funnels that will drive your customers to convert"
							Icon={HiOutlineRefresh}
						/>
					</MenuList>
				</Menu>
				<Link href="/pricing" passHref>
					<NavButton>
						Pricing
					</NavButton>
				</Link>

				<NavButton>
					Docs
				</NavButton>
			</HStack>
			<HStack>
				{!hideSign && (
					<>
						<Link href="/signin" passHref>
							<NavButton>
								Sign in
							</NavButton>
						</Link>
						<Link href="/signup" passHref>
							<Button colorScheme="teal">
								Sign up
							</Button>
						</Link>
					</>
				)}

			</HStack>
		</Flex>
	)
}