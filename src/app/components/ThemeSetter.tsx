"use client";

import { useEffect } from 'react';

const ThemeSetter = ({ theme }: { theme: string }) => {
	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
		return () => {
			document.documentElement.removeAttribute('data-theme');
		};
	}, [theme]);

	return null;
};

export default ThemeSetter;
