<script lang="ts">
	import ToolLayout from '$lib/components/ToolLayout.svelte';
	import { formatJson } from '$lib/tools/json-formatter/format';

	let input = $state('');
	let output = $state('');
	let indent = $state(2);
	let sortKeys = $state(false);
	let error = $state('');

	function run() {
		error = '';
		try {
			output = input.trim() ? formatJson(input, indent, sortKeys) : '';
		} catch (e) {
			error = e instanceof Error ? e.message : 'Invalid JSON';
			output = '';
		}
	}

	// Auto-run on changes
	$effect(() => {
		run();
	});
</script>

<ToolLayout title="JSON formatter" subtitle="Client-side only. No network.">
	<div class="grid gap-4 sm:flex sm:flex-wrap sm:items-end">
		<label class="text-muted flex flex-col gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
			Indent
			<select
				class="h-10 w-full rounded-full border border-black/10 bg-white/80 px-4 text-sm font-semibold text-[rgb(var(--ink))] focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20 sm:w-auto"
				bind:value={indent}
			>
				<option value={2}>2 spaces</option>
				<option value={4}>4 spaces</option>
				<option value={0}>Minify</option>
			</select>
		</label>

		<label
			class="text-muted flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase"
		>
			<input
				class="h-4 w-4 rounded border-black/20 text-[rgb(var(--accent))] focus:ring-[rgb(var(--accent))]/20"
				type="checkbox"
				bind:checked={sortKeys}
			/>
			Sort keys
		</label>

		<button
			class="h-10 w-full rounded-full bg-[rgb(var(--accent))] px-6 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 sm:w-auto"
			type="button"
			onclick={run}
		>
			Format
		</button>
	</div>

	{#if error}
		<div class="rounded-xl border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-700">
			{error}
		</div>
	{/if}

	<div class="grid gap-4 lg:grid-cols-2">
		<textarea
			class="min-h-[40vh] w-full rounded-2xl border border-black/10 bg-white/80 p-4 font-mono text-sm shadow-inner focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20 sm:min-h-[50vh] lg:min-h-[55vh]"
			bind:value={input}
			placeholder="Paste JSON…"
		></textarea>
		<textarea
			class="min-h-[40vh] w-full rounded-2xl border border-black/10 bg-white/80 p-4 font-mono text-sm shadow-inner focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20 sm:min-h-[50vh] lg:min-h-[55vh]"
			readonly
			value={output}
			placeholder="Output…"
		></textarea>
	</div>
</ToolLayout>
