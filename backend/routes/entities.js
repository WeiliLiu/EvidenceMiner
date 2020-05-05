const Entity = require('../models/entity');

async function getTopEntities(req, res) {
    const q = req.query;
    const where = q.where? JSON.parse(q.where) : {};
    const limit = q.limit? JSON.parse(q.limit) : -1;
    const sentence = q.sentence? JSON.parse(q.sentence) : false;

    const topEntities = await Entity.aggregate([
        {
            $match: where,
        },
        {
            $group: {
                _id: {
                    name: "$name",
                },
                docs: {
                    $addToSet: {
                        docId: sentence? "$sentId" : "$docId"
                    }
                }
            }
        },
        {
            $project: {
                "name": "$_id.name",
                "_id": 0,
                "count": {
                    $size: "$docs"
                }
            }
        },
        {
            $sort: {
                "count": -1
            }
        },
        {
            $limit: limit
        }
    ] ).allowDiskUse(true);
    
    return res.status(200).json({
        message: 'ok',
        data: topEntities
    });
}
exports.getTopEntities = getTopEntities;