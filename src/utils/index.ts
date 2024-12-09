export const normalizePath = (pathname: string): string => {
	return decodeURIComponent(pathname).replace(/\/+$/, '')
}
