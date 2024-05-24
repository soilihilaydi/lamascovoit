import { Sequelize } from 'sequelize';
import sequelize from '../config/db.config.js';

import Utilisateur from './utilisateurModel.js';
import Trajet from './trajetModel.js';
import Evaluation from './evaluationModel.js';
import Reservation from './reservationModel.js';

//  les associations 
Utilisateur.hasMany(Reservation, { foreignKey: 'idUtilisateur' });
Reservation.belongsTo(Utilisateur, { foreignKey: 'idUtilisateur' });

Utilisateur.hasMany(Trajet, { foreignKey: 'idUtilisateur' });
Trajet.belongsTo(Utilisateur, { foreignKey: 'idUtilisateur' });

Utilisateur.hasMany(Evaluation, { foreignKey: 'idUtilisateur' });
Evaluation.belongsTo(Utilisateur, { foreignKey: 'idUtilisateur' });

Trajet.hasMany(Reservation, { foreignKey: 'idTrajet' });
Reservation.belongsTo(Trajet, { foreignKey: 'idTrajet' });

Trajet.hasMany(Evaluation, { foreignKey: 'idTrajet' });
Evaluation.belongsTo(Trajet, { foreignKey: 'idTrajet' });

export { Utilisateur, Trajet, Evaluation, Reservation, sequelize };
