/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'trippiko-bg': '#2a4d4d',
        'trippiko-accent': '#f7c873',
        'trippiko-card': '#295b5b',
        'trippiko-light': '#e6f2f2',
        'trippiko-dark': '#1a2d2d',
      },
      fontFamily: {
        'heading': ['Montserrat', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}




// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         'trippiko-black': '#000000',
//         'trippiko-teal': '#13847B',
//         'trippiko-darkteal': '#1A4C4E',
//         'trippiko-lightblue': '#B4D3EF',
//         'trippiko-verylightblue': '#DCE2F6',
//         'trippiko-orange': '#DD9E5E',
//       },
//       fontFamily: {
//         'heading': ['Montserrat', 'sans-serif'],
//         'body': ['Inter', 'sans-serif'],
//       }
//     },
//   },
//   plugins: [],
// }