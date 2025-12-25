<script lang="ts">
	import ToolLayout from '$lib/components/ToolLayout.svelte';
	import { parseCsv, parseJson, tableToOutput } from '$lib/tools/table-converter/convert';
	import type { TableOutput } from '$lib/tools/table-converter/convert';

	let input = $state('');
	let output = $state('');
	let inputFormat = $state<'csv' | 'json'>('csv');
	let outputFormat = $state<TableOutput>('markdown');
	let arrayHeaders = $state(true);
	let error = $state('');

	function run() {
		error = '';
		if (!input.trim()) {
			output = '';
			return;
		}
		try {
			const data = inputFormat === 'csv' ? parseCsv(input) : parseJson(input, arrayHeaders);
			output = tableToOutput(data, outputFormat);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Unable to parse input.';
			output = '';
		}
	}

	$effect(() => {
		run();
	});
</script>

<ToolLayout title="Table converter" subtitle="CSV or JSON into HTML, Markdown, or JIRA tables.">
	<div class="flex flex-wrap items-end gap-4">
		<label class="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
			Input
			<select
				class="h-10 rounded-full border border-black/10 bg-white/80 px-4 text-sm font-semibold text-[rgb(var(--ink))] focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20"
				bind:value={inputFormat}
			>
				<option value="csv">CSV</option>
				<option value="json">JSON</option>
			</select>
		</label>

		<label class="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
			Output
			<select
				class="h-10 rounded-full border border-black/10 bg-white/80 px-4 text-sm font-semibold text-[rgb(var(--ink))] focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20"
				bind:value={outputFormat}
			>
				<option value="markdown">Markdown</option>
				<option value="html">HTML</option>
				<option value="jira">JIRA</option>
			</select>
		</label>

		<label class="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
			<input
				class="h-4 w-4 rounded border-black/20 text-[rgb(var(--accent))] focus:ring-[rgb(var(--accent))]/20"
				type="checkbox"
				bind:checked={arrayHeaders}
				disabled={inputFormat !== 'json'}
			/>
			JSON array uses first row as headers
		</label>
	</div>

	{#if error}
		<div class="rounded-xl border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-700">
			{error}
		</div>
	{/if}

	<div class="grid gap-4 lg:grid-cols-2">
		<textarea
			class="min-h-[55vh] w-full rounded-2xl border border-black/10 bg-white/80 p-4 font-mono text-sm shadow-inner focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20"
			bind:value={input}
			placeholder="Paste CSV or JSON…"
		></textarea>
		<textarea
			class="min-h-[55vh] w-full rounded-2xl border border-black/10 bg-white/80 p-4 font-mono text-sm shadow-inner focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20"
			readonly
			value={output}
			placeholder="Table output…"
		></textarea>
	</div>
</ToolLayout>
