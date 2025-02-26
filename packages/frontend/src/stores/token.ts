import axios from 'axios';
import { defineStore } from 'pinia';
import queryString from 'query-string';
import { Token, TerminusInfo } from '@bytetrade/core';
import { CurrentView } from 'src/utils/constants';

export type RootState = {
	token: Token | null;
	url: string | null;
	user: TerminusInfo;
	urlParams: any;
	currentView: string;
	requestTermiPass: boolean;
	deviceInfo: {
		isMobile: boolean;
		isVerticalScreen: boolean;
	};
};

export const useTokenStore = defineStore('token', {
	state: () => {
		return {
			token: null,
			url: null,
			user: {},
			urlParams: {},
			currentView: CurrentView.FIRST_FACTOR,
			requestTermiPass: true,
			deviceInfo: {
				isMobile: false,
				isVerticalScreen: false
			}
		} as RootState;
	},
	getters: {
		target_url(): string {
			let isLocal = false;
			if (window.location.origin.indexOf('auth.local.') > -1) {
				isLocal = true;
			}
			const name = this.user.terminusName.replace('@', '.');
			const desktopURL = 'https://desktop.' + (isLocal ? 'local.' : '') + name;

			const targetURL = this.urlParams.rd
				? decodeURIComponent(this.urlParams.rd)
				: desktopURL;
			return targetURL;
		}
	},
	actions: {
		async loadData() {
			const data: any = await axios.get(
				this.url + '/bfl/info/v1/terminus-info',
				{}
			);
			this.user = data;
		},

		async login(username: string, password: string) {
			const requestMethod = this.urlParams.rm;

			const data: Token = await axios.post(this.url + '/api/firstfactor', {
				username,
				password,
				keepMeLoggedIn: false,
				requestMethod,
				targetURL: this.target_url,
				requestTermiPass: this.requestTermiPass
			});
			this.setToken(data);
			return data;
		},

		async apiState(): Promise<boolean> {
			try {
				const data: any = await axios.get(this.url + '/api/state');
				if (data.authentication_level === 2) {
					return true;
				}
				return false;
			} catch (e) {
				return false;
			}
		},

		setToken(new_token: Token) {
			this.token = new_token;
		},

		setUrl(new_url: string | null) {
			this.url = new_url;
		},

		async secondFactor(token: string): Promise<Token> {
			const data: Token = await axios.post(
				this.url + '/api/secondfactor/totp',
				{
					targetURL: this.target_url,
					token
				}
			);
			return data;
		},

		setUrlParams() {
			let search: any = '';
			if (typeof window !== 'undefined') {
				search = queryString.parse(window.location.search);
				this.urlParams = search;
			}
		},

		getDesktopURL() {
			const name = this.user.terminusName.replace('@', '.');
			let isLocal = false;
			if (window.location.origin.indexOf('auth.local.' + name) > -1) {
				isLocal = true;
			}

			const url = 'https://desktop.' + (isLocal ? 'local.' : '') + name;
			return url;
		},

		async pingLoadData(url: string): Promise<boolean> {
			if (!url.endsWith('/')) url += '/';
			try {
				await axios.get(`${url}bfl/info/v1/terminus-info`, {
					timeout: 1000
				});
				return true;
			} catch (error) {
				return false;
			}
		}
	}
});
