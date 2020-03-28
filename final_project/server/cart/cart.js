const add = (cart, req) => {
  cart.contents.push(req.body);
  cart.amount += req.body.price;
  cart.countGoods += 1;
  return { name: req.body.name, newCart: JSON.stringify(cart, null, 4) };
};
const change = (cart, req) => {
  const find = cart.contents.find(el => el.id === +req.params.id);
  find.quantity += +req.body.quantity;
  if(req.body.quantity < 0) {
    cart.amount -= +find.price;
    cart.countGoods -= 1;
  } else {
    cart.amount += +find.price;
    cart.countGoods += 1;
  }
  return { name: req.body.name, newCart: JSON.stringify(cart, null, 4) };
};

const changeOrd = (cart, req) => {
  const find = cart.contents.find(el => el.id === +req.params.id);
  find.quantity = +req.body.quantity;
  cart.amount = 0;
  cart.countGoods = 0;
  if(cart.contents.length !== 0) {
    cart.contents.forEach(element => {
      cart.countGoods += 1 * element.quantity;
      cart.amount += element.price * element.quantity;
    });
  }
  return { name: req.body.name, newCart: JSON.stringify(cart, null, 4) };
};

const del = (cart, req) => {
  const find = cart.contents.find(el => el.id === +req.params.id);
  cart.contents.splice(cart.contents.indexOf(find), 1);
  cart.amount = 0;
  cart.countGoods = 0;
  if(cart.contents.length !== 0) {
    cart.contents.forEach(element => {
      cart.countGoods += 1 * element.quantity;
      cart.amount += element.price * element.quantity;
    });
  }
  return { name: req.body.name, newCart: JSON.stringify(cart, null, 4) };
};

const delOrd = (cart, req) => {
  cart.contents.length = 0;
  cart.amount = 0;
  cart.countGoods = 0;
  return { name: req.body.name, newCart: JSON.stringify(cart, null, 4) };
}

module.exports = {
  add,
  change,
  changeOrd,
  del,
  delOrd,
};