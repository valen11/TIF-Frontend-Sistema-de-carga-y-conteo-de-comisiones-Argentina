import { useEffect, useState } from 'react';

function TestApp() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/usuarios')
      .then(res => res.json())
      .then(data => {
        console.log('✅ Datos recibidos:', data);
        setUsuarios(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🧪 Test de Conexión API Laravel</h1>
      <p>Este es un componente de prueba separado</p>
      
      {usuarios.length === 0 ? (
        <p>No hay usuarios</p>
      ) : (
        <div>
          <h2>Usuarios recibidos desde Laravel:</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {usuarios.map(usuario => (
              <li key={usuario.id} style={{ 
                padding: '15px', 
                margin: '10px 0', 
                border: '2px solid #4CAF50',
                borderRadius: '8px',
                background: '#f0f9f0'
              }}>
                <strong style={{ fontSize: '18px' }}>{usuario.nombre}</strong>
                <br />
                <span style={{ color: '#666' }}>📧 {usuario.email}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TestApp;