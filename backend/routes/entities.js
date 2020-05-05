const Entity = require('../models/entity');

async function getEntities(req, res) {
    
    const entities = await Entity.find();
    return res.status(200).json({
        message: 'ok',
        data: entities
    });
}
exports.getEntities = getEntities;