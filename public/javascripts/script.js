function changerType(str) {
  var resultat;
  if (str === "" || str === "null") {
    resultat = null;
  } else {
    resultat = parseInt(str);
  }
  return resultat;
}

function modifierGlissade(_id) {
  var nomId = document.getElementById("nom").value;
  var nomArrId = document.getElementById("nom_arr").value;
  var cleId = document.getElementById("cle").value;
  var dateMajId = document.getElementById("date_maj").value;
  var ouvertId =document.getElementById("ouvert").value;
  var deblayeId = document.getElementById("deblaye").value;
  var conditionId = document.getElementById("condition").value;
  if (nomId !== "" && nomArrId !== "" && cleId !== "" && dateMajId !== "" && conditionId !== "" && Date.parse(dateMajId) && (ouvertId === "null" || /^\d+$/.test(ouvertId) || ouvertId === "") && (deblayeId === "" || deblayeId === "null" || /^\d+$/.test(deblayeId))) {
    ouvertId = changerType(ouvertId);
    deblayeId = changerType(deblayeId);
    var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 201 || xhr.status === 200) {
                document.getElementById("succes").style.display = "inherit";
                document.getElementById("erreur-nom").style.display = "none";
                document.getElementById("erreur-arr").style.display = "none";
                document.getElementById("erreur-cle").style.display = "none";
                document.getElementById("erreur-date").style.display = "none";
                document.getElementById("erreur-ouvert").style.display = "none";
                document.getElementById("erreur-deblaye").style.display = "none";
                document.getElementById("erreur-condition").style.display = "none";
              } else {
                console.log('Erreur avec le serveur');
              }
          }
      };
      xhr.open("PUT", "/glissade/" + _id, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({nom: nomId, arrondissement: {nom_arr: nomArrId, cle: cleId, date_maj: dateMajId}, ouvert: ouvertId, deblaye: deblayeId, condition: conditionId}));
  } else {
    validationFailGlissade(nomId, nomArrId, cleId, dateMajId, ouvertId, deblayeId, conditionId);
  }
}

function validationFailGlissade(nomId, nomArrId, cleId, dateMajId, ouvertId, deblayeId, conditionId) {
  document.getElementById("succes").style.display = "none";
  if (nomId === "") {
    document.getElementById("erreur-nom").style.display = "inherit";
  }
  if (nomArrId === "") {
    document.getElementById("erreur-arr").style.display = "inherit";
  }
  if (cleId === "") {
    document.getElementById("erreur-cle").style.display = "inherit";
  }
  if (dateMajId === "" || !Date.parse(dateMajId)) {
    document.getElementById("erreur-date").style.display = "inherit";
  }
  if (ouvertId !== "" && ouvertId !== "null" && !(/^\d+$/.test(ouvertId))) {
    document.getElementById("erreur-ouvert").style.display = "inherit";
  }
  if (deblayeId !== "" && deblayeId !== "null" && !(/^\d+$/.test(deblayeId))) {
    document.getElementById("erreur-deblaye").style.display = "inherit";
  }
  if (conditionId === "") {
    document.getElementById("erreur-condition").style.display = "inherit";
  }
}

function modifierPatinoire(_id) {
  var nomId = document.getElementById("nom").value;
  var nomArrId = document.getElementById("nom_arr").value;
  var cleId = document.getElementById("cle").value;
  var dateMajId = document.getElementById("date_maj").value;
  var ouvertId =document.getElementById("ouvert").value;
  var deblayeId = document.getElementById("deblaye").value;
  var arroseId = document.getElementById("arrose").value;
  var resurfaceId = document.getElementById("resurface").value;
  var conditionId = document.getElementById("condition").value;
  if (nomId !== "" && nomArrId !== "" && cleId !== "" && dateMajId !== "" && conditionId !== "" && Date.parse(dateMajId) && (ouvertId === "null" || /^\d+$/.test(ouvertId) || ouvertId === "") && (deblayeId === "" || deblayeId === "null" || /^\d+$/.test(deblayeId)) && (arroseId === "" || arroseId === "null" || /^\d+$/.test(arroseId))&& (resurfaceId === "" || resurfaceId === "null" || /^\d+$/.test(resurfaceId))) {
    ouvertId = changerType(ouvertId);
    deblayeId = changerType(deblayeId);
    arroseId = changerType(arroseId);
    resurfaceId = changerType(resurfaceId);
    var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 201 || xhr.status === 200) {
                document.getElementById("succes").style.display = "inherit";
                document.getElementById("erreur-nom").style.display = "none";
                document.getElementById("erreur-arr").style.display = "none";
                document.getElementById("erreur-cle").style.display = "none";
                document.getElementById("erreur-date").style.display = "none";
                document.getElementById("erreur-ouvert").style.display = "none";
                document.getElementById("erreur-deblaye").style.display = "none";
                document.getElementById("erreur-arrose").style.display = "none";
                document.getElementById("erreur-resurface").style.display = "none";
                document.getElementById("erreur-condition").style.display = "none";
              } else {
                console.log('Erreur avec le serveur');
              }
          }
      };

      xhr.open("PUT", "/patinoire/" + _id, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({nom: nomId, arrondissement: {nom_arr: nomArrId, cle: cleId, date_maj: dateMajId}, ouvert: ouvertId, deblaye: deblayeId, arrose: arroseId, resurface: resurfaceId, condition: conditionId}));
  } else {
    validationFailPatinoire(nomId, nomArrId, cleId, dateMajId, ouvertId, deblayeId, arroseId, resurfaceId, conditionId);
  }
}

