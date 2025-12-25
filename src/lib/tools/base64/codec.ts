export function encodeBase64(input: string): string {
	const bytes = new TextEncoder().encode(input);
	let binary = '';
	bytes.forEach((byte) => {
		binary += String.fromCharCode(byte);
	});
	return btoa(binary);
}

export function decodeBase64(input: string): string {
	const normalized = input.replace(/\s+/g, '');
	const binary = atob(normalized);
	const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
	return new TextDecoder().decode(bytes);
}
