import type { Config } from "tailwindcss";

const config: Config = {
  plugins: [
    require("@tailwindcss/typography"), 
    require("daisyui")
  ],
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
        greyStroke: '#A9A9A9',
        darkGreyText: '#222222',
        houseBlue: '#1a73e8',
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
      },
      variants: {
        extend: {
          backgroundColor: ['active'],
        },
      },
    },
  }
};

export default config;
