import app from "./app.js";
import sequelize from "./src/config/db.config.js";  
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

// Tentez d'authentifier et de connecter Sequelize à votre base de données
sequelize.authenticate()
    .then(() => {
        console.log('hey man la Connexion à la base de données ben ca roule man');
        // Écoute du serveur sur le port spécifié seulement après la connexion réussie à la base de données
        app.listen(PORT, () => {
            console.log(`Hey man ça roule pour toi pour moi ça tourne le serveur et prêt sur les ondes ${PORT}`);
        });
    })
    .catch(err => {
        // Log des erreurs si la connexion à la base de données échoue
        console.error('Impossible de se connecter à la base de données:', err);
    });

