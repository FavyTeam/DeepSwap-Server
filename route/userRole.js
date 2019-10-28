var UserSchema = require('./../schema/user')

module.exports.auth = async function(req, res){
    var _username = req.body.username
    var _deviceToken = req.body.deviceToken
    var _status = req.body.status
    var _info = await get_all_users()

    if (_info == undefined){
        var result = await add_user(_username, _deviceToken, _status)
        res.status(201).json(result)
        return
    }

    for (let i = 0; i < _info.length; i++){
        let doc = _info[i]

        if (doc.username === _username && doc.deviceToken === _deviceToken){
            res.status(201).json(doc)
            return
        }
    }

    var result = await add_user(_username, _deviceToken, _status)
    res.status(201).json(result)
}

function add_user(username, deviceToken, status){
    var data = {
        "username"          : username,
        "deviceToken"       : deviceToken,
        "status"            : status
    }

    return new Promise(function(resolve, reject){
        UserSchema.create(data, function(err, doc){          
            resolve(doc)
        })
    })
}

function get_all_users(){
    return new Promise(function(resolve, reject){
        UserSchema.find({},function(err, docs){
            resolve(docs)
        })
    })
}

module.exports.add = function(req, res){
    var data = {
        "username"          : req.body.username,
        "deviceToken"       : req.body.deviceToken,
    }

    UserSchema.create(data, function(err, doc){
        if(err){
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    })
}

module.exports.get = function(req, res){
    UserSchema.findOne({'_id' : req.body._id}, function (err, doc){
        if (err) res.status(401).json(err)
        
        res.status(201).json(doc)
    })
}

module.exports.get_all = function(req, res){
    var data = []

    UserSchema.find({}, function (err, docs){
        if (err) res.status(401).json(err)

        docs.forEach(function (doc) {
            data.push(doc)
        })

        res.status(201).json(data);
    })
}

module.exports.get_user_by_name = function(username){
    return new Promise(function(resolve, reject){
        UserSchema.find({},function(err, docs){
            if (err) res.status(401).json(err)

            docs.forEach(function (doc) {
                if (doc.username === username){
                    resolve(doc) 
                }
            })
        })
    })
}

module.exports.set_online = function(req, res){
    var data = {
        "status" : true
    }

    var query = {'username' : req.body.username}

    UserSchema.update(query, data, function(err, doc){
        if (err) res.status(401).json(err)

        res.status(201).json(doc);
    })
}

module.exports.setoffline = function(req, res){
    var data = {
        "status" : false
    }

    var query = {'username' : req.body.username}

    UserSchema.update(query, data, function(err, doc){
        if (err) res.status(401).json(err)

        res.status(201).json(doc);
    })
}