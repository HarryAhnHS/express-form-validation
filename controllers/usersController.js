const usersStorage = require("../storages/usersStorage");

const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const emailErr = "must be a valid email address.";
const ageErr = "must be a number between 0 and 120.";
const bioErr = "must be less than 200 characters.";

const validateUser = [
    body("firstName").trim()
        .isAlpha().withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),

    body("lastName").trim()
        .isAlpha().withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),

    body("email").optional({values: "falsy"}).trim()
        .isEmail().withMessage(`Email ${emailErr}`),

    body("age").optional({values: "falsy"})
        .isInt({ min: 0, max: 120 }).withMessage(`Age ${ageErr}`),

    body("bio").optional({values: "falsy"}).trim()
        .isLength({ max: 200 }).withMessage(`Bio ${bioErr}`)
];

module.exports = {
    usersAllGet: (req, res) => {
        res.render('index', {
            title: 'All Users',
            users: usersStorage.getUsers(),
        })
    },
    usersCreateGet: (req, res) => {
        res.render('createUser', {
            title: 'Create new user'
        })
    },
    usersCreatePost: [validateUser, (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('createUser', {
                title: 'Create new user',
                errors: errors.array(),
            }) 
        }

        const {firstName, lastName, email, age, bio} = req.body;
        usersStorage.addUser({firstName, lastName, email, age, bio});
        res.redirect('/')
    }],
    usersUpdateGet: (req, res) => {
        const userId = req.params.id;
        const user = usersStorage.getUser(userId);
        res.render('updateUser', {
            title: `Update user ${user.firstName} ${user.lastName}`,
            user: user, 
        })
    },
    usersUpdatePost: [validateUser, (req, res) => {
        const userId = req.params.id;
        const user = usersStorage.getUser(userId);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('updateUser', {
                title: `Update user ${user.firstName} ${user.lastName}`,
                user: user, 
                errors: errors.array(),
            })
        }

        const {firstName, lastName, email, age, bio} = req.body;
        usersStorage.updateUser(userId, {firstName, lastName, email, age, bio});
        res.redirect('/');
    }],
    userDelete: (req, res) => {
        usersStorage.deleteUser(req.params.id);
        res.redirect('/');
    }
}