var db = require('./db');
var mongodb = require('mongodb');

const collectionPatinoire = "patinoire";
const collectionGlissade = "glissade";

/**
 * Fonction qui permet d'obtenir le contenu d'une collection et la classe en ordre alphabétique selon le nom.
 */
exports.getCollection = function(objet, nomCollection, callback) {
  db.getConnection(function(err, db) {  
    db.collection(nomCollection, function(err, collection) {
      if (err) {
        callback(err);
      } else {
        collection.find(objet).sort({"nom": 1}).toArray(function(err, result) {
          if (err) {
            callback(err);
          } else {
            callback(null, result);
          }
        });
      }
    });
  });
};

/**
 *Fonction qui permet de modifier un objet d'une collection selon l'identifiant.
 */
exports.modifierInstallation = function(req, nomCollection, callback) {
  db.getConnection(function(err, db) {  
    db.collection(nomCollection, function(err, collection) {
      if (err) {
        callback(err);
      } else {
        if ((nomCollection === collectionPatinoire || nomCollection === collectionGlissade) && req.body.date_maj) {
          req.body.date_maj = new Date(req.body.date_maj);
        }
        collection.update({_id: new mongodb.ObjectId(req.params.id)}, {$set: req.body}, function(err, result) {
          if (err) {
            callback(err);
          } else {
            callback(null, result);
          }
        });
      }
    });
  });
};

/**
 *Fonction qui permet d'insérer un objet dans la collection en paramètre.
 */
exports.insererInstallation = function(req, nomCollection, callback) {
  db.getConnection(function(err, db) {  
    db.collection(nomCollection, function(err, collection) {
      if (err) {
        callback(err);
      } else {
        collection.insert(req.body, function(err, result) {
          if (err) {
            callback(err);
          } else {
            callback(null, result);
          }
        });
      }
    });
  });
};
