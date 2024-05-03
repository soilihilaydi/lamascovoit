import app from "./app.js";
import sequelize from "./src/config/db.config.js";  // Assurez-vous que ce chemin est correct
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

// Tentez d'authentifier et de connecter Sequelize à votre base de données
sequelize.authenticate()
    .then(() => {
        console.log('Connexion à la base de données réussie');
        // Écoute du serveur sur le port spécifié seulement après la connexion réussie à la base de données
        app.listen(PORT, () => {
            console.log(`Hey man ça roule pour toi pour moi ça tourne le serveur et prêt ${PORT}`);
        });
    })
    .catch(err => {
        // Log des erreurs si la connexion à la base de données échoue
        console.error('Impossible de se connecter à la base de données:', err);
    });

