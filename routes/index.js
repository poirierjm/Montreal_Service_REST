var express = require('express');
var csv = require('express-csv');
var router = express.Router();
var db = require('./db');
var request = require('request');
var raml2html = require('raml2html');
var jsonschema = require('jsonschema');
var schemas = require('./schemas'); 
var mongodb = require('mongodb');
var init = require('./../init.js');
var requete = require('./requete.js');
var cron = require('node-cron');

const collectionPiscine = "piscine";
const collectionPatinoire = "patinoire";
const collectionGlissade = "glissade";
const collectionUtilisateur = "utilisateur";

/**
 * Service REST permettant d'obtenir la liste de toutes les installations d'un arrondissement spécifié dans un query parameter.
 */
router.get('/installations', function(req, res) {
  var arrondissementData = req.query.arrondissement;
  requete.getCollection({'arrondissement': arrondissementData}, collectionPiscine, function(err1, piscineData) {
    requete.getCollection({'arrondissement.nom_arr': arrondissementData}, collectionPatinoire, function(err2, patinoireData) {
      requete.getCollection({'arrondissement.nom_arr': arrondissementData}, collectionGlissade, function(err3, glissadeData) {
        if (err1 || err2 || err3) {
          (err1 || err2) ? ((err1) ? console.log(err1) : console.log(err2)) : console.log(err3);
          res.sendStatus(500);
        } else if (piscineData.length === 0 && patinoireData.length === 0 && glissadeData.length === 0) {
          res.sendStatus(404);
        } else {
          var concatData = {glissade: glissadeData, patinoire: patinoireData, piscine: piscineData};
          res.json(concatData);
        }
      });
   });
  });
});

/**
 * Service REST permettant d'obtenir la liste de toutes les installations en mauvaise condition.
 */
router.get('/condition_mauvaise', function(req, res) {
  requete.getCollection({'condition': "Mauvaise"}, collectionPatinoire, function(err1, patinoireData) {
    requete.getCollection({'condition': "Mauvaise"}, collectionGlissade, function(err2, glissadeData) {
      if (err1 || err2) {
        (err1) ? console.log(err1) : console.log(err2);
        res.sendStatus(500);
      } else if (patinoireData.length === 0 && glissadeData.length === 0) {
        res.sendStatus(404);
      } else {
        var concatData = {installation: {glissade: glissadeData, patinoire: patinoireData}};
        res.json(concatData);
      }
    });
  });
});

/**
 * Service permettant d'obtenir la liste de toutes les installations en mauvaise condition dans le format XML.
 */
router.get('/condition_mauvaise_xml', function(req, res, next) {
  requete.getCollection({'condition': "Mauvaise"}, collectionPatinoire, function(err1, patinoireData) {
    requete.getCollection({'condition': "Mauvaise"}, collectionGlissade, function(err2, glissadeData) {
      if (err1 || err2) {
        (err1) ? console.log(err1) : console.log(err2);
        res.sendStatus(500);
      } else if (patinoireData.length === 0 && glissadeData.length === 0) {
        res.sendStatus(404);
      } else {
        var concatData = {installation: {glissade: glissadeData, patinoire: patinoireData}};
        res.header("Content-Type", "application/xml; charset=utf-8");
        res.render('condition_mauvaise_xml', concatData);
      }
    });
  });
});

/**
 * Service permettant d'obtenir la liste de toutes les installations en mauvaise condition dans le format CSV.
 */
router.get('/condition_mauvaise_csv', function(req, res) {
  var concatData;
  requete.getCollection({'condition': "Mauvaise"}, collectionPatinoire, function(err1, patinoireData) {
    requete.getCollection({'condition': "Mauvaise"}, collectionGlissade, function(err2, glissadeData) {
      if (err1 || err2) {
        (err1) ? console.log(err1) : console.log(err2);
        res.sendStatus(500);
      } else if (patinoireData.length === 0 && glissadeData.length === 0) {
        res.sendStatus(404);
      } else {
        concatData = patinoireData.concat(glissadeData);
        res.csv(concatData);
      }
    });
  });
});

/**
 * Service REST permettant d'ajouter un utilisateur.
 */
