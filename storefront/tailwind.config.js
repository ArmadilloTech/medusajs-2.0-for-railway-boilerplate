module.exports = {
  darkMode: ["class", "class"],
  presets: [require("@medusajs/ui-preset")],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/modules/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
    "../../node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        "8xl": "100rem",
      },
      screens: {
        "2xsmall": "320px",
        xsmall: "512px",
        small: "1024px",
        medium: "1280px",
        large: "1440px",
        xlarge: "1680px",
        "2xlarge": "1920px",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
      },
      keyframes: {
        "accordion-open": {
          from: {
            height: 0,
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-close": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: 0,
          },
        },
        "float-x": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(30px)" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(20px)" },
        },
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translateY(40px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: 0, transform: "translateX(-60px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: 0, transform: "translateX(60px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-open": "accordion-open 0.3s ease-out",
        "accordion-close": "accordion-close 0.3s ease-out",
        "float-x": "float-x 3s ease-in-out infinite",
        "float-y": "float-y 4s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(.39,.575,.565,1) both",
        "slide-in-left": "slide-in-left 1s cubic-bezier(.39,.575,.565,1) both",
        "slide-in-right":
          "slide-in-right 1s cubic-bezier(.39,.575,.565,1) both",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
