import './App.css';
import React from 'react';
import ProcesosList from './Componentes/ProcessList';

function App() {
  return (
    <div className="App">
      <nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        <div class="container-fluid">
          <a class="navbar-brand" href=".">Proyecto 1</a>
        </div>
      </nav>
      <br />
      <h1>Procesos</h1>
      <ProcesosList />
    </div>
  );
}

export default App;
