/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var pager = require('sails-pager');

module.exports = {
    register : function(req, res){
        var email = req.body.email;
        var password = req.body.password;
        User.register({
            username: email,
            email: email,
            password : password
        })
        .then(function (user) {
            sails.log('created new user', user);
            res.json(user);
            PermissionService.removeUsersFromRole([user.username], 'registered').then(function () {});
            PermissionService.addUsersToRole(user.username, 'User').then(function () {});
        })
        .catch(function (error) {
            sails.log.error(error);
            res.json(error);
        });  
    },
	list: function(req, res) {
        var perPage = req.query.per_page;
        var currentPage = req.query.page;
        var sortBy = req.query.sortBy;
        if(sortBy == null || sortBy == undefined){
            sortBy = 'createdAt';
        }
        var conditions = {active: true};
 
        //Using Promises 
        pager.paginate(User, {}, currentPage, perPage, [], sortBy + ' DESC').then(function(records){
            res.json(records);
        }).catch(function(err) {
            console.log(err);
        });
    },
    
    test : function(req, res){
        User.find({id : req.session.passport.user}).populate('roles').exec(function(err, user){
            return res.json(user) 
        });
           
    }
};

