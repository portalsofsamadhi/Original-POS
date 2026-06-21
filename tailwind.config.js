/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
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
        /* Samadhi Productions brand palette */
        samadhi: {
          black: "#0A0A0A",
          surface: "#111111",
          charcoal: "#1F1F1F",
          "rose-gold": "#C3998F",
          "rose-gold-light": "#E8B4A3",
          gold: "#FFD700",
          "gold-soft": "#F4C95D",
          cream: "#F5F0E8",
          teal: "#0A3C4A",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      backgroundImage: {
        "samadhi-rose": "linear-gradient(135deg, #C3998F 0%, #E8B4A3 50%, #F4C95D 100%)",
        "samadhi-metallic": "linear-gradient(135deg, #C3998F 0%, #E8B4A3 25%, #FFD700 50%, #E8B4A3 75%, #C3998F 100%)",
        "samadhi-cinematic": "linear-gradient(180deg, #0A0A0A 0%, #111111 40%, rgba(10, 60, 74, 0.3) 100%)",
        "samadhi-glow": "radial-gradient(ellipse at center, rgba(195, 153, 143, 0.12) 0%, transparent 70%)",
      },
      boxShadow: {
        "rose-glow": "0 4px 24px rgba(195, 153, 143, 0.2)",
        "gold-glow": "0 8px 32px rgba(255, 215, 0, 0.12)",
        cinematic: "0 8px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(195, 153, 143, 0.08)",
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
        "samadhi-shimmer": {
          "0%, 100%": { backgroundPosition: "0% center" },
          "50%": { backgroundPosition: "100% center" },
        },
        "samadhi-glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(195, 153, 143, 0.2)" },
          "50%": { boxShadow: "0 0 32px rgba(232, 180, 163, 0.35)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "samadhi-shimmer": "samadhi-shimmer 6s ease-in-out infinite",
        "samadhi-glow": "samadhi-glow-pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}