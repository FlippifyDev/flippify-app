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
        'texture-pattern': 'url(https://i.imgur.com/ZxA0OGq.png)',
      },
      colors: {
        white: '#FFFFFF',
        lightGreyBackground: '#F1F1F1',
        greyText: '#4A4A4A',
        greyStroke: '#A9A9A9',
        houseBlue: '#4C8BFA',
        darkBlue: '#09111f',
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
        }
      }
    ]
  }

};
export default config;
