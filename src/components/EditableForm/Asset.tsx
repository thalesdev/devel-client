import { Button, ButtonGroup, Stack, useToast, Select, Avatar, FormControl, Slider, SliderTrack, Box, SliderFilledTrack, SliderThumb, FormLabel, Flex } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import Upload, { UploadProps } from 'rc-upload'
import { MdGraphicEq } from 'react-icons/md'
import { useCompany } from "../../hooks/useCompany";
import { api } from "../../services/api";
import { EditablePopoverTextInput } from "../Form/Input"
import { baseURL } from "../../services/api-client";
import { CgSmartHomeWashMachine } from "react-icons/cg";

type StatusType = "Running" | "Alerting" | "Stopped"

type FileData = {
	location: string;
	id: string;
}

interface EditAssetFormProps {
	firstFieldRef: React.Ref<any>,
	onCancel(): void;
	initialData: {
		asset: {
			id: string;
			name: string;
			description: string | undefined;
			model: string;
			fileId: string;
			healthLevel: number;
			status: StatusType;
		}
		unit: {
			id: string;
		}
	}
}



export const EditAssetForm: React.FC<EditAssetFormProps> = ({ firstFieldRef, onCancel, initialData }) => {

	const [running, setRunning] = useState(false)
	const [inUpload, setInUpload] = useState(false)
	const { unit, asset } = initialData || {};
	const [name, setName] = useState(asset.name)
	const [description, setDescription] = useState(asset.description)
	const [model, setModel] = useState(asset.model)
	const [file, setFile] = useState<FileData>(undefined)
	const [healthLevel, setHealthLevel] = useState(asset.healthLevel)
	const [status, setStatus] = useState<StatusType>(asset.status)

	const { company, mutate } = useCompany()
	const toast = useToast()

	const fileReader = new window.FileReader();

	async function handleCustomRequest(option) {
		const { onSuccess, onError, file, action, onProgress } = option;

		const image: ArrayBuffer = await new Promise(resolve => {
			fileReader.onloadend = (obj) => {
				resolve(obj.target.result as ArrayBuffer)
			};
			fileReader.readAsArrayBuffer(file);
		});
		const formData = new FormData();
		formData.append('file', new Blob([image]));

		api
			.post(action, formData, {
				onUploadProgress: e => {
					onProgress({ percent: (e.loaded / e.total) * 100 });
				},
				headers: {
					'Content-Type': 'multipart/form-data'
				},
			})
			.then(response => {
				onSuccess((response as any).data);
			})
			.catch(err => {
				onError(err);
			});
	};




	const uploadConfigs: UploadProps = {
		name: "file",
		action: `${baseURL}/files`,
		onStart: () => {
			setInUpload(true)
		},
		onError: (err) => {
			toast({
				title: "Error on upload asset icon",
				duration: 5000,
				isClosable: true,
				status: "success",
				position: "top-right"
			})
			setFile(null)
			setInUpload(false)
		},
		onSuccess: (result) => {
			setFile(result as FileData)
			setInUpload(false)
		},
		beforeUpload: (file, fileList) => {
			console.log('beforeUpload', file)
			return !inUpload;
		},
		customRequest: handleCustomRequest
	}


	async function handleUpdate(e) {
		e.preventDefault()
		setRunning(true)
		try {
			await api.put(`/companies/${company._id}/units/${unit.id}/assets/${asset.id}`, {
				name,
				description: description || undefined,
				model,
				fileId: file?.id,
				healthLevel,
				status
			})
			toast({
				title: "Asset was updated successful",
				duration: 5000,
				isClosable: true,
				status: "success",
				position: "top-right"
			})
			mutate()
			onCancel()
		} catch (error) {
			toast({
				title: "Error on update Asset",
				duration: 5000,
				isClosable: true,
				status: "error",
				position: "top-right"
			})
		} finally {
			setRunning(false)
		}
	}

	useEffect(() => {
		if (asset && asset.fileId) {
			api.get(`/files/${asset.fileId}`)
				.then(res => setFile(res.data))
				.catch(err => console.log(err.response.data))
		}
	}, [asset])

	return (
		<Stack spacing={4}>
			<Upload {...uploadConfigs} style={{ margin: "auto 0" }}>
				<Box>
					<Avatar
						size="xl"
						src={file?.location}
						bg="gray.50"
						icon={<CgSmartHomeWashMachine fontSize="1.8rem" color="#333" />}
					/>
				</Box>
			</Upload>


			<EditablePopoverTextInput
				label="Asset Name"
				id="name"
				ref={firstFieldRef}
				defaultValue={name}
				onChange={e => setName(e.target.value)}
			/>
			<EditablePopoverTextInput
				label="Asset Model"
				id="model"
				defaultValue={model}
				onChange={e => setModel(e.target.value)}
			/>
			<EditablePopoverTextInput
				label="Asset Description"
				id="description"
				defaultValue={description}
				onChange={e => setDescription(e.target.value)}
			/>
			<FormControl>
				<FormLabel>Asset Health Level ({healthLevel})</FormLabel>
				<Slider
					aria-label="slider-health-level"
					defaultValue={healthLevel}
					step={1}
					min={0}
					max={100}
					onChange={(val) => setHealthLevel(val as any)}
				>
					<SliderTrack bg="gray.100">
						<SliderFilledTrack bg="teal" />
					</SliderTrack>
					<SliderThumb boxSize={6}>
						<Box color="teal" as={MdGraphicEq} />
					</SliderThumb>
				</Slider>

			</FormControl>
			<FormControl>
				<FormLabel>Asset Status</FormLabel>
				<Select
					defaultValue={status}
					onChange={e => setStatus(e.target.value as any)}
				>
					<option value="Running">
						Running
					</option>
					<option value="Alerting">
						Alerting
					</option>
					<option value="Stopped">
						Stopped
					</option>
				</Select>
			</FormControl>

			<ButtonGroup d="flex" justifyContent="flex-end">
				<Button variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button disabled={!file} colorScheme="teal" onClick={handleUpdate} isLoading={running}>
					Save
				</Button>
			</ButtonGroup>
		</Stack>
	)
}