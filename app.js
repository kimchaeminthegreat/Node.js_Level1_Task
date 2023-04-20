const express = require('express');
const app = express();

const port = 3000;

app.use(express.json());

app.get('/', (req,res) => {
    res.send('Test~!!!');
})

const postsRouter = require('./routes/posts');
app.use('/posts', [postsRouter]);

const commentsRouter = require('./routes/comments');
app.use('/posts', [commentsRouter]);

const connect = require('./schemas');
connect();

app.listen(port, () => {
    console.log(port, 'Port has opened!')
})
