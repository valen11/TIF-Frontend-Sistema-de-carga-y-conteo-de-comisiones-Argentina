import React, { useState, useEffect } from 'react';

// Simulamos axios para el ejemplo (ACTUALIZADO para manejar candidatos y mesas)
const axios = {
  get: async (url) => {
    console.log('GET:', url);
    await new Promise(r => setTimeout(r, 500));
    if (url.includes('provincias')) {
      return { data: { provincias: [
        { idProvincia: 1, nombre: 'Buenos Aires', codigo: 'BA', region: 'Centro' },
        { idProvincia: 2, nombre: 'Córdoba', codigo: 'CB', region: 'Centro' }
      ]}};
    }
    if (url.includes('listas')) {
      return { data: { listas: [
        // Se asume que la lista pertenece a idProvincia: 1 (Buenos Aires)
        { idLista: 1, idProvincia: 1, provincia: { nombre: 'Buenos Aires' }, cargo: 'Gobernador', nombre: 'Lista 1', alianza: 'Alianza A' }
      ]}};
    }
    if (url.includes('candidatos')) {
      return { data: [
        // Se asume que el candidato pertenece a idLista: 1
        { idCandidato: 1, nombre: 'Juan Pérez', cargo: 'Gobernador', idLista: 1 }
      ]};
    }
    if (url.includes('mesas')) {
      return { data: [
        // Se asume que la mesa pertenece a idProvincia: 1
        { idMesa: 1, numero: '001', escuela: 'Escuela 1', idProvincia: 1 }
      ]};
    }
    return { data: [] };
  },
  post: async (url, data) => {
    console.log('POST:', url, data);
    await new Promise(r => setTimeout(r, 500));
    if (url.includes('provincias')) {
      return { data: { provincia: { ...data, idProvincia: Date.now() }}};
    }
    if (url.includes('listas')) {
      return { data: { lista: { ...data, idLista: Date.now() }}};
    }
    // Añadido mock para Candidatos
    if (url.includes('candidatos')) {
        return { data: { candidato: { ...data, idCandidato: Date.now() }}};
    }
    // Añadido mock para Mesas
    if (url.includes('mesas')) {
        return { data: { mesa: { ...data, idMesa: Date.now() }}};
    }
    return { data: {} };
  }
};

const API_BASE_URL = 'http://localhost:8000/api';

