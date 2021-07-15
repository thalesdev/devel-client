import { Button, ButtonGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react"
import React, { useState } from "react"
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { EditablePopoverTextInput } from "../Form/Input"


interface CreateCompanyModalProps {
	initialRef: any
	finalRef: any
	isOpen: boolean
	onClose(): void
}


export const CreateCompanyModal: React.FC<CreateCompanyModalProps> = ({
	initialRef,
	finalRef,
	isOpen,
	onClose
}) => {

	const [running, setRunning] = useState(false)
	const [name, setName] = useState(undefined)
	const [cnpj, setCnpj] = useState(undefined)

	const toast = useToast()
	const { mutate } = useAuth()


	async function handleUpdate(e) {
		e.preventDefault()
		setRunning(true)
		try {
			await api.post(`/companies`, {
				name,
				cnpj
			})
			toast({
				title: "Company was created successful",
				duration: 5000,
				isClosable: true,
				status: "success",
				position: "top-right"
			})
			mutate()
			onClose()
		} catch (error) {
			toast({
				title: "Error on create Company",
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
		<Modal
			initialFocusRef={initialRef}
			finalFocusRef={finalRef}
			isOpen={isOpen}
			onClose={onClose}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Create your company</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<Stack spacing={4}>
						<EditablePopoverTextInput
							label="Company Name"
							id="name"
							ref={initialRef}
							defaultValue={name}
							onChange={e => setName(e.target.value)}
						/>
						<EditablePopoverTextInput
							label="Company CNPJ"
							id="model"
							defaultValue={cnpj}
							onChange={e => setCnpj(e.target.value)}
						/>
					</Stack>
				</ModalBody>

				<ModalFooter>
					<Button colorScheme="teal" onClick={handleUpdate} isLoading={running} mr={3}>
						Save
					</Button>
					<Button onClick={onClose}>Cancel</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}