export type TableData = {
	headers: string[];
	rows: string[][];
};

export type TableOutput = 'markdown' | 'html' | 'jira';

export function parseCsv(input: string): TableData {
	const rows = parseCsvRows(input);
	if (!rows.length) return { headers: [], rows: [] };
	const headers = rows[0];
	const body = rows.slice(1);
	return normalizeTable({ headers, rows: body });
}

export function parseJson(input: string, arrayHeaders: boolean): TableData {
	const parsed = JSON.parse(input) as unknown;
	if (Array.isArray(parsed)) {
		if (parsed.length === 0) return { headers: [], rows: [] };
		if (parsed.every((item) => Array.isArray(item))) {
			const rows = parsed as unknown[][];
			const headers = arrayHeaders ? (rows[0] ?? []).map((cell) => stringifyCell(cell)) : [];
			const body = arrayHeaders ? rows.slice(1) : rows;
			return normalizeTable({ headers, rows: body.map((row) => row.map((cell) => stringifyCell(cell))) });
		}

		if (parsed.every((item) => item && typeof item === 'object' && !Array.isArray(item))) {
			const records = parsed as Record<string, unknown>[];
			const headers = collectHeaders(records);
			const rows = records.map((record) =>
				headers.map((key) => stringifyCell(record[key]))
			);
			return normalizeTable({ headers, rows });
		}
	}

	if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
		const record = parsed as Record<string, unknown>;
		const headers = Object.keys(record);
		const rows = [headers.map((key) => stringifyCell(record[key]))];
		return normalizeTable({ headers, rows });
	}

	throw new Error('Unsupported JSON shape. Use an array of objects or arrays.');
}

export function tableToOutput(data: TableData, format: TableOutput): string {
	if (format === 'html') return toHtml(data);
	if (format === 'jira') return toJira(data);
	return toMarkdown(data);
}

function parseCsvRows(input: string): string[][] {
	const rows: string[][] = [];
	let row: string[] = [];
	let cell = '';
	let inQuotes = false;

	for (let i = 0; i < input.length; i += 1) {
		const char = input[i];
		if (inQuotes) {
			if (char === '"') {
				const next = input[i + 1];
				if (next === '"') {
					cell += '"';
					i += 1;
				} else {
					inQuotes = false;
				}
			} else {
				cell += char;
			}
			continue;
		}

		if (char === '"') {
			inQuotes = true;
			continue;
		}

		if (char === ',') {
			row.push(cell);
			cell = '';
			continue;
		}

		if (char === '\n') {
			row.push(cell);
			cell = '';
			rows.push(row);
			row = [];
			continue;
		}

		if (char === '\r') {
			continue;
		}

		cell += char;
	}

	if (cell.length > 0 || row.length > 0) {
		row.push(cell);
		rows.push(row);
	}

	return rows.map((parsedRow) => parsedRow.map((value) => value.trim()));
}

function collectHeaders(records: Record<string, unknown>[]): string[] {
	const headers: string[] = [];
	records.forEach((record) => {
		Object.keys(record).forEach((key) => {
			if (!headers.includes(key)) headers.push(key);
		});
	});
	return headers;
}

function normalizeTable(data: TableData): TableData {
	const columnCount = Math.max(
		data.headers.length,
		...data.rows.map((row) => row.length),
		0
	);
	const headers = data.headers.length
		? padRow(data.headers, columnCount)
		: Array.from({ length: columnCount }, (_, index) => `Column ${index + 1}`);
	const rows = data.rows.map((row) => padRow(row, columnCount));
	return { headers, rows };
}

function padRow(row: string[], length: number): string[] {
	const next = [...row];
	while (next.length < length) next.push('');
	return next;
}

function stringifyCell(value: unknown): string {
	if (value === null || value === undefined) return '';
	if (typeof value === 'string') return value;
	if (typeof value === 'number' || typeof value === 'boolean') return String(value);
	return JSON.stringify(value);
}

function normalizeCell(value: string): string {
	return value.replace(/\r\n/g, '\n').replace(/\n/g, '<br>');
}

function escapePipe(value: string): string {
	return normalizeCell(value).replace(/\|/g, '\\|');
}

function toMarkdown(data: TableData): string {
	if (!data.headers.length) return '';
	const headerLine = `| ${data.headers.map(escapePipe).join(' | ')} |`;
	const separatorLine = `| ${data.headers.map(() => '---').join(' | ')} |`;
	const rows = data.rows.map((row) => `| ${row.map(escapePipe).join(' | ')} |`);
	return [headerLine, separatorLine, ...rows].join('\n') + '\n';
}

function toJira(data: TableData): string {
	if (!data.headers.length) return '';
	const headerLine = `|| ${data.headers.map(escapePipe).join(' || ')} ||`;
	const rows = data.rows.map((row) => `| ${row.map(escapePipe).join(' | ')} |`);
	return [headerLine, ...rows].join('\n') + '\n';
}

function toHtml(data: TableData): string {
	if (!data.headers.length) return '';
	const headerCells = data.headers.map((cell) => `<th>${escapeHtml(normalizeCell(cell))}</th>`).join('');
	const bodyRows = data.rows
		.map((row) =>
			`<tr>${row.map((cell) => `<td>${escapeHtml(normalizeCell(cell))}</td>`).join('')}</tr>`
		)
		.join('');

	return `<table>\n\t<thead>\n\t\t<tr>${headerCells}</tr>\n\t</thead>\n\t<tbody>${bodyRows}</tbody>\n</table>\n`;
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}
