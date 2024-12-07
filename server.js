const express = require('express');
const betterSqlite3 = require('better-sqlite3');
const app = express();
const port = 3000;

// Conexión a la base de datos
const db = betterSqlite3('gestion.db');

// Crear tablas si no existen
db.prepare(`
  CREATE TABLE IF NOT EXISTS panuchos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    ingredientes TEXT NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS empleados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    puesto TEXT NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    panucho_id INTEGER NOT NULL,
    empleado_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente',
    FOREIGN KEY (cliente_id) REFERENCES clientes (id),
    FOREIGN KEY (panucho_id) REFERENCES panuchos (id),
    FOREIGN KEY (empleado_id) REFERENCES empleados (id)
  )
`).run();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// CRUD para panuchos
// Buscar panuchos por nombre
app.get('/api/panuchos/buscar/:nombre', (req, res) => {
  const { nombre } = req.params;
  try {
    const rows = db.prepare('SELECT * FROM panuchos WHERE nombre LIKE ?').all(`%${nombre}%`);
    res.json(rows);
  } catch (error) {
    res.status(500).send('Error al buscar panuchos: ' + error.message);
  }
});

// Listar todos los panuchos
app.get('/api/panuchos', (req, res) => {
  const rows = db.prepare('SELECT * FROM panuchos').all();
  res.json(rows);
});

// Agregar un nuevo panucho
app.post('/api/panuchos', (req, res) => {
  const { nombre, ingredientes } = req.body;
  try {
    db.prepare('INSERT INTO panuchos (nombre, ingredientes) VALUES (?, ?)').run(nombre, ingredientes);
    res.status(201).send('Panucho agregado');
  } catch (error) {
    res.status(500).send('Error al agregar el panucho: ' + error.message);
  }
});

// Editar un panucho existente
app.put('/api/panuchos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, ingredientes } = req.body;
  try {
    db.prepare('UPDATE panuchos SET nombre = ?, ingredientes = ? WHERE id = ?').run(nombre, ingredientes, id);
    res.send('Panucho actualizado');
  } catch (error) {
    res.status(500).send('Error al actualizar el panucho: ' + error.message);
  }
});

// Eliminar un panucho
app.delete('/api/panuchos/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM panuchos WHERE id = ?').run(id);
    res.send('Panucho eliminado');
  } catch (error) {
    res.status(500).send('Error al eliminar el panucho: ' + error.message);
  }
});

// CRUD para clientes
// Buscar clientes por nombre
app.get('/api/clientes/buscar/:nombre', (req, res) => {
  const { nombre } = req.params;
  try {
    const rows = db.prepare('SELECT * FROM clientes WHERE nombre LIKE ?').all(`%${nombre}%`);
    res.json(rows);
  } catch (error) {
    res.status(500).send('Error al buscar clientes: ' + error.message);
  }
});

// Listar todos los clientes
app.get('/api/clientes', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM clientes').all();
    res.json(rows);
  } catch (error) {
    res.status(500).send('Error al listar los clientes: ' + error.message);
  }
});

// Agregar un nuevo cliente
app.post('/api/clientes', (req, res) => {
  const { nombre, correo } = req.body;
  try {
    db.prepare('INSERT INTO clientes (nombre, correo) VALUES (?, ?)').run(nombre, correo);
    res.status(201).send('Cliente agregado');
  } catch (error) {
    res.status(500).send('Error al agregar el cliente: ' + error.message);
  }
});

// Editar un cliente existente
app.put('/api/clientes/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, correo } = req.body;
  try {
    db.prepare('UPDATE clientes SET nombre = ?, correo = ? WHERE id = ?').run(nombre, correo, id);
    res.send('Cliente actualizado');
  } catch (error) {
    res.status(500).send('Error al actualizar el cliente: ' + error.message);
  }
});

// Eliminar un cliente
app.delete('/api/clientes/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM clientes WHERE id = ?').run(id);
    res.send('Cliente eliminado');
  } catch (error) {
    res.status(500).send('Error al eliminar el cliente: ' + error.message);
  }
});

