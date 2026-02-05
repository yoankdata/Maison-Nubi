"use client";

import { GoogleAnalytics } from '@next/third-parties/google';
import Script from "next/script";

export function Analytics() {
    const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
    const clarityId = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_ID;

    return (
        <>
            {/* Google Analytics 4 */}
            {gaId && <GoogleAnalytics gaId={gaId} />}

            {/* Microsoft Clarity */}
            {clarityId && (
                <Script
                    id="microsoft-clarity"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `
                    }}
                />
            )}
        </>
    );
}
