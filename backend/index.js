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
app.post('/lista',(req,res)=>{
    db.query('SELECT * FROM productos',(err,results)=>{
        if(err){
            res.status(500).json({success:false,message:'Error en el servidor'});
        }else{
            res.json(results);
        }
    });
})
// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
