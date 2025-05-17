// Expendables Management
class ExpendablesManager {
    constructor() {
        this.expendables = {
            '7': {
                id: 7,
                name: 'Mickey Barnes #7',
                status: 'active',
                health: 87,
                energy: 65,
                memory: 92,
                temperature: 72, // Internal body temperature as percentage of normal
                location: 'Sector 4-B',
                lastMission: 'Creeper reconnaissance',
                notes: 'Survived unexpected encounter with Creeper hive. Possible contamination being monitored. Shows unusual cognitive patterns.',
                printDate: '2054-03-17'
            },
            '8': {
                id: 8,
                name: 'Mickey Barnes #8',
                status: 'active',
                health: 100,
                energy: 95,
                memory: 98,
                temperature: 60, // Internal body temperature as percentage of normal
                location: 'Colony Hub',
                lastMission: 'None (Recently printed)',
                notes: 'Printed after Mickey #7 was presumed dead. Shows optimal baseline readings. Mental conditioning complete with standard protocols.',
                printDate: '2054-05-12'
            }
        };
        
        this.initEventListeners();
        this.startVitalsSimulation();
    }
    
    initEventListeners() {
        // Initialize button event listeners for expendable cards
        document.querySelectorAll('.mickey-btn').forEach(button => {
            const mickeyId = button.dataset.mickey;
            const action = button.dataset.action;
            
            button.addEventListener('click', () => {
                this.performExpendableAction(mickeyId, action);
            });
        });
        
        // Toggle vitals button
        const toggleVitalsBtn = document.getElementById('toggle-vitals');
        if (toggleVitalsBtn) {
            toggleVitalsBtn.addEventListener('click', () => {
                document.querySelectorAll('.vitals-container').forEach(container => {
                    container.classList.toggle('hidden');
                });
                
                toggleVitalsBtn.textContent = 
                    document.querySelector('.vitals-container').classList.contains('hidden') 
                    ? 'Show Vitals' 
                    : 'Hide Vitals';
            });
        }
    }
    
    performExpendableAction(mickeyId, action) {
        const expendable = this.expendables[mickeyId];
        
        if (!expendable) {
            console.error(`Expendable #${mickeyId} not found`);
            return;
        }
        
        switch(action) {
            case 'contact':
                this.contactExpendable(expendable);
                break;
                
            case 'track':
                this.trackExpendable(expendable);
                break;
                
            case 'terminate':
                this.showTerminateConfirmation(expendable);
                break;
                
            default:
                console.error(`Unknown action: ${action}`);
        }
    }
    
    contactExpendable(expendable) {
        if (window.terminal) {
            window.terminal.addTerminalLine(`Establishing communication with ${expendable.name}...`);
            
            setTimeout(() => {
                if (expendable.id === 7) {
                    // Mickey #7 has unusual experiences and perspectives
                    window.terminal.addTerminalLine(`Connection established with ${expendable.name}`, 'success');
                    window.terminal.addTerminalLine(`M7> I'm currently in ${expendable.location}, investigating unusual creeper activity.`);
                    window.terminal.addTerminalLine(`M7> They're not what we thought. There's a pattern to their movements.`);
                    window.terminal.addTerminalLine(`M7> I think they're trying to communicate with us.`);
                    window.terminal.addTerminalLine(`M7> Why are there two of me now? Did you make another one?`, 'warning');
                    window.terminal.addTerminalLine(`M7> We need to rethink everything we know about this planet.`);
                } else {
                    // Mickey #8 is by-the-book and recently created
                    window.terminal.addTerminalLine(`Connection established with ${expendable.name}`, 'success');
                    window.terminal.addTerminalLine(`M8> Currently stationed at ${expendable.location}, awaiting orders.`);
                    window.terminal.addTerminalLine(`M8> All systems functioning within normal parameters.`);
                    window.terminal.addTerminalLine(`M8> Ready for assignment at your discretion.`);
                    window.terminal.addTerminalLine(`M8> Request clarification on current protocol violation status.`);
                }
                
                window.terminal.addTerminalLine(`Communication channel with ${expendable.name} remains open. Enter messages or type 'close' to end.`);
            }, 1500);
        }
    }
    
    trackExpendable(expendable) {
        if (window.terminal) {
            window.terminal.addTerminalLine(`Tracking ${expendable.name}...`);
            
            setTimeout(() => {
                window.terminal.addTerminalLine(`Location: ${expendable.location}`, 'success');
                window.terminal.addTerminalLine(`Movement: ${expendable.id === 7 ? 'Active exploration pattern' : 'Stationary'}`);
                window.terminal.addTerminalLine(`Vital signs: Stable`);
                window.terminal.addTerminalLine(`Distance from colony hub: ${expendable.id === 7 ? '4.2km' : '0km'}`);
                
                // Highlight expendable on map
                if (window.colonyMap) {
                    const cell = document.querySelector(`.map-cell.expendable`);
                    if (cell) {
                        cell.style.boxShadow = '0 0 15px var(--highlight-glow)';
                        cell.style.zIndex = '10';
                        
                        setTimeout(() => {
                            cell.style.boxShadow = '';
                            cell.style.zIndex = '';
                        }, 3000);
                    }
                }
            }, 1000);
        }
    }
    