function validationFailPatinoire(nomId, nomArrId, cleId, dateMajId, ouvertId, deblayeId, arroseId, resurfaceId, conditionId) {
  document.getElementById("succes").style.display = "none";
  if (nomId === "") {
    document.getElementById("erreur-nom").style.display = "inherit";
  }
  if (nomArrId === "") {
    document.getElementById("erreur-arr").style.display = "inherit";
  }
  if (cleId === "") {
    document.getElementById("erreur-cle").style.display = "inherit";
  }
  if (dateMajId === "" || !Date.parse(dateMajId)) {
    document.getElementById("erreur-date").style.display = "inherit";
  }
  if (ouvertId !== "" && ouvertId !== "null" && !(/^\d+$/.test(ouvertId))) {
    document.getElementById("erreur-ouvert").style.display = "inherit";
  }
  if (deblayeId !== "" && deblayeId !== "null" && !(/^\d+$/.test(deblayeId))) {
    document.getElementById("erreur-deblaye").style.display = "inherit";
  }
  if (arroseId !== "" && arroseId !== "null" && !(/^\d+$/.test(arroseId))) {
    document.getElementById("erreur-arrose").style.display = "inherit";
  }
  if (resurfaceId !== "" && resurfaceId !== "null" && !(/^\d+$/.test(resurfaceId))) {
    document.getElementById("erreur-resurface").style.display = "inherit";
  }
  if (conditionId === "") {
    document.getElementById("erreur-condition").style.display = "inherit";
  }
}

function modifierPiscine(_id) {
  var idUev = document.getElementById("idUev").value;
  var type = document.getElementById("type").value;
  var nom = document.getElementById("nom").value;
  var arrondissement = document.getElementById("arrondissement").value;
  var adresse =document.getElementById("adresse").value;
  var prioriete = document.getElementById("prioriete").value;
  var gestion = document.getElementById("gestion").value;
  var pointX = document.getElementById("pointX").value;
  var pointY = document.getElementById("pointY").value;
  var equipement = document.getElementById("equipement").value;
  var long = document.getElementById("long").value;
  var lat = document.getElementById("lat").value;
  if (/^\d+$/.test(idUev) && idUev !== "" && type !== "" && nom !== "" && arrondissement !== "" && adresse !== "" && long !== "" && lat !== "" && /^-?\d*(\.\d+)?$/.test(long) && /^-?\d*(\.\d+)?$/.test(lat)) {
    var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 201 || xhr.status === 200) {
                document.getElementById("succes").style.display = "inherit";
                document.getElementById("erreur-iduev").style.display = "none";
                document.getElementById("erreur-type").style.display = "none";
                document.getElementById("erreur-nom").style.display = "none";
                document.getElementById("erreur-arrondissement").style.display = "none";
                document.getElementById("erreur-adresse").style.display = "none";
                document.getElementById("erreur-long").style.display = "none";
                document.getElementById("erreur-lat").style.display = "none";
              } else {
                console.log('Erreur avec le serveur');
              }
          }
      };

      xhr.open("PUT", "/piscine/" + _id, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({idUev: parseInt(idUev), type: type, nom: nom, arrondissement: arrondissement, adresse: adresse, prioriete: prioriete, gestion: gestion, pointX: pointX, pointY: pointY, equipement: equipement, long: parseFloat(long), lat: parseFloat(lat)}));
  } else {
    validationFailPiscine(idUev, type, nom, arrondissement, adresse, long, lat);
  }
}

function validationFailPiscine(idUev, type, nom, arrondissement, adresse, long, lat) {
  document.getElementById("succes").style.display = "none";
  if (idUev === "" || !(/^\d+$/.test(idUev))) {
    document.getElementById("erreur-iduev").style.display = "inherit";
  }
  if (type === "") {
    document.getElementById("erreur-type").style.display = "inherit";
  }
  if (nom === "") {
    document.getElementById("erreur-nom").style.display = "inherit";
  }
  if (arrondissement === "") {
    document.getElementById("erreur-arrondissement").style.display = "inherit";
  }
  if (adresse === "" ) {
    document.getElementById("erreur-adresse").style.display = "inherit";
  }
  if (long === "" || !(/^-?\d*(\.\d+)?$/.test(long))) {
    document.getElementById("erreur-long").style.display = "inherit";
  }
  if (lat === "" || !(/^-?\d*(\.\d+)?$/.test(lat))) {
    document.getElementById("erreur-lat").style.display = "inherit";
  }
}

