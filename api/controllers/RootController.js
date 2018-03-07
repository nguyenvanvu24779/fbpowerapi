/**
 * RootController
 *
 * @description :: Server-side logic for managing Roots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    join : function (req, res){
        if (!req.isSocket) {
            return res.badRequest();
        }
        
         var userId = req.session.passport.user;
        // Have the socket which made the request join the "funSockets" room.
        if(userId){
            sails.sockets.join(req, 'user.' + userId);
            sails.sockets.broadcast('user.' + userId , {msg : 'hi there!'});
            //sails.sockets.emit(req.session.userId, 'privateMessage', {msg: 'Hi!'});
            
            User.find({id : userId}).populate('roles').exec(function(err, users){
                    if(err || users[0]==undefined){
                        return;
                    } 
                    //console.log(u);
                    var found = users[0].roles.find(function(element) {
                      return element.name == 'admin';
                    });
                    if(found != undefined){
                       return  sails.sockets.broadcast('user.' + userId , {userType : 'admin'});
                    }
                 
                    return  sails.sockets.broadcast('user.' + userId , {userType : 'User'});
                
            });
        }
        
        return res.json({
          message: 'ok'
        });
    },
	
};

