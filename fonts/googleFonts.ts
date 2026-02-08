// Google Fonts
import {
    Bebas_Neue,
    DM_Serif_Display,
    Inter as InterFont,
    Outfit as OutfitFont,
    Poppins as PoppinsFont,
    Roboto as RobotoFont,
} from 'next/font/google';

export const Inter = InterFont({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
export const Poppins = PoppinsFont({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
export const BebasNeue = Bebas_Neue({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-bebas-neue',
    weight: ['400'],
    style: ['normal'],
});
export const Roboto = RobotoFont({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
    weight: ['100', '300', '400', '500', '700', '900'],
});

export const Outfit = OutfitFont({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-outfit',
    weight: ['300', '400', '500', '600', '700', '800'],
});

export const DMSerifDisplay = DM_Serif_Display({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-dm-serif',
    weight: ['400'],
    style: ['normal', 'italic'],
});
