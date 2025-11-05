import './globals.css'

export const metadata = {
  title: 'Live TV',
  description: 'Watch live TV channels',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#000000', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
