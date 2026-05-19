import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      background: '#0a0a0a',
      borderTop: '1px solid #2a2a2a',
      padding: '1.2rem 2rem',
      textAlign: 'center'
    }}>
      <p style={{
        fontFamily: 'Lato, sans-serif',
        fontSize: '0.8rem',
        color: '#c4a97a',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontWeight: 300
      }}>
        Mele Marketplace &copy; 2026
      </p>
      <p style={{
        fontFamily: 'Lato, sans-serif',
        fontSize: '0.7rem',
        color: '#555',
        marginTop: '0.25rem',
        letterSpacing: '0.08em'
      }}>
        Creado por Gonzalo Martín
      </p>
    </footer>
  );
}
