const fs = require('fs');

const logs = (name, action) => {
  fs.readFile('./server/db/stats.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const stat = JSON.parse(data);
      stat.push({
        date: new Date(),
        product_name: name,
        action: action,
      });
      fs.writeFile('./server/db/stats.json', JSON.stringify(stat, null, 4), (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  })
};

module.exports = logs;
