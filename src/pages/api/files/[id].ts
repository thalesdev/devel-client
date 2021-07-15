import { NextApiRequest, NextApiResponse } from "next";
import { APIClient } from "../../../services/api-client";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {

	const { id } = req.query;
	try {
		const { data } = await APIClient().get(`/files/${id}`)
		return res.redirect(data.location)
	} catch (error) {
		console.log(error)
		return res.json({
			error: error.message
		})
	}

}