router.post('/utilisateur', function(req, res) {
  schemas.loadSchema("creer-utilisateur", function(err, schema) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      var result = jsonschema.validate(req.body, schema);
      if (result.errors.length > 0) {
        res.status(400).json(result);
      } else {
        requete.insererInstallation(req, collectionUtilisateur, function(err1, utilisateurData) {
          if (err1) {
            console.log(err1);
            res.sendStatus(500);
          } else {
            res.sendStatus(201);
          }
        });
      }
    }
  });
});

/**
 * Service REST permettant d'obtenir la liste de tous les utilisateurs.
 */
router.get('/utilisateur', function(req, res) {
  db.getConnection(function(err, db) {
    db.collection(collectionUtilisateur, function(err, collection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        collection.find().toArray(function(err, result) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            res.json(result);
          }
        });
      }
    });
  });
});

/**
 * Appelle d'un service REST pour créer un utilisateur avec les informations de l'utilisateur en paramètre.
 */
function creerUtilisateur(data) {
  request({
    url: "http://127.0.0.1:3000/utilisateur",
    method: "POST",
    headers: {
        "content-type": "application/json",
        },
    json: data,
    body: JSON.stringify(data)}, function(err, res, body) {
      console.log(err);
  });
}

/**
 * Méthode POST permetant de créer un utilisateur.
 */
router.post('/creer_utilisateur', function(req, res) {
  if (req.body.nom.length === 0 || req.body.email.length === 0) {
    res.render('user', {erreurVide: 'Le nom et courriel sont requis.'});
  } else if (!(/^.+@.+\..+$/.test(req.body.email))) {
    res.render('user', {erreurEmail: 'Le format du courriel est invalide.'});
  } else {
  var data = {
    nom: req.body.nom,
    email: req.body.email,
    arrondissements: [{
       arrondissement: req.body.arrondissement1},
      {arrondissement: req.body.arrondissement2},
      {arrondissement: req.body.arrondissement3},
      {arrondissement: req.body.arrondissement4},
      {arrondissement: req.body.arrondissement5},
      {arrondissement: req.body.arrondissement6},
      {arrondissement: req.body.arrondissement7},
      {arrondissement: req.body.arrondissement8},
      {arrondissement: req.body.arrondissement9},
      {arrondissement: req.body.arrondissement10}
    ]
  };
    data.arrondissements = data.arrondissements.filter(function(col) {
      return col.arrondissement !== undefined && col.arrondissement !== "";
    });
    creerUtilisateur(data);
    res.redirect('/user_succes');
  }
});

/**
 * Service REST permettant de modifier une installation aquatique selon l'identifiant.
 */
router.put('/glissade/:id', function(req, res) {
  schemas.loadSchema("modifier-glissade", function(err, schema) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      var result = jsonschema.validate(req.body, schema);
      if (result.errors.length > 0) {
        res.status(400).json(result);
      } else {
        requete.modifierInstallation(req, collectionGlissade, function(err1, glissadeData) {
          if (err1) {
            console.log(err1);
            res.sendStatus(500);
          } else if (glissadeData.result.n === 0) {
            res.sendStatus(404);
          } else {
            res.sendStatus(200);
          }
        });
      }
    }
  });
});

/**
 * Service REST permettant de supprimer une installation aquatique selon l'identifiant.
 */
router.delete('/glissade/:id', function(req, res) {
  db.getConnection(function(err, db) {  
    db.collection(collectionGlissade, function(err, collection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        collection.remove({_id: new mongodb.ObjectId(req.params.id)}, function(err, result) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else if (result.result.n === 0) {
            res.sendStatus(404);
          } else {
            res.sendStatus(200);
          }
        });
      }
    });
  });
});

/**
 * La page pour modifier une installation aquatique selon l'identifiant.
 */
router.get('/glissade/:id', function(req, res) {
  requete.getCollection({_id: new mongodb.ObjectId(req.params.id)}, collectionGlissade, function(err, glissadeData) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else if (glissadeData.length === 0) {
      res.sendStatus(404);
    } else {
      res.render('glissade', {glissade: glissadeData});
    }
  });
});

