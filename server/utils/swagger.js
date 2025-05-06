// utils/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
    openapi: '3.0.0',
    info: {
        title: 'Ditt API',
        version: '1.0.0',
        description: 'API-dokumentation',
    },
    servers: [
        {
        url: 'http://localhost:5000',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            },
        },
        },
    },
  apis: ['./routes/*.js'], // justera om dina routes ligger någon annanstans
};

const swaggerDocument = swaggerJsdoc(options);

export { swaggerUi, swaggerDocument };
