const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const todoRoutes = require('./routes/todos');

const app = express();
const PORT = 8080; 

app.use(express.json());

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/todos', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/doc`);
});