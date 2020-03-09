const add = (cart, req) => {
  cart.contents.push(req.body);
  return { name: req.body.product_name, newCart: JSON.stringify(cart, null, 4) };
};
const change = (cart, req) => {
  const find = cart.contents.find(el => el.id_product === +req.params.id);
  find.quantity += req.body.quantity;
  return { name: req.body.product_name, newCart: JSON.stringify(cart, null, 4) };
};
const del = (cart, req) => {
  const find = cart.contents.find(el => el.id_product === +req.params.id);
  cart.contents.splice(cart.contents.indexOf(find), 1);
  return { name: req.body.product_name, newCart: JSON.stringify(cart, null, 4) };
};

module.exports = {
  add,
  change,
  del,
};