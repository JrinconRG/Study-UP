// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0', // Versión de OpenAPI
    info: {
      title: 'API de Mi Proyecto',
      version: '1.0.0',
      description: 'Documentación de mi API con Swagger',
    },
    servers: [
      { url: 'http://localhost:3000' } // Cambia al URL de tu API
    ],
  },
  // Archivos donde buscará comentarios JSDoc
  apis: ['./routes/*.js'], // Ajusta según tu estructura
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
