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
      colors: {
        primary: '#5865F2',
        white: '#FFFFFF',
        lightGreyBackground: '#F1F1F1',
        greyText: '#dedede',
        greyStroke: '#A9A9A9',
        houseBlue: '#4C8BFA',
        textGradStart: '#65FF8A',
        textGradEnd: '#43B1E6',
        discordBlue: '#5865F2',
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: '#5865F2',
        }
      }
    ]
  }

};
export default config;
