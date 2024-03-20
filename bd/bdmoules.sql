-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 20 mars 2024 à 11:33
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.2.4

SET FOREIGN_KEY_CHECKS=0;
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
CREATE TABLE IF NOT EXISTS `bdm_modele` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` varchar(80) NOT NULL,
  `descriptif` text NOT NULL,
  `dimension` varchar(80) NOT NULL COMMENT 'long x larg x haut',
  `categorie` varchar(50) NOT NULL,
  `timestamp` date NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `bdm_modele`
--

INSERT INTO `bdm_modele` (`id`, `nom`, `descriptif`, `dimension`, `categorie`, `timestamp`) VALUES
(1, 'Piper Cub J3 Squelette Bois', 'Maquette de démonstration', '', 'avion', '2024-01-19'),
(2, 'Orca', 'Orca', '', 'avion', '2024-01-19'),
(3, 'Asw 15', 'Asw 15 3m.', '? x 300 x ?', 'planeur', '2024-01-19'),
(4, 'Moule N°1', 'Moule capot moteur, destination inconnue à compléter', '', 'autre', '2024-01-19'),
(5, 'Fox 2m', 'Moule fuseau', '', 'planeur', '2024-01-19'),
(6, 'Moule N°2', 'Master verrière en plâtre', '', 'autre', '2024-01-19'),
(7, 'LS3', 'LS3 de 3 mètres, moule fuseau, MPX', '', 'planeur', '2024-01-19'),
(8, 'Le Pointu (petit)', 'Moule du fuseau et fuselage blanc.', '', 'planeur', '2024-01-19'),
(9, 'Moule N°3', 'Moule de coque de voilier 1 mètre \"Gothix\", réalisé par l\'ARBL à partir du Goth de Franck Russel', '100 x 20 x 20', 'voilier', '2024-01-19'),
(10, 'Alpha 27', 'Moule fuseau, Mpx 3 axes', '', 'planeur', '2024-01-19'),
(11, 'Flamingo 1980', 'Planeur F3b, moule fuseau, Mpx 3 axes', '', 'planeur', '2024-01-19'),
(12, 'Moule N°4', 'Modèle non décrit, moule fuseau, à compléter', '', 'autre', '2024-01-19'),
(13, 'Ka6 4 mètres', 'Moule fuseau planeur Ka6 de 4 mètres, Mpx 3 axes', '? x 400 x ?', 'planeur', '2024-01-19'),
(14, 'Planeur B4', 'Moule fuseau de planeur B4', '', 'planeur', '2024-01-19'),
(15, 'Aile volante Corback', 'Moule fuseau Corback 140 cm', '', 'planeur', '2024-01-19'),
(16, 'Modèle N°5 planeur F3i', 'Moule du fuseau, descrition à compléter', '', 'planeur', '2024-01-19'),
(17, 'ASW 27', 'Moule fuseau de planeur Asw 27 de 4,5 mètres, S2g', '? x 450 x ?', 'planeur', '2024-01-19'),
(18, 'Modèle n°6', 'Planeur moule bulle', '', 'planeur', '2024-01-19'),
(19, 'Modèle n°7', 'Planeur moule Bulle', '', 'planeur', '2024-01-19'),
(20, 'Modèle n°8', 'Avion, moule capot moteur', '', 'avion', '2024-01-19'),
(21, 'Asw 24 4m', 'Moule de baquet et de cockpit', '', 'planeur', '2024-01-19'),
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
(34, 'Voilier Marblehead GothiX', 'Moule du Gothic de Franck Russel adapté par l\'ARBL', '135 x 40 x 30', 'voilier', '2024-01-19'),
(35, 'Modèle N°19 Catamaran', 'Moules des flotteurs de catamaran', '', 'voilier', '2024-01-19'),
(36, 'Le Pointu (grand)', 'Moule bulle planeur Le Pointu grand modèle', '', 'planeur', '2024-01-19'),
(37, 'Excalibur', 'Planeur de voltige par Eric Poulain.\r\nSurface alaire 52 dm², corde 250/150 mm, profil SB96V/VS', '260 x 145 x ?', 'planeur', '2024-01-22'),
(38, 'Modèle N°10 Avion', 'Moule de capot moteur', '', 'avion', '2024-01-24');

-- --------------------------------------------------------

--
-- Structure de la table `bdm_moule`
--

DROP TABLE IF EXISTS `bdm_moule`;
CREATE TABLE IF NOT EXISTS `bdm_moule` (
  `idmoule` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ref_modele` int(10) UNSIGNED NOT NULL,
  `numero_inventaire` int(4) DEFAULT 0 COMMENT 'numéro d''enregistrement du moule',
  `mdescription` varchar(255) NOT NULL,
  `mlieu` varchar(255) NOT NULL,
  `matiere` varchar(80) NOT NULL,
  `etat` varchar(80) NOT NULL,
  `longueur` smallint(6) DEFAULT NULL,
  `poids` tinyint(4) DEFAULT NULL,
  `commentaire` varchar(255) NOT NULL,
  PRIMARY KEY (`idmoule`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `bdm_moule`
--

INSERT INTO `bdm_moule` (`idmoule`, `ref_modele`, `numero_inventaire`, `mdescription`, `mlieu`, `matiere`, `etat`, `longueur`, `poids`, `commentaire`) VALUES
(1, 20, 24, 'Moule capot moteur, composite', 'La Minais', 'Composite', 'Excellent', NULL, NULL, 'Moule d\'avion inconnu'),
(2, 13, 27, 'Ka6 4m, Moule bulle, Mpx 3 Axes', 'Chez Ludovic B.', 'Composite', 'Excellent', NULL, NULL, 'Chez Ludovic.'),
(3, 17, 28, 'Moule du baquet et du cockpit', 'La Minais', 'Composite', 'Excellent', NULL, NULL, 'Asw 27 de 4,50 mètres'),
(4, 36, 29, 'Moule de la bulle', 'La Minais', 'Composite', 'Excellent', NULL, NULL, 'Planeur Le Pointu (Grand)'),
(5, 5, 30, 'Moule de la bulle', 'La Minais', 'Composite', '', NULL, NULL, 'Planeur Fox 2 mètres'),
(6, 7, 32, 'Master bulle pour planeurs Ls3, F3i, Ventus', 'La Minais', 'Composite', '', NULL, NULL, ''),
(7, 10, 35, 'Master bulle de planeur Alpha 27 Multiplex', 'La Minais', 'Composite', 'Correct', 0, 0, 'Disponible'),
(8, 33, 44, 'Moule de la bulle de planeur Genesis', 'La Minais', 'Composite', '', NULL, NULL, 'En prêt à Rouen'),
(9, 35, 47, 'Master de coque de catamaran ', 'La Minais', 'Bois', '', NULL, NULL, ''),
(10, 1, 1, 'Maquette de Piper Cub J3', 'La Minais', 'Bois', '', NULL, NULL, 'Maquette de démonstration (squelette)'),
(11, 2, 2, 'Moule de fuseau, avion Orca', 'La Minais', 'Composite', '', NULL, NULL, ''),
(12, 2, 3, 'Moule de capot moteur, avion Orca', 'La Minais', 'Composite', '', NULL, NULL, ''),
(13, 3, 4, 'Moule de fuseau, planeur Asw 15', 'La Minais', 'Composite', 'Correct', 127, 0, 'Disponible'),
(14, 4, 5, 'Moule de capot moteur', 'La Minais', 'Composite', '', NULL, NULL, 'Destination inconnue'),
(15, 5, 6, 'Moule de fuseau de Fox 2m', 'La Minais', 'Composite', '', 127, NULL, ''),
(16, 6, 7, 'Master de verrière en plâtre', 'La Minais', 'Plâtre', '', NULL, NULL, ''),
(17, 7, 8, 'Moule de fuseau, MPX, de planeur LS3', 'La Minais', 'Composite', '', NULL, NULL, ''),
(18, 8, 9, 'Moule de fuseau de planeur Le Pointu (petit)', 'La Minais', 'Composite', '', NULL, NULL, ''),
(19, 9, 10, 'Moule de voilier ', 'La Minais', 'Composite', 'Très bon', 120, 0, 'Moule de voilier 1 mètre \"Gothix\" réalisé par l\'ARBL à partir du \"Goth\" de Franck Russel.'),
(20, 10, 11, 'Moule de fuseau pour planeur Alpha 27, 3 axes, Multiplex', 'La Minais', 'Composite', 'Correct', 0, 0, 'Disponible en prêt interne.\r\nContactez le bureau de l\'ARBL'),
(21, 11, 12, 'Moule de fuseau Mpx planeur Flamingo 3 axes', 'La Minais', 'Composite', '', NULL, NULL, ''),
(22, 12, 13, 'Moule de fuseau - informations à compléter', 'La Minais', 'Composite', '', NULL, NULL, ''),
(23, 13, 14, 'Moule fuseau Mpx planeur Ka6 4mètres, 3 axes', 'La Minais', 'Composite', '', 127, NULL, ''),
(24, 14, 15, 'Moule de fuseau de planeur B4 de 3,7 mètres', 'La Minais', 'Composite', '', NULL, NULL, ''),
(25, 15, 16, 'Moule de fuseau d\'aile volante Corback', 'La Minais', 'Composite', '', 150, NULL, ''),
(26, 16, 17, 'Moule de fuseau de planeur F3i', 'La Minais', 'Composite', '', NULL, NULL, ''),
(27, 17, 18, 'Moule de fuseau de planeur Asw 27 de 4, mètres, S2g', 'La Minais', 'Composite', '', NULL, NULL, ''),
(28, 18, 21, 'Moule de la bulle planeur n° 6', 'La Minais', 'Composite', '', NULL, NULL, ''),
(29, 19, 22, 'Moule de la bulle du planeur modèle N°7', 'La Minais', 'Composite', '', NULL, NULL, ''),
(30, 20, 23, 'Moule du capot moteur d\'avion, modèle N°8', 'La Minais', 'Composite', '', NULL, NULL, ''),
(31, 21, 26, 'Moule du baquet et du cockpit de planeur Asw 24 4m', 'La Minais', 'Composite', '', NULL, NULL, ''),
(32, 22, 31, 'Master de la bulle de planeur Mini Twister', 'La Minais', 'Composite', '', NULL, NULL, ''),
(33, 23, 33, 'Master de la bulle de Ventus', 'La Minais', 'Composite', '', NULL, NULL, ''),
(34, 24, 34, 'Moule et contre moule baquet du modèle N°11', 'La Minais', 'Composite', '', NULL, NULL, ''),
(35, 25, 36, 'Moule du master de la bulle du modèle N°12', 'La Minais', 'Composite', '', NULL, NULL, ''),
(36, 26, 37, 'Master de la bulle d\'avion T6', 'La Minais', 'Composite', '', NULL, NULL, ''),
(37, 27, 38, 'Master en bois du modèle N°13', 'La Minais', 'Bois', '', NULL, NULL, ''),
(38, 28, 39, 'Moule de la bulle en résine du modèle N°14', 'La Minais', 'Composite', '', NULL, NULL, ''),
(39, 30, 40, 'Moule du capot moteur du modèle N°15', 'La Minais', 'Composite', '', NULL, NULL, ''),
(40, 31, 41, 'Moule du capot moteur modèle N°16', 'La Minais', 'Composite', '', NULL, NULL, ''),
(41, 32, 42, 'Moule du capot moteur modèle N°17', 'La Minais', 'Composite', '', NULL, NULL, ''),
(42, 33, 43, 'Moule du fuselage planeur Genesis', 'La Minais', 'Composite', '', NULL, NULL, 'En prêt à Rouen.'),
(43, 34, 45, 'Moule de pont de voilier modèle N°18', 'La Minais', 'Composite', '', NULL, NULL, ''),
(44, 35, 46, 'Moules des flotteurs catamaran', 'La Minais', 'Composite', '', NULL, NULL, ''),
(45, 36, 20, 'Moule du fuselage, planeur Le Pointu (grand)', 'La Minais', 'Composite', '', NULL, NULL, ''),
(46, 37, 48, 'Master du fuseau', 'Didier Delhom', 'Composite', 'Excellent', 150, NULL, 'Propriété de Didier Delhom.\r\nNombreux tirages réalisés par Didier D. et Ludovic B.'),
(47, 37, 49, 'Master de la verrière ', 'Didier Delhom', 'Composite', 'Excellent', NULL, NULL, 'Propriété de Didier Delhom.\r\nNombreux tirages réalisés par Didier D. et Ludovic B.'),
(48, 10, 35, 'Maquette de démonstration Alpha 27', 'La Minais', 'Bois, toile et composite', 'Bon', 90, 127, 'Modèle pour exposition ; échelle 1/3 ; NON DISPONIBLE'),
(49, 38, 25, 'Moule de capot moteur, avion modèle N°10', 'La Minais', 'Composite', '', NULL, NULL, 'Modèle à préciser'),
(50, 8, 19, 'Fuselage blanc de planeur Le Pointu (petit)', 'La Minais', 'Composite', '', NULL, NULL, ''),
(61, 37, 52, 'Fuseau planeur Excalibur', 'La Minais', 'Composite', '?', 120, 0, 'Disponible.'),
(62, 23, 53, 'Moule de fuseau de planeur Ventus', 'La Minais', 'Composite', 'Bon', 150, 0, 'Disponible.');

-- --------------------------------------------------------

--
-- Structure de la table `bdm_photo`
--

DROP TABLE IF EXISTS `bdm_photo`;
CREATE TABLE IF NOT EXISTS `bdm_photo` (
  `idphoto` int(11) NOT NULL AUTO_INCREMENT,
  `auteur` varchar(50) NOT NULL,
  `legende` varchar(255) NOT NULL COMMENT 'légende photo',
  `copyright` varchar(80) NOT NULL,
  `fichier` varchar(255) NOT NULL,
  `refmodele` int(11) DEFAULT NULL COMMENT 'référence un modèle',
  `refmoule` int(11) DEFAULT NULL COMMENT 'référence un élément',
  PRIMARY KEY (`idphoto`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `bdm_photo`
--

INSERT INTO `bdm_photo` (`idphoto`, `auteur`, `legende`, `copyright`, `fichier`, `refmodele`, `refmoule`) VALUES
(1, '', 'Excalibur 2.0', '(CC)', 'Excalibur.jpg', 37, NULL),
(2, '', 'Excalibur 2.0 - Master du fuseau', '(CC)', 'Excalibur_moules_fuseau.jpg', NULL, 46),
(3, '', 'Excalibur 2.0 - Master de la verrière.', '(CC)', 'Excalibur_moules_verriere.jpg', NULL, 47),
(4, 'Inconnu', 'Moto planeur tout composite', 'cc-by-sa', 'Planeur_Fox-2.3.jpg', 5, 0),
(7, 'Inconnu', 'Planeur Ventus CX de Luxe, 4,50 mètres', 'cc-by-sa', 'ventus-2cx-de-luxe-env450m-arf-topmodel-c.jpg', 23, 0),
(9, 'Ludo', 'Master de la bulle du Ventus', 'cc-by-sa', 'moulage-LudovicB_0.jpg', NULL, 33),
(11, 'ARBL d\'après Franck Russel', 'Master de \"Gothix\", voilier 1Mètre inspiré du \"Goth\" de Franck Russel ', 'cc-by-sa', 'Gothix_master.jpg', NULL, 19),
(16, 'Franck Russel - Hans-Günter Groes', 'Réalisation composite', 'cc-by-sa', 'Gothic_Marblehead_FranckRussel_mk3_version.png', 34, NULL),
(17, 'Franck Russel', 'Marblehead réalisé par Maurizio Morbidelli (MX Components)', 'cc-by-sa', 'Gothic_Marblehead_FranckRussel_mx_version.png', 34, NULL),
(18, 'ARBL d\'après Franck Russel', 'Version ARBL du voilier Gothic M de Franck Russel', 'cc-by-sa', 'Voilier_M_GothiX.jpg', NULL, 43),
(20, 'Alexander Schleicher', 'L\'ASW 27 est un planeur de la classe FAI 15 mètres, construit en matériaux composites par Alexander Schleicher GmbH & Co. Il effectua son premier vol en 1995 et fut certifié en 1997. Le W indique que Gerhard Waibel fut l\'ingénieur responsable du projet. ', 'cc-by-sa', 'Schleicher_ASW27b.jpg', 17, NULL),
(21, '?', 'Planeur de 5 mètres d\'envergure', 'cc-by-sa', 'Moule de fuseau de planeur ASW28.jpg', NULL, 27),
(22, 'François B.', 'Moule de fuseau. Planeur très populaire en Bretagne. Si vous disposez de photos de ce modèle, merci de nous les faire parvenir.', 'cc-by-sa', 'Planneur_Le-Pointu.jpg', 8, 0),
(25, '', 'De nombreux modèles d\'Alpina entre 3m et 5m.', 'cc-by-sa', 'Alpina_161008-calans-57.jpg', 8, NULL),
(26, '', 'Fuselage en fibre de verre, ailes et empennage en polystyrène coffré. ', 'cc-by-sa', 'ASW_15_GST4_1_-1a7a4.jpg', 3, NULL),
(27, 'ARBL', 'Piper Cub J3, squelette de démonstration', 'cc-by-sa', 'PiperCub J3', 1, NULL),
(28, '', 'Le Rolladen-Schneider LS3 est un planeur monoplace de classe standard qui a été produit par Rolladen-Schneider de 1976 à 1983.', 'cc-by-sa', 'Multiplex_LS3CS_01.jpg', 7, NULL),
(29, 'Multiplex', 'Planeur Flamingo Contest de chez Multiplex', 'cc-by-sa', 'multiplex-flamingo-contest.jpg', 11, NULL),
(30, 'Multiplex', 'D\'une envergure de 2.85 m, c\'était un bon compromis pour recommencer à tatouiller la bulle, à la recherche de l\'ascenseur de service. Fuselage fibre de bonne qualité, ailes entoilées en expansé coffrée, j\'ai affaire à un kit classique de planeur dont on p', 'cc-by-sa', 'flamingo_1.jpg', 11, 0),
(31, 'Multiplex', 'Le Planeur Flamingo est un planeur de compétition de haut niveau, fabriqué par l\'excellente marque Multiplex.', 'cc-by-sa', 'multiplex-flamingo-contest_02.jpg', 11, NULL),
(32, '', 'Le Planeur Flamingo est un planeur de compétition de haut niveau, fabriqué par l\'excellente marque Multiplex Mini 9. Ce planeur a été construit en 2001 et a été soigneusement entretenu depuis cette période. Il mesure 3,00 mètres de long et possède des ail', 'cc-by-sa', 'flamingo_2001.jpg', 11, NULL),
(33, '', 'Moule de fuseau', 'cc-by-sa', 'fuseau_ventus.jpg', 0, 62),
(34, '', 'Le Ventus 2cx De Luxe Topmodel CZ est une \"grande plume\" semi-maquette de 4.50m à l\'échelle 1/4e.La construction est magnifique et élégante. ', 'cc-by-sa', 'planeur_ventus_01.gif', NULL, 62),
(35, '', 'L\'Alexander Schleicher Ka 6 Rhönsegler est un planeur de compétition allemand de Classe Standard qui a dominé la compétition au début des années 1960. 1400 exemplaires ont été construits. ', 'cc-by-sa', 'K6_Grandeur&RC.jpg', 13, NULL),
(36, 'ARBL', 'Disponible.', 'cc-by-sa', 'K6_moule_bulle.jpg', NULL, 2),
(37, '', 'Le MDM-1 Fox est un planeur biplace de voltige construit par Margański & Myslowski en matériaux composites avec train fixe et un empennage cruciforme. ', 'cc-by-sa', 'moule_fuseau_planeur-K6.jpg', 0, 23),
(38, '', 'K6 des Alpilles.\r\nGrâce à ses caractéristiques de vol très dociles, le Ka-6 est le premier monoplace que pilotent les élèves de l\'AVVC (et de bien des clubs). Nombre de pilotes on fait leur premier vol de 50 km à bord d\'un Ka-6. Malgré sa construction en ', 'cc-by-sa', 'k6-al64.jpg', 13, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `bdm_realisation`
--

DROP TABLE IF EXISTS `bdm_realisation`;
CREATE TABLE IF NOT EXISTS `bdm_realisation` (
  `realid` int(11) NOT NULL AUTO_INCREMENT,
  `realisateur` varchar(80) NOT NULL COMMENT 'auteur',
  `realdate` date NOT NULL COMMENT 'date de fabrication',
  `realelement` int(11) NOT NULL,
  `realmaj` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`realid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `bdm_user`
--

DROP TABLE IF EXISTS `bdm_user`;
CREATE TABLE IF NOT EXISTS `bdm_user` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `usernom` varchar(80) NOT NULL,
  `userlogin` varchar(30) NOT NULL,
  `statut` tinyint(4) NOT NULL COMMENT '1: admin, 2:auteur, 3: lecteur\r\n',
  `pass` varchar(255) NOT NULL COMMENT 'pass crypté MD5',
  `telephone` varchar(30) NOT NULL,
  `club` varchar(255) NOT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `bdm_user`
--

INSERT INTO `bdm_user` (`userid`, `usernom`, `userlogin`, `statut`, `pass`, `telephone`, `club`) VALUES
(1, 'FRUITET Jean', 'jean.fruitet@gmail.com', 3, '81dc9bdb52d04dc20036dbd8313ed055', '06 95 28 73 11', 'ARBL, Association Radiomodéliste des Bords de Loire, 44980 Sainte luce sur Loire'),
(2, 'FRUITET Jean', 'jean.fruitet@free.fr', 2, '81dc9bdb52d04dc20036dbd8313ed055', '06 95 28 73 11', 'ARBL, Association Radiomodéliste des Bords de Loire, 44980 Sainte luce sur Loire'),
(3, 'DESCHAMPS Dominique', 'domi.desch@free.fr', 2, '674f3c2c1a8a6f90461e8a66fb5550ba', '06 68 54 01 04', 'ARBL, 44980, Sainte Luce / Loire'),
(4, 'DESCHAMPS Dominique', 'domi.d@arbl.fr', 3, '674f3c2c1a8a6f90461e8a66fb5550ba', '06 68 54 01 04', 'ARBL, 44115 Sainte Luce sur Loire.\r\nWebmaster du site arbl.fr'),
(5, 'jean.fruitet', 'jean.fruitet@laposte.net', 1, '81dc9bdb52d04dc20036dbd8313ed055', '', '');

-- --------------------------------------------------------

--
-- Structure de la table `bdm_user_moule`
--

DROP TABLE IF EXISTS `bdm_user_moule`;
CREATE TABLE IF NOT EXISTS `bdm_user_moule` (
  `ref_user` int(10) NOT NULL,
  `ref_moule` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='associe un utilisateur à un moule pour modification';
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
