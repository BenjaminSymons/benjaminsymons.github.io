<script lang="ts">
	import ToolLayout from '$lib/components/ToolLayout.svelte';
	import { htmlToMarkdown } from '$lib/tools/html-to-markdown/convert';

	let input = $state('');
	let output = $state('');

	function run() {
		output = input.trim() ? htmlToMarkdown(input) : '';
	}

	$effect(() => {
		run();
	});
</script>

<ToolLayout title="HTML to Markdown" subtitle="Local conversion. No requests.">
	<div class="grid gap-4 lg:grid-cols-2">
		<textarea
			class="min-h-[40vh] w-full rounded-2xl border border-black/10 bg-white/80 p-4 font-mono text-sm shadow-inner focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20 sm:min-h-[50vh] lg:min-h-[55vh]"
			bind:value={input}
			placeholder="Paste HTML…"
		></textarea>
		<textarea
			class="min-h-[40vh] w-full rounded-2xl border border-black/10 bg-white/80 p-4 font-mono text-sm shadow-inner focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20 sm:min-h-[50vh] lg:min-h-[55vh]"
			readonly
			value={output}
			placeholder="Markdown output…"
		></textarea>
	</div>
</ToolLayout>
