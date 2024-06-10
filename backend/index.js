const express = require('express');
const connectToMongo = require('./db');
var cors = require('cors');

connectToMongo();
const app = express();
const port = 1818;
app.use(express.json())

const corsOptions = { origin: "*", credentials: true, optionSuccessStatus: 200 }

app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json())
app.use('/api/admin',require('./routes/admin.js'));
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/prof', require('./routes/prof.js'));
app.use('/api/query', require('./routes/query.js'));
app.use('/api/subscription',require('./routes/subscription.js'));
app.use('/uploads', express.static('uploads'));

app.get('/', async (req, res) => {
    res.send('Marcos');
})

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
})