const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static('public'));
// Conexión a la base de datos
const db = mysql.createConnection({
    host: 'mysql-ca47738-carlitosbriones24-eb25.g.aivencloud.com',
    user: 'avnadmin',
    port: 17891,
    password: 'AVNS_hv2hpTZ9FFXZ6GF-1Ph',
    database: 'distribuidor_db',
    ssl: {
        rejectUnauthorized: false // Esto es importante si el servidor no tiene un certificado validado
    }
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la BD:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});


// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'bin', 'index.html'));
//   });
  
// Endpoint de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Consulta el usuario en la base de datos
    db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        } else if (results.length > 0) {
            const user = results[0];

            // Comparar la contraseña directamente (sin encriptación)
            if (password === user.password) {
                // Enviar respuesta con éxito, rol y user_id
                res.json({
                    success: true,
                    message: 'Inicio de sesión exitoso',
                    id: user.id,  // Incluye el user_id en la respuesta
                    rol: user.rol     // Aquí se incluye el rol del usuario
                });
            } else {
                res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});

// === Endpoints de usuarios ===

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

app.get('/empleados', (req, res) => {
    db.query('SELECT * FROM empleados', (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
        res.json(results);
    });
});

// === Endpoints de productos ===

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

// Listar un solo producto
app.get('/productos/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM productos WHERE id = ?', [id], (err, results) => {
        if (err) {
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
    const { nombre, descripcion, precio, stock, imagen_url } = req.body;
    db.query('INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url) VALUES (?, ?, ?, ?, ?)', 
    [nombre, descripcion, precio, stock, imagen_url], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al agregar producto' });
        } else {
            res.json({ success: true, message: 'Producto agregado con éxito', id: results.insertId });
        }
    });
});

// Actualizar producto
app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, stock, tienda } = req.body;
    db.query('UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, tienda = ? WHERE id = ?', [nombre, precio, stock, tienda, id], (err) => {
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

// === Endpoints de tiendas ===

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
    const { nombre, ubicacion, ruc, propietario, imagen_url } = req.body;
    db.query('INSERT INTO tiendas (nombre, ubicacion, ruc, propietario, imagen_url) VALUES (?, ?, ?, ?, ?)', 
    [nombre, ubicacion, ruc, propietario, imagen_url], (err, results) => {
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

// === Endpoints de pedidos y productos de pedidos ===

// Listar productos de un pedido
app.get('/pedidos_productos/:pedidoId', (req, res) => {
    const pedidoId = req.params.pedidoId;
    db.query('SELECT * FROM pedido_productos WHERE pedido_id = ?', [pedidoId], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        } else {
            res.json(results);
        }
    });
});

// Agregar pedido
app.post('/pedidos', (req, res) => {
    db.query('INSERT INTO pedidos(vendedor_id, tienda_id, total) VALUES (?, ?, ?)', [req.body.vendedor_id, req.body.tienda_id, req.body.total], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al agregar pedido' });
        } else {
            res.json({ success: true, message: 'Pedido agregado con éxito', id: results.insertId });
        }
    });
});

app.get('/pedidos/ultimoId', (req, res) => {
    db.query('SELECT MAX(id) AS max_id FROM pedidos', (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al obtener el último pedidoId' });
        } else {
            const ultimoId = results[0].max_id;
            if (ultimoId === null) {
                res.json({ success: true, ultimoId: 0 });  // No hay pedidos, retornamos 0
            } else {
                res.json({ ultimoId });
            }
        }
    });
});

app.get('/pedidosid/productos', async (req, res) => {  // Obtener los productos del último pedido
    db.query('SELECT pp.id as pedido_producto_id, pp.cantidad, pp.subtotal, p.nombre, p.descripcion,p.precio, p.imagen_url FROM pedido_productos pp JOIN productos p ON pp.producto_id = p.id WHERE pp.pedido_id = (SELECT MAX(id) FROM pedidos)', (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al obtener los productos del último pedido' });
        } else {
            res.json(results);
        }
    });
});  

