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
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        white: '#FFFFFF',
        lightGreyBackground: '#F1F1F1',
        greyStroke: '#A9A9A9',
        houseBlue: '#4C8BFA',
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
          "--greyStroke": ""
        }
      }
    ]
  }

};
export default config;
