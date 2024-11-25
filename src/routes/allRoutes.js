import authRouter from './authRoute.js';

const allRoutes = (app) => {
    app.use('/api/v1/auth', authRouter);
};

export default allRoutes;