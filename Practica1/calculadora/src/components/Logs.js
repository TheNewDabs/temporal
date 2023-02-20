import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Logs() {

  const [Consultas, setConsultas] = useState([])

  const Llamada = async () => {
    await fetch('http://localhost:4000/',
      {
        method: 'GET'
      })
      .then(res => res.json())
      .then(res => {
        setConsultas(res)
      })
  }

  Llamada()

  return (
    <div>
      <div className="base">
        <div className="container">
          <div className="main_form2">
            <h1>Logs</h1>
            <div class="tbl-header">
              <table cellpadding="0" cellspacing="0" border="0">
                <thead>
                  <tr>
                    <th>Numero 1</th>
                    <th>Numero 2</th>
                    <th>Operación</th>
                    <th>Resultado</th>
                    <th>Fecha y Hora</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div class="tbl-content">
              <table cellpadding="0" cellspacing="0" border="0">
                <tbody>
                  {Consultas.map(Consulta =>(
                    <tr>
                      <td>{Consulta.Num1}</td>
                      <td>{Consulta.Num2}</td>
                      <td>{Consulta.Operacion}</td>
                      <td>{Consulta.Resultado}</td>
                      <td>{Consulta.Fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="base">
        <div className="container">
          <div className="main_form2">
            <button className="col-12 tecla" type="button" value="Regresar"><NavLink to='/' className="tecla">Regresar</NavLink></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logs;
