/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#f0f4ff',
          '100': '#dbe4ff',
          '200': '#bac8ff',
          '300': '#91a7ff',
          '400': '#748ffc',
          '500': '#5c7cfa',
          '600': '#4c6ef5',
          '700': '#4263eb',
          '800': '#3b5bdb',
          '900': '#364fc7',
          '950': '#2b3eb2',
        },
        gray: {
          '50': '#f8f9fa',
          '100': '#f1f3f5',
          '200': '#e9ecef',
          '300': '#dee2e6',
          '400': '#ced4da',
          '500': '#adb5bd',
          '600': '#868e96',
          '700': '#495057',
          '800': '#343a40',
          '900': '#212529',
          '950': '#1a1d1f',
        }
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}