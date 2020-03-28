const add = (email, req) => {
  email.list.push(req.body);
  return { newEmail: JSON.stringify(email, null, 4) };
};
const del = (email, req) => {
  email.list.splice(email.list.indexOf(req.body.email), 1);
  return { newEmail: JSON.stringify(email, null, 4) };
};

module.exports = {
  add,
  del,
};