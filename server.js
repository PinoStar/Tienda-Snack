const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "bind"))); // Cambia "bind" por tu directorio
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "bind", "index.html"));
});

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
