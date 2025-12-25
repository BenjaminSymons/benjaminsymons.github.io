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
	<div class="opts">
		<label>
			Indent
			<select bind:value={indent}>
				<option value={2}>2</option>
				<option value={4}>4</option>
				<option value={0}>Minify</option>
			</select>
		</label>

		<label>
			<input type="checkbox" bind:checked={sortKeys} />
			Sort keys
		</label>

		<button type="button" onclick={run}>Format</button>
	</div>

	{#if error}
		<div class="err">{error}</div>
	{/if}

	<div class="grid">
		<textarea bind:value={input} placeholder="Paste JSON…"></textarea>
		<textarea readonly value={output} placeholder="Output…"></textarea>
	</div>
</ToolLayout>

<style>
	.opts {
		display: flex;
		gap: 1rem;
		align-items: center;
		flex-wrap: wrap;
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	textarea {
		width: 100%;
		min-height: 60vh;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	.err {
		padding: 0.5rem;
		border: 1px solid #d33;
	}
	@media (max-width: 900px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
