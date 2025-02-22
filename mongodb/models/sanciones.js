const mongoose = require('mongoose');

const sanciones = new mongoose.Schema({
    sancion: {
      type: String,

    },
    duracion: {
      type: String,
    },
    razon: {
      type: String,
    },
    usuarioid: {
      type: String,
    },
    staffid: {
      type: String,
    }
  });
module.exports = mongoose.model('sanciones', sanciones);

                  
                        