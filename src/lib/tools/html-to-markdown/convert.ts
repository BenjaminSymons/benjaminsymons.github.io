const BLOCK_TAGS = new Set([
	'p',
	'div',
	'section',
	'article',
	'header',
	'footer',
	'aside',
	'nav'
]);

export function htmlToMarkdown(input: string): string {
	if (!input.trim()) return '';
	if (typeof DOMParser === 'undefined') return input.trim() + '\n';

	const doc = new DOMParser().parseFromString(input, 'text/html');
	const content = serializeChildren(doc.body, { indent: '' }).trim();

	if (!content) return '';
	return content.replace(/\n{3,}/g, '\n\n') + '\n';
}

type Context = {
	indent: string;
};

function serializeChildren(node: ParentNode, context: Context): string {
	return Array.from(node.childNodes)
		.map((child) => serializeNode(child, context))
		.join('');
}

function serializeNode(node: ChildNode, context: Context): string {
	if (node.nodeType === Node.TEXT_NODE) return normalizeText(node.textContent ?? '');
	if (node.nodeType !== Node.ELEMENT_NODE) return '';

	const el = node as HTMLElement;
	const tag = el.tagName.toLowerCase();

	if (tag === 'br') return '\n';
	if (tag === 'hr') return '\n\n---\n\n';
	if (tag === 'pre') return renderCodeBlock(el);
	if (tag === 'code') return renderInlineCode(el);
	if (tag === 'strong' || tag === 'b') return wrapInline('**', el, context);
	if (tag === 'em' || tag === 'i') return wrapInline('*', el, context);
	if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6') {
		return renderHeading(el, context);
	}
	if (tag === 'a') return renderLink(el as HTMLAnchorElement, context);
	if (tag === 'img') return renderImage(el as HTMLImageElement);
	if (tag === 'blockquote') return renderBlockquote(el, context);
	if (tag === 'ul' || tag === 'ol') return renderList(el, context);
	if (tag === 'table') return renderTable(el as HTMLTableElement);
	if (BLOCK_TAGS.has(tag)) return renderBlock(el, context);

	return serializeChildren(el, context);
}

function normalizeText(text: string): string {
	return text.replace(/\s+/g, ' ');
}

function wrapInline(wrapper: string, el: HTMLElement, context: Context): string {
	const value = serializeChildren(el, context).trim();
	return value ? `${wrapper}${value}${wrapper}` : '';
}

function renderHeading(el: HTMLElement, context: Context): string {
	const level = Number(el.tagName.slice(1));
	const content = serializeChildren(el, context).trim();
	return content ? `\n\n${'#'.repeat(level)} ${content}\n\n` : '';
}

function renderLink(el: HTMLAnchorElement, context: Context): string {
	const href = el.getAttribute('href') ?? '';
	const label = serializeChildren(el, context).trim() || href;
	return href ? `[${label}](${href})` : label;
}

function renderImage(el: HTMLImageElement): string {
	const src = el.getAttribute('src') ?? '';
	const alt = el.getAttribute('alt') ?? '';
	return src ? `![${alt}](${src})` : '';
}

function renderBlockquote(el: HTMLElement, context: Context): string {
	const content = serializeChildren(el, context).trim();
	if (!content) return '';
	const lines = content.split('\n').map((line) => `> ${line}`);
	return `\n\n${lines.join('\n')}\n\n`;
}

function renderList(el: HTMLElement, context: Context): string {
	const ordered = el.tagName.toLowerCase() === 'ol';
	const items = Array.from(el.children).filter((child) => child.tagName.toLowerCase() === 'li');
	if (!items.length) return '';

	const rendered = items
		.map((item, index) => renderListItem(item as HTMLElement, context, ordered, index))
		.join('\n');
	return `\n${rendered}\n`;
}

function renderListItem(
	item: HTMLElement,
	context: Context,
	ordered: boolean,
	index: number
): string {
	const marker = ordered ? `${index + 1}.` : '-';
	const nestedLists = Array.from(item.children).filter((child) => {
		const tag = child.tagName.toLowerCase();
		return tag === 'ul' || tag === 'ol';
	});
	const mainNodes = Array.from(item.childNodes).filter(
		(child) => !(child instanceof HTMLElement && (child.tagName === 'UL' || child.tagName === 'OL'))
	);

	const mainContent = mainNodes.map((node) => serializeNode(node, context)).join('').trim();
	const prefix = `${context.indent}${marker} `;
	const lines = mainContent ? `${prefix}${mainContent}` : `${prefix}`;

	const nestedContent = nestedLists
		.map((list) => renderList(list as HTMLElement, { indent: `${context.indent}  ` }).trim())
		.filter(Boolean)
		.join('\n');

	return nestedContent ? `${lines}\n${nestedContent}` : lines;
}

function renderBlock(el: HTMLElement, context: Context): string {
	const content = serializeChildren(el, context).trim();
	return content ? `\n\n${content}\n\n` : '';
}

function renderInlineCode(el: HTMLElement): string {
	const value = (el.textContent ?? '').trim();
	if (!value) return '';
	return `\`${value.replace(/`/g, '\\`')}\``;
}

function renderCodeBlock(el: HTMLElement): string {
	const value = (el.textContent ?? '').replace(/\n$/, '');
	if (!value) return '';
	const escaped = value.replace(/```/g, '``\\`');
	return `\n\n\`\`\`\n${escaped}\n\`\`\`\n\n`;
}

function renderTable(el: HTMLTableElement): string {
	const rows = Array.from(el.querySelectorAll('tr')).map((row) =>
		Array.from(row.children)
			.filter((cell) => {
				const tag = cell.tagName.toLowerCase();
				return tag === 'td' || tag === 'th';
			})
			.map((cell) => normalizeText(cell.textContent ?? '').trim())
	);

	if (!rows.length) return '';

	const headerRow = rows[0];
	const hasHeader = Array.from(el.querySelectorAll('thead th')).length > 0 ||
		Array.from(el.querySelectorAll('tr:first-child th')).length > 0;

	const headers = hasHeader ? headerRow : headerRow.map((_, index) => `Column ${index + 1}`);
	const bodyRows = hasHeader ? rows.slice(1) : rows;

	const formattedHeaders = headers.map((cell) => escapePipe(cell));
	const formattedRows = bodyRows.map((row) => row.map((cell) => escapePipe(cell)));

	const separator = headers.map(() => '---');
	const lines = [
		`| ${formattedHeaders.join(' | ')} |`,
		`| ${separator.join(' | ')} |`,
		...formattedRows.map((row) => `| ${row.join(' | ')} |`)
	];

	return `\n\n${lines.join('\n')}\n\n`;
}

function escapePipe(value: string): string {
	return value.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}
