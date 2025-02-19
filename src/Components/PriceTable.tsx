import React, { useEffect, useState } from 'react';

const currencies = ['USDC', 'EUR', 'ETH', 'SOL', 'XLM', 'NEAR', 'BNB'];

export default function PriceTable() {
	const [btcRatios, setBtcRatios] = useState<{ [key: string]: number | null }>(
		{},
	);
	const [timestamp, setTimestamp] = useState('');

	const fetchBTCRatios = async () => {
		try {
			const requests = currencies.map(async (currency) => {
				const response = await fetch(
					`https://blockchain.info/tobtc?currency=${currency}&value=1`,
				);
				const btcValue = await response.text();
				return { [currency]: parseFloat(btcValue) };
			});

			const results = await Promise.all(requests);
			const ratios = results.reduce((acc, item) => ({ ...acc, ...item }), {});
			setBtcRatios(ratios);
			setTimestamp(new Date().toLocaleString());
			setTimeout(() => {
				fetchBTCRatios();
			}, 1000);
		} catch (err) {
			console.error('Error fetching BTC ratios:', err);
		}
		setTimeout(() => {
			fetchBTCRatios();
		}, 1000);
	};
	useEffect(() => {
		fetchBTCRatios();
	}, [timestamp]);

	return (
		<div>
			<h1>BTC Ratios</h1>
			<ul>
				{currencies.map((currency) => (
					<li key={currency}>
						{currency}:{' '}
						{btcRatios[currency] ? `${btcRatios[currency]} BTC` : 'Loading...'}
					</li>
				))}
			</ul>
			<div>Last Update: {timestamp || 'Loading...'}</div>
		</div>
	);
}
