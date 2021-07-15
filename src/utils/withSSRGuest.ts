import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";
import { cookies as Cookies } from '../config/auth'

export function withSSRGuest<P>(fn: GetServerSideProps<P>, destination?: string) {
	return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
		const cookies = parseCookies(ctx);

		if (cookies[Cookies.accessToken]) {
			return {
				redirect: {
					destination: destination || '/',
					permanent: false,
				}
			}
		}

		return await fn(ctx)
	}
}