import type { Config } from "tailwindcss";

const config: Config = {
  plugins: [require("@tailwindcss/typography"), require('daisyui')],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'texture-pattern': 'url(https://i.imgur.com/VvU51ts.png)',
        'custom-gradient': 'linear-gradient(to bottom right, #4C8BFA 30%, #FFFFFF 100%)',
      },
      opacity: {
        '96': '0.96',
        '97': '0.97',
        '98': '0.98',
        '99': '0.99',
      },
      colors: {
        primary: '#5865F2',
        white: '#FFFFFF',
        lightGreyBackground: '#F1F1F1',
        lightGreyHighlight: '#3f4b59',
        greyText: '#dedede',
        greyStroke: '#A9A9A9',
        darkGreyText: '#222222',
        houseBlue: '#4C8BFA',
        paymentPlanText: '#8678FF',
        textGradStart: '#DBC4FF',
        textGradEnd: '#AAA0FF',
        darkTextGradStart: '#644793',
        darkTextGradEnd: '#493DAD',
        discordBlue: '#5865F2',
        headingDarkText: '#1E1845',
      },
    },
  },
  daisyui: {
    themes: ['light', 'dark'],
  }

};
export default config;