const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // <-- Este es el cambio

// Servir todos los archivos estáticos
app.use(express.static(__dirname));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// ✅ SOLO LEE el número de acta actual (sin incrementarlo)
app.get('/api/ver-acta', (req, res) => {
    const contadorPath = path.join(__dirname, 'contador.json');
    fs.readFile(contadorPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer contador.json' });
        }
        const contador = JSON.parse(data);
        res.json({ numeroActa: contador.numeroActa });
    });
});

// ✅ SOLO AQUÍ se incrementa el número de acta
app.get('/api/acta', (req, res) => {
    const contadorPath = path.join(__dirname, 'contador.json');
    fs.readFile(contadorPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer contador.json' });
        }

        let contador = JSON.parse(data);
        contador.numeroActa += 1;

        fs.writeFile(contadorPath, JSON.stringify(contador, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar contador.json' });
            }

            res.json({ numeroActa: contador.numeroActa });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor contador activo en http://localhost:${PORT}`);
});




