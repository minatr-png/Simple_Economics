import '../globals.css';
import { Inter } from 'next/font/google';

export const metadata = {
  title: 'S. Economics|Login'
}

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <div id="NavigationLogo">
        </div>
      </body>
    </html>
  )
}