    showTerminateConfirmation(expendable) {
        // Create confirmation modal if doesn't exist
        let modal = document.getElementById('terminate-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'terminate-modal';
            modal.classList.add('modal');
            
            const modalContent = `
                <div class="modal-content danger">
                    <div class="modal-header">
                        <h2>TERMINATE EXPENDABLE</h2>
                        <button class="close-btn" id="close-terminate-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="warning-icon"></div>
                        <p class="confirm-text">Are you sure you want to terminate <span id="terminate-expendable-name"></span>?</p>
                        <p class="warning-text">This action cannot be undone. Termination will permanently deactivate the expendable.</p>
                        <div class="auth-section">
                            <p>Enter authorization code:</p>
                            <input type="password" id="terminate-auth-code" placeholder="Authorization code">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="confirm-terminate-btn" class="danger glow-btn">Confirm Termination</button>
                        <button id="cancel-terminate-btn">Cancel</button>
                    </div>
                </div>
            `;
            
            modal.innerHTML = modalContent;
            document.body.appendChild(modal);
            
            // Add event listeners
            modal.querySelector('#close-terminate-modal').addEventListener('click', () => {
                modal.style.display = 'none';
                modal.classList.remove('open');
            });
            
            modal.querySelector('#cancel-terminate-btn').addEventListener('click', () => {
                modal.style.display = 'none';
                modal.classList.remove('open');
            });
            
            modal.querySelector('#confirm-terminate-btn').addEventListener('click', () => {
                const authCode = document.getElementById('terminate-auth-code').value;
                const expendableName = document.getElementById('terminate-expendable-name').textContent;
                const expendableId = expendableName.slice(-1);
                
                this.processTerminationRequest(expendableId, authCode);
                modal.style.display = 'none';
                modal.classList.remove('open');
            });
        }
        
        // Update modal with expendable info
        document.getElementById('terminate-expendable-name').textContent = expendable.name;
        
        // Show modal
        modal.style.display = 'flex';
        modal.classList.add('open');
        
        // Focus the auth code input
        setTimeout(() => {
            document.getElementById('terminate-auth-code').focus();
        }, 100);
    }
    
    processTerminationRequest(expendableId, authCode) {
        if (window.terminal) {
            window.terminal.addTerminalLine(`Processing termination request for Mickey #${expendableId}...`, 'warning');
            
            setTimeout(() => {
                if (authCode === 'niflheim') {
                    window.terminal.addTerminalLine(`Authorization code accepted.`, 'success');
                    window.terminal.addTerminalLine(`Initiating termination sequence for Mickey #${expendableId}...`, 'warning');
                    
                    setTimeout(() => {
                        window.terminal.addTerminalLine(`WARNING: Expendable termination sequence active.`, 'error');
                        window.terminal.addTerminalLine(`Neural connections being severed...`);
                        window.terminal.addTerminalLine(`Metabolic functions shutting down...`);
                        
                        // Update the expendable card
                        const card = document.getElementById(`mickey-${expendableId}`);
                        if (card) {
                            const statusIndicator = card.querySelector('.status-indicator');
                            statusIndicator.classList.remove('active', 'pulse');
                            statusIndicator.classList.add('inactive');
                            
                            // Update health bars to zero
                            card.querySelectorAll('.stats-fill').forEach(fill => {
                                fill.style.width = '0%';
                            });
                            
                            // Update text status
                            card.querySelector('.info-value').textContent = 'TERMINATED';
                            card.querySelector('.info-value').style.color = 'var(--danger)';
                            
                            // Disable buttons
                            card.querySelectorAll('.mickey-btn').forEach(btn => {
                                btn.disabled = true;
                                btn.style.opacity = '0.5';
                            });
                            
                            // Add red overlay
                            card.style.boxShadow = 'inset 0 0 50px rgba(255, 44, 54, 0.3)';
                        }
                        
                        setTimeout(() => {
                            window.terminal.addTerminalLine(`Mickey #${expendableId} has been terminated.`, 'error');
                            window.terminal.addTerminalLine(`Logs updated. Colony protocol restored to normal.`);
                            
                            // Update the expendable count in the header
                            const expendableCount = document.getElementById('expendable-count');
                            if (expendableCount) {
                                expendableCount.textContent = '1 Active';
                                expendableCount.classList.remove('warning');
                            }
                        }, 2000);
                    }, 1500);
                } else {
                    window.terminal.addTerminalLine(`ERROR: Invalid authorization code.`, 'error');
                    window.terminal.addTerminalLine(`Termination sequence aborted.`);
                    window.terminal.addTerminalLine(`Security alert logged. Admin notification sent.`);
                }
            }, 1000);
        }
    }
    
