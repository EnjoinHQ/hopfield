import { headers } from 'next/headers';
import Image from 'next/image';
import { Suspense } from 'react';
import bgGradient5 from '../../public/bg-gradient.png';
import { CodeChat } from './code-chat';
import { Footer } from './footer';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export default async function Page() {
  const headersList = headers();

  if (headersList.get('user-agent')?.includes('Twitterbot')) {
    return <></>;
  }

  return (
    <div className="relative flex flex-col w-full max-h-screen h-screen px-8 overflow-hidden">
      <div className="mt-10 flex-grow">
        <h1 className="text-center font-semibold text-2xl">
          <span>How could I use </span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://hopfield.ai"
            className="text-accent"
          >
            Hopfield?
          </a>
        </h1>

        <div className="text-center max-w-lg mx-auto mt-4 mb-8 text-text-dark-2">
          This app is built with React Server Components in{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-semibold"
            href="https://nextjs.org/docs/app/building-your-application/rendering/server-components"
          >
            Next.js
          </a>
          , using{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-semibold"
            href="https://hopfield.ai"
          >
            Hopfield
          </a>{' '}
          to easily interact with OpenAI streaming chat responses.
        </div>

        <div className="max-w-2xl mx-auto w-full shrink-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="max-w-2xl max-h-[50vh] my-8 w-full font-mono mx-auto whitespace-pre-wrap flex-shrink overflow-y-scroll rounded-lg border border-slate-200 bg-white/5 backdrop-blur-md p-6 shadow-md">
          <Suspense fallback={null}>
            <CodeChat />
          </Suspense>
        </div>
      </div>

      <Image
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 -rotate-[34deg] transform-gpu opacity-40 blur-md"
        height={1200}
        width={1200}
        src={bgGradient5}
        placeholder="blur"
        alt="Large background gradient"
      />
      <Footer />
    </div>
  );
}
