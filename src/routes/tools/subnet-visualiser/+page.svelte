<script lang="ts">
	import ToolLayout from '$lib/components/ToolLayout.svelte';

	// --- State ---
	let inputIp = '192.168.1.10';
	let cidr = 24;

	// --- Reactivity ---
	// We break the IP into 4 octets. If invalid, we default to 0.0.0.0 safe logic.
	$: ipOctets = parseIp(inputIp);
	$: validIp = ipOctets.length === 4;

	// Convert the 4 decimal octets into a continuous 32-bit string for visualization
	$: binaryString = validIp
		? ipOctets.map((n) => n.toString(2).padStart(8, '0')).join('')
		: Array(32).fill('0').join('');

	// Derived Calculations
	$: subnetMaskInt = ~(2 ** (32 - cidr) - 1);
	$: ipInt = (ipOctets[0] << 24) | (ipOctets[1] << 16) | (ipOctets[2] << 8) | ipOctets[3];

	$: networkInt = ipInt & subnetMaskInt;
	$: broadcastInt = networkInt | ~subnetMaskInt;

	$: firstUsable = networkInt + 1;
	$: lastUsable = broadcastInt - 1;
	$: totalHosts = Math.pow(2, 32 - cidr);
	$: usableHosts = Math.max(0, totalHosts - 2);

	// --- Helpers ---
	function parseIp(ip: string): number[] {
		const parts = ip.split('.');
		if (parts.length !== 4) return [];
		const nums = parts.map((p) => parseInt(p, 10));
		if (nums.some((n) => isNaN(n) || n < 0 || n > 255)) return [];
		return nums;
	}

	function intToIp(int: number): string {
		// changing sign bit issues with unsigned shift
		return [(int >>> 24) & 0xff, (int >>> 16) & 0xff, (int >>> 8) & 0xff, int & 0xff].join('.');
	}

	function formatNumber(num: number) {
		return new Intl.NumberFormat().format(num);
	}
</script>

