module.exports = function (router) {
    var home = router.route('/');

    home.get(async (req, res) => {
        res.json({ message: 'This is the evidenceminer API v1.0' });
    });

    return router;
}