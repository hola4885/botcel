const mongoose = require('mongoose');

const stafft = new mongoose.Schema({
  asunt: {
    type: String,
  },
  prioridad: {
    type: String,
  },
    message: {
      type: String,
    },
    author: {
      type: String,
    },
    tiketid: {
      type: Number,
      default: 0
    },
    staff: {
      type: String,
    }
    
  });
module.exports = mongoose.model('staff', stafft);

                  
                        