// swaggerConfig.js
import swaggerJsDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Your API Documentation',
    version: '1.0.0',
    description: 'API documentation for your application',
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1', 
    },
  ],
};

const options = {
    swaggerDefinition,
    apis: [
      path.join(__dirname, '../routes/*.js'), 
      path.join(__dirname, '../controllers/*.js'), 
    ],
  };
  

const swaggerSpec = swaggerJsDoc(options);

export default swaggerSpec;