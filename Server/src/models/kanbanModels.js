const mongooose = require('mongoose');

const taskSchema = new mongooose.Schema({
    company: {
        type: String,
        required:true
    },
    id: {
        type: Number,
        required:true,
        unique: true
    },
    priority: {
        type: String,
        required:true
    },
    status: {
        type: String,
        required:true
    },
    title: {
        type: String,
        required:true
    },
})

const listSchema = new mongooose.Schema({
    id: {
        type: Number,
        required:true,
        unique: true
    },
    name: {
        type: String,
        required:true
    },
    statuses: {
        type: [String],
        required:true
    },
    items: [{
        ref: 'TASKS',
        type: mongooose.Types.ObjectId
    }]
})

const Tasks = mongooose.model('TASKS', taskSchema);
const Lists = mongooose.model('LISTS', listSchema);

module.exports = {Tasks, Lists};