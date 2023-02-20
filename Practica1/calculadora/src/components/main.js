import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Main() {

  const [Pantalla, setPantalla] = useState("0");
  const [Num1, setNum1] = useState(0.0);
  const [Num2, setNum2] = useState(0.0);
  const [NumInset, setNumInset] = useState(false);
  const [Operacion, setOperacion] = useState("");
  const [Select, setSelect] = useState(true);
  const [Decimales, setDecimales] = useState(0);
  const [Error, setError] = useState(false);
  const [Post, setPost] = useState(false);

  const Llamada = async () => {
    var Result = 0.0;
    var Bloquear = false;
    await fetch('http://localhost:4000/',
      {
        method: 'POST',
        body: JSON.stringify({
          "Num1": Num1,
          "Num2": Num2,
          "Operacion": Operacion
        })
      })
      .then(res => res.json())
      .then(res => {
        Bloquear = (!res.Error == "")
        setError(Bloquear)
        setPost(true)
        Result = res.Resultado;
        if (Bloquear) {
          setPantalla(res.Error)
        } else if (Operacion == '=') {
          setOperacion('')
          setPantalla(Num1)
        } else {
          setNum2(0.0)
          setNumInset(false)
          setOperacion('')
          setSelect(true)
          setDecimales(0)
          setNum1(res.Resultado)
          setPantalla(res.Resultado)
        }
      })
    return [Result, Bloquear]
  }

  const LlamadaNum1 = async () => {
    var Result = 0.0;
    await fetch('http://localhost:4000/',
      {
        method: 'POST',
        body: JSON.stringify({
          "Num1": Num1,
          "Num2": Num2,
          "Operacion": "="
        })
      })
      .then(res => res.json())
      .then(res => {
        setError(!(res.Error == ""))
        setPost(true)
        Result = res.Resultado;
        if (Error) {
          setPantalla(res.Resultado)
        } else if (Operacion == '=') {
          setOperacion('')
          setPantalla(Num1)
        } else {
          setNum2(0.0)
          setNumInset(false)
          setOperacion('')
          setSelect(true)
          setDecimales(0)
          setNum1(res.Resultado)
          setPantalla(res.Resultado)
        }
      })
    return Result
  }

  const Numero = (Num) => {
    if (!Error) {
      if (Post) {
        setNum1(Num)
        setPantalla(Num);
        setPost(false)
      } else {
        if (Select) {
          if (Decimales == 0) {
            setNum1(Num1 * 10 + Num);
            setPantalla(Num1 * 10 + Num);
          } else {
            setNum1(Num1 + Num * Decimales);
            setPantalla(Num1 + Num * Decimales);
            setDecimales(Decimales * 0.1);
          }
        } else {
          setNumInset(true)
          if (Decimales == 0) {
            setNum2(Num2 * 10 + Num);
            setPantalla(Num1 + Operacion + (Num2 * 10 + Num));
          } else {
            setNum2(Num2 + Num * Decimales);
            setPantalla(Num1 + Operacion + (Num2 + Num * Decimales));
            setDecimales(Decimales * 0.1);
          }
        }
      }
    }
  }

  const Operar = async (Operador) => {
    if (Operador == "c") {
      setPantalla("0");
      setNum1(0.0);
      setNum2(0.0);
      setNumInset(false)
      setOperacion("");
      setSelect(true);
      setDecimales(0);
      setPost(false)
      setError(false)
    } else if (!Error) {
      if (Post) {
        setPost(false)
      }
      if (Select) {
        if (Operador == ".") {
          if (Decimales == 0) {
            setDecimales(0.1);
            if (Select) {
              if (Post) {
                setNum1(0)
                setPantalla(0 + ".");
              } else {
                setPantalla(Num1 + ".");
              }
            } else {
              setPantalla(Num1 + Operacion + Num2 + ".");
            }
          }
        } else if (Operador == "+" || Operador == "-" || Operador == "*" || Operador == "/") {
          setOperacion(Operador);
          setSelect(false);
          setDecimales(0);
          setPantalla(Num1 + Operador)
          setNum2(0.0);
          setNumInset(false)
        } else if (Operador == "=") {
          setOperacion("=");
          LlamadaNum1();
        }
      } else {
        if (NumInset) {
          var [Result, Bloquear] = await Llamada()
          if (!Bloquear) {
            if (Operador == "+" || Operador == "-" || Operador == "*" || Operador == "/") {
              setPost(false);
              setOperacion(Operador);
              setSelect(false);
              setDecimales(0);
              setPantalla(Result + Operador)
              setNum2(0.0);
              setNumInset(false)
            }
          }
        } else if (Operador == "=") {
          setOperacion("=");
          LlamadaNum1();
        } else {
          setOperacion(Operador);
          setPantalla(Num1 + Operador)
        }
      }
    }
  }

  return (
    <div>
      <div id="calculadora" className="base">
        <div className="container">
          <div className="row">
            <div className="offset-xl-4 col-xl-4 offset-xl-4 offset-lg-3 col-lg-6 offset-lg-3 offset-md-3 col-md-6 offset-md-3 offset-sm-1 col-sm-10 offset-sm-1 offset-1 col-10 offset-1">
              <form className="main_form">
                <h3 className="colorh3">Calculadora</h3>
                <input className="contactus" type="textfield" name="ans" value={Pantalla}></input>
                <br />
                <button className="col-3 tecla" type="button" value="1" onClick={() => Numero(1.0)}>1</button>
                <button className="col-3 tecla" type="button" value="2" onClick={() => Numero(2.0)}>2</button>
                <button className="col-3 tecla" type="button" value="3" onClick={() => Numero(3.0)}>3</button>
                <button className="col-3 tecla" type="button" value="+" onClick={() => Operar("+")}>+</button>
                <br />
                <button className="col-3 tecla" type="button" value="4" onClick={() => Numero(4.0)}>4</button>
                <button className="col-3 tecla" type="button" value="5" onClick={() => Numero(5.0)}>5</button>
                <button className="col-3 tecla" type="button" value="6" onClick={() => Numero(6.0)}>6</button>
                <button className="col-3 tecla" type="button" value="-" onClick={() => Operar("-")}>-</button>
                <br />
                <button className="col-3 tecla" type="button" value="7" onClick={() => Numero(7.0)}>7</button>
                <button className="col-3 tecla" type="button" value="8" onClick={() => Numero(8.0)}>8</button>
                <button className="col-3 tecla" type="button" value="9" onClick={() => Numero(9.0)}>9</button>
                <button className="col-3 tecla" type="button" value="*" onClick={() => Operar("*")}>*</button>
                <br />
                <button className="col-3 tecla" type="button" value="0" onClick={() => Numero(0.0)}>0</button>
                <button className="col-3 tecla" type="button" value="." onClick={() => Operar(".")}>.</button>
                <button className="col-3 tecla" type="button" value="c" onClick={() => Operar("c")}>c</button>
                <button className="col-3 tecla" type="button" value="/" onClick={() => Operar("/")}>/</button>
                <button className="col-12 tecla" type="button" value="=" onClick={() => Operar("=")}>=</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div id="LogsButton" className="base">
        <div className="container">
          <div className="row">
            <div className="offset-xl-4 col-xl-4 offset-xl-4 offset-lg-3 col-lg-6 offset-lg-3 offset-md-3 col-md-6 offset-md-3 offset-sm-1 col-sm-10 offset-sm-1 offset-1 col-10 offset-1">
              <form className="main_form">
                <button className="col-12 tecla" type="button" value="Ver Logs"><NavLink to='/Logs' className="tecla">Ver Logs</NavLink></button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
