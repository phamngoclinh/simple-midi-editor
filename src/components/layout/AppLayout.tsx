// src/components/layout/AppLayout.tsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { footerStyle, headerStyle, layoutStyle, linkStyle, logoStyle, mainContentStyle, navLinkStyle, navStyle } from './AppLayout.styles';

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
        <p>&copy; 2025 Simple Midi Editor</p>
      </footer>
    </div>
  );
};

export default AppLayout;
