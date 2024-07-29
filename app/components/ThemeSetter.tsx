"use client";

import React, { useEffect } from 'react';

const ThemeSetter = ({ theme }: { theme: 'light' | 'dark' }) => {
  useEffect(() => {
    // Set the theme for this page
    document.documentElement.setAttribute('data-theme', theme);
    // Cleanup function to reset theme when the component unmounts
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, [theme]);

  return null;
};

export default ThemeSetter;
