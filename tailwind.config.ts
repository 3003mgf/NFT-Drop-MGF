import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        LVRegular: ['LVRegular'],
        Futura: ["Futura"],
        LVWeb: ["Louis Vuitton Web"]
      }
    },
  },
  plugins: [],
}
export default config
