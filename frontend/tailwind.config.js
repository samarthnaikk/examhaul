/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'hyper-indigo': '#3B1E78',
        'electric-fuchsia': '#FF1E8E',
        'cyber-lime': '#C2FF1A',
        // Secondary Colors
        'warm-ultraviolet': '#7A3FF2',
        'dusk-teal': '#1FA6A3',
        'graphite-black': '#0D0D0F',
        // Neutrals
        'paper-smoke': '#EBEBE3',
        'soft-concrete': '#BABABA',
        'ghost-indigo': '#E9E1FF',
      },
      backgroundImage: {
        'neon-gradient': 'linear-gradient(135deg, #3B1E78 0%, #7A3FF2 100%)',
        'card-glow': 'linear-gradient(135deg, #E9E1FF 0%, rgba(122, 63, 242, 0.1) 100%)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(255, 30, 142, 0.3)',
        'cyber': '0 0 15px rgba(194, 255, 26, 0.2)',
      }
    },
  },
  plugins: [],
}