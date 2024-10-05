import { cn } from '@/lib/utils/cn';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <div className="">{children}</div>
    </div>
  );
}
