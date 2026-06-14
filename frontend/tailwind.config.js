/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        piggy: {
          pink: "var(--color-piggy-pink)",
          peach: "var(--color-piggy-peach)",
          cream: "var(--color-piggy-cream)",
          card: "var(--color-piggy-card)",
          charcoal: "var(--color-piggy-charcoal)",
          gray: "var(--color-piggy-gray)",
          border: "var(--color-piggy-border)",
          positive: "var(--color-piggy-positive)",
          negative: "var(--color-piggy-negative)",
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(46, 42, 39, 0.06)",
      },
      borderRadius: {
        card: "1rem",
      },
      transitionDuration: {
        fast: "var(--motion-fast)",
        normal: "var(--motion-normal)",
        slow: "var(--motion-slow)",
        slower: "var(--motion-slower)",
      },
      transitionTimingFunction: {
        product: "var(--ease-out-product)",
        "in-out-product": "var(--ease-in-out-product)",
        snappy: "var(--spring-snappy)",
      },
    },
  },
  plugins: [],
};
