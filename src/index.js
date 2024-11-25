import express from 'express';
import allRoutes from './routes/allRoutes.js';
import connectDB from './config/db.js';
import validateConfig from './config/configValidator.js';
import allConfig from './config/config.js';
import cors from 'cors'
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swaggerConfig.js';



const app = express();
const port = 3000;

// Checks all the env
validateConfig();

// Connecting to MongoDB
connectDB(allConfig.DB_CONFIG.DATABASE);


// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
// Add Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

allRoutes(app)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})