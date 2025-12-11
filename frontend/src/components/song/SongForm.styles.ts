
export const trackListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '10px',
  border: '1px dashed #ddd',
  borderRadius: '4px',
};

export const trackItemStyle: React.CSSProperties = {
  display: 'flex',
  gap: '5px',
  alignItems: 'center',
};

export const trackInputStyle: React.CSSProperties = {
  padding: '6px',
  flexGrow: 1,
  border: '1px solid #ccc',
  borderRadius: '3px',
};

export const trackOrderInputStyle: React.CSSProperties = {
  ...trackInputStyle,
  flexGrow: 0,
  width: '50px',
  textAlign: 'center',
};

// export const addButtonFormStyle: React.CSSProperties = {
//   padding: '8px 12px',
//   fontSize: '0.9em',
//   backgroundColor: '#28a745',
//   color: 'white',
//   border: 'none',
//   borderRadius: '4px',
//   cursor: 'pointer',
//   marginTop: '5px',
// };

// export const removeButtonStyle: React.CSSProperties = {
//   padding: '6px 10px',
//   fontSize: '1em',
//   backgroundColor: '#dc3545',
//   color: 'white',
//   border: 'none',
//   borderRadius: '4px',
//   cursor: 'pointer',
// };

export const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '15px',
  border: '1px solid #eee',
  borderRadius: '8px',
  backgroundColor: '#fff'
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
  width: '100%',
  boxSizing: 'border-box',
};

export const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
};

export const buttonStyle: React.CSSProperties = {
  padding: '10px 15px',
  fontSize: '1em',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '10px',
};

export const errorStyle: React.CSSProperties = { color: 'red', fontSize: '0.8em', margin: '5px 0' };