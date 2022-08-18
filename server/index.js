require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routers/index');
const errorMiddleware = require('./middlewares/error-middleware');

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api',router);
app.use(errorMiddleware)

app.listen(PORT,() => {
    console.log(`Server started on PORT ${PORT}`);
})