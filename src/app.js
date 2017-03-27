import * as Path from 'path';
import * as Hapi from 'hapi';
import * as Inert from 'inert';
import * as Vision from 'vision';
import * as Pug from 'pug';
import Handlebars from 'Handlebars';
import serverRoutes from './myRoute';

// TODO: Remove callbacks
// TODO: Async here
// TODO: Is Path need

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
  server.start((err) => {
    if (err) {
      throw err;
    }

    // Callback after my server's running
    console.log('SERVER: app running at ', server.info.uri);
  });
}

runServer();
