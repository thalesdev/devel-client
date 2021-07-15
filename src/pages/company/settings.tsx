
import Head from 'next/head';
import React from 'react';

import { Box, Heading, Divider, VStack, SimpleGrid, Flex, HStack, Link, Button, useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { object, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import Router from 'next/router';

import { api } from '../../services/api';
import { Input } from '../../components/Form/Input';
import { DashboardPage } from "../../components/Layout/DashboardPage";
import { useCompany } from '../../hooks/useCompany';
import { useAuth } from '../../hooks/useAuth';


type CompanySettingsFormData = {
	name: string;
};

const companySettingsFormSchema = object().shape({
	name: string().required('Company Name is a required field'),
});

export default function Settings() {

	const { formState, handleSubmit, register } = useForm({ resolver: yupResolver(companySettingsFormSchema) })
	const { errors } = formState
	const { company, mutate, isCompanyOwner, reset } = useCompany()
	const { mutate: mutateUser } = useAuth()

	const toast = useToast()

	const handleUpdateCompany: SubmitHandler<CompanySettingsFormData> = async (values) => {
		if (company) {
			try {
				await api.put(`/companies/${company._id}`, {
					...values
				})
				toast({
					title: "Company successfully updated",
					duration: 5000,
					isClosable: true,
					status: "success",
					position: "top-right"
				})
				mutate()
				Router.push('/dashboard')
			} catch (error) {
				toast({
					title: "An error has occurred",
					description: error?.responde.data?.message,
					duration: 5000,
					isClosable: true,
					status: "error",
					position: "top-right"
				})
			}
		}
	}

	const handleDelete = async () => {
		if (company && isCompanyOwner) {
			try {
				await api.delete(`/companies/${company._id}`)
				toast({
					title: "Company successfully removed",
					duration: 5000,
					isClosable: true,
					status: "success",
					position: "top-right"
				})
				mutate()
				reset()
				mutateUser()
				Router.push('/dashboard')
			} catch (error) {
				toast({
					title: "An error has occurred",
					description: error?.responde.data?.message,
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
				<title>Devel - Company Settings</title>
			</Head>
			<Box
				flex="1"
				display="flex"
				flexDirection="column"
				borderRadius={8}
				bg="gray.50"
				p={["6", "8"]}
				as="form"
				onSubmit={handleSubmit(handleUpdateCompany)}
			>
				<Heading size="lg" fontWeight="normal">
					Company
				</Heading>
				<Divider my="6" borderColor="gray.100" />
				<VStack spacing="8">updated
					<Input
						name="name"
						label="Company Name"
						defaultValue={company?.name}
						{...register('name')}
						error={errors.name}
					/>
					<Button colorScheme="red" onClick={handleDelete}>
						Delete this company
					</Button>
				</VStack>

				<Flex flex="1" mt="8" align="flex-end" justify="flex-end">
					<HStack spacing="4">
						<Link href="/units" passHref>
							<Button as="a" colorScheme="gray">Cancelar</Button>
						</Link>
						<Button colorScheme="teal" type="submit" isLoading={formState.isSubmitting}>
							Update
						</Button>
					</HStack>
				</Flex>

			</Box>

		</DashboardPage>
	)
}