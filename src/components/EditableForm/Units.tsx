import { Button, ButtonGroup, Stack, useToast, Select } from "@chakra-ui/react"
import React, { useState } from "react"
import { useCompany } from "../../hooks/useCompany";
import { api } from "../../services/api";
import { EditablePopoverTextInput } from "../Form/Input"

interface EditUnitsFormProps {
	firstFieldRef: React.Ref<any>,
	onCancel(): void;
	initialData: {
		name: string;
		id: string;
	}
}


export const EditUnitsForm: React.FC<EditUnitsFormProps> = ({ firstFieldRef, onCancel, initialData }) => {

	const [running, setRunning] = useState(false)
	const { name, id } = initialData;
	const [editName, setEditName] = useState(name)
	const { company, mutate } = useCompany()
	const toast = useToast()

	async function handleUpdate(e) {
		e.preventDefault()
		setRunning(true)
		try {
			await api.put(`/companies/${company._id}/units/${id}`, {
				name: editName,
			})
			toast({
				title: "Unit was updated successful",
				duration: 5000,
				isClosable: true,
				status: "success",
				position: "top-right"
			})
			mutate()
			onCancel()
		} catch (error) {
			toast({
				title: "Error on update Player",
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
				label="Unit Name"
				id="name"
				ref={firstFieldRef}
				defaultValue={name}
				onChange={e => setEditName(e.target.value)}
			/>
			<ButtonGroup d="flex" justifyContent="flex-end">
				<Button variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button colorScheme="teal" onClick={handleUpdate} isLoading={running}>
					Save
				</Button>
			</ButtonGroup>
		</Stack>
	)
}