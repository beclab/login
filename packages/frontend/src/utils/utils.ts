function bind(obj: any, evname: any, fn: any) {
	if (obj.addEventListener) {
		obj.addEventListener(evname, fn, false);
	} else {
		obj.attachEvent('on' + evname, function () {
			fn.call(obj);
		});
	}
}

export function onload() {
	bind(window, 'message', function (e: any) {
		const data = JSON.parse(e.data);
	});
}

export function isIPHost(url: string): boolean {
	if (url.startsWith('http://')) {
		url = url.substring(7);
	} else if (url.startsWith('https://')) {
		url = url.substring(8);
	}

	const res: string[] = url.split('.');
	if (res.length == 0) {
		return false;
	}

	try {
		const r: number = parseInt(res[0]);
		if (isNaN(r)) {
			return false;
		}

		if (r >= 0 && r <= 255) {
			return true;
		}
	} catch (e) {
		return false;
	}

	return false;
}

export function isLocalHost(url: string): boolean {
	if (url.startsWith('http://localhost')) {
		return true;
	} else if (url.startsWith('https://localhost')) {
		return true;
	}

	return false;
}

export function getUrlParams(url: string) {
	const urlStr = url.split('?')[1];
	if (!urlStr) {
		return false;
	}
	const obj: any = {};
	const paramsArr = urlStr.split('&');
	for (let i = 0, len = paramsArr.length; i < len; i++) {
		const arr = paramsArr[i].split('=');
		obj[arr[0]] = arr[1];
	}
	return obj;
}

export function debounce(fn: (...args: any[]) => any, delay: number) {
	let timeout: number;

	return function (...args: any[]) {
		clearTimeout(timeout);
		timeout = window.setTimeout(() => fn(...args), delay);
	};
}
