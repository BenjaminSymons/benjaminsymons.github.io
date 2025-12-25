<script lang="ts">
	import { resolve } from '$app/paths';
	import { TOOLS } from '$lib/tools/registry';
</script>

<h1>Tools</h1>
<ul>
	{#each TOOLS as t (t.route)}
		<li>
			<a href={resolve(t.route)}>{t.name}</a>
			<div class="desc">{t.description}</div>
		</li>
	{/each}
</ul>

<style>
	.desc {
		opacity: 0.8;
	}
	ul {
		padding-left: 1.2rem;
	}
	li {
		margin: 0.6rem 0;
	}
</style>
