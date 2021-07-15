import axios, { AxiosError } from 'axios';
import { cookies as Cookies } from '../config/auth'
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { signOut } from '../contexts/AuthContext';
import { AuthTokenError } from './errors/AuthTokenError';

let isRefreshing = false;
let failedRequestsQueue = [];

export const baseURL = 'http://localhost:3333';

export function APIClient(ctx = undefined) {
	let cookies = parseCookies(ctx);

	const api = axios.create({
		baseURL: baseURL,
		headers: {
			Authorization: `Bearer ${cookies[Cookies.accessToken]}`
		}
	});

	api.interceptors.response.use(response => {
		return response;
	}, (error: AxiosError) => {
		if (error.response.status === 401) {
			if (error.response.data?.code === 'auth.expire') {
				cookies = parseCookies(ctx);
				const { [Cookies.refreshToken]: refreshToken } = cookies;
				const originalConfig = error.config

				if (!isRefreshing) {
					isRefreshing = true

					api.post('/sessions/refresh', {
						token: refreshToken,
					}).then(response => {
						const { token, refreshToken } = response.data;

						setCookie(ctx, Cookies.accessToken, token, {
							maxAge: 60 * 60 * 24 * 30, // 30 days
							path: '/'
						})

						setCookie(ctx, Cookies.refreshToken, refreshToken, {
							maxAge: 60 * 60 * 24 * 30, // 30 days
							path: '/'
						})

						api.defaults.headers['Authorization'] = `Bearer ${token}`;

						failedRequestsQueue.forEach(request => request.onSuccess(token))
						failedRequestsQueue = [];
					}).catch(err => {
						failedRequestsQueue.forEach(request => request.onFailure(err))
						failedRequestsQueue = [];

						if (process.browser) {
							// signOut()
						}
					}).finally(() => {
						isRefreshing = false
					});
				}

				return new Promise((resolve, reject) => {
					failedRequestsQueue.push({
						onSuccess: (token: string) => {
							originalConfig.headers['Authorization'] = `Bearer ${token}`

							resolve(api(originalConfig))
						},
						onFailure: (err: AxiosError) => {
							reject(err)
						}
					})
				});
			} else {
				if (process.browser) {
					// signOut()
				} else {
					return Promise.reject(new AuthTokenError())
				}
			}
		}

		return Promise.reject(error);
	});

	return api;
}