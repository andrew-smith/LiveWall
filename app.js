//--------------------------------------------------------------// Standard setup//config filevar config = require('./config');//log systemvar log = require('logly');log.name(config.name);log.colour(true);if(config.debug) log.mode('debug');//live wall servervar livewall = require('./server');
//express web applicationvar express = require('express');//web server instancevar server = express.createServer();//socket.io instancevar io = require('socket.io').listen(server);//stop rendering layout every timeserver.set("view options", { layout: false });//sets the view engine to render pages with jadeserver.set('view engine', 'jade');//this allows forms to be encoded to req.bodyserver.use(express.bodyParser());//--------------------------------------------------------------//start everything!livewall.init(server, io, function(err) {    if(err)    {        log.error("Error init-ing " + config.name);        log.error(err);        process.exit(-1);    }    else    {        server.listen(config.web.port);        log.log("Started " + config.name + " (" + config.version + ")");         if(config.web.port != 80)             log.log("on " + config.web.servername + ":" + config.web.port + "/");         else             log.log("on " + config.web.servername + "/");     }});