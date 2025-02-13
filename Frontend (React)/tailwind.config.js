/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      vsm: "320px",
      xsm: "400px",
      zsm: "480px",
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",

      tablet: "768px",
      ipad: "1024px",
      desktop: "1280px",
	    cont: "1025px",
      xtraxl: "1440px",
      xllarge: "1600px",
      xxlarge: "3200px",
    },
    extend: {},
  },
  plugins: [],
}

