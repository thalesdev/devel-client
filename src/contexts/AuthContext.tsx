import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import Router from 'next/router';

import { cache } from 'swr'
import { api } from '../services/api';
import { cookies } from '../config/auth';
import { cookies as generalCookies } from '../config/general';
import useFetch from '../hooks/useFetch';

type Notification = {
	_id: string;
	content: any;
	readAt?: Date;
}

type User = {
	email: string;
	fullname: string;
	_id: string;
	owns: any[];
	works: any[];
	notifications: Notification[]
};

type SignInCredentials = {
	email: string;
	password: string;
}

type SignUpCredentials = {
	email: string;
	fullname: string;
	password: string;
}

type AuthContextData = {
	signIn: (credentials: SignInCredentials) => Promise<void | any>;
	signUp: (credentials: SignUpCredentials) => Promise<void | any>;
	signOut: () => void;
	unreadNotifications: Notification[]
	user: User;
	isAuthenticated: boolean;
	mutate(): void
};

interface AuthProviderProps {
	children: ReactNode;
}

let authChannel: BroadcastChannel

export function signOut() {
	destroyCookie(undefined, cookies.accessToken)
	destroyCookie(undefined, cookies.refreshToken)
	destroyCookie(undefined, generalCookies.COMPANY_ID)
	console.log(cache)
	cache.clear()

	try {
		authChannel.postMessage('signOut');
	} catch { }
	Router.push('/signin')
}


export const AuthContext = createContext({} as AuthContextData)


export function AuthProvider({ children }: AuthProviderProps) {
	// const [token, setToken] = useState(undefined)
	const [initialUser, setInitialUser] = useState<User>(undefined)
	// precisa melhorar
	const { data: user, mutate } = useFetch<User>(initialUser ? '/users/me' : null)

	const unreadNotifications = useMemo(() => {
		if (user) {
			return user?.notifications.filter(not => typeof not.readAt === "undefined")
		}
		return []
	}, [user])


	const isAuthenticated = !!user;


	useEffect(() => {
		authChannel = new BroadcastChannel('auth')

		authChannel.onmessage = (message) => {
			switch (message.data) {
				case 'signOut':
					signOut();
					try {
						authChannel?.close()
					} catch {

					}
					break;
				default:
					break;
			}
		}
	}, [])

	useEffect(() => {
		const { [cookies.accessToken]: token } = parseCookies()
		if (token) {
			api.get('/users/me').then(res => {
				setInitialUser(res.data)
				// setToken(token)
			}).catch(err => err)
		}
	}, [])


	async function signIn({ email, password }: SignInCredentials) {
		try {
			const response = await api.post('/sessions', {
				email,
				password,
			})

			const { token, refreshToken, user } = response.data;

			setCookie(undefined, cookies.accessToken, token, {
				maxAge: 60 * 60 * 24 * 30, // 30 days
				path: '/'
			})

			setCookie(undefined, cookies.refreshToken, refreshToken, {
				maxAge: 60 * 60 * 24 * 30, // 30 days
				path: '/'
			})
			setInitialUser(user)
			// setToken(token)

			api.defaults.headers['Authorization'] = `Bearer ${token}`;

			Router.push('/dashboard'); // mudar pra dashboard
		} catch (err) {
			if (err.response) {
				const payload = err.response.data;
				return payload;
			}
		}
	}

	async function signUp({ email, password, fullname }: SignUpCredentials) {
		try {
			const response = await api.post('/users', {
				email,
				password,
				fullname
			})


			const { token, refreshToken, user } = response.data;

			setCookie(undefined, cookies.accessToken, token, {
				maxAge: 60 * 60 * 24 * 30, // 30 days
				path: '/'
			})

			setCookie(undefined, cookies.refreshToken, refreshToken, {
				maxAge: 60 * 60 * 24 * 30, // 30 days
				path: '/'
			})
			setInitialUser(user)
			// setToken(token)

			api.defaults.headers['Authorization'] = `Bearer ${token}`;

			Router.push('/dashboard');
		} catch (err) {
			if (err.response) {
				const payload = err.response.data;
				return payload;
			}
		}
	}

	function handleMutate() {
		mutate(data => data, true)
	}

	return (
		<AuthContext.Provider value={{
			user,
			isAuthenticated,
			signOut,
			signIn,
			signUp,
			mutate: handleMutate,
			unreadNotifications
		}}>
			{children}
		</AuthContext.Provider>
	)

}