//global objectvar config = {};    //name of this application    config.name = "Live Wall App";    //version     config.version = "testing";        config.debug = true;        //defines all the web configurationsconfig.web = {};    //the qualified server name.    //note: if using localhost be aware that only pages loaded on localhost will work.    //note: this should either be a url (www.example.com) or an IPAddress (192.168.1.2)    config.web.servername = '10.1.1.4';    //note using port 80 requires su access when running    config.web.port = 8080;        //export itmodule.exports = config;    