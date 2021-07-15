/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import {
	Flex,
	Button,
	Heading,
	Text
} from "@chakra-ui/react";
import { InstitutionalHeader } from '../components/InstitutionalHeader';
import { GetServerSideProps } from 'next';
import { withSSRGuest } from '../utils/withSSRGuest';




export default function Home() {

	return (
		<>
			<Head>
				<title>Devel - A plataform to analyse and monitoring our assets</title>
			</Head>
			<Flex w="100vw" minHeight="100vh" direction="column" >
				<InstitutionalHeader />
				<Flex justify="space-evenly" w="100%" px="20" mx={0} my="auto">
					<Flex direction="column" py="60px">
						<Heading fontSize="72px" color="teal" mb="2">
							Devel
						</Heading>
						<Text fontSize="32px" color="gray.600" mb="6">
							Manage your machines in real time
						</Text>
						<Button colorScheme="teal" maxW="150px" size="lg" >
							Start Now
						</Button>
					</Flex>
					<img src="/images/home.gif" width="640px" height="640px" />
				</Flex>
			</Flex>
		</>
	)
}



export const getServerSideProps: GetServerSideProps = withSSRGuest(async () => {
	return {
		props: {}
	}
}, '/dashboard')