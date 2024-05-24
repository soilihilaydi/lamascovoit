# Schéma MVP de la Base de Données

## Table `Utilisateurs`


CREATE TABLE Utilisateurs (
    idUtilisateur INT PRIMARY KEY AUTO_INCREMENT,
    Email VARCHAR(100) NOT NULL UNIQUE,
    MotDePasse VARCHAR(255) NOT NULL,
    Nom VARCHAR(100) NOT NULL,
    Adresse VARCHAR(255),
    NuméroDeTéléphone VARCHAR(20),
    PhotoUrl VARCHAR(255),
    Rôle VARCHAR(50)
);

## Table `Trajets`

CREATE TABLE Trajets (
    idTrajet INT PRIMARY KEY AUTO_INCREMENT,
    Départ VARCHAR(100) NOT NULL,
    Arrivée VARCHAR(100) NOT NULL,
    DateHeure DATETIME NOT NULL,
    PlacesDisponibles INT NOT NULL,
    Prix FLOAT NOT NULL,
    idUtilisateur INT,
    FOREIGN KEY (idUtilisateur) REFERENCES Utilisateurs(idUtilisateur)
);

## Table `Réservations`

CREATE TABLE Réservations (
    idReservation INT PRIMARY KEY AUTO_INCREMENT,
    Status VARCHAR(50) NOT NULL,
    idUtilisateur INT,
    idTrajet INT,
    FOREIGN KEY (idUtilisateur) REFERENCES Utilisateurs(idUtilisateur),
    FOREIGN KEY (idTrajet) REFERENCES Trajets(idTrajet)
);

## Table `Évaluations`

CREATE TABLE Évaluations (
    idEvaluation INT PRIMARY KEY AUTO_INCREMENT,
    Note FLOAT NOT NULL,
    Commentaire TEXT,
    idUtilisateur INT,
    idTrajet INT,
    FOREIGN KEY (idUtilisateur) REFERENCES Utilisateurs(idUtilisateur),
    FOREIGN KEY (idTrajet) REFERENCES Trajets(idTrajet)
);
