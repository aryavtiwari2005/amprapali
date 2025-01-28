// lib/fonts.js
import { Inter, Playfair_Display, Roboto, Montserrat, Merriweather, Poppins, DM_Sans } from 'next/font/google'

export const inter = Inter({ 
  subsets: ['latin'], 
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '600', '700']
})

export const merriweather = Merriweather({ 
  subsets: ['latin'], 
  variable: '--font-merriweather',
  display: 'swap',
  weight: ['400', '700']
});

export const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '700']
})

export const roboto = Roboto({ 
  subsets: ['latin'], 
  display: 'swap',
  variable: '--font-roboto',
  weight: ['400', '500', '700']
})

export const montserrat = Montserrat({ 
  subsets: ['latin'], 
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '600', '700']
})

export const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '600', '700']
})

export const dm_sans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dmsans',
  weight: ['400', '600', '700', '800', '900']
})