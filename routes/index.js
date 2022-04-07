var express = require('express');
var router = express.Router();
var modul = require('../modul/modul');

var session_store;
/* GET home page. */
router.get('/login', function(req, res, next) {
res.render('main/login', { title: 'Express' });
});
router.get('/dashboard', function(req, res, next) {
res.render('dashboard', { title: 'Express' });
});
router.get('/profil', function (req, res, next) {
res.render('profil', { title: 'Express' });
});

/* INI LOGIN N LOGOUT*/
router.get('/login',function(req,res,next){
	res.render('main/login',{title:"Login Page"});
});
router.post('/login',function(req,res,next){
	session_store=req.session;
	req.assert('txtEmail', 'Silahkan isi username!').notEmpty();
	req.assert('txtEmail', 'Email tidak valid!').isEmail();
	req.assert('txtPassword', 'Silahkan isi password!').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		req.getConnection(function(err,connection){
			v_pass = req.sanitize( 'txtPassword' ).escape().trim(); 
			v_email = req.sanitize( 'txtEmail' ).escape().trim();
			
			var query = connection.query('select * from user where the_email="'+v_email+'" and the_password="'+v_pass+'"',function(err,rows)
			{
				if(err)
				{

					var errornya  = ("Error Selecting : %s ",err.code );  
					console.log(err.code);
					req.flash('msg_error', errornya); 
					res.redirect('/login'); 
				}else
				{
					if(rows.length <=0)
					{

						req.flash('msg_error', "Email atau password anda salah!"); 
						res.redirect('/login');
					}
					else
					{	
						session_store.is_login = true;
						res.redirect('/customers');
					}
				}

			});
		});
	}
	else
	{
		errors_detail = "<p>Maaf ada kesalahan penulisan</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		console.log(errors_detail);
		req.flash('msg_error', errors_detail); 
		res.redirect('/login'); 
	}
});
router.get('/logout', function(req, res)
{ 
	req.session.destroy(function(err)
	{ 
		if(err)
		{ 
			console.log(err); 
		} 
		else 
		{ 
			res.redirect('/login'); 
		} 
	}); 
});
module.exports = router;
