import dynamic from 'next/dynamic';
import Head from 'next/head';
import { SimpleGrid, Box, Text, theme } from "@chakra-ui/react";

import { DashboardPage } from '../components/Layout/DashboardPage';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const options = {
	chart: {
		toolbar: {
			show: false,
		},
		zoom: {
			enabled: false,
		},
		foreColor: theme.colors.gray[800],
	},
	grid: {
		show: false,
	},
	dataLabels: {
		enabled: false,
	},
	tooltip: {
		enabled: false,
	},
	xAxis: {
		type: 'datetime',
		axisBorder: {
			color: theme.colors.gray[600]
		},
		axisTicks: {

			color: theme.colors.gray[600]
		},
		categories: [
			"2021-04-21T00:00:00.000Z",
			"2021-04-22T00:00:00.000Z",
			"2021-04-23T00:00:00.000Z",
			"2021-04-24T00:00:00.000Z",
			"2021-04-25T00:00:00.000Z",
			"2021-04-26T00:00:00.000Z",
			"2021-04-27T00:00:00.000Z",
		]
	},
	fill: {
		opacity: 0.3,
		type: 'gradient',
		gradient: {
			shade: 'dark',
			opacityFrom: 0.7,
			opacityTo: 0.3
		}
	}
}

const series = [
	{ name: 'series1', data: [31, 120, 10, 28, 61, 18, 109] }
];


export default function Dashboard() {
	return (
		<>
			<Head>
				<title>Devel - Dashboard</title>
			</Head>
			<DashboardPage>
				<SimpleGrid flex="1" gap="4" minChildWidth="320px" align="flex-start">
					<Box
						p={["6", "8"]}
						bg="gray.50"
						borderRadius={8}
						pb="4"
					>
						<Text fontSize="lg" mb="4">Inscritos da Semana</Text>
						<Chart type="area" height={160} options={options} series={series} />
					</Box>
					<Box
						p={["6", "8"]}
						bg="gray.50"
						borderRadius={8}
					>
						<Text fontSize="lg" mb="4">Taxa de abertura</Text>

						<Chart type="area" height={160} options={options} series={series} />
					</Box>
				</SimpleGrid>
			</DashboardPage>
		</>

	);
}