var testJob = function(cb){
     
        
        ScheduleJob.find({name :'testJob',  nextRunAt: { $not : { $type : 10 } ,  $exists : true } }).exec(function(err, data){
    	    var now = new Date();
    	    var nextRunAt = new Date(data[0].nextRunAt);
	     
            if( now.getTime() >= nextRunAt.getTime() ){
    	            console.log('nextRunAt:' + data[0].nextRunAt);
    	    } 
              
              
            

            
        
    	    
        });
        
       
}

module.exports = function(agenda) {
    var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        name: 'testJob',

        // set true to disabled this job
        //disabled: false,

        // method can be 'every <interval>', 'schedule <when>' or now
        //frequency supports cron strings
       // frequency: 'every 1 minutes',

        // Jobs options
        //options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            //priority: 'highest'
        //},

        // Jobs data
        //data: {},

        // execute job
        run: function(job, done) {
            sails.log.info("Agenda job : testJob");
            testJob(function(){
               done(); 
            });
            //done();
        },
    };
    return job;
}