// CRUD para empleados
// Buscar empleados por nombre
app.get('/api/empleados/buscar/:nombre', (req, res) => {
  const { nombre } = req.params;
  try {
    const rows = db.prepare('SELECT * FROM empleados WHERE nombre LIKE ?').all(`%${nombre}%`);
    res.json(rows);
  } catch (error) {
    res.status(500).send('Error al buscar empleados: ' + error.message);
  }
});

// Listar todos los empleados
app.get('/api/empleados', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM empleados').all();
    res.json(rows);
  } catch (error) {
    res.status(500).send('Error al listar los empleados: ' + error.message);
  }
});

// Agregar un nuevo empleado
app.post('/api/empleados', (req, res) => {
  const { nombre, puesto } = req.body;
  try {
    db.prepare('INSERT INTO empleados (nombre, puesto) VALUES (?, ?)').run(nombre, puesto);
    res.status(201).send('Empleado agregado');
  } catch (error) {
    res.status(500).send('Error al agregar el empleado: ' + error.message);
  }
});

// Editar un empleado existente
app.put('/api/empleados/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, puesto } = req.body;
  try {
    db.prepare('UPDATE empleados SET nombre = ?, puesto = ? WHERE id = ?').run(nombre, puesto, id);
    res.send('Empleado actualizado');
  } catch (error) {
    res.status(500).send('Error al actualizar el empleado: ' + error.message);
  }
});

// Eliminar un empleado
app.delete('/api/empleados/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM empleados WHERE id = ?').run(id);
    res.send('Empleado eliminado');
  } catch (error) {
    res.status(500).send('Error al eliminar el empleado: ' + error.message);
  }
});


// CRUD para pedidos
app.post('/api/pedidos', (req, res) => {
  const { cliente_id, panucho_id, empleado_id, cantidad } = req.body;
  try {
    db.prepare(`
      INSERT INTO pedidos (cliente_id, panucho_id, empleado_id, cantidad)
      VALUES (?, ?, ?, ?)
    `).run(cliente_id, panucho_id, empleado_id, cantidad);
    res.status(201).send('Pedido creado');
  } catch (error) {
    res.status(500).send('Error al crear el pedido: ' + error.message);
  }
});

app.get('/api/pedidos', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT pedidos.id, 
             clientes.nombre AS cliente, 
             panuchos.nombre AS panucho,
             empleados.nombre AS empleado, 
             pedidos.cantidad, 
             pedidos.estado
      FROM pedidos
      JOIN clientes ON pedidos.cliente_id = clientes.id
      JOIN panuchos ON pedidos.panucho_id = panuchos.id
      JOIN empleados ON pedidos.empleado_id = empleados.id
    `).all();
    res.json(rows);
  } catch (error) {
    res.status(500).send('Error al listar los pedidos: ' + error.message);
  }
});


app.put('/api/pedidos/:id', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    db.prepare('UPDATE pedidos SET estado = ? WHERE id = ?').run(estado, id);
    res.send('Pedido actualizado');
  } catch (error) {
    res.status(500).send('Error al actualizar el pedido: ' + error.message);
  }
});

app.delete('/api/pedidos/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM pedidos WHERE id = ?').run(id);
    res.send('Pedido eliminado');
  } catch (error) {
    res.status(500).send('Error al eliminar el pedido: ' + error.message);
  }
});
// Obtener un pedido específico por ID
app.get('/api/pedidos/:id', (req, res) => {
  const { id } = req.params;
  try {
    const pedido = db.prepare(`
      SELECT pedidos.id, clientes.nombre AS cliente, panuchos.nombre AS panucho,
             empleados.nombre AS empleado, pedidos.cantidad, pedidos.estado
      FROM pedidos
      JOIN clientes ON pedidos.cliente_id = clientes.id
      JOIN panuchos ON pedidos.panucho_id = panuchos.id
      JOIN empleados ON pedidos.empleado_id = empleados.id
      WHERE pedidos.id = ?
    `).get(id);

    if (pedido) {
      res.json(pedido);
    } else {
      res.status(404).send('Pedido no encontrado');
    }
  } catch (error) {
    res.status(500).send('Error al obtener el pedido: ' + error.message);
  }
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
