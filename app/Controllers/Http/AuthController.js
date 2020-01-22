'use strict';

const { validate } = use('Validator');
const Hash = use('Hash');
const User = use('App/Models/User');
const Database = use('Database');
const sanitize = use('sqlstring');

class AuthController {
	async register({ response, request, view }) {
		return view.render('account/register');
	}

  // input validation
	async storeUser({ response, request, view, session }) {
		const validation = await validate(request.all(), {
			email: 'required|email|unique:users,email',
			password: 'required|min:6|max:40',
			confirm_password: 'required'
		});

    // password hashing
    // flashes warning if validation fails
		if (request.input('password') == request.input('confirm_password')) {
			if (validation.fails()) {
				session
					.withErrors(validation.messages())
					.flashExcept(['password', 'confirm_password']);

    // log new user to the db
				return response.redirect('back');
			} else {
				try {
					let newUser = await User.create({
						email: request.input('email'),
						password: request.input('password')
					});
				} catch (error) {
					return error;
				}
				session.flash({ success: 'Welcome to Fresh Gear' });
				return response.redirect('/');
			}
		} else {
			session
				.withErrors([
					{
						field: 'password',
						message: 'need to confirm password'
					},
					{
						field: 'confirm_password',
						message: 'need to confirm password'
					}
				])
				.flashExcept(['password', 'confirm_password']);

			return response.redirect('back');
		}
	}
	async login({ response, request, view }) {
		return view.render('account/login');
	}

  // capture the data from form
	async handleLogin({ response, request, view, auth, session }) {
		const postData = request.post();
		let user = await Database.raw(`
      SELECT * FROM freshgear.users WHERE users.email = ${sanitize.escape(
				postData.email
			)} LIMIT 1;
    `);
		user = user[0][0];

    //verify password
		if (user) {
			const passwordVerified = await Hash.verify(
				postData.password,
				user.password
			);

      //log in user
			if (passwordVerified) {
				await auth.loginViaId(user.id);
				session.flash({ success: 'You are logged in' });
				return response.redirect('/');
			} else {
				session
					.withErrors([{ field: 'password', message: 'Incorrect password' }])
					.flashExcept(['password']);
				return response.redirect('back');
			}
		} else {
			session
				.withErrors([
					{ field: 'email', message: `Can't find user with that email` }
				])
				.flashExcept(['password']);
			return response.redirect('back');
		}

    // return postData;
		console.log(user);
		return user;
	}
	async logout({ response, request, view, auth, session }) {
		try {
			await auth.logout();
			session.flash({ success: 'You successfully logged out.' });
			return response.redirect('/');
		} catch (error) {
			console.log(error);
			session.flash({ error: 'Sorry, there was a problem logging you out.' });
			return response.redirect('/');
		}
	}
}

module.exports = AuthController;
