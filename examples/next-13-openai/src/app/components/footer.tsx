import Image from 'next/image';

export function Footer({ children }: React.PropsWithChildren) {
  return (
    <footer>
      <Image src="/hopfield.png" alt="logo" width={60} height={60} />

      <div className="details">
        {/* <p>
          Built with{' '}
          <a target="_blank" href="https://nextjs.org" rel="noreferrer">
            Next.js
          </a>{' '}
          on{' '}
          <a target="_blank" href="https://vercel.com" rel="noreferrer">
            Vercel
          </a>
        </p> */}
        {children}
      </div>
    </footer>
  );
}
