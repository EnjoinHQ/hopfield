import { headers } from 'next/headers';
import { Suspense } from 'react';
import { CityRecs } from './city-recs';
import { Footer } from './components/footer';
import { Region } from './components/region';
import { parseVercelId } from './parse-vercel-id';

export const runtime = 'edge';

export default async function Page() {
  const headersList = headers();
  const city = decodeURIComponent(
    headersList.get('X-Vercel-IP-City') || 'Phoenix',
  );

  const timezone = headersList.get('X-Vercel-IP-Timezone') || 'America/Phoenix';

  const { proxyRegion, computeRegion } = parseVercelId(
    headersList.get('X-Vercel-Id')!,
  );

  if (headersList.get('user-agent')?.includes('Twitterbot')) {
    return <></>;
  }

  return (
    <>
      <main>
        <h1 className="title">
          <span>What to do in </span>
          {city}?
        </h1>
        <pre className="tokens">
          <Suspense fallback={null}>
            <CityRecs city={city} timezone={timezone} />
          </Suspense>
        </pre>
      </main>
      <div className="meta">
        <div className="info">
          <span>Proxy Region</span>
          <Region region={proxyRegion} />
        </div>
        <div className="info">
          <span>Compute Region</span>
          <Region region={computeRegion} />
        </div>
      </div>
      <Footer />
    </>
  );
}