app.post('/notadeventa', (req, res) => {
    db.query('INSERT INTO notas_de_venta(pedido_id, vendedor_id, total) VALUES (?, ?, ?)', [req.body.pedidoId, req.body.vendedorId, req.body.total], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al agregar nota de venta' });
        } else {
            res.json({ success: true, message: 'Nota de venta agregada con éxito', id: results.insertId });
        }
    });
});

app.get('/notadeventa', (req, res) => {
    db.query('SELECT * FROM notas_de_venta', (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al obtener notas de venta' });
        } else {
            res.json(results);
        }
    });
});

app.get('/factura/:id', (req, res) => {
    const { id } = req.params;

    const query = `
            SELECT 
            nv.id AS nota_id,
            nv.created_at AS fecha_nota,
            nv.total AS total_nota,
            t.id AS tienda_id,
            t.nombre AS nombre_tienda,
            t.ubicacion AS direccion_tienda,
            t.ruc AS ruc_tienda,
            t.propietario AS propietario_tienda,
            pp.cantidad AS cantidad_producto,
            pp.subtotal AS subtotal_producto,
            pr.nombre AS nombre_producto,
            pr.precio AS precio_unitario
        FROM notas_de_venta nv
        JOIN pedidos p ON nv.pedido_id = p.id
        JOIN tiendas t ON p.tienda_id = t.id
        JOIN pedido_productos pp ON pp.pedido_id = p.id
        JOIN productos pr ON pp.producto_id = pr.id
        WHERE nv.id = ?;
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener los detalles de la factura:', err);
            res.status(500).json({ success: false, message: 'Error al obtener los detalles de la factura' });
        } else if (results.length === 0) {
            res.status(404).json({ success: false, message: 'Factura no encontrada' });
        } else {
            res.json({
                success: true,
                factura: {
                    id: results[0].nota_id,
                    fecha: results[0].fecha_nota,
                    total: results[0].total_nota,
                    tienda: {
                        id: results[0].tienda_id,
                        nombre: results[0].nombre_tienda,
                        direccion: results[0].direccion_tienda,
                        ruc: results[0].ruc_tienda,
                        propietario: results[0].propietario_tienda,
                    },
                    detalles: results.map((row) => ({
                        nombre_producto: row.nombre_producto,
                        cantidad: row.cantidad_producto,
                        precio_unitario: row.precio_unitario,
                        subtotal: row.subtotal_producto,
                    })),
                },
            });
        }
    });
});

app.post('/factura', (req, res) => {
    db.query('INSERT INTO facturas(nota_de_venta_id,facturador_id,subtotal,total) VALUES (?, ?, ?, ?)', 
    [req.body.notaDeVentaId, req.body.facturadorId, req.body.subtotal, req.body.total, req.body.fecha], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al agregar factura' });
        } else {
            res.json({ success: true, message: 'Factura agregada con éxito', id: results.insertId });
        }
    });
});
app.get('/facturas/:tiendaId', (req, res) => {
    const tiendaId = req.params.tiendaId;

    const query = `
        SELECT 
            f.id AS factura_id,
            f.created_at AS fecha_factura,
            f.total AS total_factura
        FROM 
            facturas f
        JOIN 
            notas_de_venta nv ON f.nota_de_venta_id = nv.id
        JOIN 
            pedidos p ON nv.pedido_id = p.id
        WHERE 
            p.tienda_id = ?;
    `;

    db.query(query, [tiendaId], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).send('Error al ejecutar la consulta');
            return;
        }
        res.json(results);
    });
});


app.get('/producfactura/:facturaId', (req, res) => {
    const facturaId = req.params.facturaId;

    const query = `
        SELECT 
            f.id AS factura_id,
            f.created_at AS fecha_factura,
            f.subtotal AS subtotal_factura,
            f.iva AS iva_factura,
            f.total AS total_factura,
            t.nombre AS nombre_tienda,
            t.ubicacion AS direccion_tienda,
            t.ruc AS ruc_tienda,
            t.propietario AS propietario_tienda,
            pr.nombre AS nombre_producto,
            pp.cantidad,
            pr.precio AS precio_unitario,
            pp.subtotal
        FROM 
            facturas f
        JOIN 
            notas_de_venta nv ON f.nota_de_venta_id = nv.id
        JOIN 
            pedidos p ON nv.pedido_id = p.id
        JOIN 
            tiendas t ON p.tienda_id = t.id
        JOIN 
            pedido_productos pp ON p.id = pp.pedido_id
        JOIN 
            productos pr ON pp.producto_id = pr.id
        WHERE 
            f.id = ?;
    `;

    db.query(query, [facturaId], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).send('Error al ejecutar la consulta');
            return;
        }
        res.json(results);
    });
});

// app.get('/historialtiendas/:tiendaId', async (req, res) => {
//     const tiendaId = req.params.tiendaId;

//     const query = `
//         SELECT 
//             nv.id AS nota_id,
//             nv.created_at AS fecha_nota,
//             nv.total AS total_nota,
//             t.id AS tienda_id,
//             t.nombre AS nombre_tienda,
//             t.ubicacion AS direccion_tienda,
//             t.ruc AS ruc_tienda,
//             t.propietario AS propietario_tienda,
//             p.id AS pedido_id,
//             p.total AS total_pedido,
//             f.id AS factura_id,
//             f.subtotal AS subtotal_factura,
//             f.iva AS iva_factura,
//             f.total AS total_factura
//         FROM 
//             notas_de_venta nv
//         JOIN 
//             pedidos p ON nv.pedido_id = p.id
//         JOIN 
//             tiendas t ON p.tienda_id = t.id
//         JOIN 
//             facturas f ON nv.id = f.nota_de_venta_id
//         WHERE 
//             t.id = ?;
//     `;

//     db.query(query, [tiendaId], (err, results) => {
//         if (err) {
//             console.error('Error al ejecutar la consulta:', err);
//             res.status(500).send('Error al ejecutar la consulta');
//             return;
//         }
//         res.json(results);
//     });
// });


// app.get('/pedidosid/productos', async (req, res) => {
//     try {
//       // Obtener el último pedido
//       const [ultimoPedido] = await db.query('SELECT id FROM pedidos ORDER BY id DESC LIMIT 1');
//       console.log('Ultimo pedido:', ultimoPedido);
//       console.log(productos)
      
//       if (ultimoPedido) {
//         // Consulta para obtener los productos del último pedido
//         const productos = await db.query(`
//           SELECT 
//             pp.id AS pedido_producto_id,
//             pp.cantidad,
//             pp.subtotal,
//             p.nombre,
//             p.descripcion,
//             p.imagen_url
//           FROM 
//             pedido_productos pp
//           JOIN 
//             productos p ON pp.producto_id = p.id
//           WHERE 
//             pp.pedido_id = ?`, 
//           [ultimoPedido.id]
//         );
  
//         // Devolver los productos al cliente
//         res.json(productos);
//       } else {
//         res.status(404).json({ success: false, message: 'No se encontró ningún pedido.' });
//       }
//     } catch (error) {
//       console.error('Error al obtener productos del pedido:', error);
//       res.status(500).json({ success: false, message: 'Error interno del servidor.' });
//     }
//   });
  
// Agregar productos a un pedido
app.post('/pedidos_productos', (req, res) => {
    db.query('INSERT INTO pedido_productos(pedido_id, producto_id, cantidad, subtotal) VALUES (?, ?, ?, ?)', 
    [req.body.pedidoId, req.body.productoId, req.body.cantidad, req.body.subtotal], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al agregar pedido_producto' });
        } else {
            res.json({ success: true, message: 'Pedido_producto agregado con éxito', id: results.insertId });
        }
    });
});


// // const express = require('express');
// const path = require('path');
// // const app = express();

// app.use(express.static(path.join(__dirname, 'dist', 'app')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'app', 'index.html'));
// });

// app.listen(8080, () => console.log('Servidor corriendo en puerto 8080'));

// Inicia el servidor
 app.listen(port, () => {
     console.log(`Servidor corriendo en http://localhost:${port}`);
 });
