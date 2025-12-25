/// <reference lib="webworker" />
// Minimal placeholder. Swap in a real diff later.
// Kept as a worker so you can scale without blocking the UI.

export type DiffRequest = { left: string; right: string };
export type DiffResponse = { equal: boolean; summary: string };

self.onmessage = (ev: MessageEvent<DiffRequest>) => {
	const { left, right } = ev.data;
	const equal = left === right;
	const summary = equal ? 'No differences.' : 'Different (basic equality check).';
	self.postMessage({ equal, summary } satisfies DiffResponse);
};
