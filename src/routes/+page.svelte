<script lang="ts">
	import { resolve } from '$app/paths';
	import { TOOLS } from '$lib/tools/registry';
</script>

<section class="mb-8 space-y-3 sm:mb-10">
	<p class="text-muted text-xs font-semibold tracking-[0.35em] uppercase">Utility Lab</p>
	<h1 class="text-3xl font-semibold sm:text-4xl md:text-5xl">Tools</h1>
	<p class="text-muted max-w-2xl text-base sm:text-lg">
		Fast, private utilities built for day-to-day formatting and comparison tasks. Everything runs
		client-side.
	</p>
</section>

<ul class="grid gap-4 sm:gap-6 md:grid-cols-2">
	{#each TOOLS as t (t.route)}
		<li class="group glass-card">
			<a class="flex h-full flex-col gap-4 p-5" href={resolve(t.route)}>
				<div
					class="text-muted flex items-center justify-between text-xs font-semibold tracking-[0.25em] uppercase"
				>
					<span>{t.name}</span>
					<span class="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[0.6rem]"
						>Open</span
					>
				</div>
				<p class="text-muted text-sm">{t.description}</p>
				<span
					class="mt-auto text-sm font-semibold text-[rgb(var(--accent-2))] transition group-hover:text-[rgb(var(--accent))]"
				>
					Launch tool →
				</span>
			</a>
		</li>
	{/each}
</ul>
