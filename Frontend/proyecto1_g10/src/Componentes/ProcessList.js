import './ProcessList.css'
import React, { useState, useEffect } from 'react';

const ProcesosList = () => {
  //Aqui se guardan los procesos
  const [procesos, setProcesos] = useState([]);
  //Aqui se guarda el proceso seleccionado
  const [procesoSeleccionado, setProcesoSeleccionado] = useState(null);
  //Para la busqueda
  const [busqueda, setBusqueda] = useState('');
  
  useEffect(() => {
    obtenerListaProcesos();    
    const interval = setInterval(obtenerListaProcesos, 1000);
    return () => {
      // Limpiar el intervalo cuando el componente se desmonte
      clearInterval(interval);
    };
  }, []);


  const obtenerListaProcesos = () => {
    fetch('http://localhost:3001/procesos')
      .then(response => response.json())
      .then(data => setProcesos(data))
      .catch(error => console.error(error));
  };

  const handleProcesoClick = (proceso) => {
    setProcesoSeleccionado(proceso);
  };

  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  //Para matar el proceso
  const handleMatarProceso = () => {
    if (procesoSeleccionado) {
      fetch(`http://localhost:3001/procesos/${procesoSeleccionado.pid}`, { method: 'DELETE' })
        .then(response => {
          // Para actualizar
          setProcesos(procesos.filter(proceso => proceso.pid !== procesoSeleccionado.pid));
          setProcesoSeleccionado(null);
        })
        .catch(error => console.error(error));
    }
  };

  // Para filtrar
  const procesosFiltrados = procesos.filter(proceso =>
    proceso.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="procesos-container">
      {procesoSeleccionado && (
        <div className="proceso-detalle">
          <h2>Detalles del proceso seleccionado:</h2>
          <p>PID: {procesoSeleccionado.pid}</p>
          <p>Nombre: {procesoSeleccionado.nombre}</p>
          <p>Usuario: {procesoSeleccionado.usuario}</p>
          <p>Estado: {procesoSeleccionado.estado}</p>
          <p>%CPU: {procesoSeleccionado.cpu}</p>
          <button onClick={handleMatarProceso} className="matar-button">Matar Proceso</button>
        </div>
      )}
      <br/>
      <input type="text" value={busqueda} onChange={handleBusquedaChange} placeholder="Buscar..." className="input-busqueda"/>
      <br/>
      <ul class="list-group">
        {procesosFiltrados.map(proceso => (
          <li
            key={proceso.pid}
            onClick={() => handleProcesoClick(proceso)}
            className={procesoSeleccionado === proceso ? 'selected' : ''}
            
          >
            <span className="badge bg-primary rounded-pill">PID: {proceso.pid}</span> -- Nombre: {proceso.nombre} -- Usuario: {proceso.usuario} -- Estado: {proceso.estado} -- Porcentaje CPU: %{proceso.cpu}
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default ProcesosList;
