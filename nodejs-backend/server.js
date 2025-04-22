require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
const upload = multer();

const dbConfig = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: 3308
};
app.use(cors());
app.post('/api/usuarios', upload.single('foto'), async (req, res) => {
  try {
    const nombre = req.body.nombre?.trim() || null;
    const dni = req.body.dni?.trim() || null;
    const foto = req.file?.buffer || null;

    if (!nombre || !dni) {
      return res.status(400).json({ error: 'Nombre y DNI son requeridos' });
    }

    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'INSERT INTO usuarios (nombre, dni, foto) VALUES (?, ?, ?)',
      [nombre, dni, foto]
    );
    await connection.end();
    res.status(201).json({ message: 'Usuario creado' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Servidor escuchando en el puerto ${port}`));