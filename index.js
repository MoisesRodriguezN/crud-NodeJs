var express = require('express');
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectId;

var bodyParser = require('body-parser');
var app = express()

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));

var dbUrl = 'mongodb://127.0.0.1:27017/gestion'

app.get('/', function (req, res) {
  
  
console.log(req.query.busqueda);
  mongodb.connect(dbUrl, function(err, db){
    let datos = {};

    
    if(!req.query.busqueda){
      console.log('sin filtro');
      db.collection('usuarios').find().toArray(function(err, docs) {
        datos.usuarios = docs;
        res.render('index', datos);
      });
    }else{
      console.log('con filtro');
      b = req.query.busqueda;
      filtro = {nombre: { $regex: "^" + b }};
      
      db.collection('usuarios').find(filtro).toArray(function(err, docs) {
        datos.usuarios = docs;
        res.render('index', datos);
      });
    }

    
  });
});

app.get('/formulario', function (req, res) {
  res.render('formulario');
});

app.post('/modificar', function (req, res) {
   datos = {};

   if(req.body.pais == "undefined"){
     pais = "";
   }else{
     pais = req.body.pais;
   }

     apellido = req.body.apellido;
   

   if(req.body.nombre == "undefined"){
     nombre = "";
   }else{
     nombre = req.body.nombre;
   }
   

   let usuario = {
      _id : req.body._id,
      nombre: nombre,
      apellido: apellido,
      edad: req.body.edad,
      pais: pais
   };

   datos.usuario = usuario;

  res.render('modificar', datos);
});


app.post('/inserta-usuario', function (req, res) {
  mongodb.connect(dbUrl, function(err, db){
    datos = {};

    let usuario = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      edad: req.body.edad,
      pais: req.body.pais
    };

    datos.usuario = usuario;

    db.collection('usuarios').insert(usuario);

    res.redirect('/');
  });
});


app.post('/usuario-modificado', function (req, res) {
  mongodb.connect(dbUrl, function(err, db){;

    datos = {};

    let usuario = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      edad: req.body.edad,
      pais: req.body.pais
    };

    datos.usuario = usuario;
     db.collection('usuarios').find({_id: ObjectId(req.body._id)}).toArray(function(err, p){
        p[0].nombre = req.body.nombre,
        p[0].apellido= req.body.apellido,
        p[0].edad= req.body.edad,
        p[0].pais= req.body.pais

        db.collection('usuarios').update({_id: ObjectId(req.body._id)},p[0]);
     });

    res.redirect('/');
  });
});


app.post('/borrar', function (req, res) {
  mongodb.connect(dbUrl, function(err, db){

    let borrado = {
      _id: new mongodb.ObjectID(req.body._id)
    };

    db.collection('usuarios').remove(borrado)

    res.redirect('/');
  });
});


app.listen(8080, function () {
  console.log('Servidor escuchando en http://localhost:8080')
})
