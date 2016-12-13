/**
 * Created by renato on 07/12/16.
 */

var express = require('express');
var router = express.Router();

// define the home page route
router.get('/', function (req, res) {
    console.log("Showing content");
    res.send('Birds home page ' + req.body.dados);
});
// define the about route
router.post('/search', function (req, res) {
    console.log("banana ", req.body);
    res.json( {"retorno": req.body.dados});
});


module.exports = router;