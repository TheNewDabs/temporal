import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './components/main';
import Logs from './components/Logs';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main></Main>}></Route>
          <Route path="/Logs" element={<Logs></Logs>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
