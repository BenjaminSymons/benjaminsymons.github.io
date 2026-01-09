const MAX_PREFIX = 32;
const MIN_PREFIX = 0;
const UINT32_MAX = 0xffffffff;

export type CidrParse = {
	cidr: string;
	ip: string;
	prefix: number;
	ipInt: number;
	maskInt: number;
	networkInt: number;
	broadcastInt: number;
};

export type CidrSummary = {
	cidr: string;
	network: string;
	broadcast: string;
	subnetMask: string;
	wildcardMask: string;
	firstHost: string;
	lastHost: string;
	totalAddresses: number;
	usableHosts: number;
};

export type SubnetInfo = {
	cidr: string;
	network: string;
	broadcast: string;
	firstHost: string;
	lastHost: string;
	usableHosts: number;
};

const toUnsigned = (value: number) => value >>> 0;

const formatDotted = (value: number) => {
	return [24, 16, 8, 0].map((shift) => String((value >>> shift) & 0xff)).join('.');
};

const formatHost = (value: number | null) => (value === null ? '—' : formatDotted(value));

const parseIp = (input: string) => {
	const parts = input.split('.');
	if (parts.length !== 4) {
		throw new Error('IPv4 address must have four octets.');
	}
	const octets = parts.map((part) => {
		if (!/^\d+$/.test(part)) {
			throw new Error('IPv4 address must be numeric.');
		}
		const value = Number(part);
		if (!Number.isInteger(value) || value < 0 || value > 255) {
			throw new Error('IPv4 octets must be between 0 and 255.');
		}
		return value;
	});
	const ipInt = toUnsigned((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]);
	return { ipInt, ip: octets.join('.') };
};

const maskFromPrefix = (prefix: number) => {
	if (prefix === 0) {
		return 0;
	}
	return toUnsigned(UINT32_MAX << (MAX_PREFIX - prefix));
};

const hostRange = (prefix: number, networkInt: number, broadcastInt: number) => {
	if (prefix >= 31) {
		return { first: null, last: null, usable: 0 };
	}
	return {
		first: toUnsigned(networkInt + 1),
		last: toUnsigned(broadcastInt - 1),
		usable: Math.max(0, Math.pow(2, MAX_PREFIX - prefix) - 2)
	};
};

export const parseCidr = (input: string): CidrParse => {
	const trimmed = input.trim();
	if (!trimmed) {
		throw new Error('Enter a CIDR block like 192.168.1.0/24.');
	}
	const [ipPart, prefixPart] = trimmed.split('/');
	if (!ipPart || prefixPart === undefined) {
		throw new Error('CIDR must include an IP and prefix (e.g., 10.0.0.0/16).');
	}
	const { ipInt, ip } = parseIp(ipPart.trim());
	if (!/^\d+$/.test(prefixPart.trim())) {
		throw new Error('Prefix length must be numeric.');
	}
	const prefix = Number(prefixPart.trim());
	if (!Number.isInteger(prefix) || prefix < MIN_PREFIX || prefix > MAX_PREFIX) {
		throw new Error('Prefix length must be between 0 and 32.');
	}
	const maskInt = maskFromPrefix(prefix);
	const networkInt = toUnsigned(ipInt & maskInt);
	const broadcastInt = toUnsigned(networkInt | (~maskInt >>> 0));
	return {
		cidr: `${formatDotted(networkInt)}/${prefix}`,
		ip,
		prefix,
		ipInt,
		maskInt,
		networkInt,
		broadcastInt
	};
};

export const buildSummary = (parsed: CidrParse): CidrSummary => {
	const wildcard = toUnsigned(~parsed.maskInt);
	const range = hostRange(parsed.prefix, parsed.networkInt, parsed.broadcastInt);
	const totalAddresses = Math.pow(2, MAX_PREFIX - parsed.prefix);
	return {
		cidr: parsed.cidr,
		network: formatDotted(parsed.networkInt),
		broadcast: formatDotted(parsed.broadcastInt),
		subnetMask: formatDotted(parsed.maskInt),
		wildcardMask: formatDotted(wildcard),
		firstHost: formatHost(range.first),
		lastHost: formatHost(range.last),
		totalAddresses,
		usableHosts: range.usable
	};
};

export const listSubnets = (
	parsed: CidrParse,
	targetPrefix: number,
	limit: number
): SubnetInfo[] => {
	if (targetPrefix < parsed.prefix) {
		throw new Error('Subnet prefix must be equal to or larger than the base prefix.');
	}
	if (targetPrefix > MAX_PREFIX) {
		throw new Error('Subnet prefix must be between 0 and 32.');
	}
	const diff = targetPrefix - parsed.prefix;
	const totalSubnets = Math.pow(2, diff);
	const count = Math.min(limit, totalSubnets);
	const size = Math.pow(2, MAX_PREFIX - targetPrefix);
	const subnets: SubnetInfo[] = [];
	for (let i = 0; i < count; i += 1) {
		const networkInt = toUnsigned(parsed.networkInt + i * size);
		const broadcastInt = toUnsigned(networkInt + size - 1);
		const range = hostRange(targetPrefix, networkInt, broadcastInt);
		subnets.push({
			cidr: `${formatDotted(networkInt)}/${targetPrefix}`,
			network: formatDotted(networkInt),
			broadcast: formatDotted(broadcastInt),
			firstHost: formatHost(range.first),
			lastHost: formatHost(range.last),
			usableHosts: range.usable
		});
	}
	return subnets;
};
