# 📋 CHANGELOG - Rika Firenet Card

## Version 1.0.0 (2024-11-18)

### 🎉 Version initiale

Première version publique de la carte personnalisée Rika Firenet pour Home Assistant.

---

## ✨ Fonctionnalités

### Interface utilisateur
- ✅ Reproduction fidèle de l'interface officielle Rika Firenet
- ✅ Design responsive (desktop, tablette, mobile)
- ✅ 4 onglets de navigation :
  - 🏠 **Accueil** : Vue principale avec contrôles
  - 🔥 **Flamme** : Températures et entrées
  - ⚙️ **Réglages** : Diagnostics et sorties
  - ℹ️ **Infos** : Statistiques et paramètres
- ✅ Barre de navigation en bas avec icônes
- ✅ Animation de sélection d'onglet (fond orange)

### Affichage dynamique
- ✅ SVG du poêle changeant selon l'état :
  - Éteint (Visu_Off)
  - Veille / Demande externe (Visu_Standby)
  - Allumage / Démarrage (Visu_Ignition)
  - Contrôle / Fonctionnement (Visu_Control)
  - Nettoyage (Visu_Clean)
  - Fin de combustion (Visu_BurnOff)
  - Mode hors gel (Visu_Freeze)
- ✅ Texte de statut mis à jour en temps réel
- ✅ Température ambiante (gauche, grande taille)
- ✅ Nom du modèle (haut droite)
- ✅ Icônes de statut avec états actif/inactif :
  - ⏰ Programmation horaire
  - 🌡️ Contrôle température
  - ❄️ Mode confort
  - 📡 Connexion WiFi

### Contrôles interactifs
- ✅ **Température cible** :
  - Clic sur l'icône thermomètre
  - Popup pour saisir la nouvelle température
  - Validation des limites (14-28°C)
  - Appel au service `climate.set_temperature`
- ✅ **Puissance de chauffage** :
  - Slider horizontal (30-100%, pas de 5%)
  - Affichage de la valeur en temps réel
  - Appel au service `number.set_value`
- ✅ **Mode de fonctionnement** :
  - Clic sur le texte du mode
  - Cycle automatique entre les modes disponibles
  - Appel au service `climate.set_hvac_mode`
- ✅ **Marche/Arrêt** :
  - Bouton central rond
  - État visuel (gris/orange)
  - Appel au service `switch.turn_on/off`

### Sections dépliables
- ✅ Onglet Flamme :
  - Section "Entrées" (ouverte par défaut)
  - Sections "Sorties" et "Paramètres"
- ✅ Onglet Réglages :
  - Sections "Entrées" et "Sorties" (ouverte par défaut)
  - Section "Paramètres"
- ✅ Onglet Infos :
  - Sections "Entrées" et "Paramètres" (ouverte par défaut)
  - Section "Sorties"
- ✅ Animation + / − selon l'état
- ✅ Effet hover sur les en-têtes

### Données affichées
- ✅ **Températures** :
  - Température ambiante
  - Température de flamme
  - Température cible
- ✅ **États** :
  - Statut principal (mainState/subState)
  - État de combustion (burning)
  - Demande externe
- ✅ **Puissance** :
  - Puissance de chauffage (%)
  - Slider ajustable
- ✅ **Diagnostics** :
  - Moteur diagonal (‰)
  - Ventilateur gaz de combustion (l/min)
  - État allumage (On/Off)
- ✅ **Statistiques** :
  - Heures d'utilisation (h)
  - Consommation totale (kg)
  - Consommation avant entretien (kg)
  - Cycles ON/OFF
  - Modèle du poêle
  - Versions logiciels

### Intégration Home Assistant
- ✅ Enregistrement comme custom card
- ✅ Support de la configuration YAML
- ✅ Configuration minimale (seulement `entity`)
- ✅ Configuration complète (toutes les entités)
- ✅ Noms d'entités par défaut intelligents
- ✅ Stub config pour l'éditeur visuel
- ✅ Mise à jour automatique via `hass` setter
- ✅ Gestion des entités manquantes (affichage "N/A")

### Style et design
- ✅ Palette de couleurs Rika :
  - Orange principal : #D94E2A
  - Gris foncé : #666666
  - Gris clair : #F5F5F5
  - Bleu liens : #0066CC
- ✅ Typographie système native
- ✅ Ombres et effets de profondeur
- ✅ Transitions CSS fluides
- ✅ Effets hover sur tous les éléments cliquables
- ✅ Border-radius cohérent (4px, 8px, 50%)

