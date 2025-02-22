const mongoose = require('mongoose');

const admin = new mongoose.Schema({
  asunt: {
    type: String,
  },
  prioridad: {
    type: String,
  },
    remoteTiketId: {
    type: String,
  },
    message: {
      type: String,
    },
    author: {
      type: String,
    },
    tiketid: {
      type: String,
    },
    staff: {
      type: String,
    },  localMessageId: {
      type: String,
    },  remoteMessageId: {
      type: String,
    } ,  status: {
      type: String,
    }
    
  });
module.exports = mongoose.model('admin', admin);