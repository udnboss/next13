import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html>
      <head />
      <body>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/notes">Notes</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
