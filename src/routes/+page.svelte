<script lang="ts">
	import { resolve } from '$app/paths';
	import { TOOLS } from '$lib/tools/registry';
</script>

<section class="mb-10 space-y-3">
	<p class="text-xs font-semibold uppercase tracking-[0.35em] text-muted">Utility Lab</p>
	<h1 class="text-4xl font-semibold md:text-5xl">Tools</h1>
	<p class="max-w-2xl text-base text-muted md:text-lg">
		Fast, private utilities built for day-to-day formatting and comparison tasks. Everything runs
		client-side.
	</p>
</section>

<ul class="grid gap-6 md:grid-cols-2">
	{#each TOOLS as t (t.route)}
		<li class="group glass-card">
			<a class="flex h-full flex-col gap-4 p-5" href={resolve(t.route)}>
				<div class="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.25em] text-muted">
					<span>{t.name}</span>
					<span class="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[0.6rem]">Open</span>
				</div>
				<p class="text-sm text-muted">{t.description}</p>
				<span class="mt-auto text-sm font-semibold text-[rgb(var(--accent-2))] transition group-hover:text-[rgb(var(--accent))]">
					Launch tool →
				</span>
			</a>
		</li>
	{/each}
</ul>
