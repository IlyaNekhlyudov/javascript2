const fs = require('fs');
const email = require('./email');

const actions = {
  add: email.add,
  del: email.del,
};

const handler = (req, res, action, file) => {
  fs.readFile(file, 'utf-8', (err, data) => {
      if (err) {
          res.sendStatus(404, JSON.stringify({result: 0, text: err}));
      } else {
          const { newEmail } = actions[action](JSON.parse(data), req);
          fs.writeFile(file, newEmail, (err) => {
              if (err) {
                  res.send('{"result": 0}');
              } else {
                  res.send('{"result": 1}');
              }
          })
      }
  });
};

module.exports = handler;
