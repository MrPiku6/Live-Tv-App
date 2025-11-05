import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <Link href="/">
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Live TV</h1>
        </Link>
        <div>
          <Link href="/">Home</Link>
          <Link href="/admin" style={{ marginLeft: '15px' }}>
            Admin Panel
          </Link>
        </div>
      </nav>
    </header>
  );
  }
