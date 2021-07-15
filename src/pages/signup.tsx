import * as yup from 'yup';
import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from "next"
import { Flex, Button, Stack, Heading, Text, useToast } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { withSSRGuest } from "../utils/withSSRGuest"
import { Input } from '../components/Form/Input'
import {
	AuthenticateLayout,
	AuthenticateLayoutLeft,
	AuthenticateLayoutRight
} from "../components/Layout/Authenticate"
import { InstitutionalHeader } from "../components/InstitutionalHeader"
import { useAuth } from "../hooks/useAuth"


type SignInFormData = {
	email: string;
	fullname: string;
	password: string;
};

const signUpFormSchema = yup.object().shape({
	email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
	password: yup.string().required('Senha obrigatória'),
	fullname: yup.string().required('Nome completo obrigatório')
});



export default function Signup() {

	const { register, handleSubmit, formState } = useForm({
		resolver: yupResolver(signUpFormSchema)
	})
	const { errors } = formState
	const { signUp } = useAuth()
	const toast = useToast()

	const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
		const error = await signUp(values);
		if (error) {
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
		<>
			<Head>
				<title>Devel - Sign Up</title>
			</Head>
			<>
				<InstitutionalHeader hideSign />
				<AuthenticateLayout
				>
					<AuthenticateLayoutLeft justify="center">
						<Heading as="h1" pt="10" mb="4" fontSize="72" color="teal">Devel</Heading>
						<Text lineHeight="10" fontSize="32px">
							Analyze the status of your machines in real time and manage your group of machines and users.
						</Text>
					</AuthenticateLayoutLeft>
					<AuthenticateLayoutRight>
						<Flex
							as="form"
							w="100%"
							maxWidth={360}
							bg="gray.50"
							p="8"
							borderRadius={8}
							flexDir="column"
							onSubmit={handleSubmit(handleSignIn)}
							onKeyPress={() => {

							}}
						>

							<Stack spacing="4">
								<Input
									name="fullname"
									placeholder="Nome completo"
									type="text"
									{...register('fullname')}
									error={errors.username}
								/>
								<Input
									name="email"
									placeholder="E-mail"
									type="email"
									{...register('email')}
									error={errors.email}
								/>
								<Input
									name="password"
									placeholder="Senha"
									type="password"
									{...register('password')}
									error={errors.password}
								/>

							</Stack>

							<Button
								type="submit"
								mt={6}
								colorScheme="teal"
								size="lg"
								isLoading={formState.isSubmitting}
							>
								Sign Up
							</Button>
							<Link href="/signin" passHref>
								<Button
									mt={6}
									variant="solid"
									bg="transparent !important"
									size="lg"
								>
									Alreay have account
								</Button>
							</Link>
						</Flex>

					</AuthenticateLayoutRight>
				</AuthenticateLayout>
			</>
		</>
	)
}



export const getServerSideProps: GetServerSideProps = withSSRGuest(async () => {
	return {
		props: {}
	}
}, '/dashboard')