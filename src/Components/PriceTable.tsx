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
		<div className="flex flex-col items-center justify-center text-neon-green font-mono bg-transparent mb-8">
			<h1 className="text-4xl font-bold mb-6 neon-text text-center">
				BTC Ratios
			</h1>
			<ul className="w-80 p-4 border-2 border-neon-green bg-neon-black rounded-xl shadow-neon bg-opacity-50">
				{currencies.map((currency) => (
					<li
						key={currency}
						className="py-2 px-4 text-lg neon-text border-b border-neon-green last:border-none"
					>
						{currency}:{' '}
						{btcRatios[currency] ? `${btcRatios[currency]} BTC` : 'Loading...'}
					</li>
				))}
			</ul>
			<div className="mt-4 text-lg text-center">
				Last Update: {timestamp || 'Loading...'}
			</div>
		</div>
	);
}
