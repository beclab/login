export enum SecondFactorMethod {
	TOTP = 'totp',
	Webauthn = 'webauthn',
	MobilePush = 'mobilePush',
	TerminusPass = 'terminus_pass'
}

export enum CurrentView {
	FIRSTLOGIN = 'FirstLogin',
	SECONDFACTORFORM = 'SecondFactorForm',
	MOBILEVERIFICATION = 'MobileVerification'
}
