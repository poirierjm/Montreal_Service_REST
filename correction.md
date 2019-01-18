Correction
====

Les points développés:
---------

**A1 15xp**  
Trois listes de données doivent être obtenues à l'aide de requêtes HTTP et leur contenu doit être stocké dans une base de données MongoDB.  
**Tester:** Cette fonctionnalité se trouve dans le fichier ```init.js``` à la racine du projet. Il suffit de lancer la commande ```node init.js``` pour exécuter la tâche.  

**A2 5xp**  
L'importation de données du point A1 est faite automatiquement chaque jour à minuit.  
**Tester:** Cette fonctionnalité se trouve dans le fichier ```routes/index.js```.   

**A3 5xp**  
Le système écoute les requêtes HTTP sur le port 3000. La route « /doc » fait apparaître la documentation de tous les services REST. La documentation est en format HTML, généré à partir de fichiers RAML.  
**Tester:** Cette fonctionnalité se trouve à la route ```/doc```   

**A4 10xp**  
Le système offre un service REST permettant d'obtenir la liste des installations pour un arrondissement spécifié en paramètre. Les données retournées sont en format JSON.  
**Tester:** Le service REST se trouve à la route ```/installations```   
Exemple d'utilisation:  ```/installations?arrondissement=LaSalle```  

**A5 10xp**  
Une application JavaScript/HTML permet de saisir un arrondissement à partir d'un formulaire HTML. Lorsque l'utilisateur lance la recherche, une requête Ajax contenant l'arrondissement saisis est envoyée à la route définie en A4. Lorsque la réponse Ajax revient, l'application affiche la liste des installations dans un tableau. L'application est disponible sur la page d'accueil du serveur (route « / »).  
**Tester:** Cette fonctionnalité se trouve à la route ```/```  

---

**C1 10xp**  
Le système offre un service REST permettant d'obtenir la liste des installations en mauvaise condition. Pour chaque installation, on indique toute l'information connue. La liste est triée en ordre croissant du nom de l'installation.  
**Tester:** Le service REST se trouve à la route ```/condition_mauvaise```   

**C2 10xp**  
Le système offre un service permettant d'obtenir exactement les mêmes données que le point C1 mais en format XML. L'encodage de caractères doit être UTF-8.  
**Tester:** Le service se trouve à la route ```/condition_mauvaise_xml```   

**C3 5xp**  
Le système offre un service permettant d'obtenir exactement les mêmes données que le point C1 mais en format CSV. L'encodage de caractères doit être UTF-8.  
**Tester:** Le service se trouve à la route ```/condition_mauvaise_csv```   

---

**D1 15xp**  
Le système offre un service REST permettant de modifier l'état d'une glissade. Le client doit envoyer un document JSON contenant les modifications à apporter à la glissade. Le document JSON doit être validé avec json-schema.  
**Tester:** Le service REST se trouve à la route ```/glissade/{id}```  

**D2 5xp**  
Le système offre un service REST permettant de supprimer une glissade.  
**Tester:** Le service REST se trouve à la route ```/glissade/{id}```  

**D3 20xp**  
Modifier l'application faite en A5 afin de pouvoir supprimer ou modifier les glissades retournées par l'outil de recherche. L'application doit invoquer les services faits en D1 et D2 avec des appels Ajax et afficher une confirmation en cas de succès ou un message d'erreur en cas d'erreur. Il faut développer la même fonctionnalité pour les piscines et installations aquatiques.  
**Tester:** Cette fonctionnalité se trouve à la route ```/```  
**Tester:** Le service REST pour modifier ou supprimer une patinoire se trouve à la route ```/patinoire/{id}```  
**Tester:** Le service REST pour modifier ou supprimer une piscine se trouve à la route ```/piscine/{id}```  

---

**E1 10xp**  
Le système offre un service REST permettant à un utilisateur de se créer un profil d'utilisateur. Le service reçoit un document JSON contenant :  
 - le nom complet de l'utilisateur;  
 - l'adresse courriel de l'utilisateur;  
 - une liste d'arrondissements à surveiller.  
   
Le document JSON doit être validé avec json-schema.  
**Tester:** Le service REST se trouve à la route ```/utilisateur```  

**E2 5xp**  
Le système offre une interface graphique en HTML pour invoquer le service fait en E1.  
**Tester:** L'interface graphique se trouve à la route ```/user```   


Statut
---------
125xp/100