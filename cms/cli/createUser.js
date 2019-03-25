const Users = require('../app/core/users.js');
const prompt = require('prompt');
const bcrypt = require('bcrypt');

prompt.start();

prompt.get(
    [
        {
            name: 'username',
            required: true,
        },
        {
            name: 'password',
            message: 'password (must be longer than 6 characters)',
            required: true,
            hidden: true,
        },
        {
            name: 'confirm',
            message: 'Confirm password',
            required: true,
            hidden: true,
            conform: function(value) {
                if (value === prompt.history('password').value) {
                    bcrypt.hashSync(process.argv[2]);
                    return value.length > 6;
                } else {
                    return false;
                }
            },
        },
        {
            name: 'email',
            required: true,
        },
        {
            name: 'admin',
            default: false,
            type: 'boolean',
            required: true,
        },
        {
            name: 'role',
            required: true,
        },
    ],
    function(err, result) {
        result.hash = bcrypt.hashSync(result.password);
        delete result.password;
        delete result.confirm;
        result.created = +new Date();
        if (err) {
            console.log(err);
            return;
        }
        const user = Users.createUser(result);
        if (user) {
            console.log('User created');
        } else {
            console.warn('Sorry, an error occured');
        }
    }
);
