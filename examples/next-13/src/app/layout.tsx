import './globals.css';

import { Inter } from 'next/font/google';

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Hopfield with React Server Components on the Edge',
  description: 'Hopfield with Server Components',
  twitter: {
    card: 'summary_large_image',
    title: 'Hopfield with Server Components',
    description: 'Hopfield with React Server Components streaming on the Edge',
    creator: '@EnjoinHQ',
  },
  openGraph: {
    type: 'website',
    title: 'Hopfield with Server Components',
    description: 'Hopfield with React Server Components streaming on the Edge',
    url: 'https://next-13.hopfield.ai',
  },
  themeColor: {
    color: '#F09922',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-bg text-white ${inter.className} m-0 p-0`}>
        {children}
      </body>
    </html>
  );
}
