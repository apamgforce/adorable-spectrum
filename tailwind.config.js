/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        forest: "#1a3d1f",
        leaf: "#2d6a35",
        sage: "#4a8c52",
        lime: "#7bc47f",
        mint: "#b8deba",
        cream: "#faf8f3",
        ivory: "#f5f0e8",
        earth: "#8b6914",
        gold: "#c9a227",
        amber: "#e8b84b",
        charcoal: "#1c1c1c",
        mist: "#f0f4f1",
      },

      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        headline: ["Playfair Display", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },

      animation: {
        "slide-up": "slideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 1.2s ease forwards",
        float: "float 6s ease-in-out infinite",
        "ken-burns": "kenBurns 14s ease-in-out infinite alternate",
        marquee: "marquee 35s linear infinite",
      },

      keyframes: {
        slideUp: {
          from: {
            opacity: "0",
            transform: "translateY(40px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        fadeIn: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },

        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-12px)",
          },
        },

        marquee: {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-50%)",
          },
        },

        kenBurns: {
          "0%": {
            transform: "scale(1) translateX(0) translateY(0)",
          },
          "100%": {
            transform: "scale(1.08) translateX(-1%) translateY(-1%)",
          },
        },
      },
    },
  },

  plugins: [],
};