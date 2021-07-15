/* eslint-disable react-hooks/rules-of-hooks */
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
	Badge,
	Avatar,
	HStack
} from '@chakra-ui/react';
import Link from 'next/link';
import Head from 'next/head'
import dynamic from 'next/dynamic';
import { RiAddLine, RiDeleteBin7Fill, RiEdit2Fill } from 'react-icons/ri';
import { DashboardPage } from '../../components/Layout/DashboardPage';
import { Pagination } from '../../components/Pagination';
import { useCompany } from '../../hooks/useCompany';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { UnitData } from '../../contexts/CompanyContext';
import { EditablePopover } from '../../components/EditablePopover';
import { EditAssetForm } from '../../components/EditableForm/Asset';
import { api, apiCached } from '../../services/api';

const CreateAssetForm = dynamic(() =>
	import('../../components/CreatableForm/Asset').then(module => module.CreateAssetForm), {
	ssr: false
})



export default function UnitsShow() {
	const { query: { id } } = useRouter();

	const isWideVersion = useBreakpointValue({
		base: false,
		lg: true
	})



	const {
		company,
		mutate,
		statusToColor,
		healthToColor
	} = useCompany()

	const unit = useMemo<UnitData>(() => {
		if (company) {
			return company.units.find(f => f.id === id)
		}
		return null;
	}, [company, id])



	const toast = useToast()

	async function handleDelete(unitId: string, assetId: string) {
		try {
			await api.delete(`/companies/${company._id}/units/${unitId}/assets/${assetId}`)
			mutate()
			toast({
				title: "Asset removed successfully",
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
				<title>Devel - {unit?.name}</title>
			</Head>
			<Box flex="1" borderRadius={8} bg="gray.50" p="8">
				<Flex mb="8" justify="space-between" align="center">
					<Heading size="lg" fontWeight="normal">
						{`${unit?.name} - Assets`}
					</Heading>

					<EditablePopover
						target={
							<Button
								as="a"
								size="sm"
								fontSize="small"
								colorScheme="teal"
								leftIcon={<Icon as={RiAddLine} fontSize="20" />}>
								Create New Asset
							</Button>
						}
						Form={CreateAssetForm as any}
						initialData={unit}
						isLazy={false}
					/>

				</Flex>
				<Table colorScheme="whiteAlpha">
					<Thead>
						<Tr>
							<Th px={["4", "4", "6"]} color="gray.300" width="8">
							</Th>
							<Th>
								Name
							</Th>
							<Th>
								Status
							</Th>
							<Th>
								Health Level
							</Th>
						</Tr>
					</Thead>

					<Tbody>
						{unit?.assets.map(asset => (
							<Tr key={asset.id}>
								<Td px={["4", "4", "6"]}>
									<Avatar bg="gray.100" size="sm" name={asset.name} src={`/api/files/${asset.fileId}`} />
								</Td>
								<Td>
									<Box as={Link} href={`/assets/${asset.id}`} passHref>
										<Text fontWeight="bold" _hover={{ textDecoration: 'underline' }} cursor="pointer">
											{asset.name}
										</Text>
									</Box>
								</Td>
								<Td>

									<Badge ml="1" fontSize="0.8em" colorScheme={statusToColor(asset.status)}>
										{asset.status}
									</Badge>
								</Td>
								<Td>
									<Text fontWeight="bold" color={healthToColor(asset.healthLevel)}>
										{asset.healthLevel}
									</Text>
								</Td>
								<Td>
									<Td as={HStack} >
										<Button
											as="a"
											size="sm"
											fontSize="small"
											colorScheme="teal"
											cursor="pointer"
											leftIcon={<Icon as={RiDeleteBin7Fill} fontSize="16" />}
											onClick={(e) => handleDelete(unit.id, asset.id)}
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
											Form={EditAssetForm}
											initialData={{ unit, asset }}
										/>
									</Td>
								</Td>
							</Tr>
						))}

					</Tbody>
				</Table>
				<Pagination />
			</Box>

		</DashboardPage>
	);
}
