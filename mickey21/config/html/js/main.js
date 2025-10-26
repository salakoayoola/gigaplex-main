// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initModalHandlers();
    initGlobalKeyboardShortcuts();
    initSoundEffects();
    createSnowflakes();
    
    // Check if terminal needs initial focus
    setTimeout(() => {
        const terminalInput = document.getElementById('terminal-input-field');
        if (terminalInput) {
            terminalInput.focus();
        }
    }, 2000);
});

// Snow effect
function createSnowflakes() {
    const snowContainer = document.getElementById('snow');
    if (!snowContainer) return;
    
    // Snow is now handled by the EffectsManager
    // This function remains for backward compatibility
}

// Modal handlers
function initModalHandlers() {
    // Generic close button handlers for all modals
    document.querySelectorAll('.close-btn, [id^=cancel-]').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('open');
            }
        });
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                this.classList.remove('open');
            }
        });
    });
    
    // Creeper alert acknowledgement
    const acknowledgeBtn = document.getElementById('acknowledge-btn');
    if (acknowledgeBtn) {
        acknowledgeBtn.addEventListener('click', function() {
            const alert = document.getElementById('creeper-alert');
            if (alert) {
                alert.style.display = 'none';
            }
            
            if (window.terminal) {
                window.terminal.addTerminalLine('Alert acknowledged. Returning to normal operations.');
            }
        });
    }
}

// Global keyboard shortcuts
function initGlobalKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Escape key closes any open modal
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="display: flex"]');
            if (openModal) {
                openModal.style.display = 'none';
                openModal.classList.remove('open');
            }
        }
        
        // Ctrl+T to focus terminal
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            const terminalInput = document.getElementById('terminal-input-field');
            if (terminalInput) {
                terminalInput.focus();
            }
        }
        
        // Ctrl+H for help command
        if (e.ctrlKey && e.key === 'h') {
            e.preventDefault();
            if (window.terminal) {
                window.terminal.processCommand('help');
            }
        }
    });
}

// Sound effects system (placeholder - not actual audio implementation)
function initSoundEffects() {
    // This would typically load and initialize audio files
    window.soundEffects = {
        play: function(soundName) {
            // In a real implementation, this would play the sound
            console.log(`[Sound effect: ${soundName}]`);
        }
    };
    
    // Add click sound to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            window.soundEffects.play('click');
        });
    });
}

// Handle random creeper alert (small chance every minute)
setInterval(() => {
    if (Math.random() < 0.03) { // 3% chance
        const creeperAlert = document.getElementById('creeper-alert');
        if (creeperAlert && creeperAlert.style.display !== 'flex') {
            creeperAlert.style.display = 'flex';
            
            if (window.terminal) {
                window.terminal.addTerminalLine('ALERT: Creepers detected near colony perimeter!', 'error');
            }
            
            // Play alert sound
            if (window.soundEffects) {
                window.soundEffects.play('alarm');
            }
        }
    }
}, 60000);

// Add random mission log entries (moved to MissionManager)

// Update stats randomly (moved to ExpendablesManager)

// Update current date (moved to EffectsManager)

// Occasionally trigger special events
setInterval(() => {
    if (Math.random() < 0.05) { // 5% chance
        triggerRandomEvent();
    }
}, 300000); // Every 5 minutes

function triggerRandomEvent() {
    const events = [
        {
            name: "powerFluctuation",
            handler: () => {
                if (window.terminal) {
                    window.terminal.addTerminalLine("WARNING: Power fluctuation detected in main grid.", "warning");
                    window.terminal.addTerminalLine("Switching to backup generators...");
                    
                    setTimeout(() => {
                        window.terminal.addTerminalLine("Power systems stabilized. Cause: Unknown.");
                    }, 3000);
                }
                
                // Visual effect
                document.body.classList.add('flicker');
                setTimeout(() => {
                    document.body.classList.remove('flicker');
                }, 3000);
            }
        },
        {
            name: "strangeSignal",
            handler: () => {
                if (window.terminal) {
                    window.terminal.addTerminalLine("ALERT: Unknown signal detected outside colony perimeter.", "warning");
                    window.terminal.addTerminalLine("Signal analysis in progress...");
                    
                    setTimeout(() => {
                        window.terminal.addTerminalLine("Signal origin: Sector 7.");
                        window.terminal.addTerminalLine("Possible creeper communication attempt.", "warning");
                    }, 4000);
                }
            }
        },
        {
            name: "memoryGlitch",
            handler: () => {
                if (window.terminal) {
                    window.terminal.addTerminalLine("WARNING: Memory anomaly detected in Mickey #7.", "warning");
                    window.terminal.addTerminalLine("Unauthorized memory access patterns identified.");
                    window.terminal.addTerminalLine("Running diagnostic...");
                    
                    setTimeout(() => {
                        window.terminal.addTerminalLine("Anomaly contains remnants of creeper encounter in Sector 7.", "warning");
                        window.terminal.addTerminalLine("Memory quarantine recommended.");
                    }, 5000);
                }
                
                // Update Mickey #7 card
                const memoryFill = document.querySelector('#mickey-7 .memory-fill');
                if (memoryFill) {
                    memoryFill.style.backgroundColor = 'var(--warning)';
                    memoryFill.style.animation = 'pulse-warning 2s infinite';
                    
                    setTimeout(() => {
                        memoryFill.style.backgroundColor = '';
                        memoryFill.style.animation = '';
                    }, 10000);
                }
            }
        },
        {
            name: "colonyBreach",
            handler: () => {
                if (window.terminal) {
                    window.terminal.addTerminalLine("CRITICAL ALERT: Possible colony breach detected in sector 3-B.", "error");
                    window.terminal.addTerminalLine("Security protocols activated.");
                    window.terminal.addTerminalLine("Dispatching security team...");
                    
                    setTimeout(() => {
                        window.terminal.addTerminalLine("Breach assessment complete: False alarm.", "success");
                        window.terminal.addTerminalLine("Cause: Sensor malfunction due to extreme cold.");
                    }, 6000);
                }
                
                // Show and then hide alert
                const creeperAlert = document.getElementById('creeper-alert');
                const alertTitle = creeperAlert.querySelector('h2');
                const alertContent = creeperAlert.querySelector('.alert-body');
                
                if (alertTitle) alertTitle.innerHTML = '🚨 COLONY BREACH ALERT 🚨';
                if (alertContent) {
                    alertContent.innerHTML = `
                        <p>Possible breach detected in sector 3-B!</p>
                        <p>All personnel take shelter immediately.</p>
                        <p>Security teams report to affected sector.</p>
                    `;
                }
                
                creeperAlert.style.display = 'flex';
                
                setTimeout(() => {
                    creeperAlert.style.display = 'none';
                    
                    if (window.terminal) {
                        window.terminal.addTerminalLine("All clear. Security alert cancelled.");
                    }
                }, 8000);
            }
        }
    ];
    
    // Select a random event
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    randomEvent.handler();
}