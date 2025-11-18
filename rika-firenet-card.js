/**
 * Rika Firenet Custom Card for Home Assistant
 * Reproduit l'interface officielle Rika Firenet
 * Version: 1.0.0
 */

class RikaFirenetCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = {};
    this._currentTab = 'home';
    this._expandedSections = {};
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('Vous devez définir une entité climate');
    }
    this._config = config;
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  getCardSize() {
    return 6;
  }

  // Logique de statut basée sur le code Rika original
  getStatusDetails(mainState, subState, frostStarted) {
    const baseUrl = 'https://www.rika-firenet.com/images/status/';
    
    if (frostStarted) {
      return [baseUrl + 'Visu_Freeze.svg', 'Mode hors gel'];
    }
    
    switch(mainState) {
      case 1:
        if (subState === 0) return [baseUrl + 'Visu_Off.svg', 'Poêle éteint'];
        if (subState === 1) return [baseUrl + 'Visu_Standby.svg', 'En veille'];
        if (subState === 2) return [baseUrl + 'Visu_Standby.svg', 'Demande externe'];
        if (subState === 3) return [baseUrl + 'Visu_Standby.svg', 'En veille'];
        return [baseUrl + 'Visu_Off.svg', 'Substate inconnu'];
      case 2:
        return [baseUrl + 'Visu_Ignition.svg', 'Allumage'];
      case 3:
        return [baseUrl + 'Visu_Ignition.svg', 'Démarrage'];
      case 4:
        return [baseUrl + 'Visu_Control.svg', 'Contrôle'];
      case 5:
        if (subState === 3 || subState === 4) {
          return [baseUrl + 'Visu_Clean.svg', 'Nettoyage approfondi'];
        }
        return [baseUrl + 'Visu_Clean.svg', 'Nettoyage'];
      case 6:
        return [baseUrl + 'Visu_BurnOff.svg', 'Fin de combustion'];
      default:
        return [baseUrl + 'Visu_Off.svg', 'Inconnu'];
    }
  }

  getEntityState(entityId) {
    if (!entityId || !this._hass.states) return null;
    return this._hass.states[entityId];
  }

  getStateValue(entityId, defaultValue = 'N/A') {
    const state = this.getEntityState(entityId);
    return state ? state.state : defaultValue;
  }

  getStateAttribute(entityId, attribute, defaultValue = null) {
    const state = this.getEntityState(entityId);
    return state && state.attributes ? state.attributes[attribute] : defaultValue;
  }

  callService(domain, service, data) {
    this._hass.callService(domain, service, data);
  }

  handleTabClick(tab) {
    this._currentTab = tab;
    this.render();
  }

  toggleSection(section) {
    this._expandedSections[section] = !this._expandedSections[section];
    this.render();
  }

  handlePowerClick() {
    const switchEntity = this._config.entities?.on_off || 'switch.salon_on_off';
    const currentState = this.getStateValue(switchEntity);
    const newState = currentState === 'on' ? 'turn_off' : 'turn_on';
    this.callService('switch', newState, { entity_id: switchEntity });
  }

  handleTemperatureClick() {
    const climateEntity = this._config.entity;
    const currentTemp = this.getStateAttribute(climateEntity, 'temperature', 20);
    
    const newTemp = prompt(`Température cible (14-28°C):`, currentTemp);
    if (newTemp && !isNaN(newTemp)) {
      const temp = Math.max(14, Math.min(28, parseFloat(newTemp)));
      this.callService('climate', 'set_temperature', {
        entity_id: climateEntity,
        temperature: temp
      });
    }
  }

  handlePowerSliderChange(event) {
    const powerEntity = this._config.entities?.heating_power || 'number.salon_heating_power';
    const value = event.target.value;
    this.callService('number', 'set_value', {
      entity_id: powerEntity,
      value: parseFloat(value)
    });
  }

  handleModeClick() {
    const climateEntity = this._config.entity;
    const currentMode = this.getStateAttribute(climateEntity, 'hvac_mode', 'heat');
    const modes = this.getStateAttribute(climateEntity, 'hvac_modes', ['heat', 'auto', 'off']);
    
    // Cycle through modes
    const currentIndex = modes.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    const nextMode = modes[nextIndex];
    
    this.callService('climate', 'set_hvac_mode', {
      entity_id: climateEntity,
      hvac_mode: nextMode
    });
  }

  renderHomeTab() {
    const climateEntity = this._config.entity;
    const mainStateEntity = this._config.entities?.main_state || 'sensor.salon_main_state';
    const subStateEntity = this._config.entities?.sub_state || 'sensor.salon_sub_state';
    const roomTempEntity = this._config.entities?.room_temperature || 'sensor.salon_room_temperature';
    const powerEntity = this._config.entities?.heating_power || 'number.salon_heating_power';
    const heatingTimesEntity = this._config.entities?.heating_times || 'switch.salon_heating_times';
    const switchEntity = this._config.entities?.on_off || 'switch.salon_on_off';

    const roomTemp = this.getStateValue(roomTempEntity, '0');
    const targetTemp = this.getStateAttribute(climateEntity, 'temperature', '0');
    const mainState = parseInt(this.getStateValue(mainStateEntity, '1'));
    const subState = parseInt(this.getStateValue(subStateEntity, '0'));
    const power = this.getStateValue(powerEntity, '0');
    const hvacMode = this.getStateAttribute(climateEntity, 'hvac_mode', 'heat');
    const presetMode = this.getStateAttribute(climateEntity, 'preset_mode', 'none');
    const heatingTimesOn = this.getStateValue(heatingTimesEntity) === 'on';
    const isOn = this.getStateValue(switchEntity) === 'on';

    const [statusSvg, statusText] = this.getStatusDetails(mainState, subState, false);

    // Déterminer le mode affiché
    let modeText = 'Mode manuel';
    if (hvacMode === 'auto') modeText = 'Mode automatique';
    if (presetMode === 'comfort') modeText = 'Mode confort';

    // Récupération du modèle : config > friendly_name > défaut
    const model = this._config.model || 
                  this.getStateAttribute(climateEntity, 'friendly_name', null) || 
                  'DOMO MultiAir';

    return `
      <div class="tab-content">
        <!-- Header -->
        <div class="header">
          <div class="room-name">Salon</div>
          <div class="model-name">${model}</div>
        </div>

        <!-- Zone principale -->
        <div class="main-zone">
          <!-- Température ambiante -->
          <div class="room-temp">${parseFloat(roomTemp).toFixed(1)}°C</div>

          <!-- SVG central -->
          <div class="stove-visual">
            <img src="${statusSvg}" alt="${statusText}" />
            <div class="status-text">${statusText}</div>
          </div>

          <!-- Icônes statut -->
          <div class="status-icons">
            <div class="status-icon ${heatingTimesOn ? 'active' : ''}">
              <svg viewBox="0 0 24 24"><path d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8Z"/></svg>
            </div>
            <div class="status-icon active" @click="${() => this.handleTemperatureClick()}">
              <svg viewBox="0 0 24 24"><path d="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z"/></svg>
            </div>
            <div class="status-icon ${presetMode === 'comfort' ? 'active' : ''}">
              <svg viewBox="0 0 24 24"><path d="M20.79,13.95L18.46,14.57L16.46,13.44V10.56L18.46,9.43L20.79,10.05L21.31,8.12L19.54,7.65L20,5.88L18.07,5.36L17.45,7.69L15.45,8.82L13,7.38V5.12L14.71,3.41L13.29,2L12,3.29L10.71,2L9.29,3.41L11,5.12V7.38L8.5,8.82L6.5,7.69L5.92,5.36L4,5.88L4.47,7.65L2.7,8.12L3.22,10.05L5.55,9.43L7.55,10.56V13.45L5.55,14.58L3.22,13.96L2.7,15.89L4.47,16.36L4,18.12L5.93,18.64L6.55,16.31L8.55,15.18L11,16.62V18.88L9.29,20.59L10.71,22L12,20.71L13.29,22L14.7,20.59L13,18.88V16.62L15.5,15.17L17.5,16.3L18.12,18.63L20,18.12L19.53,16.35L21.3,15.88L20.79,13.95M9.5,10.56L12,9.11L14.5,10.56V13.44L12,14.89L9.5,13.44V10.56Z"/></svg>
            </div>
            <div class="status-icon active">
              <svg viewBox="0 0 24 24"><path d="M1,9L9,9L9,1L1,1M3,3L7,3L7,7L3,7M13,9L21,9L21,1L13,1M15,3L19,3L19,7L15,7M1,21L9,21L9,13L1,13M3,15L7,15L7,19L3,19M13,13L15,13L15,15L13,15M15,15L17,15L17,17L15,17M13,17L15,17L15,19L13,19M17,13L19,13L19,15L17,15M19,15L21,15L21,17L19,17M17,17L19,17L19,19L17,19M19,19L21,19L21,21L19,21M17,21L19,21L19,23L17,23M15,19L17,19L17,21L15,21M13,21L15,21L15,23L13,23Z"/></svg>
            </div>
          </div>
        </div>

        <!-- Puissance de chauffage -->
        <div class="power-section">
          <div class="power-label">Puissance de chauffage %</div>
          <div class="power-control">
            <div class="power-value">${power}</div>
            <input 
              type="range" 
              class="power-slider" 
              min="30" 
              max="100" 
              step="5" 
              value="${power}"
            />
          </div>
        </div>

        <!-- Mode -->
        <div class="mode-section">
          <div class="mode-text">${modeText}</div>
        </div>

        <!-- Bouton Power -->
        <div class="power-button-container">
          <button class="power-button ${isOn ? 'on' : 'off'}">
            <svg viewBox="0 0 24 24"><path d="M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  renderFlameTab() {
    const flameTempEntity = this._config.entities?.stove_temperature || 'sensor.salon_stove_temperature';
    const roomTempEntity = this._config.entities?.room_temperature || 'sensor.salon_room_temperature';
    const climateEntity = this._config.entity;

    const flameTemp = this.getStateValue(flameTempEntity, '0');
    const roomTemp = this.getStateValue(roomTempEntity, '0');
    const externalRequest = this.getStateAttribute(climateEntity, 'hvac_action', 'off');

    const isExpanded = this._expandedSections['inputs'] !== false; // Ouvert par défaut

    return `
      <div class="tab-content info-tab">
        <div class="info-section">
          <div class="section-header">
            <span>${isExpanded ? '−' : '+'}</span>
            <span>Entrées</span>
          </div>
          ${isExpanded ? `
            <div class="section-content">
              <div class="info-row">
                <span class="info-label">Température de flamme [°C]</span>
                <span class="info-value">${flameTemp}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Température ambiante [°C]</span>
                <span class="info-value">${parseFloat(roomTemp).toFixed(1)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Demande externe</span>
                <span class="info-value">${externalRequest === 'heating' ? 'On' : 'Off'}</span>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="info-section">
          <div class="section-header">
            <span>+</span>
            <span>Sorties</span>
          </div>
        </div>

        <div class="info-section">
          <div class="section-header">
            <span>+</span>
            <span>Paramètres</span>
          </div>
        </div>
      </div>
    `;
  }

  renderSettingsTab() {
    const diagMotorEntity = this._config.entities?.diag_motor || 'sensor.salon_diag_motor';
    const fanVelocityEntity = this._config.entities?.fan_velocity || 'sensor.salon_fan_velocity';
    const burningEntity = this._config.entities?.stove_burning || 'sensor.salon_stove_burning';

    const diagMotor = this.getStateValue(diagMotorEntity, '0');
    const fanVelocity = this.getStateValue(fanVelocityEntity, '0');
    const burning = this.getStateValue(burningEntity, 'False');

    const isExpandedInputs = this._expandedSections['settings_inputs'] !== false;
    const isExpandedOutputs = this._expandedSections['settings_outputs'] !== false;

    return `
      <div class="tab-content info-tab">
        <div class="info-section">
          <div class="section-header">
            <span>${isExpandedInputs ? '−' : '+'}</span>
            <span>Entrées</span>
          </div>
        </div>

        <div class="info-section">
          <div class="section-header">
            <span>${isExpandedOutputs ? '−' : '+'}</span>
            <span>Sorties</span>
          </div>
          ${isExpandedOutputs ? `
            <div class="section-content">
              <div class="info-row">
                <span class="info-label">Moteur diagonal [‰]</span>
                <span class="info-value">${diagMotor}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Ventilateur de gaz de combustion [l/min]</span>
                <span class="info-value">${fanVelocity}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Allumage</span>
                <span class="info-value">${burning === 'True' || burning === true ? 'On' : 'Off'}</span>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="info-section">
          <div class="section-header">
            <span>+</span>
            <span>Paramètres</span>
          </div>
        </div>
      </div>
    `;
  }

  renderInfoTab() {
    const runtimeEntity = this._config.entities?.stove_runtime || 'sensor.salon_stove_runtime';
    const consumptionEntity = this._config.entities?.stove_consumption || 'sensor.salon_stove_consumption';
    const beforeServiceEntity = this._config.entities?.pellets_before_service || 'sensor.salon_pellets_before_service';
    const climateEntity = this._config.entity;

    const runtime = this.getStateValue(runtimeEntity, '0');
    const consumption = this.getStateValue(consumptionEntity, '0');
    const beforeService = this.getStateValue(beforeServiceEntity, '0');
    
    // Récupération du modèle : config > friendly_name > défaut
    const model = this._config.model || 
                  this.getStateAttribute(climateEntity, 'friendly_name', null) || 
                  'DOMO MultiAir';

    const isExpandedInputs = this._expandedSections['info_inputs'] !== false;
    const isExpandedParams = this._expandedSections['info_params'] !== false;

    return `
      <div class="tab-content info-tab">
        <div class="info-section">
          <div class="section-header">
            <span>${isExpandedInputs ? '−' : '+'}</span>
            <span>Entrées</span>
          </div>
        </div>

        <div class="info-section">
          <div class="section-header">
            <span>+</span>
            <span>Sorties</span>
          </div>
        </div>

        <div class="info-section">
          <div class="section-header">
            <span>${isExpandedParams ? '−' : '+'}</span>
            <span>Paramètres</span>
          </div>
          ${isExpandedParams ? `
            <div class="section-content">
              <div class="info-row">
                <span class="info-label">Heures d'utilisation pellets [h]</span>
                <span class="info-value">${runtime}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Consommation des pellets [kg]</span>
                <span class="info-value">${consumption}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Consommation avant entretien [kg]</span>
                <span class="info-value">${beforeService}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Cycles ON/OFF</span>
                <span class="info-value">156</span>
              </div>
              <div class="info-row">
                <span class="info-label">Modèle du poêle</span>
                <span class="info-value">${model}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Logiciel du poêle</span>
                <span class="info-value">228</span>
              </div>
              <div class="info-row">
                <span class="info-label">Logiciel de l'écran</span>
                <span class="info-value">228</span>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  renderNavigationBar() {
    const tabs = [
      { id: 'home', icon: 'M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z', label: 'Accueil' },
      { id: 'flame', icon: 'M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z', label: 'Flamme' },
      { id: 'settings', icon: 'M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z', label: 'Réglages' },
      { id: 'info', icon: 'M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z', label: 'Infos' }
    ];

    return `
      <div class="nav-bar">
        ${tabs.map(tab => `
          <div class="nav-item ${this._currentTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">
            <svg viewBox="0 0 24 24"><path d="${tab.icon}"/></svg>
          </div>
        `).join('')}
      </div>
    `;
  }

  render() {
    if (!this._config || !this._hass) return;

    let tabContent = '';
    switch(this._currentTab) {
      case 'home':
        tabContent = this.renderHomeTab();
        break;
      case 'flame':
        tabContent = this.renderFlameTab();
        break;
      case 'settings':
        tabContent = this.renderSettingsTab();
        break;
      case 'info':
        tabContent = this.renderInfoTab();
        break;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
        
        .card-container {
          background: #f5f5f5;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .header {
          padding: 16px 20px 8px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .room-name {
          font-size: 20px;
          color: #333;
        }

        .model-name {
          font-size: 16px;
          color: #D94E2A;
          font-weight: 500;
        }

        .main-zone {
          display: grid;
          grid-template-columns: 80px 1fr 60px;
          align-items: center;
          padding: 20px;
          gap: 20px;
        }

        .room-temp {
          font-size: 28px;
          color: #D94E2A;
          font-weight: 300;
          text-align: center;
        }

        .stove-visual {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .stove-visual img {
          width: 180px;
          height: 240px;
          object-fit: contain;
        }

        .status-text {
          font-size: 14px;
          color: #666;
          text-align: center;
          padding: 4px 12px;
          background: rgba(0,0,0,0.05);
          border-radius: 4px;
        }

        .status-icons {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .status-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #e0e0e0;
          cursor: pointer;
          transition: all 0.3s;
        }

        .status-icon svg {
          width: 24px;
          height: 24px;
          fill: #999;
        }

        .status-icon.active {
          background: #D94E2A;
        }

        .status-icon.active svg {
          fill: white;
        }

        .status-icon:hover {
          transform: scale(1.1);
        }

        .power-section {
          padding: 20px;
        }

        .power-label {
          text-align: center;
          color: #666;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .power-control {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .power-value {
          min-width: 50px;
          padding: 8px 12px;
          background: #666;
          color: white;
          border-radius: 4px;
          text-align: center;
          font-size: 16px;
          font-weight: 500;
        }

        .power-slider {
          flex: 1;
          height: 30px;
          -webkit-appearance: none;
          appearance: none;
          background: #D94E2A;
          outline: none;
          border-radius: 15px;
        }

        .power-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 30px;
          height: 30px;
          background: white;
          cursor: pointer;
          border-radius: 50%;
          border: 3px solid #D94E2A;
        }

        .power-slider::-moz-range-thumb {
          width: 30px;
          height: 30px;
          background: white;
          cursor: pointer;
          border-radius: 50%;
          border: 3px solid #D94E2A;
        }

        .mode-section {
          padding: 12px 20px;
          text-align: center;
        }

        .mode-text {
          color: #333;
          font-size: 16px;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: background 0.3s;
        }

        .mode-text:hover {
          background: rgba(0,0,0,0.05);
        }

        .power-button-container {
          padding: 20px;
          display: flex;
          justify-content: center;
        }

        .power-button {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: none;
          background: #e0e0e0;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .power-button svg {
          width: 40px;
          height: 40px;
          fill: #666;
        }

        .power-button.on {
          background: #D94E2A;
        }

        .power-button.on svg {
          fill: white;
        }

        .power-button:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .power-button:active {
          transform: scale(0.95);
        }

        /* Onglets info */
        .info-tab {
          padding: 16px;
        }

        .info-section {
          background: white;
          margin-bottom: 12px;
          border-radius: 4px;
          overflow: hidden;
        }

        .section-header {
          padding: 16px;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }

        .section-header:hover {
          background: #ebebeb;
        }

        .section-header span:first-child {
          font-weight: bold;
          font-size: 20px;
          width: 20px;
          text-align: center;
        }

        .section-content {
          padding: 0;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          color: #0066cc;
          font-size: 14px;
        }

        .info-value {
          background: #666;
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 14px;
          min-width: 60px;
          text-align: center;
        }

        /* Navigation */
        .nav-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: #f0f0f0;
          border-top: 1px solid #ddd;
        }

        .nav-item {
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.3s;
          background: #f0f0f0;
        }

        .nav-item:hover {
          background: #e0e0e0;
        }

        .nav-item.active {
          background: #D94E2A;
        }

        .nav-item svg {
          width: 28px;
          height: 28px;
          fill: #666;
        }

        .nav-item.active svg {
          fill: white;
        }

        .tab-content {
          min-height: 400px;
          background: #f5f5f5;
        }
      </style>

      <div class="card-container">
        ${tabContent}
        ${this.renderNavigationBar()}
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    // Navigation
    this.shadowRoot.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        this.handleTabClick(item.dataset.tab);
      });
    });

    // Sections dépliables
    this.shadowRoot.querySelectorAll('.section-header').forEach(header => {
      header.addEventListener('click', (e) => {
        const section = e.currentTarget.parentElement;
        const sectionType = section.querySelector('.section-content') ? 
          section.querySelector('span:nth-child(2)').textContent.toLowerCase() : null;
        if (sectionType) {
          this.toggleSection(`${this._currentTab}_${sectionType}`);
        }
      });
    });

    // Bouton power
    const powerButton = this.shadowRoot.querySelector('.power-button');
    if (powerButton) {
      powerButton.addEventListener('click', () => this.handlePowerClick());
    }

    // Slider puissance
    const powerSlider = this.shadowRoot.querySelector('.power-slider');
    if (powerSlider) {
      powerSlider.addEventListener('input', (e) => {
        // Mise à jour visuelle immédiate
        const valueDisplay = this.shadowRoot.querySelector('.power-value');
        if (valueDisplay) valueDisplay.textContent = e.target.value;
      });
      powerSlider.addEventListener('change', (e) => this.handlePowerSliderChange(e));
    }

    // Mode
    const modeText = this.shadowRoot.querySelector('.mode-text');
    if (modeText) {
      modeText.addEventListener('click', () => this.handleModeClick());
    }

    // Température (icône thermomètre)
    const tempIcon = this.shadowRoot.querySelectorAll('.status-icon')[1];
    if (tempIcon) {
      tempIcon.addEventListener('click', () => this.handleTemperatureClick());
    }
  }

  static getConfigElement() {
    return document.createElement("rika-firenet-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "climate.salon_2",
      model: "DOMO MultiAir",
      entities: {
        main_state: "sensor.salon_main_state",
        sub_state: "sensor.salon_sub_state",
        room_temperature: "sensor.salon_room_temperature",
        stove_temperature: "sensor.salon_stove_temperature",
        heating_power: "number.salon_heating_power",
        stove_consumption: "sensor.salon_stove_consumption",
        stove_runtime: "sensor.salon_stove_runtime",
        pellets_before_service: "sensor.salon_pellets_before_service",
        stove_burning: "sensor.salon_stove_burning",
        diag_motor: "sensor.salon_diag_motor",
        fan_velocity: "sensor.salon_fan_velocity",
        heating_times: "switch.salon_heating_times",
        on_off: "switch.salon_on_off"
      }
    };
  }
}

customElements.define('rika-firenet-card', RikaFirenetCard);

// Enregistrement de la carte
window.customCards = window.customCards || [];
window.customCards.push({
  type: "rika-firenet-card",
  name: "Rika Firenet Card",
  description: "Carte personnalisée reproduisant l'interface Rika Firenet"
});

console.info(
  '%c RIKA-FIRENET-CARD %c v1.0.0 ',
  'color: white; background: #D94E2A; font-weight: 700;',
  'color: #D94E2A; background: white; font-weight: 700;'
);
