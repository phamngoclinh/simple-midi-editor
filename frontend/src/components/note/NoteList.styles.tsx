export const containerStyle: React.CSSProperties = {
  marginTop: '15px',
  paddingTop: '10px',
  borderTop: '1px solid #eee',
};

export const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  maxHeight: '600px',
  overflow: 'auto'
};

export const listItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 15px',
  marginBottom: '8px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  borderLeftWidth: '5px',
  borderLeftStyle: 'solid',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

export const noteInfoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

export const noteTitleStyle: React.CSSProperties = {
  fontWeight: 'bold',
  fontSize: '1em',
  marginBottom: '3px',
};

export const noteDetailsStyle: React.CSSProperties = {
  fontSize: '0.85em',
  color: '#666',
};

export const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
};

export const buttonBaseStyle: React.CSSProperties = {
  padding: '6px 10px',
  fontSize: '0.85em',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
};

export const editButtonStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  backgroundColor: '#ffc107',
  color: '#333',
};

export const deleteButtonStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  backgroundColor: '#dc3545',
  color: 'white',
};

export const refreshButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: '#007bff',
    color: 'white',
    marginTop: '10px',
};