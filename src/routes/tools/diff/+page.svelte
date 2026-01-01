<script lang="ts">
	import { onMount } from 'svelte';
	import ToolLayout from '$lib/components/ToolLayout.svelte';
	import type { DiffRequest, DiffResponse } from '$lib/tools/diff/diff.worker';

	let left = $state('');
	let right = $state('');
	let result = $state<DiffResponse | null>(null);

	let worker: Worker | null = null;

	onMount(() => {
		worker = new Worker(new URL('$lib/tools/diff/diff.worker.ts', import.meta.url), {
			type: 'module'
		});

		worker.onmessage = (ev: MessageEvent<DiffResponse>) => {
			result = ev.data;
		};

		return () => worker?.terminate();
	});

	function run() {
		if (!worker) return;
		const msg: DiffRequest = { left, right };
		worker.postMessage(msg);
	}

	$effect(() => {
		run();
	});
</script>

<ToolLayout title="Diff checker" subtitle="Worker-backed.">
	<div class="grid gap-4 lg:grid-cols-2">
		<textarea
			class="min-h-[35vh] w-full rounded-2xl border border-black/10 bg-white/80 p-4 font-mono text-sm shadow-inner focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20 sm:min-h-[45vh]"
			bind:value={left}
			placeholder="Left…"
		></textarea>
		<textarea
			class="min-h-[35vh] w-full rounded-2xl border border-black/10 bg-white/80 p-4 font-mono text-sm shadow-inner focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20 sm:min-h-[45vh]"
			bind:value={right}
			placeholder="Right…"
		></textarea>
	</div>

	<div class="rounded-2xl border border-black/10 bg-white/70 px-5 py-4 text-sm">
		{#if result}
			<strong class="text-[rgb(var(--accent-2))]">
				{result.equal ? 'Match' : 'Different'}
			</strong>
			<div class="text-muted mt-2">{result.summary}</div>
		{:else}
			<div class="text-muted">Type to compare.</div>
		{/if}
	</div>
</ToolLayout>