### Performance
- ✅ Shadow DOM pour isolation CSS
- ✅ Pas de dépendances externes (sauf SVG Rika)
- ✅ Rendu optimisé
- ✅ Event listeners attachés après rendu
- ✅ Mise à jour sélective du DOM

### Code quality
- ✅ Code JavaScript moderne (ES6+)
- ✅ Structure orientée objet (classe)
- ✅ Commentaires et documentation
- ✅ Gestion d'erreurs basique
- ✅ Validation des inputs utilisateur
- ✅ Nommage cohérent des méthodes

---

## 📦 Fichiers livrés

1. **rika-firenet-card.js** (800+ lignes)
   - Code principal de la carte
   - Logique de rendu et d'interaction
   - Styles CSS inline

2. **README.md**
   - Documentation complète
   - Guide d'installation
   - Exemples de configuration
   - Dépannage

3. **configuration-examples.yaml**
   - Configuration minimale
   - Configuration complète
   - Exemples avancés
   - Notes techniques

4. **INSTALLATION.md**
   - Guide d'installation rapide
   - Étapes détaillées
   - Vérifications
   - Dépannage

5. **REFERENCE-ETATS.md**
   - Table des états mainState/subState
   - Correspondance avec SVG
   - Logique de détermination
   - Codes couleur

6. **CHANGELOG.md** (ce fichier)
   - Notes de version
   - Liste des fonctionnalités

---

## 🔧 Configuration requise

### Minimum
- Home Assistant 2023.4+
- Intégration Rika Firenet (Antibill51)
- Entités de base :
  - `climate.XXXX`
  - `sensor.XXXX_main_state`
  - `sensor.XXXX_sub_state`
  - `sensor.XXXX_room_temperature`

### Recommandé
- Toutes les entités Rika Firenet
- Navigateur moderne (Chrome, Firefox, Safari, Edge)
- Connexion internet (pour les SVG)

---

## 🐛 Problèmes connus

### Limitations actuelles
- ⚠️ Pas de support offline pour les SVG (chargés depuis rika-firenet.com)
- ⚠️ Pas d'éditeur visuel (configuration YAML uniquement)
- ⚠️ Pas de support du mode four/pâtisserie (non applicable au DOMO)
- ⚠️ Pas de support du mode bois (non applicable au DOMO)
- ⚠️ Les sections "Paramètres" dans certains onglets sont vides (données non exposées par l'intégration)

### Bugs connus
Aucun bug connu à ce jour.

---

## 🚀 Améliorations futures possibles

### Version 1.1 (à venir)
- [ ] Éditeur visuel dans l'interface HA
- [ ] Support des traductions (i18n)
- [ ] Thèmes personnalisables (couleurs)
- [ ] Option pour héberger les SVG localement
- [ ] Animation de transition entre onglets
- [ ] Graphiques de consommation intégrés

### Version 1.2 (futur)
- [ ] Historique des températures
- [ ] Alertes visuelles (entretien, erreurs)
- [ ] Mode compact (carte réduite)
- [ ] Widget pour companion app
- [ ] Export des données

### Version 2.0 (long terme)
- [ ] Support multi-poêles
- [ ] Programmation horaire intégrée
- [ ] Contrôle avancé des courbes de chauffe
- [ ] Intégration météo
- [ ] Mode eco/confort automatique

---

## 🤝 Contributions

Cette carte est open source et les contributions sont les bienvenues !

Idées d'améliorations :
- Tests sur différents modèles Rika
- Optimisations de performance
- Nouvelles fonctionnalités
- Traductions
- Documentation

---

## 📄 Licence

Cette carte est fournie "telle quelle", sans garantie d'aucune sorte.

Les SVG et logos Rika sont la propriété de Rika GmbH.

---

## 👏 Remerciements

- **Antibill51** pour l'excellente intégration Rika Firenet
- **Rika GmbH** pour les visuels SVG officiels
- **Community Home Assistant** pour le support

---

## 📊 Statistiques

- **Lignes de code** : ~800
- **Taille du fichier** : ~50 KB
- **Temps de développement** : 1 session
- **Navigateurs testés** : Chrome, Firefox, Safari, Edge
- **Appareils testés** : Desktop, tablette, mobile

---

**Développé avec ❤️ pour la communauté Home Assistant**

**Version actuelle : 1.0.0**  
**Date de sortie : 18 novembre 2024**  
**Status : Stable**
