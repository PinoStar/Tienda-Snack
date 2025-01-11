const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1993',
    database: 'mundosnack'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la BD:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});

// Endpoint de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Consulta el usuario en la base de datos
    db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        } else if (results.length > 0) {
            const user = results[0];

            // Comparar la contraseña directamente (sin encriptación)
            if (password === user.password) {
                // Enviar respuesta con éxito y rol
                res.json({
                    success: true,
                    message: 'Inicio de sesión exitoso',
                    rol: user.rol // Aquí se incluye el rol del usuario
                });
            } else {
                res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});


// === Usuarios ===

// Listar usuarios
app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        } else {
            res.json(results);
        }
    });
});

// Agregar usuario
app.post('/usuarios', (req, res) => {
    const { username, password, rol } = req.body;
    db.query('INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)', [username, password, rol], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al agregar usuario' });
        } else {
            res.json({ success: true, message: 'Usuario agregado con éxito', id: results.insertId });
        }
    });
});

// Eliminar usuario
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM usuarios WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
        } else {
            res.json({ success: true, message: 'Usuario eliminado con éxito' });
        }
    });
});

// === Productos ===

// Listar productos
app.get('/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        } else {
            res.json(results);
        }
    });
});

app.get('/productos/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM productos WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);  // Agregar esta línea
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        } else if (results.length === 0) {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
        } else {
            res.json(results[0]);
        }
    });
});


// Agregar producto
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio, stock, tienda_id,imagen_url } = req.body; // Cambié 'tienda' por 'tienda_id'
    db.query('INSERT INTO productos (nombre,descripcion, precio, stock, tienda_id, imagen_url) VALUES (?, ?, ?, ?, ?)', [nombre, precio, stock, tienda_id, imagen_url], (err, results) => {
        if (err) {
            console.error('Error al agregar producto:', err);  // Agregar consola para detalles del error
            res.status(500).json({ success: false, message: 'Error al agregar producto', error: err });
        } else {
            res.json({ success: true, message: 'Producto agregado con éxito', id: results.insertId });
        }
    });
    
});


// Actualizar producto
app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, stock, tienda } = req.body;
    db.query('UPDATE productos SET nombre = ?,descripcion=?, precio = ?, stock = ?, tienda = ? WHERE id = ?', [nombre, precio, stock, tienda, id], (err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al actualizar producto' });
        } else {
            res.json({ success: true, message: 'Producto actualizado con éxito' });
        }
    });
});

// Eliminar producto
app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM productos WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al eliminar producto' });
        } else {
            res.json({ success: true, message: 'Producto eliminado con éxito' });
        }
    });
});

// === Tiendas ===

// Listar tiendas
app.get('/tiendas', (req, res) => {
    db.query('SELECT * FROM tiendas', (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        } else {
            res.json(results);
        }
    });
});

// Agregar tienda
app.post('/tiendas', (req, res) => {
    const { nombre, ubicacion } = req.body;
    db.query('INSERT INTO tiendas (nombre, ubicacion) VALUES (?, ?)', [nombre, ubicacion], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al agregar tienda' });
        } else {
            res.json({ success: true, message: 'Tienda agregada con éxito', id: results.insertId });
        }
    });
});

// Actualizar tienda
app.put('/tiendas/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, ubicacion } = req.body;
    db.query('UPDATE tiendas SET nombre = ?, ubicacion = ? WHERE id = ?', [nombre, ubicacion, id], (err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al actualizar tienda' });
        } else {
            res.json({ success: true, message: 'Tienda actualizada con éxito' });
        }
    });
});

// Eliminar tienda
app.delete('/tiendas/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tiendas WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al eliminar tienda' });
        } else {
            res.json({ success: true, message: 'Tienda eliminada con éxito' });
        }
    });
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
