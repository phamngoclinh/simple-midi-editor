export const layoutStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#f8f8f8',
};

export const headerStyle: React.CSSProperties = {
  backgroundColor: '#343a40',
  color: 'white',
  padding: '10px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

export const logoStyle: React.CSSProperties = {
  fontSize: '1.5em',
  fontWeight: 'bold',
};

export const navStyle: React.CSSProperties = {
  display: 'flex',
  gap: '20px',
};

export const navLinkStyle: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
  padding: '5px 10px',
  borderRadius: '4px',
  transition: 'background-color 0.2s',
};

export const linkStyle: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
};

export const mainContentStyle: React.CSSProperties = {
  flexGrow: 1, // Đẩy footer xuống dưới cùng
  padding: '20px',
};

export const footerStyle: React.CSSProperties = {
  backgroundColor: '#343a40',
  color: '#aaa',
  textAlign: 'center',
  padding: '10px 0',
  fontSize: '0.8em',
};