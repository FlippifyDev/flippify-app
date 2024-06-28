import type { Config } from "tailwindcss";

const config: Config = {
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
  
  // All Daisy UI Customization
  plugins: [require("@tailwindcss/typography"), require('daisyui')],

  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
        },
        colors: {
          primary: '#5865F2'
        }
      }
    ]
  }

};
export default config;
