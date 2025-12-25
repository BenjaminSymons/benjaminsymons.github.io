<script lang="ts">
	import '../app.css';
	import { resolve } from '$app/paths';
	import { TOOLS } from '$lib/tools/registry';

	let { children } = $props();
</script>

<div class="page-shell min-h-screen">
	<header class="sticky top-0 z-20 border-b border-black/10 bg-white/70 backdrop-blur">
		<div class="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
			<a class="text-lg font-semibold tracking-tight" href={resolve('/')}>My Tools</a>
			<nav class="text-muted flex flex-wrap gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
				{#each TOOLS as t (t.route)}
					<a
						class="text-muted rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.2em] uppercase transition hover:border-black/30 hover:text-[rgb(var(--ink))]"
						href={resolve(t.route)}
					>
						{t.name}
					</a>
				{/each}
			</nav>
		</div>
	</header>

	<main class="mx-auto w-full max-w-6xl px-6 pt-10 pb-16">
		{@render children()}
	</main>
</div>
