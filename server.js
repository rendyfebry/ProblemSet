// ============= REQUIRE

var express       = require('express');
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var jwt           = require('jsonwebtoken');
var cors          = require('cors');
var app           = express();
var router        = express.Router();
var path           = require('path');


// == setup
var config        = require('./app/config');
var User          = require('./models/user');
var Phonebook     = require('./models/phonebook');
var port          = 3030;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));

mongoose.connect(config.database);
app.set('secretKey', config.secret);
app.use(cors());

// ============= ROUTES

router.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/views/index.html'));
});

router.get('/signup', function(req, res){
	res.sendFile(path.join(__dirname + '/views/signup.html'));
});

router.post('/api/login', function(req, res){
	User.findOne({
		email: req.body.email
	}, function(err, user){
		if(err) throw err;

		if(!user) {
			res.json({ success: false, message: 'User tidak terdaftar'});
		} else {
			if(user.password != req.body.password){
				res.json({ success: false, message: 'Password salah'});
			} else {
				var token = jwt.sign(user, app.get('secretKey'), { expiresIn: "24h"});

				res.json({ 
					success: true,
					message: 'Login success', 
					token: token
				});
			}
		}
	})
});

router.post('/api/signup', function(req, res){
	User.findOne({
		email: req.body.email
	}, function(err, user){
		if(user) {
			res.json({ success: false, message: 'User sudah terdaftar'});
		} else {
			var newUser = new User();
			newUser.email = req.body.email;
			newUser.password = req.body.password;
		
			newUser.save(function(err){
				if(err) req.send(err);
		
				res.json({ 
					success: true,
					message: 'Signup Success' 
				});
			});
		}
	});
});

// protected routes

router.use(function(req, res, next){
	var token = req.query.token;

	if(token) {
		jwt.verify(token, app.get('secretKey'), function(err, decoded){
			if(err) {
				return res.json({
					success: false,
					message: 'Wrong token'
				});
			} else {
				req.decoded = decoded;

				if(decoded.exp <= Date.now()/1000) {
					return res.status(400).send({
						success: false,
						message: 'Token expired',
						date: Date.now()/1000,
						expired: decoded.exp
					});
				}

				next();
			}
		});
	} else {
		return res.status(403).send({
			success: false,
			message: 'token not found'
		});
	}
});

router.get('/phonebooks', function(req, res){
	res.sendFile(path.join(__dirname + '/views/phonebooks.html'));
});

router.get('/api/phonebooks', function(req, res){
	Phonebook.find({}, function(err, phonebooks){
		if(err) throw err;

		return res.json({
			success: true,
			phonebooks: phonebooks
		});
	});
});

router.post('/api/phonebooks', function(req, res){
	var phonebook = new Phonebook();
	phonebook.name = req.body.name;
	phonebook.title = req.body.title;
	phonebook.email = req.body.email;
	phonebook.phone = req.body.phone;
	phonebook.address = req.body.address;
	phonebook.company = req.body.company;

	phonebook.save(function(err){
		if(err) req.send(err);

		res.json({ 
			success: true,
			message: 'Data berhasil disimpan' 
		});
	});
});

router.get('/api/phonebooks/:id', function(req, res){
	Phonebook.findById(req.params.id, function(err, phonebook){
		if(!err) {
			res.json({ 
				success: true,
				phonebook: phonebook
			});
		} else {
			res.json({ 
				success: false,
				message: 'Something wrong!' 
			});
		}
	});
});

router.put('/api/phonebooks/:id', function(req, res){
	Phonebook.update({_id: req.params.id}, 
		{ 
			name: req.body.name,
			title: req.body.title,
			email: req.body.email,
			phone: req.body.phone,
			address: req.body.address,
			company: req.body.company
		},
		function(err, phonebook) {
		if(!err && phonebook.nModified > 0) {
			res.json({ 
				success: true,
				message: 'Data berhasil diupdate' 
			});
		} else {
			res.json({ 
				success: false,
				message: 'Something wrong!' 
			});
		}
	});
});

router.delete('/api/phonebooks/:id', function(req, res){
	Phonebook.remove({ _id :req.params.id }, function(err, phonebook){
		if(!err) {
			res.json({ 
				success: true,
				message: 'Data berhasil dihapus' 
			});
		} else {
			res.json({ 
				success: false,
				message: 'Something wrong!' 
			});
		}
	});
});

router.get('/api/phonebooks-search/:key', function(req, res){
		Phonebook.find({
				$or: [
					{ 'name': req.params.key },
					{ 'email': req.params.key },
					{ 'phone': req.params.key },
					{ 'address': req.params.key },
					{ 'company': req.params.key }
				]}, function(err, phonebooks) {

			if(err) res.send(err);

			if(phonebooks.length != 0) {
				res.json({ 
					success: true,
					phonebooks: phonebooks
				});
			} else {
				res.json({ 
					success: false,
					message: 'Something wrong!' 
				});
			}
		});
	});

app.use(router);

app.listen(port, function(){
	console.log('running on '+port);
});
