const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const { ObjectId } = require("mongodb");
const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/mongo"

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
  });

  const procesoSchema = new mongoose.Schema({
    pid: Number,
    nombre: String,
    usuario: String,
    estado: String,
    cpu: Number
  });

const Proceso = mongoose.model('Proceso', procesoSchema);



app.get('/procesos', (req, res) => {
  Proceso.find()
    .then((procesos) => {
      res.json(procesos);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

app.delete('/procesos/:pid', (req, res) => {
  const pidProceso = req.params.pid;

  Proceso.findOneAndDelete({ pid: pidProceso })
    .then((procesoEliminado) => {
      if (!procesoEliminado) {
        return res.status(404).json({ message: 'Proceso no encontrado' });
      }
      res.json(procesoEliminado);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

app.listen(3001, () => {
  console.log('API escuchando en el puerto 3001');
});

app.post('/procesos', (req, res) => {
  const { pid, nombre, usuario, estado, cpu } = req.body;

  const nuevoProceso = new Proceso({
    pid,
    nombre,
    usuario,
    estado,
    cpu
  });

  nuevoProceso.save()
    .then((procesoGuardado) => {
      res.status(201).json(procesoGuardado);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});