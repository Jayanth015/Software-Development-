export default function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
        Welcome to Buyer Lead Intake
      </h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#6b7280' }}>
        Manage your buyer leads efficiently
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a 
          href="/buyers" 
          style={{
            display: 'inline-block',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          View All Leads
        </a>
        <a 
          href="/buyers/new" 
          style={{
            display: 'inline-block',
            backgroundColor: '#e5e7eb',
            color: '#1f2937',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#d1d5db'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#e5e7eb'}
        >
          Add New Lead
        </a>
      </div>
    </div>
  )
}
