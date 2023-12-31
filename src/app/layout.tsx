import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import CLSNavButton from '@clsNavButton';
import Link from "next/link";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Simple economics'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <div id="NavigationLogo">
          <Link href="/"><img src='/logo.png' ></img></Link>
          <CLSNavButton title="<" goBack={true}></CLSNavButton>
          <CLSNavButton title=">" goForward={true}></CLSNavButton>
        </div>
      </body>
    </html>
  )
}
