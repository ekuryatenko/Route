import Path from 'path';
import Hapi from 'hapi';
import Inert from 'inert';
import Vision from 'vision';
import Pug from 'pug';
import Handlebars from 'handlebars';
import serverRoutes from './myRoute';

/**
 * Involves plugins to Server
 *
 * @param {Object} server
 * @param {String} pluginName
 */
async function hapiRegister(server, pluginName) {
  return new Promise((resolve, reject) => {
    server.register(pluginName, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

/**
 * Provides main initial settings for hapi server
 * Starts server
 */
async function runServer() {
  const server = new Hapi.Server();
  server.connection({ port: process.env.PORT });
  await hapiRegister(server, Inert);
  await hapiRegister(server, Vision);
  // Enables Pug - server.views method
  server.views({
    // Registers the Pug as responsible for rendering of .pug files
    engines: {
      html: Handlebars,
      pug: Pug
    },
    // Shows server where templates are located in
    path: `${__dirname} ./../frontend`,
    // For correct page rendering: https://github.com/hapijs/vision#jade
    compileOptions: {
      pretty: true
    }
  });
  server.route(serverRoutes);
  await server.start();
  // Callback after my server's running
  console.log('SERVER: app running at ', server.info.uri);
}

runServer();
