import Icon from "@chakra-ui/icon";
import { Badge, HStack, Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Portal, Flex } from "@chakra-ui/react";
import React from "react";
import { RiNotificationLine, RiUserAddLine } from "react-icons/ri";
import { useAuth } from "../../hooks/useAuth";
import { NotificationChooser } from "../Notification";






export function NotificationsNav() {

	const { unreadNotifications } = useAuth()


	return (
		<HStack
			spacing={["6", "8"]}
			mx={["6", "8"]}
			pr={["6", "8"]}
			py="1"
			color="gray.300"
			borderRightWidth={1}
			borderColor="gray.100"
		>

			<Popover
				arrowShadowColor="rgba(0,0,0,.1)"
			>
				<PopoverTrigger>
					<HStack
						spacing="1"
						cursor="pointer">
						<Icon
							as={RiNotificationLine}
							fontSize="20"
							color={unreadNotifications.length ? "teal.500" : "gray.100"}

						/>
						<Badge colorScheme="teal">
							{unreadNotifications.length}
						</Badge>
					</HStack>
				</PopoverTrigger>
				<Portal>
					<PopoverContent
						borderColor="gray.50"
						w="450px"
					>
						<PopoverArrow />
						<PopoverHeader borderColor="gray.50">
							Notifications ({unreadNotifications.length})
						</PopoverHeader>
						<PopoverCloseButton />
						<PopoverBody
							maxH="250px"

							as={Flex}
							direction="column"
							overflowY="auto"
						>
							{unreadNotifications.map(notification => (
								<NotificationChooser notification={notification} key={notification._id} />
							))}
						</PopoverBody>
					</PopoverContent>
				</Portal>
			</Popover>







			<Icon
				as={RiUserAddLine}
				fontSize="20"
			/>
		</HStack>
	)
}