import { setup } from "axios-cache-adapter";
import { APIClient } from "./api-client";

export const api = APIClient()

export const apiCached = setup({
	...api.defaults,
	cache: {
		maxAge: 15 * 60 * 1000 // 15min,
	}
})