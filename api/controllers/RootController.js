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
        // Have the socket which made the request join the "funSockets" room.
        sails.sockets.join(req, 'root');
        sails.sockets.broadcast('root', {msg : 'hi there!'});
        return res.json({
          message: 'ok'
        });
    },
	
};

