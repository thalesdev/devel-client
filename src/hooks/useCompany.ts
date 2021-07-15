import { useContext } from "react";
import { CompanyContext } from "../contexts/CompanyContext";

export function useCompany() {
	const company = useContext(CompanyContext);
	return company;
}