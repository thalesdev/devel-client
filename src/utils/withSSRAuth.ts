import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";
import { cookies as Cookies } from '../config/auth'

// discontinued
type WithSSRAuthOptions = {
	permissions?: string[];
	roles?: string[];
}

export function withSSRAuth<P>(fn: GetServerSideProps<P>, options?: WithSSRAuthOptions) {
	return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
		const cookies = parseCookies(ctx);
		const token = cookies[Cookies.accessToken];

		if (!token) {
			return {
				redirect: {
					destination: '/signin',
					permanent: false,
				}
			}
		}

		try {
			return await fn(ctx)
		} catch (err) {
			if (err instanceof AuthTokenError) {
				destroyCookie(ctx, Cookies.accessToken)
				destroyCookie(ctx, Cookies.refreshToken)

				return {
					redirect: {
						destination: '/signin',
						permanent: false,
					}
				}
			}
		}
	}
}