/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand': {
          red: '#E63946',
          orange: '#F4A261',
          light: '#FFF3E0',
        }
      },
      backgroundImage: {
        'cooking-pattern': "url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?auto=format&fit=crop&q=80')",
        'chef-hero': "url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80')",
        'kitchen': "url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80')"
      }
    },
  },
  plugins: [],
};