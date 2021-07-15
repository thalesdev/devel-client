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
import { api } from '../../services/api';
import { InviteEmployeeForm } from '../../components/CreatableForm/InviteEmployee';




export default function EmployeeList() {

	const isWideVersion = useBreakpointValue({
		base: false,
		lg: true
	})

	const { company, mutate, isCompanyOwner } = useCompany()
	const toast = useToast()

	async function handleDelete(employeeId: string) {
		try {
			await api.delete(`/employees/${company._id}`, {
				data: {
					userId: employeeId
				}
			})
			mutate()
			toast({
				title: "Employee removed successfully",
				duration: 5000,
				isClosable: true,
				status: "success",
				position: "top-right"
			})
		} catch (error) {
			toast({
				title: "An error has occurred",
				description: error.response?.message,
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
				<title>Devel | {company?.name} - Employees</title>
			</Head>
			<Box flex="1" borderRadius={8} bg="gray.50" p="8">
				<Flex mb="8" justify="space-between" align="center">
					<Heading size="lg" fontWeight="normal">
						Employees
					</Heading>
					{isCompanyOwner && (
						<EditablePopover
							initialData={{}}
							target={
								<Button
									as="a"
									size="sm"
									fontSize="small"
									colorScheme="teal"
									leftIcon={<Icon as={RiAddLine} fontSize="20" />}
								>
									Invite Employee
								</Button>
							}
							Form={InviteEmployeeForm}
						/>
					)}
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
						{company?.employees.map(employee => (
							<Tr key={employee._id}>
								<Td>
									<Text fontWeight="bold" >
										{employee.fullname}
									</Text>
								</Td>
								<Td>
									<Text fontWeight="bold">{employee.email}</Text>
								</Td>
								{isWideVersion && (
									<>
										<Td>
											<Text fontWeight="bold">{employee._id}</Text>
										</Td>
										{isCompanyOwner && (
											<Td as={HStack} >
												<Button
													as="a"
													size="sm"
													fontSize="small"
													colorScheme="teal"
													cursor="pointer"
													leftIcon={<Icon as={RiDeleteBin7Fill} fontSize="16" />}
													onClick={(e) => handleDelete(employee._id)}
												>
													Fire
												</Button>
											</Td>
										)}
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
