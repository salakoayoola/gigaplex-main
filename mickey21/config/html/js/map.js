// Colony Map Functionality
class ColonyMap {
    constructor() {
        this.mapElement = document.getElementById('colony-map');
        this.mapGrid = document.querySelector('.map-grid');
        this.toggleViewBtn = document.getElementById('toggle-map-view');
        this.sectors = [];
        this.currentView = 'sectors'; // 'sectors' or 'detailed'
        this.expendableLocations = {
            '7': { row: 3, col: 4 }, // Sector 4-B
            '8': { row: 0, col: 0 }  // Colony Hub
        };
        
        this.initMap();
        this.setupEventListeners();
    }
    
    initMap() {
        if (!this.mapGrid) return;
        
        // Clear any existing cells
        this.mapGrid.innerHTML = '';
        
        // Create map cells in 8x8 grid
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement('div');
                cell.classList.add('map-cell');
                
                // Set initial status randomly for demonstration
                const sectorNumber = this.getSectorNumber(row, col);
                const status = this.getInitialSectorStatus(sectorNumber);
                if (status) {
                    cell.classList.add(status);
                }
                
                // Add sector number or coordinates based on view
                const label = document.createElement('div');
                label.classList.add('cell-label');
                
                if (this.currentView === 'sectors') {
                    if (sectorNumber) {
                        label.textContent = sectorNumber;
                    }
                } else {
                    label.textContent = `${row},${col}`;
                }
                
                cell.appendChild(label);
                
                // Add click event for cell details
                cell.addEventListener('click', () => {
                    this.showSectorDetails(row, col, sectorNumber);
                });
                
                this.mapGrid.appendChild(cell);
                
                // Store cell reference
                if (!this.sectors[row]) {
                    this.sectors[row] = [];
                }
                this.sectors[row][col] = {
                    element: cell,
                    status: status || 'unknown',
                    sectorNumber: sectorNumber
                };
            }
        }
        
        // Mark expendable locations
        this.updateExpendableLocations();
    }
    
    getSectorNumber(row, col) {
        // Colony hub at 0,0
        if (row === 0 && col === 0) {
            return 'Hub';
        }
        
        // Only certain cells represent numbered sectors
        const sectorMap = {
            '0,2': 1,  // North Ridge
            '2,0': 2,  // Western Valley
            '2,3': 3,  // Central Plains
            '3,4': 4,  // Eastern Plains
            '4,1': 5,  // Southern Valley
            '5,2': 6,  // Thermal Vents
            '3,6': 7,  // Creeper Territory
            '6,5': 8,  // Southern Ice Shelf
            '3,2': 9,  // Cave System
            '1,6': 10, // Northern Glacier
            '5,7': 11, // Eastern Cliffs
            '7,3': 12  // Deep Ice Shelf
        };
        
        const key = `${row},${col}`;
        return sectorMap[key] || '';
    }
    
    getInitialSectorStatus(sectorNumber) {
        // Set initial statuses for demonstration
        const initialStatuses = {
            'Hub': 'safe',
            '1': 'safe',
            '2': 'safe',
            '3': 'safe',
            '4': 'warning', // Creeper activity
            '5': 'safe',
            '6': 'unknown',
            '7': 'danger',  // Heavy creeper activity
            '8': 'unknown',
            '9': 'safe',
            '10': 'unknown',
            '11': 'unknown',
            '12': 'warning' // Some creeper activity
        };
        
        return initialStatuses[sectorNumber] || (Math.random() > 0.7 ? 'unknown' : null);
    }
    
    updateExpendableLocations() {
        // First clear any existing expendable markers
        const cells = document.querySelectorAll('.map-cell.expendable');
        cells.forEach(cell => {
            cell.classList.remove('expendable');
        });
        
        // Mark cells with expendables
        for (const [id, location] of Object.entries(this.expendableLocations)) {
            if (this.sectors[location.row] && this.sectors[location.row][location.col]) {
                const cell = this.sectors[location.row][location.col].element;
                cell.classList.add('expendable');
                
                // Add expendable indicator
                const existingLabel = cell.querySelector('.cell-label');
                if (existingLabel && !existingLabel.textContent.includes('M')) {
                    existingLabel.textContent += ` M${id}`;
                }
            }
        }
    }
    
    markSectorStatus(sectorNumber, status) {
        // Find the sector by number and update its status
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.sectors[row] && this.sectors[row][col] && 
                    this.sectors[row][col].sectorNumber === sectorNumber) {
                    
                    const cell = this.sectors[row][col];
                    
                    // Remove old status classes
                    cell.element.classList.remove('safe', 'warning', 'danger', 'unknown');
                    
                    // Add new status
                    cell.element.classList.add(status);
                    cell.status = status;
                    
                    // Log the change to the terminal if available
                    if (window.terminal) {
                        window.terminal.addTerminalLine(`Updated sector ${sectorNumber} status to ${status.toUpperCase()}`);
                    }
                    
                    // Add blinking effect temporarily
                    cell.element.classList.add('status-update');
                    setTimeout(() => {
                        cell.element.classList.remove('status-update');
                    }, 3000);
                    
                    return true;
                }
            }
        }
        
        return false;
    }
    
    showSectorDetails(row, col, sectorNumber) {
        const sector = this.sectors[row][col];
        
        if (window.terminal) {
            window.terminal.addTerminalLine(`Sector information:`, 'success');
            
            if (sectorNumber) {
                window.terminal.addTerminalLine(`Sector ID: ${sectorNumber}`);
            } else {
                window.terminal.addTerminalLine(`Coordinates: ${row},${col} (Unmapped terrain)`);
            }
            
            window.terminal.addTerminalLine(`Status: ${sector.status.toUpperCase()}`);
            
            // Show different details based on the sector
            if (sectorNumber === 'Hub') {
                window.terminal.addTerminalLine('Colony Hub - Central operations facility');
                window.terminal.addTerminalLine('- Population: 203 colonists');
                window.terminal.addTerminalLine('- Security level: Maximum');
                window.terminal.addTerminalLine('- All systems operational');
            } else if (sectorNumber === '4') {
                window.terminal.addTerminalLine('Eastern Plains - Research outpost');
                window.terminal.addTerminalLine('- Distance from hub: 4.2 km');
                window.terminal.addTerminalLine('- Last scan: 2054-05-13 15:22:18');
                window.terminal.addTerminalLine('- <span class="warning">Creeper activity detected</span>');
                window.terminal.addTerminalLine('- Expendable present: Mickey #7');
            } else if (sectorNumber === '7') {
                window.terminal.addTerminalLine('Creeper Territory - Designated danger zone');
                window.terminal.addTerminalLine('- Distance from hub: 6.8 km');
                window.terminal.addTerminalLine('- Last scan: 2054-05-13 14:05:43');
                window.terminal.addTerminalLine('- <span class="error">Heavy creeper presence</span>');
                window.terminal.addTerminalLine('- <span class="warning">Unusual activity patterns observed</span>');
                window.terminal.addTerminalLine('- ALERT: Entry requires commander authorization');
            } else {
                // Generic details for other sectors
                window.terminal.addTerminalLine(`General sector information`);
                window.terminal.addTerminalLine(`- Temperature: ${-40 - Math.floor(Math.random() * 15)}°C`);
                window.terminal.addTerminalLine(`- Last explored: ${Math.random() > 0.5 ? '2054-05-10' : 'Unknown'}`);
                window.terminal.addTerminalLine(`- Resources: ${Math.random() > 0.7 ? 'Detected' : 'None detected'}`);
            }
        }
    }
    
    setupEventListeners() {
        if (this.toggleViewBtn) {
            this.toggleViewBtn.addEventListener('click', () => {
                this.toggleMapView();
            });
        }
    }
    
    toggleMapView() {
        this.currentView = this.currentView === 'sectors' ? 'detailed' : 'sectors';
        
        if (this.toggleViewBtn) {
            this.toggleViewBtn.textContent = this.currentView === 'sectors' ? 'Show Detailed' : 'Show Sectors';
        }
        
        this.initMap();
    }
    
    moveExpendable(expendableId, newRow, newCol) {
        if (this.expendableLocations[expendableId]) {
            this.expendableLocations[expendableId] = { row: newRow, col: newCol };
            this.updateExpendableLocations();
            
            // Log the movement to the terminal
            if (window.terminal) {
                const sectorNumber = this.getSectorNumber(newRow, newCol);
                const sectorDesc = sectorNumber ? `Sector ${sectorNumber}` : `coordinates ${newRow},${newCol}`;
                window.terminal.addTerminalLine(`Mickey #${expendableId} moved to ${sectorDesc}`);
            }
        }
    }
}

// Initialize map when script loads
window.addEventListener('DOMContentLoaded', () => {
    window.colonyMap = new ColonyMap();
});