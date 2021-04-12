import numeral from 'numeral';

export function formatValue(number) {
	return numeral(number).format('0,0.[0000000000]');
}

export const siteName = "http://localhost:8000";

export const algodurl = "http://127.0.0.1:4001";
