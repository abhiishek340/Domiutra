import Script from "next/script";

/**
 * Analytics are opt-in via environment variables and load nothing when unset.
 *   NEXT_PUBLIC_ANALYTICS_PROVIDER = "plausible" | "ga4"
 *   NEXT_PUBLIC_ANALYTICS_ID       = Plausible domain or GA4 measurement ID
 * Plausible is cookieless and recommended. GA4 is configured with IP
 * anonymization and no ad personalization signals.
 */
export function Analytics() {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER?.trim().toLowerCase();
  const id = process.env.NEXT_PUBLIC_ANALYTICS_ID?.trim();
  if (!provider || !id) return null;

  if (provider === "plausible") {
    return (
      <Script
        defer
        data-domain={id}
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
    );
  }

  if (provider === "ga4" && /^G-[A-Z0-9]+$/i.test(id)) {
    return (
      <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false});`}
        </Script>
      </>
    );
  }

  return null;
}
