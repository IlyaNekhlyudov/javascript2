const express = require('express');
const fs = require('fs');
const cartRouter = require('./cart/cartRouter');
const app = express();
const orderRouter = require('./order/orderRouter');
const emailRouter = require('./email/emailRouter');

app.use(express.json());
app.use('/', express.static('./public'));
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/email', emailRouter);

app.get('/api/products', (req, res) => {
  fs.readFile('./server/db/products.json', 'utf-8', (err, data) => {
    if (err) {
      res.sendStatus(404, JSON.stringify({result: 0, text: err}));
    } else {
      res.send(data);
    }
  });
});

const port = process.env.PORT || 8888;
app.listen(port, () => {
  console.log(`Listening ${port} port`);
});