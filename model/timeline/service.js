const db = require('../../db/index.js');
const Timeline = db.Timeline;
const config = require('../../config.json')


async function getAll() {
    return await Timeline.find().select('-createdBy')
}

async function adminGetAll() {
    return await Timeline.find()
}

async function create(statusParam) {
    const statusTimeline = new Timeline(statusParam);
    await statusTimeline.save();
}

module.exports = {
    getAll,
    adminGetAll,
    create
};