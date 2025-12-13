
export const backdropStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

export const modalContentStyle: React.CSSProperties = {
  padding: '20px',
  borderRadius: '8px',
  maxWidth: '500px',
  width: '90%',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  position: 'relative',
};

export const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #eee',
};

export const bodyStyle: React.CSSProperties = {
  paddingTop: '10px',
};

export const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '1.5em',
  cursor: 'pointer',
  color: '#aaa',
};

export const modalFooterStyle: React.CSSProperties = {
  marginTop: '20px',
  borderTop: '1px solid #eee',
  paddingTop: '20px',
  textAlign: 'right'
};