module.exports = function(agenda) {
    var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        name: 'checkNodeJob',

        // set true to disabled this job
        disabled: true,

        // method can be 'every <interval>', 'schedule <when>' or now
        //frequency supports cron strings
        frequency: 'every 30 minutes',

        // Jobs options
        options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            priority: 'highest'
        },

        // Jobs data
        //data: {},

        // execute job
        run: function(job, done) {
            sails.log.info("Agenda job : checkNodeJob");
     
            done();
         
        },
    };
    return job;
}