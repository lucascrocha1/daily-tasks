const fs = require('fs');

fs.copyFile('.\\src\\env\\env-prod.ts', '.\\src\\env\\env.ts', (err) => {
    if (err) throw err;
});