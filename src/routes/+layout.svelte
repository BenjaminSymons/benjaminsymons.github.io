<script lang="ts">
	import './layout.css';
	import { resolve } from '$app/paths';
	import { TOOLS } from '$lib/tools/registry';

	let { children } = $props();
</script>

<header class="hdr">
	<a class="brand" href={resolve('/')}>My Tools</a>
	<nav class="nav">
		{#each TOOLS as t (t.route)}
			<a href={resolve(t.route)}>{t.name}</a>
		{/each}
	</nav>
</header>

<main class="main">
	{@render children()}
</main>

<style>
	.hdr {
		display: flex;
		gap: 1rem;
		align-items: center;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid #ddd;
	}
	.brand {
		font-weight: 600;
		text-decoration: none;
	}
	.nav {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}
	.nav a {
		text-decoration: none;
	}
	.main {
		padding: 1rem;
		max-width: 1100px;
		margin: 0 auto;
	}
</style>
