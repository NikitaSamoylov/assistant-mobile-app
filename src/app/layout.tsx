import type { Metadata } from "next";
import { Header } from "@/modules/Header";
import { StoreProvider } from "./Providers/StoreProvider";
import { SystemErrorProvider } from "./Providers/SystemErrorProvider";
import { Footer } from "@/modules/Footer";
import { SessionAppProvider } from "./Providers/SessionProvider";
import ServiceWorkerRegister from "@/lib/serviceWorkers/ServiceWorkerRegister";
import CheckIsOnlineProvider from "./Providers/CheckIsOnlineProvider";
import GetAndSetUserSession from "./Providers/GetUserSessionProvider";
import { ThemeProvider } from "./Providers/ThemeProvider";
import { BackupProvider } from "./Providers/BackupProvider";
import { NoInternetNotifyProvider } from "./Providers/NoInternetNotifyProvider";
import { CheckBackup } from "@/modules/ProductsPageContent/CheckBackup";
import './styles/globals.css';

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
      </head>
      <body className={`${'SFPro'}`}>
        <ServiceWorkerRegister />
        <SessionAppProvider>
          <StoreProvider>
            <CheckIsOnlineProvider>
              <GetAndSetUserSession>
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
              </GetAndSetUserSession>
            </CheckIsOnlineProvider>
          </StoreProvider>
        </SessionAppProvider>
      </body>
    </html>
  );
}
