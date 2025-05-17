// Mission Management
class MissionManager {
    constructor() {
        this.activeMissions = [];
        this.missionLog = document.getElementById('mission-log');
        this.initButtons();
        this.initModals();
        this.initMissionLog();
    }
    
    initButtons() {
        // Mission control buttons
        const scanBtn = document.getElementById('scan-btn');
        const exploreBtn = document.getElementById('explore-btn');
        const contactBtn = document.getElementById('contact-btn');
        const deployBtn = document.getElementById('deploy-btn');
        
        if (scanBtn) {
            scanBtn.addEventListener('click', () => {
                if (window.terminal) {
                    window.terminal.processCommand('scan');
                }
            });
        }
        
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                this.openMissionModal('explore');
            });
        }
        
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                if (window.terminal) {
                    window.terminal.contactCreepers();
                }
            });
        }
        
        if (deployBtn) {
            deployBtn.addEventListener('click', () => {
                this.openMissionModal('deploy');
            });
        }
        
        // Colony management buttons
        const resourcesBtn = document.getElementById('resources-btn');
        const weatherBtn = document.getElementById('weather-btn');
        const alertBtn = document.getElementById('alert-btn');
        const protocolBtn = document.getElementById('protocol-btn');
        
        if (resourcesBtn) {
            resourcesBtn.addEventListener('click', () => {
                if (window.terminal) {
                    window.terminal.processCommand('resources');
                }
            });
        }
        
        if (weatherBtn) {
            weatherBtn.addEventListener('click', () => {
                if (window.terminal) {
                    window.terminal.processCommand('weather');
                }
            });
        }
        
        if (alertBtn) {
            alertBtn.addEventListener('click', () => {
                this.openAlertModal();
            });
        }
        
        if (protocolBtn) {
            protocolBtn.addEventListener('click', () => {
                if (window.terminal) {
                    window.terminal.addTerminalLine('Accessing protocol management...');
                    window.terminal.addTerminalLine('Access denied. Administrator authorization required.', 'error');
                    window.terminal.addTerminalLine('Hint: Try "override niflheim" command');
                }
            });
        }
        
        // Filter mission log
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                this.filterMissionLog(filter);
                
                // Update active class
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }
    
    initModals() {
        // Mission modal
        const missionModal = document.getElementById('mission-modal');
        const closeMissionModal = document.getElementById('close-mission-modal');
        const cancelMissionBtn = document.getElementById('cancel-mission-btn');
        const deployMissionBtn = document.getElementById('deploy-mission-btn');
        
        if (closeMissionModal) {
            closeMissionModal.addEventListener('click', () => {
                missionModal.style.display = 'none';
                missionModal.classList.remove('open');
            });
        }
        
        if (cancelMissionBtn) {
            cancelMissionBtn.addEventListener('click', () => {
                missionModal.style.display = 'none';
                missionModal.classList.remove('open');
            });
        }
        
        if (deployMissionBtn) {
            deployMissionBtn.addEventListener('click', () => {
                this.deployMission();
            });
        }
        
        // Alert modal
        const alertModal = document.getElementById('alert-modal');
        const closeAlertModal = document.getElementById('close-alert-modal');
        const cancelAlertBtn = document.getElementById('cancel-alert-btn');
        const issueAlertBtn = document.getElementById('issue-alert-btn');
        
        if (closeAlertModal) {
            closeAlertModal.addEventListener('click', () => {
                alertModal.style.display = 'none';
                alertModal.classList.remove('open');
            });
        }
        
        if (cancelAlertBtn) {
            cancelAlertBtn.addEventListener('click', () => {
                alertModal.style.display = 'none';
                alertModal.classList.remove('open');
            });
        }
        
        if (issueAlertBtn) {
            issueAlertBtn.addEventListener('click', () => {
                this.issueAlert();
            });
        }
        
        // Creeper alert
        const creeperAlert = document.getElementById('creeper-alert');
        const acknowledgeBtn = document.getElementById('acknowledge-btn');
        const deployResponseBtn = document.getElementById('deploy-response-btn');
        
        if (acknowledgeBtn) {
            acknowledgeBtn.addEventListener('click', () => {
                creeperAlert.style.display = 'none';
                
                if (window.terminal) {
                    window.terminal.addTerminalLine('Alert acknowledged. Returning to normal operations.');
                }
            });
        }
        
        if (deployResponseBtn) {
            deployResponseBtn.addEventListener('click', () => {
                creeperAlert.style.display = 'none';
                this.openMissionModal('deploy', {
                    type: 'recon',
                    sector: '7',
                    priority: 'critical'
                });
                
                if (window.terminal) {
                    window.terminal.addTerminalLine('Preparing emergency response deployment...');
                }
            });
        }
    }
    
    openMissionModal(type, presets = {}) {
        const modal = document.getElementById('mission-modal');
        
        // Populate with presets if provided
        if (presets.type) {
            document.getElementById('mission-type').value = presets.type;
        }
        
        if (presets.sector) {
            document.getElementById('mission-sector').value = presets.sector;
        }
        
        if (presets.priority) {
            document.getElementById('mission-priority').value = presets.priority;
        }
        
        // Set an appropriate title based on the type
        const modalTitle = modal.querySelector('.modal-header h2');
        if (modalTitle) {
            modalTitle.textContent = type === 'explore' ? 'Exploration Mission' : 'Mission Deployment';
        }
        
        modal.style.display = 'flex';
        modal.classList.add('open');
    }
    
    openAlertModal() {
        const modal = document.getElementById('alert-modal');
        modal.style.display = 'flex';
        modal.classList.add('open');
    }
    
    deployMission() {
        const expendableId = document.getElementById('mission-expendable').value;
        const missionType = document.getElementById('mission-type').value;
        const targetSector = document.getElementById('mission-sector').value;
        const duration = document.getElementById('mission-duration').value;
        const priority = document.getElementById('mission-priority').value;
        const notes = document.getElementById('mission-notes').value;
        
        // Close the modal
        const modal = document.getElementById('mission-modal');
        modal.style.display = 'none';
        modal.classList.remove('open');
        
        // Create a new mission
        const mission = {
            id: `M-${Date.now().toString().slice(-6)}`,
            expendableId: expendableId,
            type: missionType,
            sector: targetSector,
            duration: duration,
            priority: priority,
            notes: notes,
            status: 'active',
            startTime: new Date(),
            completionTime: null
        };
        
        this.activeMissions.push(mission);
        
        // Log in terminal
        if (window.terminal) {
            window.terminal.addTerminalLine(`Deploying Mickey #${expendableId} on ${this.getMissionTypeLabel(missionType)} mission...`, 'success');
            window.terminal.addTerminalLine(`Mission ID: ${mission.id}`);
            window.terminal.addTerminalLine(`Target: Sector ${targetSector}`);
            window.terminal.addTerminalLine(`Priority: ${priority.toUpperCase()}`);
            window.terminal.addTerminalLine(`Expendable #${expendableId} preparing for departure.`);
        }
        
        // Add to mission log
        this.addMissionEntry({
            date: new Date(),
            text: `Mickey #${expendableId} deployed to Sector ${targetSector} for ${this.getMissionTypeLabel(missionType)} mission.`,
            type: 'normal'
        });
        
        // Move expendable on map if map exists
        if (window.colonyMap) {
            // Get destination coordinates based on sector
            const sectorCoordinates = this.getSectorCoordinates(targetSector);
            if (sectorCoordinates) {
                window.colonyMap.moveExpendable(expendableId, sectorCoordinates.row, sectorCoordinates.col);
            }
        }
        
        // Schedule some mission updates
        this.scheduleMissionUpdates(mission);
    }
    
    getMissionTypeLabel(type) {
        const labels = {
            'recon': 'reconnaissance',
            'repair': 'repair and maintenance',
            'research': 'research and data collection',
            'contact': 'creeper contact'
        };
        
        return labels[type] || type;
    }
    
    getSectorCoordinates(sectorNumber) {
        // Map from sector numbers to row,col coordinates
        const sectorMap = {
            '1': { row: 0, col: 2 },  // North Ridge
            '2': { row: 2, col: 0 },  // Western Valley
            '3': { row: 2, col: 3 },  // Central Plains
            '4': { row: 3, col: 4 },  // Eastern Plains
            '5': { row: 4, col: 1 },  // Southern Valley
            '6': { row: 5, col: 2 },  // Thermal Vents
            '7': { row: 3, col: 6 },  // Creeper Territory
            '8': { row: 6, col: 5 },  // Southern Ice Shelf
            '9': { row: 3, col: 2 },  // Cave System
            '10': { row: 1, col: 6 }, // Northern Glacier
            '11': { row: 5, col: 7 }, // Eastern Cliffs
            '12': { row: 7, col: 3 }  // Deep Ice Shelf
        };
        
        return sectorMap[sectorNumber];
    }
    
    scheduleMissionUpdates(mission) {
        // Schedule a series of updates based on mission duration
        const baseDelay = mission.duration === 'short' ? 30000 : 
                         mission.duration === 'medium' ? 60000 :
                         mission.duration === 'long' ? 90000 : 120000;
        
        // Mid-mission update
        setTimeout(() => {
            if (mission.status === 'active') {
                let updateText = '';
                let updateType = 'normal';
                
                // Different updates based on mission type and sector
                if (mission.type === 'recon' && (mission.sector === '4' || mission.sector === '7' || mission.sector === '12')) {
                    updateText = `Mickey #${mission.expendableId} reports increased creeper activity in Sector ${mission.sector}.`;
                    updateType = mission.sector === '7' ? 'warning' : 'normal';
                } else if (mission.type === 'contact' && mission.sector === '7') {
                    updateText = `ALERT: Unusual sonic patterns detected from creepers during contact attempt in Sector ${mission.sector}.`;
                    updateType = 'warning';
                } else if (mission.type === 'repair') {
                    updateText = `Mickey #${mission.expendableId} has completed ${Math.floor(Math.random() * 30) + 60}% of repairs in Sector ${mission.sector}.`;
                } else if (mission.type === 'research') {
                    updateText = `Mickey #${mission.expendableId} collecting samples from Sector ${mission.sector}. Preliminary analysis shows interesting results.`;
                } else {
                    updateText = `Mickey #${mission.expendableId} reports normal progress in Sector ${mission.sector}.`;
                }
                
                this.addMissionEntry({
                    date: new Date(),
                    text: updateText,
                    type: updateType
                });
                
                if (window.terminal && Math.random() > 0.5) {
                    window.terminal.addTerminalLine(`Mission update: ${updateText}`, updateType === 'warning' ? 'warning' : '');
                }
            }
        }, baseDelay / 2);
        
        // Mission completion
        setTimeout(() => {
            if (mission.status === 'active') {
                mission.status = 'completed';
                mission.completionTime = new Date();
                
                let completionText = '';
                let completionType = 'normal';
                
                // Different completions based on mission type and sector
                if (mission.type === 'recon' && mission.sector === '7') {
                    completionText = `Mickey #${mission.expendableId} returned from Sector ${mission.sector} with critical intelligence about creeper behavior patterns.`;
                    completionType = 'warning';
                } else if (mission.type === 'contact') {
                    completionText = `Mickey #${mission.expendableId} reports successful attempt to establish basic communication with creepers in Sector ${mission.sector}.`;
                    completionType = 'warning';
                } else if (mission.type === 'repair') {
                    completionText = `Mickey #${mission.expendableId} has successfully completed all repairs in Sector ${mission.sector}.`;
                } else if (mission.type === 'research') {
                    completionText = `Mickey #${mission.expendableId} returned with valuable research data from Sector ${mission.sector}.`;
                } else {
                    completionText = `Mickey #${mission.expendableId} has returned from Sector ${mission.sector}. Mission complete.`;
                }
                
                this.addMissionEntry({
                    date: new Date(),
                    text: completionText,
                    type: completionType
                });
                
                if (window.terminal) {
                    window.terminal.addTerminalLine(`Mission ${mission.id} completed.`, 'success');
                    window.terminal.addTerminalLine(completionText);
                }
                
                // Move expendable back to base if map exists (50% chance to stay in the field)
                if (window.colonyMap && Math.random() > 0.5) {
                    window.colonyMap.moveExpendable(mission.expendableId, 0, 0); // Colony hub
                }
            }
        }, baseDelay);
        
        // Possible mission complication
        if (Math.random() > 0.7) {
            setTimeout(() => {
                if (mission.status === 'active') {
                    let complicationText = '';
                    
                    // Generate a random complication
                    const complications = [
                        `Mickey #${mission.expendableId} reports equipment malfunction in Sector ${mission.sector}.`,
                        `Mickey #${mission.expendableId} encountered unexpected weather conditions in Sector ${mission.sector}.`,
                        `Mickey #${mission.expendableId} discovered unusual geological formation in Sector ${mission.sector}.`,
                        `Mickey #${mission.expendableId} reports minor injury while navigating difficult terrain in Sector ${mission.sector}.`,
                        `Mickey #${mission.expendableId} lost contact temporarily. Signal restored after 12 minutes.`
                    ];
                    
                    // Special complications for creeper sectors
                    if (mission.sector === '4' || mission.sector === '7' || mission.sector === '12') {
                        complications.push(
                            `WARNING: Mickey #${mission.expendableId} surrounded by creepers in Sector ${mission.sector}. Situation tense.`,
                            `Mickey #${mission.expendableId} observes unprecedented creeper behavior in Sector ${mission.sector}.`,
                            `ALERT: Mickey #${mission.expendableId} reports creepers attempting to follow him back to colony from Sector ${mission.sector}.`
                        );
                    }
                    
                    complicationText = complications[Math.floor(Math.random() * complications.length)];
                    
                    this.addMissionEntry({
                        date: new Date(),
                        text: complicationText,
                        type: complicationText.includes('WARNING') || complicationText.includes('ALERT') ? 'warning' : 'normal'
                    });
                    
                    if (window.terminal) {
                        window.terminal.addTerminalLine(complicationText, complicationText.includes('WARNING') || complicationText.includes('ALERT') ? 'warning' : '');
                    }
                }
            }, baseDelay * Math.random());
        }
    }
    
    issueAlert() {
        const alertType = document.getElementById('alert-type').value;
        const severity = document.getElementById('alert-severity').value;
        const message = document.getElementById('alert-message').value;
        
        // Close the modal
        const alertModal = document.getElementById('alert-modal');
        alertModal.style.display = 'none';
        alertModal.classList.remove('open');
        
        // Show the colony-wide alert
        const creeperAlert = document.getElementById('creeper-alert');
        const alertTitle = creeperAlert.querySelector('h2');
        const alertContent = creeperAlert.querySelector('.alert-body');
        
        // Update alert title based on type and severity
        if (alertTitle) {
            let icon = '⚠️';
            if (severity === 'critical' || severity === 'danger') {
                icon = '🚨';
            }
            
            let title = alertType.toUpperCase();
            if (alertType === 'creeper') title = 'CREEPER PROXIMITY';
            if (alertType === 'weather') title = 'EXTREME WEATHER';
            if (alertType === 'breach') title = 'COLONY BREACH';
            if (alertType === 'medical') title = 'MEDICAL EMERGENCY';
            if (alertType === 'system') title = 'SYSTEM FAILURE';
            
            alertTitle.innerHTML = `${icon} ${title} ALERT ${icon}`;
        }
        
        // Update alert content
        if (alertContent) {
            alertContent.innerHTML = message.replace(/\n/g, '<br>');
        }
        
        // Show the alert
        creeperAlert.style.display = 'flex';
        
        // Log to mission log
        this.addMissionEntry({
            date: new Date(),
            text: `COLONY ALERT: ${message.split('\n')[0]}`,
            type: severity === 'notice' ? 'normal' : 'warning'
        });
        
        // Log to terminal
        if (window.terminal) {
            window.terminal.addTerminalLine(`Colony-wide ${severity.toUpperCase()} alert issued: ${alertType}`, 'error');
        }
    }
    
    initMissionLog() {
        // Initial mission log entries are already in the HTML
        // Set up auto-generation of new entries
        this.startRandomMissionEntries();
    }
    
    addMissionEntry(entry) {
        const entryElement = document.createElement('div');
        entryElement.classList.add('mission-entry');
        
        // Make entries of different types filterable
        if (entry.type) {
            entryElement.dataset.type = entry.type;
        }
        
        // Format date
        const formattedDate = this.formatDate(entry.date);
        
        // Create entry header with date and tag
        const entryHeader = document.createElement('div');
        entryHeader.classList.add('entry-header');
        
        const dateElement = document.createElement('div');
        dateElement.classList.add('date');
        dateElement.textContent = formattedDate;
        
        const tagElement = document.createElement('div');
        tagElement.classList.add('entry-tag');
        
        if (entry.type === 'warning' || entry.type === 'critical') {
            tagElement.classList.add(entry.type);
            tagElement.textContent = entry.type === 'critical' ? 'CRITICAL' : 'WARNING';
        } else {
            tagElement.classList.add('normal');
            tagElement.textContent = 'INFO';
        }
        
        entryHeader.appendChild(dateElement);
        entryHeader.appendChild(tagElement);
        
        // Create entry content
        const entryContent = document.createElement('p');
        entryContent.textContent = entry.text;
        
        // Add everything to the entry
        entryElement.appendChild(entryHeader);
        entryElement.appendChild(entryContent);
        
        // Add to the top of the mission log
        if (this.missionLog.firstChild) {
            this.missionLog.insertBefore(entryElement, this.missionLog.firstChild);
        } else {
            this.missionLog.appendChild(entryElement);
        }
        
        // Limit the number of entries to keep
        const entries = this.missionLog.querySelectorAll('.mission-entry');
        if (entries.length > 30) {
            this.missionLog.removeChild(entries[entries.length - 1]);
        }
    }
    
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    
    filterMissionLog(filter) {
        const entries = this.missionLog.querySelectorAll('.mission-entry');
        
        entries.forEach(entry => {
            if (filter === 'all') {
                entry.style.display = '';
            } else if (entry.dataset.type === filter) {
                entry.style.display = '';
            } else {
                entry.style.display = 'none';
            }
        });
    }
    
    startRandomMissionEntries() {
        // Add random mission log entries periodically
        setInterval(() => {
            // Lower chance (10%) of generating random entries
            if (Math.random() > 0.9) {
                this.addRandomMissionEntry();
            }
        }, 30000); // Every 30 seconds
    }
    
    addRandomMissionEntry() {
        const events = [
            "Environmental sensors detect temperature drop to -53°C in sector 12.",
            "Hydroponics system efficiency increased by 3% after recent maintenance.",
            "Mickey #7 reported unusual ice formations in sector 9.",
            "Satellite communications temporarily interrupted by solar activity.",
            "Automated drones completed perimeter scan. No anomalies detected.",
            "Medical officer reports successful treatment of frostbite cases.",
            "Power fluctuation in eastern wing stabilized.",
            "Water recycling system operating at 97% efficiency.",
            "Mickey #8 completed maintenance on eastern perimeter sensors.",
            "Security system detected and neutralized attempted digital intrusion.",
            "Memory backup procedure for Mickey #7 and #8 completed successfully.",
            "Creeper activity increased near the western ridge."
        ];
        
        const warnings = [
            "WARNING: Unauthorized access attempt to cloning facility.",
            "WARNING: Unexplained power fluctuations in sector 3.",
            "WARNING: Multiple detection system temporarily disabled.",
            "WARNING: Unusual creeper behavior observed - possible intelligence.",
            "WARNING: Resource consumption exceeding projections.",
            "WARNING: Minor radiation leak detected in research lab. Contained.",
            "WARNING: Communications satellite experiencing intermittent failures.",
            "WARNING: Temperature control malfunction in food storage area.",
            "WARNING: Unidentified signal detected outside colony perimeter."
        ];
        
        // 20% chance of warning
        const isWarning = Math.random() < 0.2;
        const text = isWarning ? warnings[Math.floor(Math.random() * warnings.length)] : events[Math.floor(Math.random() * events.length)];
        
        this.addMissionEntry({
            date: new Date(),
            text: text,
            type: isWarning ? 'warning' : 'normal'
        });
    }
}

// Initialize mission manager when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    window.missionManager = new MissionManager();
});