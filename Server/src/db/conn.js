const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/kanban")
.then(() => {
    console.log(`connnection successfull`);
})
.catch((err) => {
    console.log(`no connection: ${err}`)
});