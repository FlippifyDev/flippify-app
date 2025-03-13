import type { Config } from "tailwindcss";

const {
	default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx,js,jsx,mdx}',
		'./components/**/*.{ts,tsx,js,jsx,mdx}',
		'./app/**/*.{ts,tsx,js,jsx,mdx}',
		'./src/**/*.{ts,tsx,js,jsx,mdx}',
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			backgroundImage: {
				'texture-pattern': 'url(https://i.imgur.com/VvU51ts.png)',
				'custom-gradient': 'linear-gradient(to bottom right, #4C8BFA 30%, #FFFFFF 100%)',
			},
			width: {
				'86': '21.50rem',
				'87': '21.75rem',
				'88': '22.00rem',
				'89': '22.25rem',
				'90': '22.50rem',
				'91': '22.75rem',
				'92': '23rem',
				'93': '23.25rem',
				'94': '23.5rem',
				'95': '23.75rem',
			},
			opacity: {
				'96': '0.96',
				'97': '0.97',
				'98': '0.98',
				'99': '0.99',
			},
			scale: {
				'101': '1.01',
				'102': '1.02',
				'103': '1.03',
				'104': '1.04',
			},
			boxShadow: {
				'planCardShadow': '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
				'right-lg': '10px 0 15px -3px rgba(0, 0, 0, 0.3), 4px 0 6px -2px rgba(0, 0, 0, 0.2)',
			},
			colors: {
				primary: '#5865F2',
				white: '#ffffff',
				orderPageText: '#17192c',
				lightGreyBackground: '#F1F1F1',
				userBackground: '#f2f6fa',
				tableHeaderBackground: "#f5f9fc",
				lightGreyHighlight: '#cccccc',
				greyText: '#dedede',
				slightlyDarkerGreyText: '#9A9A9A',
				darkBackground: '#090a25',
				deepBlue: '#000011',
				greyStroke: '#A9A9A9',
				darkGreyText: '#222222',
				houseBlue: '#1a73e8',
				houseHoverBlue: '#1A9EEA',
				lightModeText: '#3b4045',
				userPageBlueBg: '#1b2a49',
				userPageLightBlueBg: '#3e78b2',
				paymentPlanText: '#8678FF',
				textGradStart: '#35B4F8',
				textGradEnd: '#81EAFA',
				discordBlue: '#5865F2',
				greenLabel: '#1f493d',
				orangeLabel: '#ff4d04',
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in-settings": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
				"fade-in-bounce": {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"60%": { opacity: "1", transform: "translateY(-10px)" },
					"80%": { transform: "translateY(5px)" },
					"100%": { transform: "translateY(0)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fadeInPrimary": "fade-in-settings 0.8s ease-out forwards",
				"fadeInSecondary": "fade-in-settings 1.1s ease-out forwards",
				"fadeInBounce": "fade-in-bounce 1s ease-out forwards",
			},
			fontFamily: {
				sans: ['Rubik', 'sans-serif'],
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("daisyui"),
		require('flowbite/plugin')({
			charts: true,
		}),
		require("tailwindcss-animate"),
		addVariablesForColors,
	],
	daisyui: {
		themes: ["light", "dark"],
	},
} satisfies Config;

export default config;

function addVariablesForColors({ addBase, theme }: any) {
	let allColors = flattenColorPalette(theme("colors"));
	let newVars = Object.fromEntries(
		Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
	);

	addBase({
		":root": newVars,
	});
}