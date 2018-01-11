/**
 * StreamVideoController
 *
 * @description :: Server-side logic for managing Streamvideos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    startLiveStream : function(req, res){
        var sharesAmount = req.query.sharesAmount;
        var timeShareLimit = req.query.timeShareLimit;
        var videoId = req.query.videoId;
        
        Jobs.now('shareLiveStream2GroupsJob', {url : 'test url', videoId : videoId , sharesAmount : sharesAmount, timeShareLimit : timeShareLimit})
        res.json({ message : 'ok' });
    }
	
};

