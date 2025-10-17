# Projet HACKATHON

## Installation 
1. Clone le dépôt :
   ```sh
   git clone <url-du-repo>
   cd hackaton
   ```

2. Installe les dépendances :
   ```sh
   npm install
   ```

3. Configure les variables d'environnement :
   - Copie `.env.example` en `.env` et adapte les valeurs si besoin.

4. Lance le serveur de développement pour le frontend :
    ```sh
    cd front
    npm run dev
    ```

5. Ouvre ton navigateur à l'adresse indiquée (généralement `http://localhost:3000`).

6. Lance le serveur pour le backend :
    ```sh
    npm start
    ```

7. Vérifie que le backend fonctionne en accédant à l'API à l'adresse `http://localhost:5000` (ou l'adresse configurée).

## Structure de données

### Structure des dossiers 

- back/
	- models/: Schémas Mongoose pour les entités (User, Commentary, ...)
	- controllers/: Logique métier pour chaque entité (auth, users, commentaries)
	- routes/: Définition des routes Express (commentariesRoutes, usersRoutes, authRoutes, adminRoutes)
	- middlewares/: middlewares d'authentification et d'autorisation
	- utils/: utilitaires (ex: gestion tokens)

- front/
	- src/app/: pages et composants (Next.js app router)
	- src/app/components/: composants réutilisables (Navbar, AddButton, ...)
    - src/app/pages/: pages profils, pages admin, pages connexion & inscriptions, page commentaires, 

### Schémas de données

User:
```json
{
	"_id": "string",
	"email": "string",
	"firstname": "string",
	"lastname": "string",
	"password": "hashed string",
	"role": "user|admin",
	"avatar": "url",
	"address": "string",
	"description": "string",
	"phoneNumber": "string",
	"createdAt": "Date",
	"updatedAt": "Date"
}
```

Commentary:
```json
{
	"_id": "string",
	"description": "string",
	"userId": "ObjectId | { _id, firstname, lastname, avatar }",
	"parentId": "ObjectId | null",
	"createdAt": "Date",
	"updatedAt": "Date"
}
```


## Documentation des routes (API)

### Auth
- POST /auth/signin
	- Description: authentifie un utilisateur.
	- Corps: { email, password }
	- Réponse: { token, user }
	- Notes: renvoie un token JWT à stocker côté client (localStorage).

- POST /auth/signup
	- Description: crée un nouvel utilisateur.
	- Corps: { email, firstname, lastname, password, address?, description?, phoneNumber?, avatar? }
	- Réponse: { success: true, user }

- GET /auth/me
	- Description: retourne les informations de l'utilisateur courant (auth requis).
	- Headers: Authorization: Bearer <token>
	- Réponse: { user }

### Users
- GET /users
	- Description: liste des utilisateurs (auth requis, rôle admin possible selon routes).
	- Headers: Authorization: Bearer <token> (si protégé)
	- Réponse: [ users ]

- GET /users/:_id
	- Description: récupère un utilisateur par id (auth requis selon configuration).
	- Réponse: user

- POST /users
	- Description: crée un utilisateur (inscription).
	- Corps: { email, firstname, lastname, password, ... }

- PUT /users/:_id
	- Description: met à jour un utilisateur (auth + ownership/admin).

- DELETE /users/:_id
	- Description: supprime un utilisateur (requiert rôle admin selon configuration).

### Commentaries
- GET /commentaries
	- Description: retourne les commentaires principaux (parentId=null) et popula les champs userId (firstname, lastname, avatar, email) côté serveur.
	- Réponse: [ commentaries ]

- GET /commentaries/:id
	- Description: récupère un commentaire par id.

- POST /commentaries
	- Description: crée un commentaire ou une réponse.
	- Headers: Authorization: Bearer <token> (nécessaire pour poster)
	- Corps: { description, parentId? }
	- Réponse: le commentaire créé (le controller populate userId à la création)

- PUT /commentaries/:id
	- Description: met à jour un commentaire (ownership/admin requis)

- DELETE /commentaries/:id
	- Description: supprime un commentaire (ownership/admin requis)

- GET /commentaries/responses/:parentId
	- Description: récupère les réponses pour un commentaire donné (populate userId côté serveur)

### Admin
- GET /admin/users-this-month
	- Divers endpoints statistiques disponibles (ex: total-comments, comments-per-day)

### Notes générales
- Auth: certains endpoints sont protégés par un middleware `authOpaque` qui nécessite d'envoyer l'en-tête Authorization: Bearer <token>.
- Format des utilisateurs: les objets user renvoyés contiennent typiquement { _id, firstname, lastname, email, avatar, role, createdAt, ... }.
- Comportement côté client: le frontend essaie de récupérer les données utilisateur si `userId` est renvoyé sous forme d'ID. Les pages affichent un message invitant à s'inscrire/se connecter si l'API renvoie 401.


## Auteurs
* [Léo RICHE](https://github.com/Leo-Riche)
* [Anthony LOPES](https://github.com/AnthxnyL)
* [Alyssia LORSOLD PRADON](https://github.com/alyssialopr)