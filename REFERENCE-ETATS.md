# 🎨 RÉFÉRENCE DES ÉTATS ET VISUELS RIKA FIRENET

## États mainState et leurs visuels

La carte utilise les valeurs de `sensor.salon_main_state` et `sensor.salon_sub_state` pour déterminer quel SVG afficher.

### mainState = 1 : Arrêt / Veille

| subState | SVG | Description | Texte affiché |
|----------|-----|-------------|---------------|
| 0 | `Visu_Off.svg` | ⚫ Poêle complètement éteint | "Poêle éteint" |
| 1 | `Visu_Standby.svg` | 💤 En veille, prêt à démarrer | "En veille" |
| 2 | `Visu_Standby.svg` | 💤 Attente demande externe (thermostat) | "Demande externe" |
| 3 | `Visu_Standby.svg` | 💤 En veille | "En veille" |
| autre | `Visu_Off.svg` | ⚫ État inconnu | "Substate inconnu" |

**SVG "Standby"** : Affiche "zzZ" sur le poêle

---

### mainState = 2 : Allumage

| SVG | Description | Texte affiché |
|-----|-------------|---------------|
| `Visu_Ignition.svg` | 🔥 Phase d'allumage initiale | "Allumage" |

**SVG "Ignition"** : Flamme en formation, début de combustion

---

### mainState = 3 : Démarrage

| SVG | Description | Texte affiché |
|-----|-------------|---------------|
| `Visu_Ignition.svg` | 🔥 Démarrage du poêle | "Démarrage" |

**SVG "Ignition"** : Même visuel que l'allumage

---

### mainState = 4 : Contrôle / Fonctionnement

| SVG | Description | Texte affiché |
|-----|-------------|---------------|
| `Visu_Control.svg` | ✅ Fonctionnement normal, contrôle actif | "Contrôle" |

**SVG "Control"** : Flamme stable et bien formée, poêle en fonctionnement optimal

---

### mainState = 5 : Nettoyage

| subState | SVG | Description | Texte affiché |
|----------|-----|-------------|---------------|
| 3 ou 4 | `Visu_Clean.svg` | 🧹 Nettoyage approfondi | "Nettoyage approfondi" |
| autre | `Visu_Clean.svg` | 🧹 Nettoyage standard | "Nettoyage" |

**SVG "Clean"** : Animation de nettoyage

---

### mainState = 6 : Fin de combustion

| SVG | Description | Texte affiché |
|-----|-------------|---------------|
| `Visu_BurnOff.svg` | 🌫️ Fin de combustion, extinction | "Fin de combustion" |

**SVG "BurnOff"** : Flamme décroissante

---

### mainState autre : État inconnu

| SVG | Description | Texte affiché |
|-----|-------------|---------------|
| `Visu_Off.svg` | ⚫ État non géré | "Inconnu" |

---

## États spéciaux

### Mode hors gel (frostStarted = true)

| SVG | Description | Texte affiché |
|-----|-------------|---------------|
| `Visu_Freeze.svg` | ❄️ Protection antigel active | "Mode hors gel" |

**Note** : Votre DOMO n'a pas cette fonctionnalité par défaut

---

### Déconnexion WiFi (offline)

| SVG | Description | Texte affiché |
|-----|-------------|---------------|
| `Warning_WifiSignal.svg` | 📡 Perte de connexion | "Déconnecté" |

**Note** : Non implémenté dans la carte actuelle (géré par HA nativement)

---

## SVG non utilisés (poêles avec four)

Ces SVG existent dans Rika Firenet mais ne sont **PAS** utilisés par la carte car votre DOMO n'a pas de four :

| SVG | Description | Usage |
|-----|-------------|-------|
| `Visu_Bake.svg` | 🍕 Mode pâtisserie | Four Rika uniquement |
| `Visu_HeatingUp.svg` | 🔥 Montée en température | Four Rika uniquement |
| `Visu_SpliLog.svg` | 🪵 Mode bois | Poêles hybrides uniquement |

---

## Logique de détermination du statut

```javascript
// Priorité 1 : Mode hors gel
if (frostStarted) → Visu_Freeze.svg

// Priorité 2 : État principal (mainState)
switch (mainState) {
  case 1: // Arrêt/Veille
    if (subState === 0) → Visu_Off.svg (éteint)
    if (subState === 1, 2, 3) → Visu_Standby.svg (veille)
    
  case 2: // Allumage
    → Visu_Ignition.svg
    
  case 3: // Démarrage
    → Visu_Ignition.svg
    
  case 4: // Contrôle
    → Visu_Control.svg
    
  case 5: // Nettoyage
    if (subState === 3 ou 4) → Visu_Clean.svg (approfondi)
    else → Visu_Clean.svg (standard)
    
  case 6: // Fin de combustion
    → Visu_BurnOff.svg
    
  default: // Inconnu
    → Visu_Off.svg
}
```

