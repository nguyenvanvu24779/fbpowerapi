/**
 * StreamVideoController
 *
 * @description :: Server-side logic for managing Streamvideos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    startLiveStream : function(req, res){
        Jobs.now('shareLiveStream2GroupsJob', {url : 'test url', sharesAmount : 200, timeShareLimit : 30})
        res.json({ message : 'ok' });
    }
	
};