function filtrerInstallationsAvecArrond() {
  donneesFiltrer("/installations?arrondissement=", "glissade", 7);
  donneesFiltrer("/installations?arrondissement=", "patinoire", 9);
  donneesFiltrer("/installations?arrondissement=", "piscine", 9);
}

function donneesFiltrer(path, installationId, tdLength) {
  var arrond = document.getElementById("arrondSearch").value;
  var xhr = new XMLHttpRequest();
  var url = path + arrond;
  var tbody = document.getElementById(installationId);

  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var result = "";
      var installations = JSON.parse(xhr.responseText);
      if (installationId === "glissade") {
        for (var i = 0; i < installations.glissade.length; i++) {
          result += "<tr id="+ installations.glissade[i]._id + "><td>"+ installations.glissade[i].nom +"</td><td>"+ installations.glissade[i].arrondissement.cle +"</td><td>"+installations.glissade[i].arrondissement.date_maj +"</td><td id='ouvert'>"+ installations.glissade[i].ouvert +"</td><td>"+ installations.glissade[i].deblaye +"</td><td>"+ installations.glissade[i].condition +"</td><td><a href='/glissade/"+ installations.glissade[i]._id + "'><span class='glyphicon glyphicon-pencil'></span></a> <span onclick='supprimerInstallation(\"" + installations.glissade[i]._id + "\", \"/glissade/\");' class='glyphicon glyphicon-remove'></span></td></tr>";
        }
      } else if (installationId === "patinoire") {
        for (var i = 0; i < installations.patinoire.length; i++) {
          result += "<tr id="+ installations.patinoire[i]._id + "><td>"+ installations.patinoire[i].nom +"</td><td>"+ installations.patinoire[i].arrondissement.cle +"</td><td>"+installations.patinoire[i].arrondissement.date_maj +"</td><td>"+ installations.patinoire[i].ouvert +"</td><td>"+ installations.patinoire[i].deblaye +"</td><td>"+ installations.patinoire[i].arrose +"</td><td>"+ installations.patinoire[i].resurface +"</td><td>"+ installations.patinoire[i].condition +"</td><td><a href='/patinoire/"+ installations.patinoire[i]._id + "'><span class='glyphicon glyphicon-pencil'></span></a> <span onclick='supprimerInstallation(\"" + installations.patinoire[i]._id + "\", \"/patinoire/\");' class='glyphicon glyphicon-remove'></span></td></tr>";
        }
      } else if (installationId === "piscine") {
        for (var i = 0; i < installations.piscine.length; i++) {
          result += "<tr id="+ installations.piscine[i]._id + "><td>"+ installations.piscine[i].type +"</td><td>"+ installations.piscine[i].nom +"</td><td>"+installations.piscine[i].adresse +"</td><td>"+ installations.piscine[i].prioriete +"</td><td>"+ installations.piscine[i].gestion +"</td><td>"+ installations.piscine[i].equipement +"</td><td>"+ installations.piscine[i].long +"</td><td>"+ installations.piscine[i].lat +"</td><td><a href='/piscine/"+ installations.piscine[i]._id + "'><span class='glyphicon glyphicon-pencil'></span></a> <span onclick='supprimerInstallation(\"" + installations.piscine[i]._id + "\", \"/piscine/\");' class='glyphicon glyphicon-remove'></span></td></tr>";
        }
      }
      tbody.innerHTML = result;
    } else if (xhr.status === 404) {
      tbody.innerHTML = "<tr><td colspan='" + tdLength + "'>Aucune donnée</td></tr>";
    } else {
      console.log('Erreur avec le serveur');
    }
  };
  xhr.send();
}

function supprimerInstallation(_id, path) {
  var xhr = new XMLHttpRequest();

  xhr.open("DELETE", path + _id, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var tr = document.getElementById(_id);
      tr.innerHTML = '';
      if (path === "/patinoire/") {
        document.getElementById("succes-pat").style.display = "inherit";
      } else if (path === "/glissade/") {
        document.getElementById("succes-gli").style.display = "inherit";
      } else if (path === "/piscine/") {
        document.getElementById("succes-pis").style.display = "inherit";
      }
    } else {
      console.log('Erreur avec le serveur');
    }
  };
  xhr.send(null);
}

var cpt = 1;
function ajouterChamps() {
  if (cpt < 10) {
    cpt++;
    var objet = document.getElementById('arrondissement');
    var div = document.createElement("div");
    div.setAttribute("class", "form-group");
    var nom = "arrondissement" + cpt;
    div.innerHTML = '<label class="sr-only" for='+ nom +' >Arrondissement '+ cpt +' : </label><input class="form-control" name='+ nom +' type="text" placeholder="Arrondissement '+ cpt +'" >';
    objet.appendChild(div);
  }
}
