const express = require('express');
const users = require('./routes/users.routes')

const port = 3000;

const app = express();

app.use(express.json());
app.use(users)


app.listen(port, () => {
  console.log(`App escutando na porta ${port}`);
});
