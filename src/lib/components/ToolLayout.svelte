<script lang="ts">
	type Props = {
		title: string;
		subtitle?: string;
		children: import('svelte').Snippet;
	};

	let { title, subtitle, children }: Props = $props();
</script>

<section class="glass-card overflow-hidden">
	<header class="border-b border-black/10 px-6 py-5">
		<h1 class="text-3xl font-semibold md:text-4xl">{title}</h1>
		{#if subtitle}
			<p class="text-muted mt-2 text-sm">{subtitle}</p>
		{/if}
	</header>

	<div class="space-y-6 p-6">
		{@render children()}
	</div>
</section>