/**
 * Service REST permettant de modifier une patinoire selon l'identifiant.
 */
router.put('/patinoire/:id', function(req, res) {
  schemas.loadSchema("modifier-patinoire", function(err, schema) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      var result = jsonschema.validate(req.body, schema);
      if (result.errors.length > 0) {
        res.status(400).json(result);
      } else {
        requete.modifierInstallation(req, collectionPatinoire, function(err1, patinoireData) {
          if (err1) {
            console.log(err1);
            res.sendStatus(500);
          } else if (patinoireData.result.n === 0) {
            res.sendStatus(404);
          } else {
            res.sendStatus(200);
          }
        });
      }
    }
  });
});

/**
 * Service REST permettant de supprimer une patinoire selon l'identifiant.
 */
router.delete('/patinoire/:id', function(req, res) {
  db.getConnection(function(err, db) {  
    db.collection(collectionPatinoire, function(err, collection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        collection.remove({_id: new mongodb.ObjectId(req.params.id)}, function(err, result) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else if (result.result.n === 0) {
            res.sendStatus(404);
          } else {
            res.sendStatus(200);
          }
        });
      }
    });
  });
});

/**
 * La page pour modifier une patinoire selon l'identifiant.
 */
router.get('/patinoire/:id', function(req, res) {
  requete.getCollection({_id: new mongodb.ObjectId(req.params.id)}, collectionPatinoire, function(err, patinoireData) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else if (patinoireData.length === 0) {
      res.sendStatus(404);
    } else {
      res.render('patinoire', {patinoire: patinoireData});
    }
  });
});

/**
 * Service REST permettant de modifier une piscine selon l'identifiant.
 */
router.put('/piscine/:id', function(req, res) {
  schemas.loadSchema("modifier-piscine", function(err, schema) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      var result = jsonschema.validate(req.body, schema);
      if (result.errors.length > 0) {
        res.status(400).json(result);
      } else {
        requete.modifierInstallation(req, collectionPiscine, function(err1, piscineData) {
          if (err1) {
            console.log(err1);
            res.sendStatus(500);
          } else if (piscineData.result.n === 0) {
            res.sendStatus(404);
          } else {
            res.sendStatus(200);
          }
        });
      }
    }
  });
});

/**
 * Service REST permettant de supprimer une piscine selon l'identifiant.
 */
router.delete('/piscine/:id', function(req, res) {
  db.getConnection(function(err, db) {  
    db.collection(collectionPiscine, function(err, collection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        collection.remove({_id: new mongodb.ObjectId(req.params.id)}, function(err, result) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else if (result.result.n === 0) {
            res.sendStatus(404);
          } else {
            res.sendStatus(200);
          }
        });
      }
    });
  });
});

/**
 * La page pour modifier une piscine selon l'identifiant.
 */
router.get('/piscine/:id', function(req, res) {
  requete.getCollection({_id: new mongodb.ObjectId(req.params.id)}, collectionPiscine, function(err, piscineData) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else if (piscineData.length === 0) {
      res.sendStatus(404);
    } else {
      res.render('piscine', {piscine: piscineData});
    }
  });
});

/**
 * La page de l'index.
 */
router.get('/', function(req, res, next) {
  res.render('index');
});

/**
 * La page pour créer un utilisateur.
 */
router.get('/user', function(req, res, next) {
  res.render('user');
});

/**
 * La page de confirmation qu'un utilisateur à été créer avec succès.
 */
router.get('/user_succes', function(req, res, next) {
  res.render('user_succes');
});

/**
 * La page de documentation RAML à la route /doc.
 */
router.get('/doc', function(req, res) {
  var config = raml2html.getConfigForTheme();
  var erreur = function(err) {
    console.log(err);
    res.sendStatus(500);
  };
  var success = function(html) {
    res.send(html);
  };
  raml2html.render("routes/doc/index.raml", config).then(success, erreur);
});

/**
 * Mise à jour des données de la ville de Montréal.
 * Execute le script ../init.js à tous les jours à minuit.
 */
cron.schedule('0 0 0 * * *', function() {
  init.initBD();
});

module.exports = router;
