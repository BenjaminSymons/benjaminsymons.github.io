import type { RouteId } from '$app/types';

export type ToolInfo = {
	id: string;
	name: string;
	route: RouteId;
	description: string;
};

export const TOOLS: ToolInfo[] = [
	{
		id: 'json-formatter',
		name: 'JSON formatter',
		route: '/tools/json-formatter',
		description: 'Prettify/minify JSON with options.'
	},
	{
		id: 'diff',
		name: 'Diff checker',
		route: '/tools/diff',
		description: 'Compare two texts (worker-based).'
	}
];