export default function App() {
  // Estados principales de datos
  const [provincias, setProvincias] = useState([]);
  const [listas, setListas] = useState([]);
  const [candidatos, setCandidatos] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [seccionActiva, setSeccionActiva] = useState('panel');
  const [cargando, setCargando] = useState(true);

  // Estados de formularios
  const [formProvincia, setFormProvincia] = useState('');
  const [formLista, setFormLista] = useState({
    provincia: '',
    cargo: '',
    nombre: '',
    alianza: ''
  });
  // NUEVO: Estado para Candidatos
  const [formCandidato, setFormCandidato] = useState({
    nombre: '',
    cargo: '',
    idLista: '' // Clave foránea para la relación
  });
  // NUEVO: Estado para Mesas
  const [formMesa, setFormMesa] = useState({
    numero: '',
    escuela: '',
    idProvincia: '' // Clave foránea para la relación
  });

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [resProvincias, resListas, resCandidatos, resMesas] = await Promise.all([
          axios.get(`${API_BASE_URL}/provincias`),
          axios.get(`${API_BASE_URL}/listas`),
          axios.get(`${API_BASE_URL}/candidatos`),
          axios.get(`${API_BASE_URL}/mesas`)
        ]);

        // Manejo de respuestas
        setProvincias(resProvincias.data.provincias || []);
        setListas(resListas.data.listas || resListas.data || []);
        setCandidatos(resCandidatos.data || []);
        setMesas(resMesas.data || []);
        
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setCargando(false);
      }
    };

    cargarDatosIniciales();
  }, []);

  // Función para agregar provincia
  const agregarProvincia = async () => {
    const nombreProvincia = formProvincia.trim();
    if (!nombreProvincia) {
      alert("Escribí un nombre de provincia.");
      return;
    }

    const datosProvincia = { nombre: nombreProvincia };

    try {
      const response = await axios.post(`${API_BASE_URL}/provincias`, datosProvincia);
      const nuevaProvincia = response.data.provincia;
      
      setProvincias([...provincias, nuevaProvincia]);
      setFormProvincia('');
      
      alert("Provincia agregada con éxito");
    } catch (error) {
      console.error("Error al registrar provincia:", error);
      alert(`Error al guardar: ${error.message}`);
    }
  };

  // Función para agregar lista
  const agregarLista = async () => {
    if (!formLista.provincia || !formLista.cargo || !formLista.nombre) {
      alert("Completá todos los campos obligatorios");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/listas`, formLista);
      const nuevaLista = response.data.lista;
      
      // En un entorno real, Laravel devolvería el objeto con la relación (provincia: {nombre: 'X'}). 
      // Aquí, la agregamos al estado para que el display funcione inmediatamente.
      const provinciaSeleccionada = provincias.find(p => p.idProvincia == formLista.provincia);
      
      setListas([...listas, { ...nuevaLista, provincia: { nombre: provinciaSeleccionada?.nombre } }]);
      setFormLista({ provincia: '', cargo: '', nombre: '', alianza: '' });
      
      alert("Lista agregada con éxito");
    } catch (error) {
      console.error("Error al registrar lista:", error);
      alert(`Error al guardar: ${error.message}`);
    }
  };
  
  // NUEVA: Función para agregar Candidato
  const agregarCandidato = async () => {
    if (!formCandidato.nombre || !formCandidato.idLista || !formCandidato.cargo) {
      alert("Completá todos los campos obligatorios para el candidato.");
      return;
    }

    try {
      // Endpoint: POST /api/candidatos
      const response = await axios.post(`${API_BASE_URL}/candidatos`, formCandidato);
      const nuevoCandidato = response.data.candidato; 

      // El nuevo objeto debe incluir idLista para el renderizado inmediato
      setCandidatos([...candidatos, nuevoCandidato]);
      setFormCandidato({ nombre: '', cargo: '', idLista: '' });

      alert("Candidato agregado con éxito");
    } catch (error) {
      console.error("Error al registrar candidato:", error);
      alert(`Error al guardar candidato: ${error.message}`);
    }
  };

  // NUEVA: Función para agregar Mesa
  const agregarMesa = async () => {
    if (!formMesa.numero || !formMesa.escuela || !formMesa.idProvincia) {
      alert("Completá todos los campos obligatorios para la mesa.");
      return;
    }
    
    // Convertimos el ID de provincia a entero antes de enviar
    const datosMesa = {
        ...formMesa,
        idProvincia: parseInt(formMesa.idProvincia)
    };

    try {
      // Endpoint: POST /api/mesas
      const response = await axios.post(`${API_BASE_URL}/mesas`, datosMesa);
      const nuevaMesa = response.data.mesa;
      
      // Buscar la provincia por su ID para actualizar el estado con el nombre
      const provinciaSeleccionada = provincias.find(p => p.idProvincia === parseInt(formMesa.idProvincia));

      setMesas([...mesas, { ...nuevaMesa, provincia: { nombre: provinciaSeleccionada?.nombre } }]);
      setFormMesa({ numero: '', escuela: '', idProvincia: '' });

      alert("Mesa agregada con éxito");
    } catch (error) {
      console.error("Error al registrar mesa:", error);
      alert(`Error al guardar mesa: ${error.message}`);
    }
  };


  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl font-semibold text-blue-600">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">Sistema Electoral</h1>
        <p className="text-blue-100 mt-2">Gestión de elecciones</p>
      </header>

      {/* Navegación */}
      <nav className="bg-white shadow-md p-4">
        <div className="flex gap-4 flex-wrap">
          {['panel', 'provincias', 'listas', 'candidatos', 'mesas'].map(seccion => (
            <button
              key={seccion}
              onClick={() => setSeccionActiva(seccion)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                seccionActiva === seccion
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {seccion.charAt(0).toUpperCase() + seccion.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="p-6 flex-1">
        {/* Panel (sin cambios) */}
        {seccionActiva === 'panel' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Panel de Control</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Provincias</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{provincias.length}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800">Listas</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">{listas.length}</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800">Candidatos</h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">{candidatos.length}</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800">Mesas</h3>
                <p className="text-3xl font-bold text-orange-600 mt-2">{mesas.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Provincias (sin cambios en la sección) */}
        {seccionActiva === 'provincias' && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Provincias</h2>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3">Agregar Provincia</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={formProvincia}
                  onChange={(e) => setFormProvincia(e.target.value)}
                  placeholder="Nombre de la provincia"
                  className="flex-1 p-3 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={agregarProvincia}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Agregar
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Nombre</th>
                    <th className="p-3 text-left">Código</th>
                    <th className="p-3 text-left">Región</th>
                  </tr>
                </thead>
                <tbody>
                  {provincias.map((p) => (
                    <tr key={p.idProvincia} className="border-b hover:bg-gray-50">
                      <td className="p-3">{p.idProvincia}</td>
                      <td className="p-3">{p.nombre}</td>
                      <td className="p-3">{p.codigo || '-'}</td>
                      <td className="p-3">{p.region || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Listas (sin cambios en la sección) */}
        {seccionActiva === 'listas' && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Listas</h2>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3">Agregar Lista</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select
                  value={formLista.provincia}
                  onChange={(e) => setFormLista({...formLista, provincia: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Seleccionar provincia</option>
                  {provincias.map((p) => (
                    // El valor del select debe ser el ID de la provincia
                    <option key={p.idProvincia} value={p.idProvincia}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={formLista.cargo}
                  onChange={(e) => setFormLista({...formLista, cargo: e.target.value})}
                  placeholder="Cargo"
                  className="p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={formLista.nombre}
                  onChange={(e) => setFormLista({...formLista, nombre: e.target.value})}
                  placeholder="Nombre de la lista"
                  className="p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={formLista.alianza}
                  onChange={(e) => setFormLista({...formLista, alianza: e.target.value})}
                  placeholder="Alianza"
                  className="p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                onClick={agregarLista}
                className="mt-3 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Agregar Lista
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Provincia</th>
                    <th className="p-3 text-left">Cargo</th>
                    <th className="p-3 text-left">Nombre</th>
                    <th className="p-3 text-left">Alianza</th>
                  </tr>
                </thead>
                <tbody>
                  {listas.map((l) => (
                    <tr key={l.idLista} className="border-b hover:bg-gray-50">
                      {/* Mostrar el nombre de la provincia asociada */}
                      <td className="p-3">{provincias.find(p => p.idProvincia == l.idProvincia)?.nombre || l.provincia?.nombre || 'N/A'}</td>
                      <td className="p-3">{l.cargo}</td>
                      <td className="p-3">{l.nombre}</td>
                      <td className="p-3">{l.alianza || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Candidatos (NUEVA SECCIÓN) */}
        {seccionActiva === 'candidatos' && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Candidatos</h2>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-3">Agregar Candidato</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={formCandidato.nombre}
                  onChange={(e) => setFormCandidato({...formCandidato, nombre: e.target.value})}
                  placeholder="Nombre del candidato"
                  className="p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={formCandidato.cargo}
                  onChange={(e) => setFormCandidato({...formCandidato, cargo: e.target.value})}
                  placeholder="Cargo (Ej: Gobernador)"
                  className="p-3 border border-gray-300 rounded-lg"
                />
                <select
                  value={formCandidato.idLista}
                  onChange={(e) => setFormCandidato({...formCandidato, idLista: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Seleccionar Lista</option>
                  {listas.map((l) => (
                    <option key={l.idLista} value={l.idLista}>
                      {l.nombre} ({l.cargo} en {provincias.find(p => p.idProvincia == l.idProvincia)?.nombre || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={agregarCandidato}
                className="mt-3 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Agregar Candidato
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Nombre</th>
                    <th className="p-3 text-left">Cargo</th>
                    <th className="p-3 text-left">Lista</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatos.map((c) => {
                    // Encontrar la lista asociada para mostrar el nombre
                    const listaAsociada = listas.find(l => l.idLista == c.idLista);
                    return (
                      <tr key={c.idCandidato} className="border-b hover:bg-gray-50">
                        <td className="p-3">{c.idCandidato}</td>
                        <td className="p-3">{c.nombre}</td>
                        <td className="p-3">{c.cargo}</td>
                        <td className="p-3">{listaAsociada ? listaAsociada.nombre : 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mesas (NUEVA SECCIÓN) */}
        {seccionActiva === 'mesas' && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Mesas</h2>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-3">Agregar Mesa</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={formMesa.numero}
                  onChange={(e) => setFormMesa({...formMesa, numero: e.target.value})}
                  placeholder="Número de Mesa"
                  className="p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={formMesa.escuela}
                  onChange={(e) => setFormMesa({...formMesa, escuela: e.target.value})}
                  placeholder="Nombre de la Escuela"
                  className="p-3 border border-gray-300 rounded-lg"
                />
                <select
                  value={formMesa.idProvincia}
                  onChange={(e) => setFormMesa({...formMesa, idProvincia: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Seleccionar Provincia</option>
                  {provincias.map((p) => (
                    <option key={p.idProvincia} value={p.idProvincia}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={agregarMesa}
                className="mt-3 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Agregar Mesa
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Número</th>
                    <th className="p-3 text-left">Escuela</th>
                    <th className="p-3 text-left">Provincia</th>
                  </tr>
                </thead>
                <tbody>
                  {mesas.map((m) => {
                    // Encontrar la provincia asociada para mostrar el nombre
                    const provinciaAsociada = provincias.find(p => p.idProvincia == (m.idProvincia || m.provincia?.idProvincia));
                    return (
                      <tr key={m.idMesa} className="border-b hover:bg-gray-50">
                        <td className="p-3">{m.idMesa}</td>
                        <td className="p-3">{m.numero}</td>
                        <td className="p-3">{m.escuela}</td>
                        <td className="p-3">{provinciaAsociada?.nombre || 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
