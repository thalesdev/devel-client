import { Button, Flex, HStack, IconButton, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
import { useAuth } from "../../hooks/useAuth";
import { useCompany } from "../../hooks/useCompany";
import { api } from "../../services/api";

interface InviteNotificationProps {
	notification: {
		_id: string;
		content: {
			message: string;
			userId: string;
			companyId: string;
		};
	}
}

export function InviteNotification({ notification }: InviteNotificationProps) {
	const { content: { message, userId, companyId } } = notification;
	const { company, mutate: mutateCompany } = useCompany()
	const { mutate: mutateUser } = useAuth()
	const toast = useToast()

	async function handleAccept() {
		try {
			await api.post(`/employees/${company._id}/accept`, {
				notificationId: notification._id
			})
			mutateUser()
			mutateCompany()
			toast({
				title: "Invitation accepted successfully",
				duration: 5000,
				isClosable: true,
				status: "success",
				position: "top-right"
			})
		} catch (error) {
			toast({
				title: "Invitation was not accepted successfully",
				description: error?.response.data?.message,
				duration: 5000,
				isClosable: true,
				status: "error",
				position: "top-right"
			})
		}
	}



	return (
		<Flex
			borderBottomWidth="1px"
			borderBottomColor="gray.50"
			p={6}
			px={2}
			width="100%"
			direction="column"
			justify="center"
			align="space-between"
		>
			<Text>
				{message}
			</Text>
			<HStack spacing="2" mt="2">
				<Button
					colorScheme="teal"
					leftIcon={<AiOutlineCheck />}
					aria-label="Accept invite"
					onClick={handleAccept}
				>
					Accept Invite
				</Button>
				<Button
					leftIcon={<AiOutlineClose />}
					aria-label="Decline invite"
				>
					Decline Invite
				</Button>
			</HStack>
		</Flex>
	)
}