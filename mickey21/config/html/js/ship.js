// Ship Management System
class ShipManager {
    constructor() {
        this.ship = {
            name: 'NSS Heimdall',
            status: 'docked',
            location: 'Bay 2-A',
            lastMission: 'Supply Run',
            hull: 92,
            fuel: 78,
            lifeSupport: 95,
            engine: 88,
            notes: 'Minor hull damage from ice storm during last landing. Scheduled for repair during next maintenance cycle.'
        };
        
        this.initEventListeners();
        this.startSystemsSimulation();
    }
    
    initEventListeners() {
        // Toggle ship details
        const toggleBtn = document.getElementById('toggle-ship-details');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const vitalsContainer = document.querySelector('.ship-status .vitals-container');
                if (vitalsContainer) {
                    vitalsContainer.classList.toggle('hidden');
                    toggleBtn.textContent = vitalsContainer.classList.contains('hidden') ? 
                        'Show Details' : 'Hide Details';
                }
            });
        }
        
        // Ship action buttons
        document.querySelectorAll('.ship-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.performShipAction(action);
            });
        });
    }
    
    performShipAction(action) {
        switch(action) {
            case 'status':
                this.checkSystems();
                break;
            case 'prep':
                this.prepForLaunch();
                break;
            case 'emergency':
                this.emergencyLaunch();
                break;
        }
    }
    
    checkSystems() {
        if (window.terminal) {
            window.terminal.addTerminalLine('Initiating ship systems diagnostic...', '');
            
            setTimeout(() => {
                window.terminal.addTerminalLine('Hull integrity: 92% - Minor damage detected', 'warning');
                window.terminal.addTerminalLine('Fuel systems: 78% - Within operational parameters', '');
                window.terminal.addTerminalLine('Life support: 95% - Optimal', 'success');
                window.terminal.addTerminalLine('Engine status: 88% - Performance nominal', '');
                window.terminal.addTerminalLine('Navigation systems: Online', 'success');
                window.terminal.addTerminalLine('Communication arrays: Functional', 'success');
            }, 1500);
        }
    }
    
    prepForLaunch() {
        if (window.terminal) {
            window.terminal.addTerminalLine('Initiating launch preparation sequence...', '');
            
            setTimeout(() => {
                window.terminal.addTerminalLine('Checking environmental conditions...', '');
                setTimeout(() => {
                    window.terminal.addTerminalLine('WARNING: Current weather conditions suboptimal', 'warning');
                    window.terminal.addTerminalLine('Proceeding with pre-flight checklist:', '');
                    window.terminal.addTerminalLine('1. Fuel systems pressurized', 'success');
                    window.terminal.addTerminalLine('2. Navigation computer online', 'success');
                    window.terminal.addTerminalLine('3. Life support activated', 'success');
                    window.terminal.addTerminalLine('4. Engine warm-up sequence initiated', '');
                    window.terminal.addTerminalLine('Estimated time to launch readiness: 45 minutes', '');
                }, 2000);
            }, 1000);
        }
    }
    
    emergencyLaunch() {
        if (window.terminal) {
            window.terminal.addTerminalLine('WARNING: Emergency launch sequence requires authorization', 'warning');
            window.terminal.addTerminalLine('Enter override code or use "override niflheim" command', '');
        }
    }
    
    updateShipSystems() {
        // Update hull integrity
        this.ship.hull += (Math.random() * 2 - 1) * 0.5;
        this.ship.hull = Math.max(0, Math.min(100, this.ship.hull));
        
        // Update fuel level
        this.ship.fuel += (Math.random() * 2 - 1) * 0.3;
        this.ship.fuel = Math.max(0, Math.min(100, this.ship.fuel));
        
        // Update life support
        this.ship.lifeSupport += (Math.random() * 2 - 1) * 0.2;
        this.ship.lifeSupport = Math.max(0, Math.min(100, this.ship.lifeSupport));
        
        // Update engine status
        this.ship.engine += (Math.random() * 2 - 1) * 0.4;
        this.ship.engine = Math.max(0, Math.min(100, this.ship.engine));
        
        // Update UI
        this.updateShipUI();
    }
    
    updateShipUI() {
        const hullFill = document.querySelector('.hull-fill');
        const fuelFill = document.querySelector('.fuel-fill');
        const lifeSupportFill = document.querySelector('.life-support-fill');
        const engineFill = document.querySelector('.engine-fill');
        
        if (hullFill) hullFill.style.width = `${this.ship.hull}%`;
        if (fuelFill) fuelFill.style.width = `${this.ship.fuel}%`;
        if (lifeSupportFill) lifeSupportFill.style.width = `${this.ship.lifeSupport}%`;
        if (engineFill) engineFill.style.width = `${this.ship.engine}%`;
        
        // Update values
        const hullValue = document.querySelector('.vital-row:nth-child(1) .vital-value');
        const fuelValue = document.querySelector('.vital-row:nth-child(2) .vital-value');
        const lifeSupportValue = document.querySelector('.vital-row:nth-child(3) .vital-value');
        const engineValue = document.querySelector('.vital-row:nth-child(4) .vital-value');
        
        if (hullValue) hullValue.textContent = `${Math.round(this.ship.hull)}%`;
        if (fuelValue) fuelValue.textContent = `${Math.round(this.ship.fuel)}%`;
        if (lifeSupportValue) lifeSupportValue.textContent = `${Math.round(this.ship.lifeSupport)}%`;
        if (engineValue) engineValue.textContent = `${Math.round(this.ship.engine)}%`;
        
        // Update colors based on status
        if (hullFill) {
            if (this.ship.hull < 30) {
                hullFill.style.backgroundColor = 'var(--danger)';
            } else if (this.ship.hull < 60) {
                hullFill.style.backgroundColor = 'var(--warning)';
            } else {
                hullFill.style.backgroundColor = 'var(--success)';
            }
        }
    }
    
    startSystemsSimulation() {
        // Update ship systems every 5 seconds
        setInterval(() => {
            this.updateShipSystems();
        }, 5000);
    }
}

// Initialize ship manager when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    window.shipManager = new ShipManager();
});