// app/components/ServiceWorkerRegister.tsx (or wherever you registered the Service Worker)
"use client";

import { useEffect } from 'react';

const ServiceWorkerRegister = () => {
	useEffect(() => {
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', () => {
				navigator.serviceWorker.register('/sw.js').then(
					(registration) => {
						console.log('ServiceWorker registration successful with scope: ', registration.scope);
					},
					(err) => {
						console.error('ServiceWorker registration failed: ', err);
					}
				);
			});
		} else {
			console.error('Service Worker not supported in this browser.');
		}
	}, []);

	return null;
};

export default ServiceWorkerRegister;
