const express = require('express');
const { Client } = require('pg'); // Importar el cliente de PostgreSQL
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos PostgreSQL
const client = new Client({
    host: 'demonstrably-advisable-skink.data-1.use1.tembo.io',
    port: 5432,
    user: 'postgres',
    password: 'S0KPiGzccUj5ARa5',
    database: 'postgres',
    ssl: {
        rejectUnauthorized: false // Esto es importante si el servidor no tiene un certificado validado
    }
});

client.connect()
    .then(() => {
        console.log('Conectado a PostgreSQL');
    })
    .catch(err => {
        console.error('Error al conectar con la base de datos PostgreSQL:', err.stack);
    });

// Endpoint de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Consulta el usuario en la base de datos
    client.query('SELECT * FROM usuarios WHERE username = $1', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        } else if (results.rows.length > 0) {
            const user = results.rows[0];

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
    client.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        } else {
            res.json(results.rows);
        }
    });
});

// Agregar usuario
app.post('/usuarios', (req, res) => {
    const { username, password, rol } = req.body;
    client.query('INSERT INTO usuarios (username, password, rol) VALUES ($1, $2, $3) RETURNING id', 
    [username, password, rol], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al agregar usuario' });
        } else {
            res.json({ success: true, message: 'Usuario agregado con éxito', id: results.rows[0].id });
        }
    });
});

// Actualizar usuario
app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { username, password, rol } = req.body;
    client.query('UPDATE usuarios SET username = $1, password = $2, rol = $3 WHERE id = $4', 
    [username, password, rol, id], (err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
        } else {
            res.json({ success: true, message: 'Usuario actualizado con éxito' });
        }
    });
});

// Eliminar usuario
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    client.query('DELETE FROM usuarios WHERE id = $1', [id], (err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
        } else {
            res.json({ success: true, message: 'Usuario eliminado con éxito' });
        }
    });
});

// === Endpoints de productos ===

// Listar productos
app.get('/productos', (req, res) => {
    client.query('SELECT * FROM productos', (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        } else {
            res.json(results.rows);
        }
    });
});

// Listar un solo producto
app.get('/productos/:id', (req, res) => {
    const { id } = req.params;
    client.query('SELECT * FROM productos WHERE id = $1', [id], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        } else if (results.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
        } else {
            res.json(results.rows[0]);
        }
    });
});

// Agregar producto
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio, stock, imagen_url } = req.body;
    client.query('INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url) VALUES ($1, $2, $3, $4, $5) RETURNING id', 
    [nombre, descripcion, precio, stock, imagen_url], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al agregar producto' });
        } else {
            res.json({ success: true, message: 'Producto agregado con éxito', id: results.rows[0].id });
        }
    });
});

// Actualizar producto
app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, imagen_url } = req.body;
    client.query('UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, stock = $4, imagen_url = $5 WHERE id = $6', 
    [nombre, descripcion, precio, stock, imagen_url, id], (err) => {
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
    client.query('DELETE FROM productos WHERE id = $1', [id], (err) => {
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
    client.query('SELECT * FROM tiendas', (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        } else {
            res.json(results.rows);
        }
    });
});

// Agregar tienda
app.post('/tiendas', (req, res) => {
    const { nombre, direccion } = req.body;
    client.query('INSERT INTO tiendas (nombre, direccion) VALUES ($1, $2) RETURNING id', 
    [nombre, direccion], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al agregar tienda' });
        } else {
            res.json({ success: true, message: 'Tienda agregada con éxito', id: results.rows[0].id });
        }
    });
});

// Actualizar tienda
app.put('/tiendas/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, direccion } = req.body;
    client.query('UPDATE tiendas SET nombre = $1, direccion = $2 WHERE id = $3', 
    [nombre, direccion, id], (err) => {
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
    client.query('DELETE FROM tiendas WHERE id = $1', [id], (err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al eliminar tienda' });
        } else {
            res.json({ success: true, message: 'Tienda eliminada con éxito' });
        }
    });
});
//lista productos de un pedido
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

// Listar productos de un pedido
app.get('/pedidos_productos/:pedidoId', (req, res) => {
    const pedidoId = req.params.pedidoId;
    client.query('SELECT * FROM pedido_productos WHERE pedido_id = $1', [pedidoId], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        } else {
            res.json(results.rows);
        }
    });
});

