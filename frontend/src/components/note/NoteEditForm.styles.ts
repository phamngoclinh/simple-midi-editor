export const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

export const labelStyle: React.CSSProperties = {
  fontWeight: 'bold',
  marginTop: '5px',
  color: '#555',
  fontSize: '0.9em'
};

export const inputStyle: React.CSSProperties = {
  padding: '8px',
  fontSize: '1em',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

export const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
};

export const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
  marginTop: '15px',
  justifyContent: 'flex-end',
};

export const submitButtonStyle: React.CSSProperties = {
  padding: '10px 15px',
  fontSize: '1em',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export const cancelButtonStyle: React.CSSProperties = {
  ...submitButtonStyle,
  backgroundColor: '#6c757d',
};

export const errorStyle: React.CSSProperties = { color: 'red', fontSize: '0.8em', margin: '5px 0' };