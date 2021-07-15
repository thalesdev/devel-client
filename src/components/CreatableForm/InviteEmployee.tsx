import { Button, ButtonGroup, Stack, useToast, Select, Avatar, FormControl, Slider, SliderTrack, Box, SliderFilledTrack, SliderThumb, FormLabel, Flex } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import Upload, { UploadProps } from 'rc-upload'
import { MdGraphicEq } from 'react-icons/md'
import { useCompany } from "../../hooks/useCompany";
import { api } from "../../services/api";
import { EditablePopoverTextInput } from "../Form/Input"
import { baseURL } from "../../services/api-client";
import { FaImage } from "react-icons/fa";
import { CgSmartHomeWashMachine } from "react-icons/cg";

type StatusType = "Running" | "Alerting" | "Stopped"

type FileData = {
	location: string;
	id: string;
}

interface InviteEmployeeFormProps {
	firstFieldRef: React.Ref<any>,
	onCancel(): void;
	initialData: {}
}


export const InviteEmployeeForm: React.FC<InviteEmployeeFormProps> = ({
	firstFieldRef,
	onCancel,
	initialData
}) => {

	const [running, setRunning] = useState(false)
	const [email, setEmail] = useState(undefined)

	const { company, mutate } = useCompany()
	const toast = useToast()

	async function handleInvite(e) {
		e.preventDefault()
		setRunning(true)
		try {
			await api.post(`/employees/${company._id}/invite`, {
				email
			})
			toast({
				title: "Employee was invited successful",
				duration: 5000,
				isClosable: true,
				status: "success",
				position: "top-right"
			})
			mutate()
			onCancel()
		} catch (error) {
			toast({
				title: "Error on invite employee",
				description: error?.response.data?.message,
				duration: 5000,
				isClosable: true,
				status: "error",
				position: "top-right"
			})
		} finally {
			setRunning(false)
		}
	}

	return (
		<Stack spacing={4}>

			<EditablePopoverTextInput
				label="User email"
				id="email"
				ref={firstFieldRef}
				defaultValue={email}
				onChange={e => setEmail(e.target.value)}
			/>

			<ButtonGroup d="flex" justifyContent="flex-end">
				<Button variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button colorScheme="teal" onClick={handleInvite} isLoading={running}>
					Invite
				</Button>
			</ButtonGroup>
		</Stack>
	)
}