const mongoose = require('mongoose');

const { Schema } = mongoose;

const vozSchema = new Schema({
    Guild: {
        type: String,
        required: true
    },
    Channel: {
        type: String,
        required: true
    },
    UserLimit: {
        type: Number,
        default: 5
    }
}, {
    timestamps: true // Añade campos `createdAt` y `updatedAt`
});

module.exports = mongoose.model('Voz', vozSchema);
