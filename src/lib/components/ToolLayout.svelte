<script lang="ts">
	type Props = {
		title: string;
		subtitle?: string;
		children: import('svelte').Snippet;
	};

	let { title, subtitle, children }: Props = $props();
</script>

<section class="wrap">
	<header class="top">
		<h1>{title}</h1>
		{#if subtitle}
			<p class="sub">{subtitle}</p>
		{/if}
	</header>

	{@render children()}
</section>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.top h1 {
		margin: 0;
	}
	.sub {
		margin: 0.25rem 0 0;
		opacity: 0.8;
	}
</style>
