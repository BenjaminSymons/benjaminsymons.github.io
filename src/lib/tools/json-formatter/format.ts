export function formatJson(input: string, indent: number, sortKeys: boolean): string {
	const obj = JSON.parse(input);

	const normalised = sortKeys ? sortObject(obj) : obj;
	return JSON.stringify(normalised, null, indent) + '\n';
}

function sortObject(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(sortObject);
	if (value && typeof value === 'object') {
		const entries = Object.entries(value as Record<string, unknown>)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([k, v]) => [k, sortObject(v)]);
		return Object.fromEntries(entries);
	}
	return value;
}
