<script lang="ts">
	import ToolLayout from '$lib/components/ToolLayout.svelte';
	import { buildSummary, listSubnets, parseCidr } from '$lib/tools/cidr-subnet/calc';

	let input = $state('');
	let subnetPrefix = $state('');
	let limit = $state('8');
	let summary = $state<ReturnType<typeof buildSummary> | null>(null);
	let subnets = $state<ReturnType<typeof listSubnets>>([]);
	let error = $state('');

	const toNumber = (value: string | number | null | undefined, fallback: number) => {
		if (value === null || value === undefined) {
			return fallback;
		}
		if (typeof value === 'number') {
			return value;
		}
		const normalized = String(value).trim();
		if (!normalized) {
			return fallback;
		}
		return Number(normalized);
	};

	function run() {
		error = '';
		summary = null;
		subnets = [];
		if (!input.trim()) {
			return;
		}
		try {
			const parsed = parseCidr(input);
			const nextPrefix = toNumber(subnetPrefix, parsed.prefix);
			if (!Number.isFinite(nextPrefix) || !Number.isInteger(nextPrefix)) {
				throw new Error('Subnet prefix must be a whole number.');
			}
			const parsedLimit = toNumber(limit, 8);
			if (!Number.isFinite(parsedLimit) || !Number.isInteger(parsedLimit)) {
				throw new Error('Max subnets must be a whole number.');
			}
			const limitValue = Math.max(1, Math.min(256, parsedLimit));
			summary = buildSummary(parsed);
			subnets = listSubnets(parsed, nextPrefix, limitValue);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Invalid CIDR input.';
		}
	}

	$effect(() => {
		run();
	});
</script>

<ToolLayout title="CIDR + subnet reference" subtitle="Offline calculator for CIDR blocks and subnet lists.">
	<div class="flex flex-wrap items-end gap-4">
		<label class="text-muted flex flex-col gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
			CIDR block
			<input
				class="h-10 w-full rounded-full border border-black/10 bg-white/80 px-4 text-sm font-semibold text-[rgb(var(--ink))] focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20 sm:w-64"
				bind:value={input}
				placeholder="10.0.0.0/16"
				type="text"
			/>
		</label>

		<label class="text-muted flex flex-col gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
			Subnet prefix
			<input
				class="h-10 w-full rounded-full border border-black/10 bg-white/80 px-4 text-sm font-semibold text-[rgb(var(--ink))] focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20 sm:w-40"
				bind:value={subnetPrefix}
				min="0"
				max="32"
				placeholder="Use CIDR"
				step="1"
				type="number"
			/>
		</label>

		<label class="text-muted flex flex-col gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
			Max subnets
			<input
				class="h-10 w-full rounded-full border border-black/10 bg-white/80 px-4 text-sm font-semibold text-[rgb(var(--ink))] focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20 sm:w-32"
				bind:value={limit}
				min="1"
				max="256"
				placeholder="8"
				step="1"
				type="number"
			/>
		</label>
	</div>

	{#if error}
		<div class="rounded-xl border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-700">
			{error}
		</div>
	{/if}

	{#if summary}
		<div class="grid gap-4 lg:grid-cols-2">
			<div class="rounded-2xl border border-black/10 bg-white/80 p-4 shadow-inner">
				<h2 class="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Summary</h2>
				<dl class="mt-4 grid gap-3 text-sm">
					<div class="flex items-center justify-between gap-4">
						<dt class="text-muted">CIDR</dt>
						<dd class="font-mono text-right">{summary.cidr}</dd>
					</div>
					<div class="flex items-center justify-between gap-4">
						<dt class="text-muted">Network</dt>
						<dd class="font-mono text-right">{summary.network}</dd>
					</div>
					<div class="flex items-center justify-between gap-4">
						<dt class="text-muted">Broadcast</dt>
						<dd class="font-mono text-right">{summary.broadcast}</dd>
					</div>
					<div class="flex items-center justify-between gap-4">
						<dt class="text-muted">Subnet mask</dt>
						<dd class="font-mono text-right">{summary.subnetMask}</dd>
					</div>
					<div class="flex items-center justify-between gap-4">
						<dt class="text-muted">Wildcard mask</dt>
						<dd class="font-mono text-right">{summary.wildcardMask}</dd>
					</div>
					<div class="flex items-center justify-between gap-4">
						<dt class="text-muted">Host range</dt>
						<dd class="font-mono text-right">
							{summary.firstHost} – {summary.lastHost}
						</dd>
					</div>
					<div class="flex items-center justify-between gap-4">
						<dt class="text-muted">Total addresses</dt>
						<dd class="font-mono text-right">
							{summary.totalAddresses.toLocaleString()}
						</dd>
					</div>
					<div class="flex items-center justify-between gap-4">
						<dt class="text-muted">Usable hosts</dt>
						<dd class="font-mono text-right">
							{summary.usableHosts.toLocaleString()}
						</dd>
					</div>
				</dl>
			</div>

			<div class="rounded-2xl border border-black/10 bg-white/80 p-4 shadow-inner">
				<h2 class="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
					Subnet list
				</h2>
				<div
					class="mt-4 max-h-[40vh] overflow-auto rounded-2xl border border-black/10 bg-white/60 sm:max-h-[55vh]"
				>
					<table class="min-w-[36rem] w-full text-left text-sm">
						<thead class="sticky top-0 bg-white/90 text-xs uppercase tracking-[0.2em] text-muted">
							<tr>
								<th class="px-4 py-3">CIDR</th>
								<th class="px-4 py-3">Network</th>
								<th class="px-4 py-3">Broadcast</th>
								<th class="px-4 py-3">Host range</th>
								<th class="px-4 py-3">Usable</th>
							</tr>
						</thead>
						<tbody class="font-mono">
							{#each subnets as subnet, index (subnet.cidr)}
								<tr
									class={index % 2 === 0
										? 'border-t border-black/10 bg-white/80'
										: 'border-t border-black/10 bg-white/60'}
								>
									<td class="px-4 py-3">{subnet.cidr}</td>
									<td class="px-4 py-3">{subnet.network}</td>
									<td class="px-4 py-3">{subnet.broadcast}</td>
									<td class="px-4 py-3">
										{subnet.firstHost} – {subnet.lastHost}
									</td>
									<td class="px-4 py-3">{subnet.usableHosts.toLocaleString()}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	{/if}
</ToolLayout>
