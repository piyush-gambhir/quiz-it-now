import { cn } from '@/lib/utils/cn';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Header />
      <div className="">{children}</div>
      <Footer />
    </div>
  );
}
