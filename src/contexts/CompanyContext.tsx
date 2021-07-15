import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { useState } from "react";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

import { cookies } from '../config/general';
// import { api } from '../services/api';
import useFetch from '../hooks/useFetch';
import { api } from '../services/api';
import Router from 'next/router';

interface CompanyContextProps {
	children: ReactNode;
}

export interface AssetData {
	description: string;
	fileId: string;
	healthLevel: number;
	healthLevelAudits: {
		value: number;
		id: string;
		createdAt: Date;
	}[];
	status: string;
	statusAudits: {
		value: string;
		id: string;
		createdAt: Date;
	}[]
	model: string;
	name: string;
	id: string;
}

export interface UnitData {
	name: string;
	id: string;
	assets: AssetData[];
}

interface CompanyData {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
	name: string;
	ownerId: string;
	units: UnitData[];
	employees?: {
		fullname: string;
		_id: string;
		email: string;
	}[]
}

type ColorStatusType = "green" | "yellow" | "yellow.600" | "red";
function statusToColor(status: string): ColorStatusType {
	switch (status) {
		case "Running":
			return "green";
		case "Alerting":
			return "yellow";
		default:
			return "red";
	}
}

function healthToColor(health: number): ColorStatusType {
	if (health >= 0 && health <= 33) {
		return "red";
	}
	else if (health > 33 && health <= 66) {
		return "yellow.600";
	}
	return "green"
}

interface CompanyContextData {
	company: CompanyData;
	isCompanyOwner: boolean;
	setCompany(arg0: string): void;
	deleteUnit(arg0: string): Promise<void>;
	reset(): void;
	mutate(): void,
	statusToColor(arg0: string): ColorStatusType
	healthToColor(arg0: number): ColorStatusType
};







export const CompanyContext = createContext<CompanyContextData>({} as CompanyContextData);

export function CompanyProvider({ children }: CompanyContextProps) {

	const [companyId, setCompanyId] = useState<string | undefined>();
	const { data: company, mutate: mutateData } = useFetch<CompanyData>(companyId ? `/companies/${companyId}` : null);

	const [isCompanyOwner, setIsCompanyOwner] = useState(false);
	const { user } = useAuth()

	useEffect(() => {
		const { [cookies.COMPANY_ID]: companyId } = parseCookies()
		if (companyId) {
			setCompanyId(companyId)
		}
	}, [])

	useEffect(() => {
		setIsCompanyOwner(company && user && company.ownerId === user._id)
	}, [company, user])


	function handleSetCompany(companyId: string) {
		if (user?.works.find(company => company._id === companyId) ||
			user?.owns.find(company => company._id === companyId)) {
			setCookie(undefined, cookies.COMPANY_ID, companyId, {
				maxAge: 60 * 60 * 24 * 30, // 30 days
				path: '/'
			})
			setCompanyId(companyId)
			Router.push('/dashboard')
		}
	}

	function mutateHandle(data?: CompanyData, shouldUpdate?: boolean) {
		if (data) {
			mutateData(data, shouldUpdate)
		} else {
			mutateData(d => d, true)
		}
	}

	async function deleteUnit(unitId: string) {
		if (company) {
			await api.delete(`/companies/${company._id}/units/${unitId}`)
			mutateHandle()
		}
	}
	function reset() {
		setCompanyId(undefined);
		destroyCookie(undefined, cookies.COMPANY_ID)
	}

	return (
		<CompanyContext.Provider value={{
			company: companyId ? company : undefined,
			setCompany: handleSetCompany,
			isCompanyOwner,
			mutate: mutateHandle,
			deleteUnit,
			statusToColor,
			healthToColor,
			reset,
		}}>
			{children}
		</CompanyContext.Provider>
	)
}
