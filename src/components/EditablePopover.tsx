import {
	Popover,
	PopoverArrow,
	PopoverCloseButton,
	PopoverContent,
	PopoverTrigger,
	useDisclosure
} from "@chakra-ui/react"
import React from "react"
import FocusLock from "react-focus-lock"


interface FormProps {
	firstFieldRef: React.Ref<any>
	onCancel(): void
}

interface EditablePopoverProps {
	target?: React.ReactNode;
	Form: React.FC<any>
	initialData: any
	isLazy?: boolean
}



export function EditablePopover({ target, Form, initialData, isLazy = true }: EditablePopoverProps) {
	const { onOpen, onClose, isOpen } = useDisclosure()
	const firstFieldRef = React.useRef(null)


	return (
		<>
			<Popover
				isOpen={isOpen}
				initialFocusRef={firstFieldRef}
				onOpen={onOpen}
				onClose={onClose}
				placement="right"
				closeOnBlur={false}
				isLazy={isLazy}
			>
				<PopoverTrigger>
					{target}
				</PopoverTrigger>
				<PopoverContent p={5}>
					<FocusLock returnFocus persistentFocus={false}>
						<PopoverArrow />
						<PopoverCloseButton />
						<Form firstFieldRef={firstFieldRef} onCancel={onClose} initialData={initialData} />
					</FocusLock>
				</PopoverContent>
			</Popover>
		</>
	)
}