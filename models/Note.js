const mongoose = require('mongoose')
const NoteSchema = new mongoose.Schema({
    email: {type:String, required: true},
    title: {type:String, required:true},
    desc: {type:String, required:true},
}, {timestamps: true});

module.exports = mongoose.model('Note', NoteSchema);