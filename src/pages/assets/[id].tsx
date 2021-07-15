import React, { useMemo } from "react";
import { useRouter } from "next/router";
import Head from 'next/head'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Box, Text, Flex, Avatar, HStack, VStack, Badge, SimpleGrid, Button, Icon } from "@chakra-ui/react";

import { DashboardPage } from "../../components/Layout/DashboardPage";
import { useCompany } from "../../hooks/useCompany";
import { AssetData, UnitData } from "../../contexts/CompanyContext";
import { RiEdit2Fill } from "react-icons/ri";
import { EditAssetForm } from "../../components/EditableForm/Asset";
import { EditablePopover } from "../../components/EditablePopover";

export default function ShowAsset() {
	const { query: { id } } = useRouter()
	const {
		company,
		statusToColor,
		healthToColor
	} = useCompany()

	const [asset, unit] = useMemo(() => {
		if (company) {
			const unit = company.units
				.find(unit => unit.assets.find(_asset => _asset.id === id))
			if (unit) {
				return [unit.assets.find(_asset => _asset.id === id), unit]
			}
		}
		return [{} as AssetData, {} as UnitData];

	}, [company, id])


	const healevelChartOptions = useMemo(() => {
		if (asset && asset.healthLevelAudits) {
			return ({
				title: {
					text: null
				},
				xAxis: {
					type: "datetime"
				},
				series: [{
					data: asset.healthLevelAudits.map(audit => ({
						x: new Date(audit.createdAt).getTime(),
						y: audit.value
					})),
					name: "Health Level"
				}]
			})
		}
		return null
	}, [asset])

	const statusChartOptions = useMemo(() => {
		if (asset && asset.statusAudits) {
			const rawData = asset.statusAudits.reduce((prev, current) => {
				return {
					...prev,
					[current.value]: typeof prev[current.value] !== "undefined" ? prev[current.value] + 1 : 1
				}
			}, {})
			return ({
				title: { text: null, },
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false,
					type: 'pie'
				},
				tooltip: {
					pointFormat: '<b>{point.percentage:.1f}%</b>'
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',

					}
				},
				series: [{
					colorByPoint: true,
					data: Object.entries(rawData).map(([name, value]) => ({
						name,
						y: value
					})),
					name: "Status"
				}]
			})
		}
		return null
	}, [asset])


	return (
		<>
			<Head>
				<title>Devel | {company?.name} - {asset?.name}</title>
			</Head>
			<DashboardPage>
				<Flex
					direction="column"
					flex={1}
				>
					<HStack
						p={["6", "8"]}
						bg="gray.50"
						borderRadius={8}
						pb="4"
						spacing={8}
					>
						<Avatar src={`/api/files/${asset?.fileId}`} name={asset?.name} size="xl" />
						<VStack
							flex={1}
							align="flex-start"
						>
							<Text fontSize="lg" fontWeight="bold">{asset?.name}</Text>
							<HStack spacing="6">
								<HStack>
									<Text as={Text} fontSize="lg">
										Last Health Level report
									</Text>
									<Badge colorScheme={healthToColor(asset.healthLevel)}>
										{asset?.healthLevel}
									</Badge>
								</HStack>
								<HStack >
									<Text fontSize="lg">Last Status report </Text>
									<Badge colorScheme={statusToColor(asset.status)}>
										{asset?.status}
									</Badge>
								</HStack>
								<HStack>
									<Text as={Text} fontSize="lg">
										Model
									</Text>
									<Badge>
										{asset?.model}
									</Badge>
								</HStack>
							</HStack>
							{asset.description && (
								<VStack>
									<Text fontWeight="bold">Description</Text>
									<Text>{asset.description}</Text>
								</VStack>
							)}
						</VStack>
						<Flex>
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
						</Flex>
					</HStack>

					{healevelChartOptions && (
						<Box
							p={["6", "8"]}
							bg="gray.50"
							borderRadius={8}
							pb="4"
							w="100%"
							mt="4"
						>
							<Text fontSize="lg" mb="4">Health Level over time chart</Text>
							<HighchartsReact
								highcharts={Highcharts}
								options={healevelChartOptions}
							/>
						</Box>
					)}
					{statusChartOptions && (
						<Box
							p={["6", "8"]}
							bg="gray.50"
							borderRadius={8}
							pb="4"
							mt="4"
						>
							<Text fontSize="lg" mb="4">Status chart</Text>
							<HighchartsReact
								highcharts={Highcharts}
								options={statusChartOptions}
							/>
						</Box>
					)}
				</Flex>
			</DashboardPage>
		</>
	)
}