import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mahin AI',
  description: 'Mahin AI production-ready chatbot platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
