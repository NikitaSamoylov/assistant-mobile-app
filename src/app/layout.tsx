import type { Metadata } from "next";
import { Header } from "@/modules/Header";
import { StoreProvider } from "./Providers/StoreProvider";
import { SystemErrorProvider } from "./Providers/SystemErrorProvider";
import { Footer } from "@/modules/Footer";
import { SessionAppProvider } from "./Providers/SessionProvider";
import ServiceWorkerRegister from "@/lib/serviceWorkers/ServiceWorkerRegister";
import CheckIsOnlineProvider from "./Providers/CheckIsOnlineProvider";
import GetAndSetUserSession from "./Providers/GetUserSessionProvider";
import { TariffPlanProvider } from "./Providers/TariffPlanProvider";
import { ThemeProvider } from "./Providers/ThemeProvider";
import { BackupProvider } from "./Providers/BackupProvider";
import { NoInternetNotifyProvider } from "./Providers/NoInternetNotifyProvider";
import { CheckBackup } from "@/modules/ProductsPageContent/CheckBackup";
import { ErrorBoundary } from 'react-error-boundary';
import { Error } from "@/components/Error";
import { CheckIsAppInstalledProvider } from "./Providers/CheckIsAppInstalledProvider";
import './styles/globals.css';
import Script from "next/script";
import { Suspense } from "react";
import YandexMetrika from "./Providers/YandexMetrika";

export const metadata: Metadata = {
  title: "Мой дворецкий",
  description: "Ваш помощник дома",
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <script src="https://widget.cloudpayments.ru/bundles/cloudpayments.js" defer></script>
      </head>
      <body className={`${'SFPro'}`}>
        <Script id="metrika-counter" strategy="afterInteractive">
          {
            `
          (function (m, e, t, r, i, k, a) {
            m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
          m[i].l = 1 * new Date();
          for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
          k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
          })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=103514866', 'ym');
          ym(103514866, 'init', {ssr: true, defer: true, webvisor: true, clickmap: true, ecommerce: "dataLayer", accurateTrackBounce: true, trackLinks: true, childIframe: true });
              `
          }
        </Script>
        <Suspense fallback={<Error />}>
          <YandexMetrika />
        </Suspense>
        <ServiceWorkerRegister />
        <SessionAppProvider>
          <StoreProvider>
            <CheckIsAppInstalledProvider>
              <CheckIsOnlineProvider>
                <GetAndSetUserSession>
                  <TariffPlanProvider>
                    <SystemErrorProvider>
                      <ThemeProvider>
                        <NoInternetNotifyProvider>
                          <BackupProvider>
                            <CheckBackup>
                              <Header />
                              {children}
                              <Footer />
                            </CheckBackup>
                          </BackupProvider>
                        </NoInternetNotifyProvider>
                      </ThemeProvider>
                    </SystemErrorProvider>
                  </TariffPlanProvider>
                </GetAndSetUserSession>
              </CheckIsOnlineProvider>
            </CheckIsAppInstalledProvider>
          </StoreProvider>
        </SessionAppProvider>
      </body>
    </html>
  );
}
