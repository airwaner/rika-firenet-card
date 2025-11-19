# 🔥 RIKA FIRENET CARD - GUIDE D'INSTALLATION RAPIDE

## 📦 Fichiers fournis

1. **rika-firenet-card.js** - La carte personnalisée (code principal)
2. **README.md** - Documentation complète
3. **configuration-examples.yaml** - Exemples de configuration

## 🚀 Installation en 5 minutes

### Étape 1 : Créer le dossier
Sur votre Home Assistant, créez le dossier :
```
/config/www/rika-firenet-card/
```

Vous pouvez le faire via :
- **File Editor** (addon)
- **Studio Code Server** (addon)
- **SSH** (commande : `mkdir -p /config/www/rika-firenet-card`)
- **Samba** (accès réseau aux fichiers)

### Étape 2 : Copier le fichier
Copiez le fichier **rika-firenet-card.js** dans le dossier créé.

Résultat attendu :
```
/config/www/rika-firenet-card/rika-firenet-card.js
```

### Étape 3 : Ajouter la ressource
1. Allez dans **Paramètres** → **Tableaux de bord** → **Ressources**
2. Cliquez sur **+ Ajouter une ressource**
3. Remplissez :
   - **URL** : `/local/rika-firenet-card/rika-firenet-card.js`
   - **Type de ressource** : **Module JavaScript**
4. Cliquez sur **Créer**

### Étape 4 : Redémarrer ou vider le cache
**Option A** : Redémarrez Home Assistant
**Option B** : Videz le cache de votre navigateur (Ctrl+F5 ou Cmd+Shift+R)

### Étape 5 : Ajouter la carte
1. Éditez votre tableau de bord
2. Ajoutez une **Carte manuelle**
3. Collez cette configuration :

```yaml
type: custom:rika-firenet-card
entity: climate.salon_2
model: "DOMO MultiAir"
entities:
  main_state: sensor.salon_main_state
  sub_state: sensor.salon_sub_state
  room_temperature: sensor.salon_room_temperature
  stove_temperature: sensor.salon_stove_temperature
  heating_power: number.salon_heating_power
  on_off: switch.salon_on_off
```

4. **Sauvegardez**

## ✅ Vérification

Si tout fonctionne, vous devriez voir :
- ✅ L'interface Rika avec le SVG de votre poêle
- ✅ La température ambiante à gauche
- ✅ Le slider de puissance
- ✅ Le menu déroulant pour choisir le mode
- ✅ Les 4 onglets en bas (Accueil / Flamme / Réglages / Infos)
- ✅ Le bouton power central

## 🎨 Personnalisation

### Adapter les noms d'entités
Si vos entités ont des noms différents, modifiez la configuration :

```yaml
type: custom:rika-firenet-card
entity: climate.MON_POELE  # ← Changez ici
entities:
  main_state: sensor.MON_POELE_main_state  # ← Et ici
  sub_state: sensor.MON_POELE_sub_state
  # ... etc
```

### Mode lecture seule
Si vous voulez afficher le mode sans permettre de le modifier :

```yaml
type: custom:rika-firenet-card
entity: climate.salon_2
mode_editable: false  # ← Ajouter cette ligne
entities:
  # ... vos entités
```

### Voir vos entités disponibles
1. Allez dans **Outils de développement** → **États**
2. Filtrez par "salon" ou "rika"
3. Notez les noms exacts de vos entités

## 🔧 Dépannage

### ❌ La carte ne s'affiche pas
**Problème** : Carte non trouvée ou erreur "Custom element doesn't exist"

**Solutions** :
1. Vérifiez que le fichier est bien dans `/config/www/rika-firenet-card/`
2. Vérifiez l'URL de la ressource : `/local/rika-firenet-card/rika-firenet-card.js`
3. Videz le cache du navigateur (Ctrl+F5)
4. Ouvrez la console du navigateur (F12) pour voir les erreurs

### ❌ Les entités ne s'affichent pas
**Problème** : Valeurs "N/A" ou "0" partout

**Solutions** :
1. Vérifiez que l'intégration Rika Firenet est bien installée
2. Vérifiez les noms de vos entités dans **États**
3. Adaptez la configuration avec VOS noms d'entités

### ❌ Les contrôles ne fonctionnent pas
**Problème** : Impossible de changer la température ou la puissance

**Solutions** :
1. Vérifiez que vous avez les permissions dans HA
2. Vérifiez que les entités sont contrôlables (pas en lecture seule)
3. Consultez les logs de Home Assistant

### ❌ Le SVG ne s'affiche pas
**Problème** : Pas d'image du poêle au centre

**Solutions** :
1. Vérifiez votre connexion internet (les SVG sont chargés depuis rika-firenet.com)
2. Vérifiez que `sensor.salon_main_state` existe et a une valeur
3. Vérifiez la console du navigateur (F12) pour des erreurs de chargement

## 🎯 Fonctionnalités disponibles

### Onglet Accueil
- ✅ Température ambiante et consigne
- ✅ SVG dynamique du poêle
- ✅ Icônes de statut (horloge, thermomètre, confort, WiFi)
- ✅ Slider de puissance ajustable
- ✅ Menu déroulant pour sélectionner le mode
- ✅ Affichage du mode actuel
- ✅ Bouton marche/arrêt

### Onglet Flamme
- ✅ Température de flamme
- ✅ Température ambiante
- ✅ Demande externe
- ✅ Sections dépliables

### Onglet Réglages
- ✅ Moteur diagonal
- ✅ Ventilateur de gaz
- ✅ État allumage
- ✅ Sections dépliables

### Onglet Infos
- ✅ Heures d'utilisation
- ✅ Consommation totale
- ✅ Consommation avant entretien
- ✅ Modèle du poêle
- ✅ Versions logiciels
- ✅ Sections dépliables

## 📱 Utilisation

### Changer la température
Cliquez sur l'**icône thermomètre** (2e icône à droite) et entrez la température souhaitée.

### Ajuster la puissance
Déplacez le **slider rouge** ou cliquez sur la valeur numérique.

### Changer le mode
Utilisez le **menu déroulant** pour sélectionner directement le mode souhaité (Manuel / Automatique / Arrêt).

### Allumer/Éteindre
Cliquez sur le **bouton power central** (rond avec icône).

### Naviguer entre les onglets
Cliquez sur les **icônes en bas** de la carte.

### Déplier les sections
Dans les onglets Flamme/Réglages/Infos, cliquez sur les **sections avec + ou −**.

## 🔄 Mise à jour future

Pour mettre à jour la carte :
1. Remplacez le fichier **rika-firenet-card.js**
2. Videz le cache du navigateur (Ctrl+F5)
3. Rechargez la page

## 📞 Support

- **Intégration Rika** : https://github.com/antibill51/rika-firenet-custom-component
- **Forum HA** : https://community.home-assistant.io/

## 🎉 Profitez !

Votre interface Rika est maintenant intégrée à Home Assistant !

N'hésitez pas à personnaliser la carte selon vos besoins et à l'ajouter à vos tableaux de bord préférés.
