// Terminal Functionality
class Terminal {
    constructor() {
        this.terminalContent = document.getElementById('terminal-content');
        this.inputField = document.getElementById('terminal-input-field');
        this.suggestionsElement = document.getElementById('command-suggestions');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.availableCommands = [
            'help', 'status', 'scan', 'history', 'resources', 
            'weather', 'alert', 'clear', 'terminate', 'override',
            'map', 'deploy', 'contact', 'mission', 'expendables'
        ];
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Input field listeners
        this.inputField.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.inputField.addEventListener('input', this.handleInput.bind(this));
        this.inputField.addEventListener('focus', () => {
            this.showSuggestions();
        });
        
        // Clear button
        const clearBtn = document.getElementById('clear-terminal');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.processCommand('clear');
            });
        }
        
        // Help button
        const helpBtn = document.getElementById('help-btn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.processCommand('help');
            });
        }
        
        // Document click to hide suggestions
        document.addEventListener('click', (e) => {
            if (e.target !== this.inputField && e.target !== this.suggestionsElement) {
                this.hideSuggestions();
            }
        });
    }
    
    handleKeyDown(e) {
        if (e.key === 'Enter') {
            const command = this.inputField.value.trim().toLowerCase();
            if (command) {
                this.addCommandToHistory(command);
                this.addTerminalLine(`admin@niflheim:~$ ${command}`, 'user-command');
                this.processCommand(command);
                this.inputField.value = '';
                this.historyIndex = -1;
                this.hideSuggestions();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory(1);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autocompleteCommand();
        } else if (e.key === 'Escape') {
            this.hideSuggestions();
        }
    }
    
    handleInput() {
        const inputValue = this.inputField.value.trim().toLowerCase();
        if (inputValue) {
            this.showSuggestions(inputValue);
        } else {
            this.hideSuggestions();
        }
    }
    
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
            return;
        }
        
        if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length - 1;
            return;
        }
        
        this.inputField.value = this.commandHistory[this.historyIndex];
    }
    
    autocompleteCommand() {
        const inputValue = this.inputField.value.trim().toLowerCase();
        const matches = this.availableCommands.filter(cmd => cmd.startsWith(inputValue));
        
        if (matches.length === 1) {
            this.inputField.value = matches[0];
            this.hideSuggestions();
        } else if (matches.length > 1) {
            this.showSuggestions(inputValue);
        }
    }
    
    showSuggestions(prefix = '') {
        if (!prefix) {
            this.suggestionsElement.innerHTML = '';
            this.availableCommands.forEach(cmd => {
                this.addSuggestion(cmd);
            });
        } else {
            const matches = this.availableCommands.filter(cmd => cmd.startsWith(prefix));
            
            if (matches.length > 0) {
                this.suggestionsElement.innerHTML = '';
                matches.forEach(cmd => {
                    this.addSuggestion(cmd);
                });
                this.suggestionsElement.style.display = 'block';
            } else {
                this.hideSuggestions();
            }
        }
    }
    
    addSuggestion(command) {
        const item = document.createElement('div');
        item.classList.add('suggestion-item');
        item.textContent = command;
        
        item.addEventListener('click', () => {
            this.inputField.value = command;
            this.hideSuggestions();
            this.inputField.focus();
        });
        
        this.suggestionsElement.appendChild(item);
    }
    
    hideSuggestions() {
        this.suggestionsElement.style.display = 'none';
    }
    
    addCommandToHistory(command) {
        // Only add if it's different from the last command
        if (this.commandHistory.length === 0 || this.commandHistory[this.commandHistory.length - 1] !== command) {
            this.commandHistory.push(command);
            
            // Keep history to a reasonable size
            if (this.commandHistory.length > 50) {
                this.commandHistory.shift();
            }
        }
    }
    
    addTerminalLine(text, className = '') {
        const line = document.createElement('div');
        line.classList.add('line');
        
        if (className) {
            line.classList.add(className);
        }
        
        if (className === 'user-command') {
            line.innerHTML = text;
        } else {
            line.innerHTML = `<span class="prompt">system></span> ${text}`;
        }
        
        this.terminalContent.appendChild(line);
        this.scrollToBottom();
        
        return line;
    }
    
    addTypedTerminalLine(text, className = '', typingSpeed = 30) {
        const line = this.addTerminalLine('', className);
        
        // Create a span for the prompt if it's not a user command
        if (className !== 'user-command') {
            const promptSpan = document.createElement('span');
            promptSpan.classList.add('prompt');
            promptSpan.textContent = 'system> ';
            line.innerHTML = '';
            line.appendChild(promptSpan);
        } else {
            line.innerHTML = '';
        }
        
        const textSpan = document.createElement('span');
        textSpan.classList.add('typing');
        line.appendChild(textSpan);
        
        let i = 0;
        const typeCharacter = () => {
            if (i < text.length) {
                if (className === 'user-command') {
                    textSpan.textContent += text.charAt(i);
                } else {
                    textSpan.textContent += text.charAt(i);
                }
                i++;
                this.scrollToBottom();
                setTimeout(typeCharacter, typingSpeed);
            }
        };
        
        typeCharacter();
        return line;
    }
    
    scrollToBottom() {
        this.terminalContent.scrollTop = this.terminalContent.scrollHeight;
    }
    
    processCommand(command) {
        const args = command.split(' ');
        const baseCommand = args[0];
        
        switch(baseCommand) {
            case 'help':
                this.showHelp();
                break;
                
            case 'status':
                this.showStatus();
                break;
                
            case 'scan':
                this.performScan();
                break;
                
            case 'history':
                this.showHistory();
                break;
                
            case 'resources':
                this.showResources();
                break;
                
            case 'weather':
                this.showWeather();
                break;
                
            case 'alert':
                this.triggerAlert();
                break;
                
            case 'clear':
                this.clearTerminal();
                break;
                
            case 'terminate':
                this.handleTerminate(args);
                break;
                
            case 'override':
                this.handleOverride(args);
                break;
                
            case 'map':
                this.showMap();
                break;
                
            case 'deploy':
                this.deployExpendable();
                break;
                
            case 'contact':
                this.contactCreepers();
                break;
                
            case 'mission':
                this.showMissionDetails();
                break;
                
            case 'expendables':
                this.showExpendableDetails();
                break;
                
            default:
                this.addTerminalLine(`Command not recognized: ${command}`, 'error');
                this.addTerminalLine('Type "help" for available commands.');
        }
    }
    
    showHelp() {
        this.addTerminalLine('Available commands:', 'success');
        this.addTerminalLine('- <b>help</b>: Display this help message');
        this.addTerminalLine('- <b>status</b>: Show colony and expendable status');
        this.addTerminalLine('- <b>scan</b>: Scan for creeper activity');
        this.addTerminalLine('- <b>history</b>: Show mission history');
        this.addTerminalLine('- <b>resources</b>: Check colony resources');
        this.addTerminalLine('- <b>weather</b>: Show weather forecast');
        this.addTerminalLine('- <b>alert</b>: Trigger colony-wide alert');
        this.addTerminalLine('- <b>map</b>: Display colony sector map');
        this.addTerminalLine('- <b>deploy</b>: Deploy expendable on mission');
        this.addTerminalLine('- <b>contact</b>: Attempt creeper communication');
        this.addTerminalLine('- <b>mission</b>: View active mission details');
        this.addTerminalLine('- <b>expendables</b>: View expendable status');
        this.addTerminalLine('- <b>clear</b>: Clear terminal');
        this.addTerminalLine('- <b>terminate</b>: Terminate specific expendable');
        this.addTerminalLine('- <b>override</b>: Override system protocols (requires authorization)');
    }
    
    showStatus() {
        this.addTerminalLine('Colony Status: <span class="success">OPERATIONAL</span>');
        this.addTerminalLine('Population: 203 colonists');
        this.addTerminalLine('Expendables: 2 active (Mickey #7, Mickey #8)');
        this.addTerminalLine('WARNING: Multiple Mickeys detected. Protocol violation.', 'warning');
        this.addTerminalLine('Temperature: -48°C (External), 19°C (Internal)');
        this.addTerminalLine('Power systems: 92% efficiency');
        this.addTerminalLine('Next supply shipment: 148 days');
    }
    
    performScan() {
        this.addTypedTerminalLine('Initiating perimeter scan...', '', 20);
        
        setTimeout(() => {
            this.addTerminalLine('Scanning sector 1...', '');
            setTimeout(() => {
                this.addTerminalLine('Scanning sector 2...', '');
                setTimeout(() => {
                    this.addTerminalLine('Scanning sector 3...', '');
                    setTimeout(() => {
                        this.addTerminalLine('Scanning sector 4... <span class="warning">Alert: Creeper activity detected</span>', '');
                        setTimeout(() => {
                            this.addTerminalLine('Continuing scan...', '');
                            setTimeout(() => {
                                this.addTerminalLine('Scan complete. Results:', 'success');
                                this.addTerminalLine('Creeper activity detected in sectors 4, 7, and 12.');
                                this.addTerminalLine('Unusual movement patterns observed in sector 7.');
                                this.addTerminalLine('Recommend immediate investigation of sector 7.', 'warning');
                                
                                // Update map with creeper activity
                                if (window.colonyMap) {
                                    window.colonyMap.markSectorStatus(4, 'warning');
                                    window.colonyMap.markSectorStatus(7, 'danger');
                                    window.colonyMap.markSectorStatus(12, 'warning');
                                }
                            }, 500);
                        }, 400);
                    }, 400);
                }, 300);
            }, 300);
        }, 1000);
    }
    
    showHistory() {
        this.addTerminalLine('Retrieving mission history...', '');
        
        setTimeout(() => {
            this.addTerminalLine('Recent missions:', 'success');
            this.addTerminalLine('1. <span class="date">2054-05-13 09:45:22</span> Multiple situation under review. Both expendables confined to quarters.');
            this.addTerminalLine('2. <span class="date">2054-05-13 07:12:18</span> <span class="warning">WARNING: Multiple Mickeys detected. Protocol violation.</span>');
            this.addTerminalLine('3. <span class="date">2054-05-13 06:30:44</span> Mickey #7 returned to base. Reported unusual creeper behavior.');
            this.addTerminalLine('4. <span class="date">2054-05-12 13:15:09</span> Initiated printing of Mickey #8.');
            this.addTerminalLine('5. <span class="date">2054-05-12 11:47:32</span> <span class="warning">Lost contact with Mickey #7 after falling into ice crevasse.</span>');
            this.addTerminalLine('6. <span class="date">2054-05-12 08:23:17</span> Mickey #7 dispatched to sector 12 for routine creeper activity monitoring.');
        }, 500);
    }
    
    showResources() {
        this.addTerminalLine('Colony resources at 67% capacity.');
        this.addTerminalLine('Food: <span class="success">73%</span> (42 days remaining)');
        this.addTerminalLine('Water: <span class="success">89%</span> (65 days remaining)');
        this.addTerminalLine('Fuel: <span class="warning">58%</span> (31 days remaining)');
        this.addTerminalLine('Medical supplies: <span class="error">44%</span> (CRITICAL)', 'warning');
        this.addTerminalLine('Oxygen generation: <span class="success">96%</span> capacity');
        this.addTerminalLine('Spare parts: <span class="warning">52%</span> of minimum recommended inventory');
        this.addTerminalLine('Expendable printing materials: <span class="success">78%</span> (capacity for 4 more prints)');
    }
    
    showWeather() {
        this.addTerminalLine('Current weather conditions:');
        this.addTerminalLine('Temperature: -48°C');
        this.addTerminalLine('Wind: 37 km/h from NE');
        this.addTerminalLine('Visibility: Poor (ice storm approaching)');
        this.addTerminalLine('Barometric pressure: 876 hPa (falling)');
        this.addTerminalLine('Precipitation: Light snowfall (2cm/hour)');
        this.addTerminalLine('UV index: Low');
        
        this.addTerminalLine('Forecast:', 'success');
        this.addTerminalLine('Next 24 hours: Continued blizzard conditions, temperatures dropping to -56°C');
        this.addTerminalLine('48-72 hours: Storm clearing, temperatures steady at -42°C');
        this.addTerminalLine('WARNING: Outdoor missions not recommended for next 48 hours', 'warning');
        this.addTerminalLine('ALERT: Whiteout conditions expected in 4-6 hours, duration 18+ hours', 'error');
    }
    
    triggerAlert() {
        this.addTerminalLine('ALERT SYSTEM ACTIVATED', 'error');
        document.getElementById('alert-modal').style.display = 'flex';
        document.getElementById('alert-modal').classList.add('open');
    }
    
    clearTerminal() {
        this.terminalContent.innerHTML = '';
        this.addTerminalLine('Terminal cleared.', 'success');
    }
    
    handleTerminate(args) {
        if (args.length < 2) {
            this.addTerminalLine('Please specify which expendable to terminate: "terminate 7" or "terminate 8"');
            return;
        }
        
        const expendableId = args[1];
        if (expendableId === '7' || expendableId === '8') {
            this.addTerminalLine(`WARNING: Termination protocol initiated for Mickey #${expendableId}`, 'warning');
            
            setTimeout(() => {
                this.addTerminalLine('ERROR: Termination requires authorization from colony leader', 'error');
                this.addTerminalLine('Hint: Use "override niflheim" command with proper authorization');
            }, 1500);
        } else {
            this.addTerminalLine(`Invalid expendable ID: ${expendableId}`, 'error');
            this.addTerminalLine('Available expendables: 7, 8');
        }
    }
    
    handleOverride(args) {
        if (args.length < 2) {
            this.addTerminalLine('Override code required. Please enter in format: "override [code]"');
            return;
        }
        
        const code = args[1].toLowerCase();
        if (code === 'niflheim') {
            this.addTerminalLine('Override accepted. Administrator privileges granted.', 'success');
            this.addTerminalLine('All systems unlocked. Proceed with caution.', 'warning');
            this.addTerminalLine('Multiple expendable protocol disabled.');
            document.getElementById('expendable-count').classList.remove('warning');
            
            // Update protocol button text
            const protocolBtn = document.getElementById('protocol-btn');
            if (protocolBtn) {
                protocolBtn.querySelector('.btn-text').textContent = 'Protocols [ADMIN]';
            }
        } else {
            this.addTerminalLine(`Invalid override code: ${code}`, 'error');
            this.addTerminalLine('Access denied. Security alert logged.');
        }
    }
    
    showMap() {
        this.addTerminalLine('Displaying colony sector map...');
        this.addTerminalLine('Map is available in the Colony Map panel.');
        
        // Highlight the map section
        const mapSection = document.querySelector('.colony-map-section');
        if (mapSection) {
            mapSection.style.boxShadow = '0 0 20px var(--highlight-glow)';
            setTimeout(() => {
                mapSection.style.boxShadow = '';
            }, 3000);
        }
    }
    
    deployExpendable() {
        this.addTerminalLine('Opening mission deployment interface...');
        document.getElementById('mission-modal').style.display = 'flex';
        document.getElementById('mission-modal').classList.add('open');
    }
    
    contactCreepers() {
        this.addTypedTerminalLine('Attempting to establish communication with creepers...', '', 20);
        
        setTimeout(() => {
            this.addTerminalLine('Configuring transmission frequency...', '');
            setTimeout(() => {
                this.addTerminalLine('Broadcasting greeting signals on all channels...', '');
                setTimeout(() => {
                    this.addTerminalLine('Monitoring for response...', '');
                    setTimeout(() => {
                        this.addTerminalLine('Unusual sonic patterns detected. Possible intelligent response.', 'warning');
                        setTimeout(() => {
                            this.addTerminalLine('Communication attempt analysis:', 'success');
                            this.addTerminalLine('- Non-random pattern detected in return signals');
                            this.addTerminalLine('- 78% certainty of intelligent origin');
                            this.addTerminalLine('- Mathematical sequence identified in response');
                            this.addTerminalLine('- Recommend further contact attempts with Mickey #7 present');
                        }, 800);
                    }, 1000);
                }, 800);
            }, 800);
        }, 1000);
    }
    
    showMissionDetails() {
        this.addTerminalLine('Active missions:', 'success');
        this.addTerminalLine('MISSION #54-23: Creeper reconnaissance', '');
        this.addTerminalLine('- Assigned to: Mickey #7');
        this.addTerminalLine('- Status: In progress');
        this.addTerminalLine('- Location: Sector 4-B (Eastern Ice Shelf)');
        this.addTerminalLine('- Objective: Observe creeper behavior patterns');
        this.addTerminalLine('- Started: 2054-05-13 14:22:36');
        this.addTerminalLine('- Expected completion: 2054-05-13 22:30:00');
        this.addTerminalLine('- Last check-in: 18 minutes ago');
        this.addTerminalLine('- Mission notes: Investigate unusual thermal signatures detected during scan.');
    }
    
    showExpendableDetails() {
        this.addTerminalLine('Expendable status:', 'success');
        
        this.addTerminalLine('Mickey Barnes #7:', '');
        this.addTerminalLine('- Status: <span class="success">Active</span>');
        this.addTerminalLine('- Health: 87%');
        this.addTerminalLine('- Energy: 65%');
        this.addTerminalLine('- Memory integrity: 92%');
        this.addTerminalLine('- Current mission: Creeper reconnaissance (Sector 4-B)');
        this.addTerminalLine('- Print date: 2054-03-17');
        this.addTerminalLine('- Anomalies: <span class="warning">Unusual cognitive patterns detected</span>');
        
        this.addTerminalLine('Mickey Barnes #8:', '');
        this.addTerminalLine('- Status: <span class="success">Active</span>');
        this.addTerminalLine('- Health: 100%');
        this.addTerminalLine('- Energy: 95%');
        this.addTerminalLine('- Memory integrity: 98%');
        this.addTerminalLine('- Current mission: None (confined to quarters)');
        this.addTerminalLine('- Print date: 2054-05-12');
        this.addTerminalLine('- Anomalies: None detected');
        
        this.addTerminalLine('WARNING: Multiple Mickeys detected. Protocol violation.', 'warning');
    }
}

// Initialize terminal when script loads
const terminal = new Terminal();

// Export for use in other modules
window.terminal = terminal;