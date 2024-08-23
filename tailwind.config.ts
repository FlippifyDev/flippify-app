import type { Config } from "tailwindcss";

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
      },
      colors: {
        primary: '#5865F2',
        white: '#ffffff',
        lightGreyBackground: '#F1F1F1',
        lightGreyHighlight: '#cccccc',
        greyText: '#dedede',
        slightlyDarkerGreyText: '#9A9A9A',
        greyStroke: '#A9A9A9',
        darkGreyText: '#222222',
        houseBlue: '#1a73e8',
        houseHoverBlue: '#58d6e5',
        lightModeText: '#3b4045',
        userPageBlueBg: '#1b2a49',
        userPageLightBlueBg: '#3e78b2',
        paymentPlanText: '#8678FF',
        textGradStart: '#DBC4FF',
        textGradEnd: '#AAA0FF',
        darkTextGradStart: '#644793',
        darkTextGradEnd: '#493DAD',
        discordBlue: '#5865F2',
        headingDarkText: '#1E1845',
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"),
    require('flowbite/plugin')({
      charts: true,
    }),
    require("tailwindcss-animate")
  ],
  daisyui: {
    themes: ["light", "dark"],
  },
} satisfies Config;

export default config;
