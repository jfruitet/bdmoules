-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 22 jan. 2024 à 11:23
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

-- --------------------------------------------------------

--
-- Structure de la table `bdm_photo`
--

CREATE TABLE `bdm_photo` (
  `photoid` int(11) NOT NULL,
  `legende` varchar(255) NOT NULL COMMENT 'légende photo',
  `copyrigth` varchar(80) NOT NULL,
  `fichier` varchar(255) NOT NULL,
  `vignette` varchar(255) NOT NULL,
  `refmodele` int(11) DEFAULT NULL COMMENT 'référence un modèle',
  `refmoule` int(11) DEFAULT NULL COMMENT 'référence un élément'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `bdm_photo`
--

INSERT INTO `bdm_photo` (`photoid`, `legende`, `copyrigth`, `fichier`, `vignette`, `refmodele`, `refmoule`) VALUES
(1, 'Excalibur 2.0', '(CC)', 'Excalibur.jpg', 'Excalibur_vignette.jpg', 37, NULL),
(2, 'Excalibur 2.0 - Master', '(CC)', 'Excalibur_moules.jpg', 'Excalibur_moules_vignette.jpg', NULL, 46);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `bdm_photo`
--
ALTER TABLE `bdm_photo`
  ADD PRIMARY KEY (`photoid`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `bdm_photo`
--
ALTER TABLE `bdm_photo`
  MODIFY `photoid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
