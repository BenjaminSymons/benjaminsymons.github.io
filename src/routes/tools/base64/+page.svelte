<script lang="ts">
	import ToolLayout from '$lib/components/ToolLayout.svelte';
	import { decodeBase64, encodeBase64 } from '$lib/tools/base64/codec';

	let mode = $state<'encode' | 'decode'>('encode');
	let input = $state('');
	let output = $state('');
	let error = $state('');

	function run() {
		error = '';
		if (!input.trim()) {
			output = '';
			return;
		}
		try {
			output = mode === 'encode' ? encodeBase64(input) : decodeBase64(input);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Invalid input.';
			output = '';
		}
	}

	$effect(() => {
		run();
	});
</script>

<ToolLayout title="Base64 encoder/decoder" subtitle="Offline and instant.">
	<div class="flex flex-wrap items-end gap-4">
		<label class="text-muted flex flex-col gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
			Mode
			<select
				class="h-10 rounded-full border border-black/10 bg-white/80 px-4 text-sm font-semibold text-[rgb(var(--ink))] focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20"
				bind:value={mode}
			>
				<option value="encode">Encode</option>
				<option value="decode">Decode</option>
			</select>
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
			placeholder="Paste input…"
		></textarea>
		<textarea
			class="min-h-[55vh] w-full rounded-2xl border border-black/10 bg-white/80 p-4 font-mono text-sm shadow-inner focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20"
			readonly
			value={output}
			placeholder="Output…"
		></textarea>
	</div>
</ToolLayout>
