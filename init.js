var xmldom = require("xmldom");
var db = require('./routes/db');
var request = require('request');
var csv = require('csvtojson');

const collectionPiscine = "piscine";
const collectionPatinoire = "patinoire";
const collectionGlissade = "glissade";

/**
 * Retourne le contenu du document d'une glissade ou d'une patinoire dépendant de la collection passé en paramètre
 */
function getContenuFichier(nomCollection, callback) {
  var url;
  if (nomCollection === collectionGlissade) {
    url = "http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_GLISSADE.xml";
  } else if (nomCollection === collectionPatinoire) {
    url = "http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_PATINOIRE.xml";
  }
  request.get(url, function(err, response) {
    if (err) {
      callback(err);
    } else {
      var data = response.body;
      callback(null, data);
    }
  });
}

/**
 * Insérer un object à la collection piscine.
 */
function insertPiscine(idUev, type, nom, arrondissement, adresse, prioriete, gestion, pointX, pointY, equipement, long, lat) {
  db.getConnection( function(err, db) {
    db.collection(collectionPiscine, function(err, collection) {
      if (err) {
        console.log(err);
      } else {
        collection.insert({'idUev': idUev,
                           'type': type,
                           'nom': nom,
                           'arrondissement': arrondissement,
                           'adresse': adresse,
                           'prioriete': prioriete,
                           'gestion': gestion,
                           'pointX': pointX,
                           'pointY': pointY,
                           'equipement': equipement,
                           'long': long,
                           'lat': lat}, function(err, result) {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  });
}

/**
 * Insérer un object à la collection glissade.
 */
function insertGlissade(nom, nomArr, cle, dateMaj, ouvert, deblaye, condition) {
  db.getConnection( function(err, db) {
    db.collection(collectionGlissade, function(err, collection) {
      if (err) {
        console.log(err);
      } else {
        collection.insert({'nom': nom,
                           'arrondissement': {
                             'nom_arr': nomArr,
                             'cle': cle,
                             'date_maj': dateMaj,
                           },
                           'ouvert': ouvert,
                           'deblaye': deblaye,
                           'condition': condition}, function(err, result) {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  });
}

/**
 * Insérer un object à la collection patinoire.
 */
function insertPatinoire(nom, nomArr, cle, dateMaj, ouvert, deblaye, arrose, resurface, condition) {
  db.getConnection(function(err, db) {
    db.collection(collectionPatinoire, function(err, collection) {
      if (err) {
        console.log(err);
      } else {
        collection.insert({'nom': nom,
                           'arrondissement': {
                             'nom_arr': nomArr,
                             'cle': cle,
                             'date_maj': dateMaj,
                           },
                           'ouvert': ouvert,
                           'deblaye': deblaye,
                           'arrose': arrose,
                           'resurface': resurface,
                           'condition': condition}, function(err, result) {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  });
}

/**
 * Décompose chaque objet des piscine de la ville de montreal pour les stocker dans la bd.
 */
function parsePiscine() {
  csv()
  .fromStream(request.get('http://donnees.ville.montreal.qc.ca/dataset/4604afb7-a7c4-4626-a3ca-e136158133f2/resource/cbdca706-569e-4b4a-805d-9af73af03b14/download/piscines.csv'))
  .on('csv', (csvCol)=>{
      insertPiscine(parseInt(csvCol[0]), csvCol[1], csvCol[2], csvCol[3], csvCol[4],
                    csvCol[5], csvCol[6], csvCol[7], csvCol[8], csvCol[9], 
                    parseFloat(csvCol[10]), parseFloat(csvCol[11]));
  })
  .on('done', (error)=>{
  });
}
  
/**
 * Décompose chaque objet des patinoires ou des piscines de la ville de montreal pour les stocker dans la bd.
 */
function parsePatinoireOuPiscine(collection) {
  getContenuFichier(collection, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      var domRoot = new xmldom.DOMParser().parseFromString(data.toString());
      var installaList = domRoot.getElementsByTagName(collection);
      if (!installaList.length) {
      console.log("La collection ne contient aucun objet.");
      } else {
        for (var i = 0; i < installaList.length; i++) {
          var currentInstalla = installaList[i];
          var nom = currentInstalla.getElementsByTagName("nom")[0].textContent;
          var arrondissement = currentInstalla.getElementsByTagName("arrondissement");
          var nomArr = arrondissement[0].getElementsByTagName("nom_arr")[0].textContent;
          var cle = arrondissement[0].getElementsByTagName("cle")[0].textContent;
          var dateMaj = arrondissement[0].getElementsByTagName("date_maj")[0].textContent;
          var ouvert = parseInt(currentInstalla.getElementsByTagName("ouvert")[0].textContent);
          var deblaye = parseInt(currentInstalla.getElementsByTagName("deblaye")[0].textContent);
          var condition = currentInstalla.getElementsByTagName("condition")[0].textContent;
          if (collection === collectionPatinoire) {
            var arrose = parseInt(currentInstalla.getElementsByTagName("arrose")[0].textContent);
            var resurface = parseInt(currentInstalla.getElementsByTagName("resurface")[0].textContent);
            insertPatinoire(nom, nomArr, cle, dateMaj, ouvert, deblaye, arrose, resurface, condition);
          } else if (collection === collectionGlissade) {
            insertGlissade(nom, nomArr, cle, dateMaj, ouvert, deblaye, condition);
          }
        }
      }
    }
  });
}

/**
 * Supprime de la bd la collection passé en paramètre.
 */
function dropCollection(nomCollection) {
    db.getConnection( function(err, db) {
      db.collection(nomCollection, function(err, collection) {
        if (err) {
          console.log(err);
        } else {
          collection.drop( function(err, result) {
            if (err) {
              console.log("Erreur a drop la collection", nomCollection);
            }
          });
        }
      });
    });
  }

/**
 * Reinitialise les donnees des piscines, glissades et patinoires dans leur propre collection.
 */
function initialiseDonnees() {
  dropCollection(collectionPiscine);
  dropCollection(collectionGlissade);
  dropCollection(collectionPatinoire);
  parsePiscine();
  parsePatinoireOuPiscine(collectionPatinoire);
  parsePatinoireOuPiscine(collectionGlissade);
}

exports.initBD = function() {
  initialiseDonnees();
};

initialiseDonnees();