---

## Correspondance avec sensor.salon_stove_status

L'intégration Rika Firenet fournit également un capteur texte `sensor.salon_stove_status` qui contient des valeurs comme :

| Valeur texte | mainState probable | Description |
|--------------|-------------------|-------------|
| `off` | 1 (subState 0) | Éteint |
| `external_request` | 1 (subState 2) | Demande externe |
| `standby` | 1 (subState 1 ou 3) | Veille |
| `ignition` | 2 | Allumage |
| `starting` | 3 | Démarrage |
| `running` | 4 | Fonctionnement |
| `control` | 4 | Contrôle |
| `cleaning` | 5 | Nettoyage |
| `burn_off` | 6 | Fin de combustion |

**Important** : La carte utilise `mainState` et `subState` (numériques) pour plus de précision.

---

## Icônes de statut (colonne droite)

| Position | Icône | Description | État |
|----------|-------|-------------|------|
| 1 (haut) | ⏰ Horloge | Programmation horaire | Active si `switch.salon_heating_times` = ON |
| 2 | 🌡️ Thermomètre | Contrôle température | Toujours active (cliquable) |
| 3 | ❄️ Flocon | Mode confort | Active si `preset_mode` = comfort |
| 4 (bas) | 📡 WiFi | Connexion | Toujours active |

---

## Codes couleur

| Couleur | Usage | Hex |
|---------|-------|-----|
| 🔴 Orange Rika | Éléments principaux, puissance, temp | `#D94E2A` |
| ⚫ Gris foncé | Valeurs, badges | `#666666` |
| ⚪ Gris clair | Fond, sections | `#F5F5F5` |
| 🔵 Bleu liens | Labels cliquables | `#0066CC` |
| ⚪ Blanc | Textes sur fond coloré | `#FFFFFF` |

---

## URLs des SVG officiels

Tous les SVG sont chargés depuis le CDN Rika :

```
https://www.rika-firenet.com/images/status/Visu_Off.svg
https://www.rika-firenet.com/images/status/Visu_Standby.svg
https://www.rika-firenet.com/images/status/Visu_Ignition.svg
https://www.rika-firenet.com/images/status/Visu_Control.svg
https://www.rika-firenet.com/images/status/Visu_Clean.svg
https://www.rika-firenet.com/images/status/Visu_BurnOff.svg
https://www.rika-firenet.com/images/status/Visu_Freeze.svg
https://www.rika-firenet.com/images/status/Warning_WifiSignal.svg
```

**Avantage** : Toujours à jour avec les visuels officiels Rika  
**Inconvénient** : Nécessite une connexion internet pour afficher les images

---

## Exemples de transitions typiques

### Allumage du poêle
```
mainState: 1 (subState: 2) → "Demande externe" (Visu_Standby.svg)
       ↓
mainState: 2 → "Allumage" (Visu_Ignition.svg)
       ↓
mainState: 3 → "Démarrage" (Visu_Ignition.svg)
       ↓
mainState: 4 → "Contrôle" (Visu_Control.svg)
```

### Extinction du poêle
```
mainState: 4 → "Contrôle" (Visu_Control.svg)
       ↓
mainState: 6 → "Fin de combustion" (Visu_BurnOff.svg)
       ↓
mainState: 1 (subState: 0) → "Poêle éteint" (Visu_Off.svg)
```

### Cycle de nettoyage
```
mainState: 4 → "Contrôle" (Visu_Control.svg)
       ↓
mainState: 5 → "Nettoyage" (Visu_Clean.svg)
       ↓
mainState: 4 → "Contrôle" (Visu_Control.svg)
```

---

## Notes techniques

1. **Chargement des SVG** : Les images sont chargées dynamiquement via `<img>` tag
2. **Cache navigateur** : Les SVG sont mis en cache par le navigateur
3. **Fallback** : En cas d'erreur de chargement, le texte reste affiché
4. **Mise à jour** : Le SVG change immédiatement quand `mainState` ou `subState` change
5. **Responsive** : Les SVG ont une taille fixe (180x240px) qui s'adapte au conteneur

---

## Correspondance avec l'app Rika Firenet

| État dans l'app | mainState | subState | SVG |
|----------------|-----------|----------|-----|
| Éteint | 1 | 0 | Visu_Off |
| En attente | 1 | 1 | Visu_Standby |
| Demande externe | 1 | 2 | Visu_Standby |
| Allumage | 2 | - | Visu_Ignition |
| Démarrage | 3 | - | Visu_Ignition |
| En marche | 4 | - | Visu_Control |
| Nettoyage | 5 | 0-2 | Visu_Clean |
| Nettoyage approfondi | 5 | 3-4 | Visu_Clean |
| Extinction | 6 | - | Visu_BurnOff |

---

Cette référence vous permet de comprendre exactement quel visuel sera affiché selon l'état de votre poêle !
