<script lang="ts">
	import '../app.css';
	import { resolve } from '$app/paths';
	import { TOOLS } from '$lib/tools/registry';

	let { children } = $props();
</script>

<div class="page-shell min-h-screen">
	<header class="sticky top-0 z-20 border-b border-black/10 bg-white/70 backdrop-blur">
		<div
			class="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between"
		>
			<a class="text-lg font-semibold tracking-tight" href={resolve('/')}>My Tools</a>
			<nav
				class="no-scrollbar text-muted flex w-full flex-nowrap gap-2 overflow-x-auto pb-2 text-xs font-semibold uppercase tracking-[0.18em] md:w-auto md:flex-wrap md:pb-0 md:tracking-[0.2em]"
			>
				{#each TOOLS as t (t.route)}
					<a
						class="text-muted shrink-0 whitespace-nowrap rounded-full border border-black/10 bg-white/70 px-2 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.18em] transition hover:border-black/30 hover:text-[rgb(var(--ink))] sm:px-3 sm:text-[0.65rem] sm:tracking-[0.2em]"
						href={resolve(t.route)}
					>
						{t.name}
					</a>
				{/each}
			</nav>
		</div>
	</header>

	<main class="mx-auto w-full max-w-6xl px-4 pt-8 pb-16 sm:px-6 sm:pt-10">
		{@render children()}
	</main>
</div>
