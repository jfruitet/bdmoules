-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 19 jan. 2024 à 16:45
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bdmoules`
--
CREATE DATABASE IF NOT EXISTS `bdmoules` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `bdmoules`;

-- --------------------------------------------------------

--
-- Structure de la table `bdm_modele`
--

DROP TABLE IF EXISTS `bdm_modele`;
CREATE TABLE `bdm_modele` (
  `id` int(10) UNSIGNED NOT NULL,
  `nom` varchar(80) NOT NULL,
  `descriptif` text NOT NULL,
  `dimension` varchar(80) NOT NULL COMMENT 'long x larg x haut',
  `categorie` enum('avion','planeur','voilier','bateau','autre') NOT NULL,
  `timestamp` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `bdm_modele`
--

INSERT INTO `bdm_modele` (`id`, `nom`, `descriptif`, `dimension`, `categorie`, `timestamp`) VALUES
(1, 'Piper Cub J3 Squelette Bois', 'Maquette de démonstration', '', 'avion', '2024-01-19'),
(2, 'Orca', 'Orca', '', 'avion', '2024-01-19'),
(3, 'Asw 15', 'Asw 15 3m.\r\nMoule fuseau', '? x 300 x ?', 'planeur', '2024-01-19'),
(4, 'Modèle N°1', 'Moule capot moteur, destination inconnue à compléter', '', 'autre', '2024-01-19'),
(5, 'Fox 2m', 'Moule fuseau', '', 'planeur', '2024-01-19'),
(6, 'Moule N°2', 'Master verrière en plâtre', '', 'autre', '2024-01-19'),
(7, 'LS3', 'LS3 de 3 mètres, moule fuseau, MPX', '', 'planeur', '2024-01-19'),
(8, 'Le Pointu', 'Moule à fuseau de planeur \"Le Pointu\" (petit)', '', 'planeur', '2024-01-19'),
(9, 'Modèle N°3', 'Moule de bateau, descriptif à compléter', '', 'bateau', '2024-01-19'),
(10, 'Alpha 27', 'Moule fuseau, Mpx 3 axes', '', 'planeur', '2024-01-19'),
(11, 'Flamingo 1980', 'Planeur F3b, moule fuseau, Mpx 3 axes', '', 'planeur', '2024-01-19'),
(12, 'Moule N°4', 'Modèle non décrit, moule fuseau, à compléter', '', 'autre', '2024-01-19'),
(13, 'Ka6 4 mètres', 'Moule fuseau planeur Ka6 de 4 mètres, Mpx 3 axes', '? x 400 x ?', 'planeur', '2024-01-19'),
(14, 'Planeur B4', 'Moule fuseau de planeur B4', '', 'planeur', '2024-01-19'),
(15, 'Aile volante Corback', 'Moule fuseau Corback 140 cm', '', 'planeur', '2024-01-19'),
(16, 'Moule N°5 planeur F3i', 'Moule fuseau ', '', 'planeur', '2024-01-19'),
(17, 'ASW 27', 'Moule fuseau de planeur Asw 27 de 4,5 mètres, S2g', '? x 450 x ?', 'planeur', '2024-01-19'),
(18, 'Modèle n°6', 'Planeur moule bulle', '', 'planeur', '2024-01-19'),
(19, 'Modèle n°7', 'Planeur moule Bulle', '', 'planeur', '2024-01-19'),
(20, 'Modèle n°8', 'Avion, moule capot moteur', '', 'avion', '2024-01-19'),
(21, 'Asw 24 4m', 'Moule Bacquet Cokpit', '', 'planeur', '2024-01-19'),
(22, 'Mini Twister', 'Master Bulle', '', 'planeur', '2024-01-19'),
(23, 'Ventus', 'Master Bulle', '', 'planeur', '2024-01-19'),
(24, 'Modèle N°11', 'Moule et contre moule Bacquet', '', 'autre', '2024-01-19'),
(25, 'Modèle N°12', 'Master Bulle', '', 'autre', '2024-01-19'),
(26, 'T6', 'Avion T6, master Bulle', '', 'avion', '2024-01-19'),
(27, 'Modèle N°13', 'Planeur, master bois', '', 'planeur', '2024-01-19'),
(28, 'Modèle N°14', 'Moule bulle en résine', '', 'autre', '2024-01-19'),
(30, 'Modèle N°15', 'Moule capot moteur', '', 'autre', '2024-01-19'),
(31, 'Modèle N°16', 'Moule capot moteur', '', 'autre', '2024-01-19'),
(32, 'Modèle N°17', 'Moule capot moteur', '', 'autre', '2024-01-19'),
(33, 'Genesis', 'Moule fuselage', '', 'planeur', '2024-01-19'),
(34, 'Modèle N°18, voilier', 'Moule de pont de voilier, modèle inconnu', '', 'voilier', '2024-01-19'),
(35, 'Modèle N°19 Catamaran', 'Moules des flotteurs de catamaran', '', 'voilier', '2024-01-19'),
(36, 'Le Pointu (grand)', 'Moule bulle planeur Le Pointu grand modèle', '', 'planeur', '2024-01-19');

-- --------------------------------------------------------

--
-- Structure de la table `bdm_moule`
--

DROP TABLE IF EXISTS `bdm_moule`;
CREATE TABLE `bdm_moule` (
  `idmoule` int(10) UNSIGNED NOT NULL,
  `ref_modele` int(10) UNSIGNED NOT NULL,
  `numero_inventaire` int(4) DEFAULT 0 COMMENT 'numéro d''enregistrement du moule',
  `mdescription` varchar(255) NOT NULL,
  `mlieu` varchar(255) NOT NULL,
  `matiere` varchar(80) NOT NULL,
  `etat` enum('Excellent','Bon','Médiocre','Inconnu') NOT NULL,
  `longueur` tinyint(4) DEFAULT NULL,
  `poids` tinyint(4) DEFAULT NULL,
  `commentaire` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `bdm_moule`
--

INSERT INTO `bdm_moule` (`idmoule`, `ref_modele`, `numero_inventaire`, `mdescription`, `mlieu`, `matiere`, `etat`, `longueur`, `poids`, `commentaire`) VALUES
(1, 20, 9, 'Moule capot moteur, composite', 'La Minais', '', 'Excellent', NULL, NULL, ''),
(2, 13, 0, 'Ka6 4m, Moule Bulle, Mpx 3 Axes', 'Chez Ludovic B.', '', 'Excellent', NULL, NULL, ''),
(3, 17, 0, 'Asw 27 de 450 cm, moule baquet, cokpit', 'La Minais', '', 'Excellent', NULL, NULL, ''),
(4, 36, 0, 'Moule de planeur Le Pointu (Grand)', 'La Minais', '', 'Excellent', NULL, NULL, ''),
(5, 5, 0, 'Moule bulle', 'La Minais', 'Composite', '', NULL, NULL, ''),
(6, 7, 0, 'Master bulle pour planeurs Ls3, F3i, Ventus', 'La Minais', 'Composite', '', NULL, NULL, ''),
(7, 10, 0, 'Mastr bulle planeur Alpha 27 270cm, Mpx 3 Axes;', 'La Minais', 'Composite', '', NULL, NULL, ''),
(8, 33, 0, 'Moule bulle de planeur Genesis', 'La Minais', 'Composite', '', NULL, NULL, 'En prêt à Rouen'),
(9, 35, 0, 'Master bois de coque de Catamaran ', 'La Minais', 'Bois', '', NULL, NULL, ''),
(10, 1, 0, 'Maquette de d?monstration', 'La Minais', 'Bois', '', NULL, NULL, ''),
(11, 2, 0, 'Moule de fuseau', 'La Minais', 'Composite', '', NULL, NULL, ''),
(12, 2, 0, 'Moule de capot moteur', 'La Minais', 'Composite', '', NULL, NULL, ''),
(13, 3, 0, 'Moule de fuseau', 'La Minais', 'Composite', '', 127, NULL, ''),
(14, 4, 0, 'Moule capot moteur destination inconnue ? compl?ter', 'La Minais', 'Composite', '', NULL, NULL, ''),
(15, 5, 0, 'Moule de fuseau', 'La Minais', 'Composite', '', 127, NULL, ''),
(16, 6, 0, 'Master de verri?re en pl?tre', 'La Minais', 'Pl?tre', '', NULL, NULL, ''),
(17, 7, 0, 'Moule de fuseau, MPX', 'La Minais', 'Composite', '', NULL, NULL, ''),
(18, 8, 0, 'Moule de fuseau', 'La Minais', 'Composite', '', NULL, NULL, ''),
(19, 9, 3, 'Moule de bateau descriptif ? compl?ter', 'La Minais', 'Composite', '', NULL, NULL, ''),
(20, 10, 0, 'Moule de fuseau Mpx 3 axes', 'La Minais', 'Composite', '', NULL, NULL, ''),
(21, 11, 0, 'Moule de fuseau Mpx 3 axes', 'La Minais', 'Composite', '', NULL, NULL, ''),
(22, 12, 4, 'Moule de fuseau ? compl?ter', 'La Minais', 'Composite', '', NULL, NULL, ''),
(23, 13, 0, 'Moule fuseau Mpx 3 axes', 'La Minais', 'Composite', '', 127, NULL, ''),
(24, 14, 0, 'Moule de fuseau', 'La Minais', 'Composite', '', NULL, NULL, ''),
(25, 15, 0, 'Moule de fuseau', 'La Minais', 'Composite', '', NULL, 127, ''),
(26, 16, 5, 'Moule de fuseau', 'La Minais', 'Composite', '', NULL, NULL, ''),
(27, 17, 0, 'Moule de fuseau S2g', 'La Minais', 'Composite', '', NULL, 127, ''),
(28, 18, 6, 'Moule de la bulle', 'La Minais', 'Composite', '', NULL, NULL, ''),
(29, 19, 7, 'Moule de la bulle', 'La Minais', 'Composite', '', NULL, NULL, ''),
(30, 20, 8, 'Moule du capot moteur', 'La Minais', 'Composite', '', NULL, NULL, ''),
(31, 21, 0, 'Moule du baquet du cokpit', 'La Minais', 'Composite', '', NULL, NULL, ''),
(32, 22, 0, 'Moule du master de la bulle', 'La Minais', 'Composite', '', NULL, NULL, ''),
(33, 23, 0, 'Moule du master de la bulle', 'La Minais', 'Composite', '', NULL, NULL, ''),
(34, 24, 11, 'Moule et contre moule baquet', 'La Minais', 'Composite', '', NULL, NULL, ''),
(35, 25, 12, 'Moule du master de la bulle', 'La Minais', 'Composite', '', NULL, NULL, ''),
(36, 26, 0, 'Moule du master de la bulle', 'La Minais', 'Composite', '', NULL, NULL, ''),
(37, 27, 13, 'Moule du master en bois', 'La Minais', 'Bois', '', NULL, NULL, ''),
(38, 28, 14, 'Moule de la bulle en r?sine', 'La Minais', 'Composite', '', NULL, NULL, ''),
(39, 30, 15, 'Moule du capot moteur', 'La Minais', 'Composite', '', NULL, NULL, ''),
(40, 31, 16, 'Moule du capot moteur', 'La Minais', 'Composite', '', NULL, NULL, ''),
(41, 32, 17, 'Moule du capot moteur', 'La Minais', 'Composite', '', NULL, NULL, ''),
(42, 33, 0, 'Moule du fuselage', 'La Minais', 'Composite', '', NULL, NULL, ''),
(43, 34, 18, 'Moule de pont de voilier mod?le inconnu', 'La Minais', 'Composite', '', NULL, NULL, ''),
(44, 35, 19, 'Moules des flotteurs catamaran', 'La Minais', 'Composite', '', NULL, NULL, ''),
(45, 36, 0, 'Moule bulle planeur Le Pointu grand mod?le', 'La Minais', 'Composite', '', NULL, NULL, '');

-- --------------------------------------------------------

--
-- Structure de la table `bdm_photo`
--

DROP TABLE IF EXISTS `bdm_photo`;
CREATE TABLE `bdm_photo` (
  `photoid` int(11) NOT NULL,
  `legende` varchar(255) NOT NULL COMMENT 'légende photo',
  `copyrigth` varchar(80) NOT NULL,
  `fichier` varchar(255) NOT NULL,
  `vignette` varchar(255) NOT NULL,
  `refmodele` int(11) DEFAULT NULL COMMENT 'référence un modèle',
  `refmoule` int(11) DEFAULT NULL COMMENT 'référence un élément'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `bdm_realisation`
--

DROP TABLE IF EXISTS `bdm_realisation`;
CREATE TABLE `bdm_realisation` (
  `realid` int(11) NOT NULL,
  `realisateur` varchar(80) NOT NULL COMMENT 'auteur',
  `realdate` date NOT NULL COMMENT 'date de fabrication',
  `realelement` int(11) NOT NULL,
  `realmaj` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `bdm_user`
--

DROP TABLE IF EXISTS `bdm_user`;
CREATE TABLE `bdm_user` (
  `userid` int(11) NOT NULL,
  `usernom` varchar(80) NOT NULL,
  `userlogin` varchar(30) NOT NULL,
  `statut` tinyint(4) NOT NULL COMMENT '1: admin, 2:auteur, 3: lecteur\r\n',
  `pass` varchar(255) NOT NULL COMMENT 'pass crypté MD5',
  `telephone` varchar(30) NOT NULL,
  `club` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `bdm_user_moule`
--

DROP TABLE IF EXISTS `bdm_user_moule`;
CREATE TABLE `bdm_user_moule` (
  `ref_user` int(10) NOT NULL,
  `ref_moule` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='associe un utilisateur à un moule pour modification';

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `bdm_modele`
--
ALTER TABLE `bdm_modele`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `bdm_moule`
--
ALTER TABLE `bdm_moule`
  ADD PRIMARY KEY (`idmoule`);

--
-- Index pour la table `bdm_photo`
--
ALTER TABLE `bdm_photo`
  ADD PRIMARY KEY (`photoid`);

--
-- Index pour la table `bdm_realisation`
--
ALTER TABLE `bdm_realisation`
  ADD PRIMARY KEY (`realid`);

--
-- Index pour la table `bdm_user`
--
ALTER TABLE `bdm_user`
  ADD PRIMARY KEY (`userid`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `bdm_modele`
--
ALTER TABLE `bdm_modele`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT pour la table `bdm_moule`
--
ALTER TABLE `bdm_moule`
  MODIFY `idmoule` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT pour la table `bdm_photo`
--
ALTER TABLE `bdm_photo`
  MODIFY `photoid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `bdm_realisation`
--
ALTER TABLE `bdm_realisation`
  MODIFY `realid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `bdm_user`
--
ALTER TABLE `bdm_user`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
