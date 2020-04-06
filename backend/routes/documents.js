var express = require('express');
var router = express.Router();

var elastic = require('../elasticsearch');

/* GET suggestions */
// router.get('/suggest/:input', function (req, res, next) {  
//   elastic.getSuggestions(req.params.input).then(function (result) { res.json(result) });
// });

// GET search query
router.get('/', function (req, res, next) {
  console.log(req.body)
  elastic.getSearchResult(req.body.query)
    .then(result => {
      console.log(result);
      res.json(result);
    })
    .catch(error => {
      console.log("hello");
      res.json({"error": "error occurred"});
    })
})

/* POST document to be indexed */
router.post('/', function (req, res, next) {  
  elastic.addDocument(req.body).then(function (result) { res.json(result) });
});

module.exports = router;