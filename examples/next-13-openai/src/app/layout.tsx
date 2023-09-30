export const metadata = {
  title: 'Hopfield with React Server Components on the Edge',
  description: 'Hopfield with Server Components',
  twitter: {
    card: 'summary_large_image',
    title: 'Hopfield with Server Components',
    description: 'Hopfield with React Server Components streaming on the Edge',
    creator: '@nextjs',
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
      <body>{children}</body>
    </html>
  );
}
