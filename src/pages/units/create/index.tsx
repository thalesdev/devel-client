
import {
	Box,
	Divider,
	Flex,
	Heading,
	VStack,
	SimpleGrid,
	HStack,
	Button,
	useToast
} from '@chakra-ui/react';
import Link from 'next/link';
import Head from 'next/head';
import Router from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';


import { Input } from '../../../components/Form/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { DashboardPage } from '../../../components/Layout/DashboardPage';
import { useCompany } from '../../../hooks/useCompany';
import { api } from '../../../services/api';


type UnitCreateFormData = {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
};

const unitCreateFormSchema = yup.object().shape({
	name: yup.string().required('Unit Name is a required field'),
});



export default function UserCreate() {

	const { formState, handleSubmit, register } = useForm({ resolver: yupResolver(unitCreateFormSchema) })
	const { errors } = formState
	const { company, mutate } = useCompany()
	const toast = useToast()

	const handleCreateUser: SubmitHandler<UnitCreateFormData> = async (values) => {
		if (company) {
			try {
				await api.post(`/companies/${company._id}/units`, {
					...values
				})
				mutate()
				toast({
					title: "Unit successfully added",
					duration: 5000,
					isClosable: true,
					status: "success",
					position: "top-right"
				})
				Router.push('/units')
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
	}

	return (
		<DashboardPage>
			<Head>
				<title>Devel - Create a Unit</title>
			</Head>
			<Box
				flex="1"
				display="flex"
				flexDirection="column"
				borderRadius={8}
				bg="gray.50"
				p={["6", "8"]}
				as="form"
				onSubmit={handleSubmit(handleCreateUser)}
			>
				<Heading size="lg" fontWeight="normal">
					Create a Unit
				</Heading>
				<Divider my="6" borderColor="gray.100" />
				<VStack spacing="8">
					<SimpleGrid minChildWidth="240px" spacing={["6", "8"]} width="100%">
						<Input
							name="name"
							label="Unit Name"
							{...register('name')}
							error={errors.name}
						/>
					</SimpleGrid>
				</VStack>

				<Flex flex="1" mt="8" align="flex-end" justify="flex-end">
					<HStack spacing="4">
						<Link href="/units" passHref>
							<Button as="a" colorScheme="gray">Cancelar</Button>
						</Link>
						<Button colorScheme="teal" type="submit" isLoading={formState.isSubmitting}>
							Create
						</Button>
					</HStack>
				</Flex>

			</Box>

		</DashboardPage>
	);
}
