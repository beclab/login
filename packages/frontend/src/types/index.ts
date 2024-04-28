import { Token, TerminusInfo } from '@bytetrade/core';

export type RootState = {
	token: Token | null;
	url: string | null;
	user: TerminusInfo;
	urlParams: any;
	currentView: string;
	requestTermiPass: boolean;
};
