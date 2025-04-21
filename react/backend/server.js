require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());

// Configuración de CORS para permitir solicitudes desde el frontend (puerto 3001)
const corsOptions = {
  origin: 'http://localhost:3000',  // Cambia esto si tu frontend está en otro puerto
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

const upload = multer();

const dbConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

// Función para probar la conexión a la base de datos
const testConnection = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Conexión a la base de datos exitosa');
    await connection.end();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
};

// Probar la conexión cuando inicie el servidor
testConnection();

// Ruta para crear un usuario
app.post('/api/usuarios', upload.single('foto'), async (req, res) => {
  try {
    const nombre = req.body.nombre?.trim() || '';
    const dni = req.body.dni?.trim() || '';
    const foto = req.file?.buffer;

    if (!nombre || !dni) {
      return res.status(400).json({ error: 'Nombre y DNI son requeridos' });
    }

    // Intentar conectar a la base de datos
    const connection = await mysql.createConnection(dbConfig);
    // Ejecutar la consulta
    await connection.execute(
      'INSERT INTO usuarios (nombre, dni, foto) VALUES (?, ?, ?)',
      [nombre, dni, foto]
    );
    
    // Cerrar la conexión
    await connection.end();
    
    res.status(201).json({ message: 'Usuario creado' });
  } catch (error) {
    // Si hay un error, mostrarlo
    console.error('Error en la conexión o al insertar el usuario:', error.message);
    res.status(500).json({ error: 'Error al crear usuario', details: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor escuchando en el puerto ${port}`));
