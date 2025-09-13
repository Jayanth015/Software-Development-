export const metadata = {
  title: 'Buyer Lead Intake',
  description: 'Manage buyer leads with ease',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
          <nav style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                    Buyer Lead Intake
                  </h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Demo User</span>
                </div>
              </div>
            </div>
          </nav>
          <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
