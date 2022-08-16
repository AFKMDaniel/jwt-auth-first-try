require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routers/index');

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api',router);

app.listen(PORT,() => {
    console.log(`Server started on PORT ${PORT}`);
})