// Agregar pedido
app.post('/pedidos', (req, res) => {
    client.query('INSERT INTO pedidos(vendedor_id, tienda_id, total) VALUES ($1, $2, $3) RETURNING id', [req.body.vendedor_id, req.body.tienda_id, req.body.total], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al agregar pedido' });
        } else {
            res.json({ success: true, message: 'Pedido agregado con éxito', id: results.rows[0].id });
        }
    });
});

app.get('/pedidos/ultimoId', (req, res) => {
    client.query('SELECT MAX(id) AS max_id FROM pedidos', (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al obtener el último pedidoId' });
        } else {
            const ultimoId = results.rows[0].max_id;
            if (ultimoId === null) {
                res.json({ success: true, ultimoId: 0 });  // No hay pedidos, retornamos 0
            } else {
                res.json({ ultimoId });
            }
        }
    });
});

app.get('/pedidosid/productos', async (req, res) => {  // Obtener los productos del último pedido
    client.query('SELECT pp.id as pedido_producto_id, pp.cantidad, pp.subtotal, p.nombre, p.descripcion, p.precio, p.imagen_url ' +
    'FROM pedido_productos pp JOIN productos p ON pp.producto_id = p.id WHERE pp.pedido_id = (SELECT MAX(id) FROM pedidos)', 
    (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al obtener los productos del último pedido' });
        } else {
            res.json(results.rows);
        }
    });
});

app.post('/notadeventa', (req, res) => {
    client.query('INSERT INTO notas_de_venta(pedido_id, vendedor_id, total) VALUES ($1, $2, $3) RETURNING id', 
    [req.body.pedidoId, req.body.vendedorId, req.body.total], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al agregar nota de venta' });
        } else {
            res.json({ success: true, message: 'Nota de venta agregada con éxito', id: results.rows[0].id });
        }
    });
});

app.get('/notadeventa', (req, res) => {
    client.query('SELECT * FROM notas_de_venta', (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al obtener notas de venta' });
        } else {
            res.json(results.rows);
        }
    });
});

// Obtener detalles de la factura
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
        WHERE nv.id = $1;
    `;

    client.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener los detalles de la factura:', err);
            res.status(500).json({ success: false, message: 'Error al obtener los detalles de la factura' });
        } else if (results.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Factura no encontrada' });
        } else {
            res.json({
                success: true,
                factura: {
                    id: results.rows[0].nota_id,
                    fecha: results.rows[0].fecha_nota,
                    total: results.rows[0].total_nota,
                    tienda: {
                        id: results.rows[0].tienda_id,
                        nombre: results.rows[0].nombre_tienda,
                        direccion: results.rows[0].direccion_tienda,
                        ruc: results.rows[0].ruc_tienda,
                        propietario: results.rows[0].propietario_tienda,
                    },
                    detalles: results.rows.map((row) => ({
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

// Agregar factura
app.post('/factura', (req, res) => {
    client.query('INSERT INTO facturas(nota_de_venta_id, facturador_id, subtotal, total, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id', 
    [req.body.notaDeVentaId, req.body.facturadorId, req.body.subtotal, req.body.total, req.body.fecha], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al agregar factura' });
        } else {
            res.json({ success: true, message: 'Factura agregada con éxito', id: results.rows[0].id });
        }
    });
});

// Obtener facturas por tienda
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
            p.tienda_id = $1;
    `;

    client.query(query, [tiendaId], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).send('Error al ejecutar la consulta');
            return;
        }
        res.json(results.rows);
    });
});

// Obtener productos de la factura
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
            f.id = $1;
    `;

    client.query(query, [facturaId], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).send('Error al ejecutar la consulta');
            return;
        }
        res.json(results.rows);
    });
});

// Agregar productos a un pedido
app.post('/pedidos_productos', (req, res) => {
    client.query('INSERT INTO pedido_productos(pedido_id, producto_id, cantidad, subtotal) VALUES ($1, $2, $3, $4) RETURNING id', 
    [req.body.pedidoId, req.body.productoId, req.body.cantidad, req.body.subtotal], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al agregar pedido_producto' });
        } else {
            res.json({ success: true, message: 'Pedido_producto agregado con éxito', id: results.rows[0].id });
        }
    });
});




// Escuchar en el puerto
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
