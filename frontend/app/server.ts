import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import path from 'node:path';
import bootstrap from './src/main.server';

export function app(): express.Express {
  // Crear una instancia de Express
  const server = express();

  // Obtener las rutas del servidor y del navegador
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  // Crear instancia de CommonEngine para renderización SSR
  const commonEngine = new CommonEngine();

  // Configurar el motor de vistas y la carpeta de vistas
  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Servir los archivos estáticos de la aplicación Angular
  server.use(express.static(path.join(__dirname, 'dist', 'app')));

  // Manejar las solicitudes a todas las rutas con la renderización SSR
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    // Renderizar el contenido con Angular SSR (usando CommonEngine)
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  // Configurar el puerto en el que escuchará el servidor
  const port = process.env['PORT'] || 4000;

  // Iniciar el servidor
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}
run();