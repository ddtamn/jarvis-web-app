/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter, sans-serif", { fontFeatureSettings: '"cv11", "ss01"' }],
      },
    },
  },
  plugins: [],
};
