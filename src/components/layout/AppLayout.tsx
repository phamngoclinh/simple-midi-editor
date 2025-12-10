// src/components/layout/AppLayout.tsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

interface AppLayoutProps {
  // Có thể truyền các actions chung vào đây nếu cần
}

const AppLayout: React.FC<AppLayoutProps> = () => {
  return (
    <div style={layoutStyle}>
      {/* --- Thanh Điều Hướng và Actions (Header/Navbar) --- */}
      <header style={headerStyle}>
        <div style={logoStyle}>
          <Link to="/" style={linkStyle}>
            🎶 Simple Midi Editor
          </Link>
        </div>
        
        {/* Menu chính */}
        <nav style={navStyle}>
          <Link to="/" style={navLinkStyle}>
            Quản Lý Songs
          </Link>
        </nav>
      </header>

      {/* --- Nội dung chính của Page (được render bởi Router) --- */}
      <main style={mainContentStyle}>
        <Outlet /> 
      </main>
      
      {/* Footer (Tùy chọn) */}
      <footer style={footerStyle}>
        <p>&copy; 2025 SynthComposer App</p>
      </footer>
    </div>
  );
};

export default AppLayout;

// --- Styles Cơ bản ---

const layoutStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#f8f8f8',
};

const headerStyle: React.CSSProperties = {
  backgroundColor: '#343a40',
  color: 'white',
  padding: '10px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const logoStyle: React.CSSProperties = {
  fontSize: '1.5em',
  fontWeight: 'bold',
};

const navStyle: React.CSSProperties = {
  display: 'flex',
  gap: '20px',
};

const navLinkStyle: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
  padding: '5px 10px',
  borderRadius: '4px',
  transition: 'background-color 0.2s',
};

const linkStyle: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
};

const mainContentStyle: React.CSSProperties = {
  flexGrow: 1, // Đẩy footer xuống dưới cùng
  padding: '20px',
};

const footerStyle: React.CSSProperties = {
  backgroundColor: '#343a40',
  color: '#aaa',
  textAlign: 'center',
  padding: '10px 0',
  fontSize: '0.8em',
};