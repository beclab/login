import axios from 'axios';
import { defineStore } from 'pinia';
import queryString from 'query-string';
import { Token } from '@bytetrade/core';
import { Encoder } from '../utils/encoder';
import { CurrentView } from 'src/constants/index';
import { RootState } from 'src/types/index';

function stringToIntHash(str: string, lowerbound: number, upperbound: number) {
	if (!str) {
		return lowerbound;
	}

	let result = 0;
	for (let i = 0; i < str.length; i++) {
		result = result + str.charCodeAt(i);
	}

	if (!lowerbound) lowerbound = 0;
	if (!upperbound) upperbound = 500;

	return (result % (upperbound - lowerbound)) + lowerbound;
}

const useGlobalCDN = false;

export const useTokenStore = defineStore('token', {
	state: () => {
		return {
			token: null,
			url: null,
			user: {},
			urlParams: {},
			currentView: CurrentView.FIRSTLOGIN,
			requestTermiPass: true
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
		},
		avatar_url(): string {
			if (!this.user || !this.user.terminusName) {
				return 'https://file.bttcdn.com/avatar3/1.png';
			}

			if (!this.user.avatar) {
				const id = stringToIntHash(this.user.terminusName, 1, 36);
				if (useGlobalCDN) {
					return `https://file.bttcdn.com/avatar3/${id}.png`;
				} else {
					return (
						'https://' +
						this.user.terminusName.replace('@', '.') +
						`/avatar/${id}.png`
					);
				}
			}

			if (this.user.avatar.startsWith('http')) {
				return this.user.avatar;
			} else {
				const re = new RegExp('^[1-3]?[0-9]\\.png');
				if (re.test(this.user.avatar)) {
					if (useGlobalCDN) {
						return 'https://file.bttcdn.com/avatar3/' + this.user.avatar;
					} else {
						return (
							'https://' +
							this.user.terminusName.replace('@', '.') +
							'/avatar/' +
							this.user.avatar
						);
					}
				} else {
					try {
						const vp = JSON.parse(this.user.avatar);
						if (vp) {
							const vcstr = Encoder.bytesToString(
								Encoder.base64UrlToBytes(
									vp.verifiableCredential![0].split('.')[1]
								)
							);
							const vc = JSON.parse(vcstr);
							let imageUrl = vc.vc.credentialSubject.image;
							if (imageUrl.startsWith('ipfs://')) {
								imageUrl = imageUrl.replace(
									'ipfs://',
									'https://gateway.ipfs.io/ipfs/'
								);
							}

							return imageUrl;
						} else {
							return 'https://file.bttcdn.com/avatar3/1.png';
						}
					} catch (e) {
						return 'https://file.bttcdn.com/avatar3/1.png';
					}
				}
			}
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

		async cert_secondfactor_totp(token: string): Promise<Token> {
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