    updateVitals() {
        for (const [id, expendable] of Object.entries(this.expendables)) {
            // Skip if expendable is terminated
            if (expendable.status === 'terminated') continue;
            
            // Get the card element
            const card = document.getElementById(`mickey-${id}`);
            if (!card) continue;
            
            // Update health with small random changes
            expendable.health += (Math.random() * 2 - 1) * (id === '7' ? 2 : 0.5);
            expendable.health = Math.max(0, Math.min(100, expendable.health));
            
            // Update energy with more volatility for Mickey #7
            expendable.energy += (Math.random() * 3 - 1.5) * (id === '7' ? 2 : 1);
            expendable.energy = Math.max(0, Math.min(100, expendable.energy));
            
            // Memory integrity slowly degrades for Mickey #7, very stable for #8
            expendable.memory += (Math.random() * 1 - 0.6) * (id === '7' ? 2 : 0.1);
            expendable.memory = Math.max(0, Math.min(100, expendable.memory));
            
            // Temperature fluctuates
            expendable.temperature += (Math.random() * 2 - 1);
            expendable.temperature = Math.max(0, Math.min(100, expendable.temperature));
            
            // Update the UI elements
            const healthFill = card.querySelector('.health-fill');
            const energyFill = card.querySelector('.energy-fill');
            const memoryFill = card.querySelector('.memory-fill');
            const tempFill = card.querySelector('.temp-fill');
            const healthValue = card.querySelector('.vital-row:nth-child(1) .vital-value');
            const energyValue = card.querySelector('.vital-row:nth-child(2) .vital-value');
            const memoryValue = card.querySelector('.vital-row:nth-child(3) .vital-value');
            const tempValue = card.querySelector('.vital-row:nth-child(4) .vital-value');
            
            if (healthFill) healthFill.style.width = `${expendable.health}%`;
            if (energyFill) energyFill.style.width = `${expendable.energy}%`;
            if (memoryFill) memoryFill.style.width = `${expendable.memory}%`;
            if (tempFill) tempFill.style.width = `${expendable.temperature}%`;
            
            if (healthValue) healthValue.textContent = `${Math.round(expendable.health)}%`;
            if (energyValue) energyValue.textContent = `${Math.round(expendable.energy)}%`;
            if (memoryValue) memoryValue.textContent = `${Math.round(expendable.memory)}%`;
            
            // Temperature is shown in degrees rather than percentage
            if (tempValue) {
                // Map 0-100% to -60°C to -10°C
                const tempInDegrees = -60 + (expendable.temperature * 0.5);
                tempValue.textContent = `${tempInDegrees.toFixed(1)}°C`;
            }
            
            // Change fill colors based on values
            if (healthFill) {
                if (expendable.health < 30) {
                    healthFill.style.backgroundColor = 'var(--danger)';
                } else if (expendable.health < 60) {
                    healthFill.style.backgroundColor = 'var(--warning)';
                } else {
                    healthFill.style.backgroundColor = 'var(--success)';
                }
            }
            
            if (energyFill) {
                if (expendable.energy < 30) {
                    energyFill.style.backgroundColor = 'var(--danger)';
                } else if (expendable.energy < 60) {
                    energyFill.style.backgroundColor = 'var(--warning)';
                } else {
                    energyFill.style.backgroundColor = 'var(--warning)';
                }
            }
            
            if (memoryFill) {
                if (expendable.memory < 30) {
                    memoryFill.style.backgroundColor = 'var(--danger)';
                } else if (expendable.memory < 60) {
                    memoryFill.style.backgroundColor = 'var(--warning)';
                } else {
                    memoryFill.style.backgroundColor = 'var(--highlight)';
                }
            }
            
            // Add warnings for low stats
            if (expendable.health < 30 || expendable.energy < 20 || expendable.memory < 40) {
                if (!card.classList.contains('warning-state')) {
                    card.classList.add('warning-state');
                    card.style.boxShadow = '0 0 15px var(--warning)';
                    
                    // Log critical warning to terminal
                    if (window.terminal && Math.random() > 0.7) {
                        let warningText;
                        if (expendable.health < 30) {
                            warningText = `WARNING: ${expendable.name} health at critical levels (${Math.round(expendable.health)}%)`;
                        } else if (expendable.energy < 20) {
                            warningText = `WARNING: ${expendable.name} energy reserves critically low (${Math.round(expendable.energy)}%)`;
                        } else {
                            warningText = `WARNING: ${expendable.name} memory integrity degrading (${Math.round(expendable.memory)}%)`;
                        }
                        window.terminal.addTerminalLine(warningText, 'warning');
                    }
                }
            } else {
                if (card.classList.contains('warning-state')) {
                    card.classList.remove('warning-state');
                    card.style.boxShadow = '';
                }
            }
        }
    }
    
    startVitalsSimulation() {
        // Update vitals every 5 seconds
        setInterval(() => {
            this.updateVitals();
        }, 5000);
    }
}

// Initialize expendables manager when the DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    window.expendablesManager = new ExpendablesManager();
});