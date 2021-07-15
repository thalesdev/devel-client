import { ElementType } from "react";
import Icon from "@chakra-ui/icon";
import { Link, LinkProps, Text } from "@chakra-ui/react";
import { ActiveLink } from "../ActiveLink";

interface NavLinkProps extends LinkProps {
	children: string;
	icon: ElementType;
	href: string;
}

export function NavLink({ children, icon, href, ...rest }: NavLinkProps) {
	return (
		<ActiveLink href={href} passHref>
			<Link display="flex" align="center" {...rest}>
				<Icon as={icon} fontSize="20" />
				<Text ml="4" fontWeight="medium">{children}</Text>
			</Link>
		</ActiveLink>
	)
}