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
  // El array 'mesas' ahora almacenará votosNulos y votosEnBlanco
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
<<<<<<< HEAD
  // Se añaden votosNulos y votosEnBlanco al formulario de mesa/telegrama
  const [formMesa, setFormMesa] = useState({
    provincia: '',
    circuito: '',
    establecimiento: '',
    electores: '',
    votos: '', // Votos válidos (antes era total)
    votosNulos: '', // Nuevo campo
    votosEnBlanco: '' // Nuevo campo
  });

  // Funciones para provincias
  const agregarProvincia = () => {
    if (!formProvincia.trim()) {
      // Reemplazo alert() con un log y un retorno
      console.error("Escribí un nombre de provincia.");
=======
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
>>>>>>> 74f89e1 (Initial commit - proyecto React)
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

<<<<<<< HEAD
  // Funciones para listas
  const agregarLista = () => {
    const { provincia, cargo, nombre, alianza } = formLista;
    if (!provincia || !cargo || !nombre) {
      console.error("Completá todos los campos obligatorios.");
=======
  // Función para agregar lista
  const agregarLista = async () => {
    if (!formLista.provincia || !formLista.cargo || !formLista.nombre) {
      alert("Completá todos los campos obligatorios");
>>>>>>> 74f89e1 (Initial commit - proyecto React)
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

<<<<<<< HEAD
  // Funciones para candidatos
  const agregarCandidato = () => {
    const { provincia, cargo, lista, nombre, orden } = formCandidato;
    if (!provincia || !cargo || !lista || !nombre) {
      console.error("Completá todos los campos.");
=======
  // NUEVA: Función para agregar Mesa
  const agregarMesa = async () => {
    if (!formMesa.numero || !formMesa.escuela || !formMesa.idProvincia) {
      alert("Completá todos los campos obligatorios para la mesa.");
>>>>>>> 74f89e1 (Initial commit - proyecto React)
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

<<<<<<< HEAD
  // Funciones para mesas / telegramas
  const agregarMesa = () => {
    const { provincia, circuito, establecimiento, electores, votos, votosNulos, votosEnBlanco } = formMesa;
    
    // Validación básica de campos
    if (!provincia || !circuito || !establecimiento || !electores || !votos || !votosNulos || !votosEnBlanco) {
      console.error("Completá todos los campos.");
      return;
    }

    // Conversión a números
    const numElectores = parseInt(electores);
    const numVotos = parseInt(votos);
    const numVotosNulos = parseInt(votosNulos);
    const numVotosEnBlanco = parseInt(votosEnBlanco);
    
    // Suma de votos registrados (válidos + nulos + en blanco)
    const totalVotosRegistrados = numVotos + numVotosNulos + numVotosEnBlanco;

    if (totalVotosRegistrados > numElectores) {
      console.error("La suma de votos (válidos, nulos y en blanco) no puede superar al total de electores.");
      return;
    }

    setMesas([...mesas, {
      provincia,
      circuito,
      establecimiento,
      electores: numElectores,
      votos: numVotos, // Votos válidos
      votosNulos: numVotosNulos, // Votos Nulos
      votosEnBlanco: numVotosEnBlanco // Votos en Blanco
    }]);
    setFormMesa({ provincia: '', circuito: '', establecimiento: '', electores: '', votos: '', votosNulos: '', votosEnBlanco: '' });
  };

  // Calcular resultados
  const calcularResultados = () => {
    // Total de votos emitidos (válidos + nulos + en blanco)
    const totalVotosEmitidos = mesas.reduce((acc, m) => acc + m.votos + m.votosNulos + m.votosEnBlanco, 0);
    const totalElectores = mesas.reduce((acc, m) => acc + m.electores, 0);
    const totalVotosNulos = mesas.reduce((acc, m) => acc + m.votosNulos, 0);
    const totalVotosEnBlanco = mesas.reduce((acc, m) => acc + m.votosEnBlanco, 0);
    
    const participacion = totalElectores ? ((totalVotosEmitidos / totalElectores) * 100).toFixed(1) : 0;
    
    return { 
      totalVotosEmitidos, 
      totalElectores, 
      participacion,
      totalVotosNulos,
      totalVotosEnBlanco
    };
  };
=======

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl font-semibold text-blue-600">Cargando datos...</p>
      </div>
    );
  }
>>>>>>> 74f89e1 (Initial commit - proyecto React)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">Sistema Electoral</h1>
        <p className="text-blue-100 mt-2">Gestión de elecciones</p>
      </header>

<<<<<<< HEAD
      {/* Navegación - Se añade 'telegramas' */}
      <nav className="bg-gray-800 p-3 flex justify-center gap-2 flex-wrap shadow-md">
        {['panel', 'provincias', 'listas', 'mesas', 'telegramas', 'resultados'].map(seccion => (
          <button
            key={seccion}
            onClick={() => setSeccionActiva(seccion)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              seccionActiva === seccion
                ? 'bg-blue-500 text-white scale-105 shadow-lg'
                : 'bg-gray-300 text-gray-800 hover:bg-blue-400 hover:text-white'
            }`}
          >
            {seccion.charAt(0).toUpperCase() + seccion.slice(1)}
          </button>
        ))}
=======
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
>>>>>>> 74f89e1 (Initial commit - proyecto React)
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
<<<<<<< HEAD
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Total de mesas cargadas</p>
                <p className="text-3xl font-bold text-orange-700">{mesas.length}</p>
=======
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800">Mesas</h3>
                <p className="text-3xl font-bold text-orange-600 mt-2">{mesas.length}</p>
>>>>>>> 74f89e1 (Initial commit - proyecto React)
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

<<<<<<< HEAD
        {/* MESAS (Formulario de Carga) - Se han añadido Votos Nulos y en Blanco */}
        {seccionActiva === 'mesas' && (
          <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Carga de Resultados por Mesa</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
              <select
                value={formMesa.provincia}
                onChange={(e) => setFormMesa({ ...formMesa, provincia: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 col-span-2 md:col-span-1"
              >
                <option value="">Provincia</option>
                {provincias.map((p, i) => (
                  <option key={i} value={p}>{p}</option>
                ))}
              </select>
              <input
                type="text"
                value={formMesa.circuito}
                onChange={(e) => setFormMesa({ ...formMesa, circuito: e.target.value })}
                placeholder="Circuito"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 col-span-2 md:col-span-1"
              />
              <input
                type="text"
                value={formMesa.establecimiento}
                onChange={(e) => setFormMesa({ ...formMesa, establecimiento: e.target.value })}
                placeholder="Establecimiento"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 col-span-2 md:col-span-1"
              />
              <input
                type="number"
                value={formMesa.electores}
                onChange={(e) => setFormMesa({ ...formMesa, electores: e.target.value })}
                placeholder="Electores"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 col-span-2 md:col-span-1"
              />
              {/* Nuevos campos de votos */}
              <input
                type="number"
                value={formMesa.votos}
                onChange={(e) => setFormMesa({ ...formMesa, votos: e.target.value })}
                placeholder="Votos Válidos"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 col-span-2 md:col-span-1"
              />
              <input
                type="number"
                value={formMesa.votosNulos}
                onChange={(e) => setFormMesa({ ...formMesa, votosNulos: e.target.value })}
                placeholder="Votos Nulos"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 col-span-2 md:col-span-1"
              />
              <input
                type="number"
                value={formMesa.votosEnBlanco}
                onChange={(e) => setFormMesa({ ...formMesa, votosEnBlanco: e.target.value })}
                placeholder="Votos en Blanco"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 col-span-2 md:col-span-1"
              />
              {/* Botón */}
              <button
                onClick={agregarMesa}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all col-span-2 md:col-span-1"
=======
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
>>>>>>> 74f89e1 (Initial commit - proyecto React)
              >
                Agregar Candidato
              </button>
            </div>
<<<<<<< HEAD
            
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Mesas registradas</h3>
            <p className="text-sm text-gray-500 mb-4">Puedes ver el detalle completo en la sección Telegramas.</p>
=======

>>>>>>> 74f89e1 (Initial commit - proyecto React)
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
<<<<<<< HEAD
                    <th className="p-3">Provincia</th>
                    <th className="p-3">Circuito</th>
                    <th className="p-3">Establecimiento</th>
                    <th className="p-3">Electores</th>
                    <th className="p-3">Votos Válidos</th>
                    <th className="p-3">Votos Nulos</th>
                    <th className="p-3">Votos en Blanco</th>
                    <th className="p-3">Participación %</th>
                  </tr>
                </thead>
                <tbody>
                  {mesas.map((m, i) => {
                    const totalVotosMesa = m.votos + m.votosNulos + m.votosEnBlanco;
                    const participacion = ((totalVotosMesa / m.electores) * 100).toFixed(1);
                    return (
                      <tr key={i} className="border-b hover:bg-blue-50 transition-colors">
                        <td className="p-3 text-center">{m.provincia}</td>
                        <td className="p-3 text-center">{m.circuito}</td>
                        <td className="p-3 text-center">{m.establecimiento}</td>
                        <td className="p-3 text-center">{m.electores}</td>
                        <td className="p-3 text-center">{m.votos}</td>
                        <td className="p-3 text-center">{m.votosNulos}</td>
                        <td className="p-3 text-center">{m.votosEnBlanco}</td>
                        <td className="p-3 text-center">{participacion}%</td>
=======
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
>>>>>>> 74f89e1 (Initial commit - proyecto React)
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

<<<<<<< HEAD
        {/* TELEGRAMAS - Nueva Sección (muestra el listado de mesas/telegramas cargados) */}
        {seccionActiva === 'telegramas' && (
          <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Recepción de Telegramas (Detalle)</h2>
            <p className="text-gray-600 mb-4">Listado de todas las mesas cargadas con el detalle de votos válidos, nulos y en blanco (lo mismo que en mesas, solo que con otro nombre).</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="p-3">Provincia</th>
                    <th className="p-3">Circuito</th>
                    <th className="p-3">Establecimiento</th>
                    <th className="p-3">Electores</th>
                    <th className="p-3">Votos Válidos</th>
                    <th className="p-3">Votos Nulos</th>
                    <th className="p-3">Votos en Blanco</th>
                    <th className="p-3">Participación %</th>
                  </tr>
                </thead>
                <tbody>
                  {mesas.map((m, i) => {
                    const totalVotosMesa = m.votos + m.votosNulos + m.votosEnBlanco;
                    const participacion = ((totalVotosMesa / m.electores) * 100).toFixed(1);
                    return (
                      <tr key={i} className="border-b hover:bg-blue-50 transition-colors">
                        <td className="p-3 text-center">{m.provincia}</td>
                        <td className="p-3 text-center">{m.circuito}</td>
                        <td className="p-3 text-center">{m.establecimiento}</td>
                        <td className="p-3 text-center">{m.electores}</td>
                        <td className="p-3 text-center">{m.votos}</td>
                        <td className="p-3 text-center">{m.votosNulos}</td>
                        <td className="p-3 text-center">{m.votosEnBlanco}</td>
                        <td className="p-3 text-center">{participacion}%</td>
=======
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
>>>>>>> 74f89e1 (Initial commit - proyecto React)
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
<<<<<<< HEAD
          </div>
        )}

        {/* RESULTADOS - Se añaden Votos Nulos y en Blanco */}
        {seccionActiva === 'resultados' && (
          <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Resultados Generales</h2>
            {(() => {
              const { totalVotosEmitidos, totalElectores, participacion, totalVotosNulos, totalVotosEnBlanco } = calcularResultados();
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-lg shadow">
                    <p className="text-gray-600 text-sm mb-2">Total de electores</p>
                    <p className="text-4xl font-bold text-blue-700">{totalElectores.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-lg shadow">
                    <p className="text-gray-600 text-sm mb-2">Total de votos emitidos</p>
                    <p className="text-4xl font-bold text-green-700">{totalVotosEmitidos.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-lg shadow">
                    <p className="text-gray-600 text-sm mb-2">Participación promedio</p>
                    <p className="text-4xl font-bold text-purple-700">{participacion}%</p>
                  </div>
                  {/* Nuevo: Votos Nulos */}
                  <div className="bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-lg shadow">
                    <p className="text-gray-600 text-sm mb-2">Votos Nulos</p>
                    <p className="text-4xl font-bold text-red-700">{totalVotosNulos.toLocaleString()}</p>
                  </div>
                  {/* Nuevo: Votos en Blanco */}
                  <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-lg shadow">
                    <p className="text-gray-600 text-sm mb-2">Votos en Blanco</p>
                    <p className="text-4xl font-bold text-yellow-700">{totalVotosEnBlanco.toLocaleString()}</p>
                  </div>
                </div>
              );
            })()}
=======
>>>>>>> 74f89e1 (Initial commit - proyecto React)
          </div>
        )}
      </main>
    </div>
  );
<<<<<<< HEAD
}

=======
}
>>>>>>> 74f89e1 (Initial commit - proyecto React)
