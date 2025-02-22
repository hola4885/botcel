const mongoose = require('mongoose');

const nuevostaff = new mongoose.Schema({
    tiketid: {
      type: String,

    },
    staff: {
      type: String,
    }
    
  });
module.exports = mongoose.model('nuevostaff', nuevostaff);

                  
                        