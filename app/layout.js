import './globals.css'
import Header from '../components/Header'

export const metadata = {
  title: 'Live TV App',
  description: 'Watch live TV channels',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
