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
		id: 'html-to-markdown',
		name: 'HTML to Markdown',
		route: '/tools/html-to-markdown',
		description: 'Convert HTML into clean Markdown.'
	},
	{
		id: 'base64',
		name: 'Base64 encoder/decoder',
		route: '/tools/base64',
		description: 'Encode or decode Base64 strings.'
	},
	{
		id: 'table-converter',
		name: 'Table converter',
		route: '/tools/table-converter',
		description: 'Turn CSV or JSON into HTML, Markdown, or JIRA tables.'
	},
	{
		id: 'diff',
		name: 'Diff checker',
		route: '/tools/diff',
		description: 'Compare two texts (worker-based).'
	}
];
