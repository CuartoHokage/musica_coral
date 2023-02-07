var express= require('express');
var app= express();
var path = require('path');
var fs=require('fs');
var mediaserver=require('mediaserver');
var multer= require('multer');

var opcionesMulter=multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, 'canciones'));
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
});

var upload= multer({storage:opcionesMulter});

app.use(express.static('public'));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'))
});

app.get('/canciones', function(req, res){
    fs.readFile(path.join(__dirname,'canciones.json'),'utf8', function(err, canciones){
        if (err) throw err;
        res.json(JSON.parse(canciones));
    });
});

app.get('/canciones/:nombre', function(req, res){
    var cancion=path.join(__dirname, 'canciones', req.params.nombre);
    console.log(req.params.nombre);
    mediaserver.pipe(req, res, cancion);
});

app.post('/lista', upload.single('cancion'), function(req, res){
    const jsonsInDir = fs.readdirSync('./canciones').filter(file => path.extname(file) === '.mp3');
    //console.log(jsonsInDir);
    
    
    /*jsonsInDir.forEach(file => {
        const fileData = fs.readFileSync(path.join('./sw_lbi/categories', file));
        const json = JSON.parse(fileData.toString());
    });*/
    var archivoCanciones=path.join(__dirname, 'canciones.json')
    //var nombre=req.file.originalname;
    fs.readFile(archivoCanciones, 'utf-8', function(err, archivo){
        if(err) throw err;
        var canciones= JSON.parse(archivo);
        for (let index = 0; index < jsonsInDir.length; index++) {
            canciones.push({nombre: jsonsInDir[index]})
            
        }
        fs.writeFile(archivoCanciones, JSON.stringify(canciones), function (err) {
            if(err) throw err;
            res.sendFile(path.join(__dirname, 'index.html'));
        })
    });
});

app.post('/canciones', upload.single('cancion'), function(req, res){
    var archivoCanciones=path.join(__dirname, 'canciones.json')
    var nombre=req.file.originalname;
    fs.readFile(archivoCanciones, 'utf-8', function(err, archivo){
        if(err) throw err;
        var canciones= JSON.parse(archivo);
        canciones.push({nombre: nombre})
        fs.writeFile(archivoCanciones, JSON.stringify(canciones), function (err) {
            if(err) throw err;
            res.sendFile(path.join(__dirname, 'index.html'))
        })
    });
});

app.listen(3000, function(){
    console.log('Aplicacion Corriendo');
});