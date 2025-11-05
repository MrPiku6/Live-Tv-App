export const metadata = {
  title: 'Admin Panel - Live TV',
  description: 'Manage your live TV channels and playlists',
}

export default function AdminLayout({ children }) {
  return (
    <div style={{ backgroundColor: '#0f0f0f', minHeight: '100vh' }}>
      {children}
    </div>
  )
}
