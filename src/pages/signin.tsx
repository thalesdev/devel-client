import Head from 'next/head'
import * as yup from 'yup';
import Link from 'next/link'
import { GetServerSideProps } from "next"
import { Flex, Button, Stack, Heading, Text, useToast } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { Input } from '../components/Form/Input'
import { useAuth } from "../hooks/useAuth"
import {
	AuthenticateLayout,
	AuthenticateLayoutLeft,
	AuthenticateLayoutRight
} from "../components/Layout/Authenticate"
import { InstitutionalHeader } from "../components/InstitutionalHeader"
import { withSSRGuest } from "../utils/withSSRGuest"


type SignInFormData = {
	email: string;
	password: string;
};

const signInFormSchema = yup.object().shape({
	email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
	password: yup.string().required('Senha obrigatória')
});



export default function Signin() {

	const { register, handleSubmit, formState } = useForm({
		resolver: yupResolver(signInFormSchema)
	})
	const { errors } = formState
	const { signIn } = useAuth()
	const toast = useToast()

	const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
		const error = await signIn(values);
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
				<title>Devel - Sign In</title>
			</Head>
			<>
				<InstitutionalHeader hideSign />
				<AuthenticateLayout
				>
					<AuthenticateLayoutLeft justify="center">
						<Heading as="h1" pt="10" mb="4" color="teal" fontSize="72">
							Devel
						</Heading>
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
									name="email"
									placeholder="E-mail"
									type="email"
									{...register('email', {
										required: "E-mail é requirido"
									})}
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
								Sign In
							</Button>

							<Link href="/signup" prefetch>
								<Button
									mt={6}
									colorScheme="linkedin"
									size="lg"
								>
									Create Account
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