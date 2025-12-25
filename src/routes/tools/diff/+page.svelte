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
	<div class="grid">
		<textarea bind:value={left} placeholder="Left…"></textarea>
		<textarea bind:value={right} placeholder="Right…"></textarea>
	</div>

	<div class="res">
		{#if result}
			<strong>{result.equal ? 'Match' : 'Different'}</strong>
			<div>{result.summary}</div>
		{:else}
			<div>Type to compare.</div>
		{/if}
	</div>
</ToolLayout>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	textarea {
		width: 100%;
		min-height: 45vh;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	.res {
		padding: 0.75rem;
		border: 1px solid #ddd;
	}
	@media (max-width: 900px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
