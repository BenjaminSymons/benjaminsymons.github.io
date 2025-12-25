<script lang="ts">
	import ToolLayout from '$lib/components/ToolLayout.svelte';
	import type { DiffRequest, DiffResponse } from '$lib/tools/diff/diff.worker';

	let left = $state('');
	let right = $state('');
	let result = $state<DiffResponse | null>(null);

	// Create worker once, terminate on unmount
	const worker = new Worker(new URL('$lib/tools/diff/diff.worker.ts', import.meta.url), {
		type: 'module'
	});

	worker.onmessage = (ev: MessageEvent<DiffResponse>) => {
		result = ev.data;
	};

	function run() {
		const msg: DiffRequest = { left, right };
		worker.postMessage(msg);
	}

	$effect(() => {
		run();
	});

	$effect(() => {
		return () => worker.terminate();
	});
</script>

<ToolLayout title="Diff checker" subtitle="Worker-backed.">
	<div class="grid gap-4 lg:grid-cols-2">
		<textarea
			class="min-h-[45vh] w-full rounded-2xl border border-black/10 bg-white/80 p-4 font-mono text-sm shadow-inner focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20"
			bind:value={left}
			placeholder="Left…"
		></textarea>
		<textarea
			class="min-h-[45vh] w-full rounded-2xl border border-black/10 bg-white/80 p-4 font-mono text-sm shadow-inner focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20"
			bind:value={right}
			placeholder="Right…"
		></textarea>
	</div>

	<div class="rounded-2xl border border-black/10 bg-white/70 px-5 py-4 text-sm">
		{#if result}
			<strong class="text-[rgb(var(--accent-2))]">
				{result.equal ? 'Match' : 'Different'}
			</strong>
			<div class="mt-2 text-muted">{result.summary}</div>
		{:else}
			<div class="text-muted">Type to compare.</div>
		{/if}
	</div>
</ToolLayout>
