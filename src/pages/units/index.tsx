import {
	Box,
	Flex,
	Heading,
	Button,
	Icon,
	Table,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	Text,
	useBreakpointValue,
	useToast,
	HStack
} from '@chakra-ui/react';
import Link from 'next/link';
import Head from 'next/head'
import { RiAddLine, RiDeleteBin7Fill, RiDeleteBin7Line, RiEdit2Fill, RiPencilLine } from 'react-icons/ri';
import { DashboardPage } from '../../components/Layout/DashboardPage';
import { Pagination } from '../../components/Pagination';
import { useCompany } from '../../hooks/useCompany';
import { EditablePopover } from '../../components/EditablePopover';
import { EditUnitsForm } from '../../components/EditableForm/Units';




export default function UnitsList() {

	const isWideVersion = useBreakpointValue({
		base: false,
		lg: true
	})

	const { company, deleteUnit } = useCompany()
	const toast = useToast()

	async function handleDelete(companyId: string) {
		try {
			await deleteUnit(companyId)
			toast({
				title: "Unit removed successfully",
				duration: 5000,
				isClosable: true,
				status: "success",
				position: "top-right"
			})
		} catch (error) {
			toast({
				title: "An error has occurred",
				description: error.message,
				duration: 5000,
				isClosable: true,
				status: "error",
				position: "top-right"
			})
		}
	}


	return (
		<DashboardPage>
			<Head>
				<title>Devel - Units</title>
			</Head>
			<Box flex="1" borderRadius={8} bg="gray.50" p="8">
				<Flex mb="8" justify="space-between" align="center">
					<Heading size="lg" fontWeight="normal">
						Units
					</Heading>
					<Link href="/units/create" passHref>
						<Button
							as="a"
							size="sm"
							fontSize="small"
							colorScheme="teal"
							leftIcon={<Icon as={RiAddLine} fontSize="20" />}
						>
							Create New Unit
						</Button>
					</Link>
				</Flex>
				<Table colorScheme="whiteAlpha">
					<Thead>
						<Tr>
							<Th>
								Name
							</Th>
							<Th>
								Assets
							</Th>
							{isWideVersion && (
								<>
									<Th>
										Id
									</Th>
									<Th w="8" />
								</>
							)}
						</Tr>
					</Thead>

					<Tbody>
						{company?.units.map(unit => (
							<Tr key={unit.id}>
								<Td>
									<Box as={Link} href={`/units/${unit.id}`} passHref>
										<Text fontWeight="bold" _hover={{ textDecoration: 'underline' }} cursor="pointer">
											{unit.name}
										</Text>
									</Box>
								</Td>
								<Td>
									<Text fontWeight="bold">{unit.assets.length}</Text>
								</Td>
								{isWideVersion && (
									<>
										<Td>
											<Text fontWeight="bold">{unit.id}</Text>
										</Td>
										<Td as={HStack} >
											<Button
												as="a"
												size="sm"
												fontSize="small"
												colorScheme="teal"
												cursor="pointer"
												leftIcon={<Icon as={RiDeleteBin7Fill} fontSize="16" />}
												onClick={(e) => handleDelete(unit.id)}
											>
												Delete
											</Button>
											<EditablePopover target={
												<Button
													as="a"
													size="sm"
													fontSize="small"
													colorScheme="teal"
													cursor="pointer"
													leftIcon={<Icon as={RiEdit2Fill} fontSize="16" />}>
													Edit
												</Button>}
												Form={EditUnitsForm}
												initialData={unit}
											/>
										</Td>
									</>
								)}
							</Tr>
						))}

					</Tbody>
				</Table>
				<Pagination />
			</Box>

		</DashboardPage>
	);
}
