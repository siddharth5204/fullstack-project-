const connectToMongo = require( "./db");
const express = require('express')
var cors = require('cors')
const app = express()

app.use(cors())
connectToMongo();

const port = 5000

app.use(express.json())
// Avaiable routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))
 

app.listen(port, () => {
  console.log(`iNotebook app listening on port http://localhost:${port}`)
})