<ToolLayout title="Subnet Visualiser" subtitle="Visualize how subnetting works with IP addresses.">
	<!-- CONTROL PANEL -->
	<div class="controls card">
		<div class="input-group">
			<label for="ip">IP Address</label>
			<input
				id="ip"
				type="text"
				bind:value={inputIp}
				class:invalid={!validIp}
				placeholder="e.g. 192.168.1.10"
			/>
		</div>

		<div class="input-group">
			<div class="label-row">
				<label for="cidr">CIDR Prefix</label>
				<span class="highlight-val">/{cidr}</span>
			</div>
			<input id="cidr" type="range" min="0" max="32" bind:value={cidr} />
			<div class="slider-labels">
				<span>/0</span>
				<span>/8</span>
				<span>/16</span>
				<span>/24</span>
				<span>/32</span>
			</div>
		</div>
	</div>

	<!-- VISUALIZATION -->
	<section class="visualization card">
		<h2>Bit Visualization</h2>
		<p class="desc">
			The <span class="net-text">Network Bits</span> define the street. The
			<span class="host-text">Host Bits</span> define the house number.
		</p>

		<!-- The 32 Bits Grid -->
		<div class="bits-container">
			{#each binaryString.split('') as bit, i}
				<!-- Add a separator every 8 bits for readability -->
				{#if i > 0 && i % 8 === 0}
					<div class="octet-spacer">.</div>
				{/if}

				<div class="bit" class:network={i < cidr} class:host={i >= cidr}>
					<span class="bit-val">{bit}</span>
					<span class="bit-index">{31 - i}</span>
				</div>
			{/each}
		</div>

		<!-- The Mask Overlay (Visual Divider) -->
		<div class="mask-info">
			<div class="mask-part net" style="width: calc({(cidr / 32) * 100}% - 5px)">
				Network Portion ({cidr} bits)
			</div>
			<div class="mask-part host" style="width: calc({((32 - cidr) / 32) * 100}% - 5px)">
				Host Portion ({32 - cidr} bits)
			</div>
		</div>
	</section>

	<!-- RESULTS GRID -->
	<section class="results">
		<div class="card result-card">
			<h3>Network Address</h3>
			<div class="value">{intToIp(networkInt)}</div>
			<div class="sub">The identifier for this subnet</div>
		</div>

		<div class="card result-card">
			<h3>Broadcast Address</h3>
			<!-- Visual logic: If /31 or /32, the concept of broadcast is weird, 
           but mathematically it equals the last IP in the block. -->
			<div class="value">{intToIp(broadcastInt)}</div>
			<div class="sub">
				{#if cidr === 32}
					(Same as IP for /32)
				{:else if cidr === 31}
					(Used as 2nd IP in p2p)
				{:else}
					Talks to everyone in subnet
				{/if}
			</div>
		</div>

		<div class="card result-card">
			<h3>Usable Range</h3>
			{#if usableHosts > 0}
				<div class="value range">
					<span>{intToIp(firstUsable)}</span>
					<span> - </span>
					<span>{intToIp(lastUsable)}</span>
				</div>
				<div class="sub">For your devices</div>
			{:else}
				<!-- Handle /31 and /32 nicely -->
				<div class="value" style="color: #888;">N/A</div>
				<div class="sub">
					{#if cidr === 32}
						Single Host Route (No Range)
					{:else}
						Point-to-Point Link (Special Case)
					{/if}
				</div>
			{/if}
		</div>

		<div class="card result-card highlight">
			<h3>Total Hosts</h3>
			<div class="value large">{formatNumber(usableHosts)}</div>
			<div class="sub">Usable IPs (Total: {formatNumber(totalHosts)})</div>
		</div>

		<div class="card result-card">
			<h3>Subnet Mask</h3>
			<div class="value">{intToIp(subnetMaskInt)}</div>
			<div class="sub">Wildcard: {intToIp(~subnetMaskInt)}</div>
		</div>
	</section>
</ToolLayout>

<style>
	/* --- Global & Layout --- */
	:global(body) {
		background-color: #f4f6f8;
		color: #333;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
	}

	h2 {
		margin-top: 0;
		font-size: 1.1rem;
		color: #555;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	h3 {
		margin: 0 0 0.5rem 0;
		font-size: 0.9rem;
		color: #888;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	p {
		margin-top: 0;
		color: #666;
		line-height: 1.5;
	}

	.card {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.05),
			0 2px 4px -1px rgba(0, 0, 0, 0.03);
		margin-bottom: 1.5rem;
		border: 1px solid #eaeaea;
	}

	/* --- Inputs --- */
	.controls {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		align-items: start;
	}

	@media (max-width: 600px) {
		.controls {
			grid-template-columns: 1fr;
			gap: 1rem;
		}
	}

	.input-group {
		display: flex;
		flex-direction: column;
	}
	label {
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #333;
	}

	input[type='text'] {
		font-size: 1.2rem;
		padding: 0.6rem;
		border: 2px solid #ddd;
		border-radius: 6px;
		font-family: monospace;
		width: 100%;
		box-sizing: border-box;
		transition: border-color 0.2s;
	}
	input[type='text']:focus {
		outline: none;
		border-color: #3b82f6;
	}
	input[type='text'].invalid {
		border-color: #ef4444;
	}

	/* Range Slider */
	input[type='range'] {
		width: 100%;
		cursor: pointer;
	}
	.label-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.highlight-val {
		font-size: 1.2rem;
		font-weight: 700;
		color: #3b82f6;
	}
	.slider-labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		color: #999;
		margin-top: 0.3rem;
	}

	/* --- Visualization --- */
	.desc {
		margin-bottom: 1.5rem;
		font-size: 0.95rem;
	}
	.net-text {
		color: #3b82f6;
		font-weight: 700;
		background: #e0eaff;
		padding: 2px 4px;
		border-radius: 4px;
	}
	.host-text {
		color: #f59e0b;
		font-weight: 700;
		background: #fff8e1;
		padding: 2px 4px;
		border-radius: 4px;
	}

	.bits-container {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		font-family: monospace;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.octet-spacer {
		display: flex;
		align-items: flex-end;
		padding-bottom: 5px;
		font-weight: bold;
		color: #ccc;
		margin: 0 4px;
	}

	.bit {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 20px;
	}

	.bit-val {
		font-size: 1.2rem;
		font-weight: bold;
		width: 20px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.bit-index {
		font-size: 0.6rem;
		color: #bbb;
		margin-top: 2px;
	}

	/* Bit Colors */
	.bit.network .bit-val {
		background-color: #3b82f6;
		color: white;
	}
	.bit.host .bit-val {
		background-color: #f59e0b;
		color: white;
	}

	/* Mask Bar Overlay */
	.mask-info {
		display: flex;
		height: 8px;
		width: 100%;
		margin-top: 10px;
		border-radius: 4px;
		overflow: hidden;
		font-size: 0.75rem;
		color: white;
		font-weight: bold;
		text-transform: uppercase;
		text-align: center;
		line-height: 20px; /* Hide text typically, or show if specific styling added */
	}

	.mask-part {
		height: 6px;
		transition: width 0.2s ease;
		margin-right: 5px;
		border-radius: 3px;
	}
	.mask-part.net {
		background-color: #3b82f6;
		opacity: 0.5;
	}
	.mask-part.host {
		background-color: #f59e0b;
		opacity: 0.5;
	}

	/* --- Results Grid --- */
	.results {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.result-card {
		margin-bottom: 0; /* Reset global card margin for grid */
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.value {
		font-size: 1.4rem;
		font-family: monospace;
		color: #111;
		font-weight: 600;
	}

	.value.large {
		font-size: 1.8rem;
		color: #10b981;
	}

	.value.range {
		display: flex;
		flex-direction: column;
		font-size: 1.1rem;
	}

	.sub {
		font-size: 0.85rem;
		color: #888;
		margin-top: 0.2rem;
	}
</style>
