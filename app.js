var http = require('http'),
express = require('express'),
partials = require('express-partials'),
mongoose = require('mongoose'),
engines = require('consolidate'),
port = process.env.PORT || 3000;
var app = express();

// setting server
app.use(express.static(__dirname + '/public'));
app.engine('haml', engines.haml);
app.set('view engine', 'haml');
app.set('views', __dirname + '/views');
app.use(partials());

// connect database
mongoose.connect('mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + '/' + process.env.DB_NAME);

// database scheme
var FotoSchema = new mongoose.Schema(
    {
        user_name: String,
        user_url: String,
        photo_id: Number,
        meta_url: String,
        image_url: String,
        year: String,
        date: String,
        time: String,
        unixtime: Number
    }
);

mongoose.model('Photo', FotoSchema);
var DBPhoto = mongoose.model('Photo');

app.get('/', function(req, res) {
    res.render('index.haml');
});

app.get('/get_photo.json', function(req, res) {
            res.contentType('application/json');
            var time = req.query.time;
            console.log('time: ' + time);
            DBPhoto.find({time: time}, function(err, docs) {
                                if (docs.length === 0) return res.send({});
                                var photo = selectRandom(docs);
                                var json = JSON.stringify(photo);
                                res.send(json);
                            });
});

var selectRandom = function(list) {
    return list[Math.floor(Math.random() * list.length)];
};

app.listen(port);

console.log('Express server listening on port ' + port);
