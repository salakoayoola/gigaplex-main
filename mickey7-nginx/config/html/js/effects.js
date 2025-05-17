// Visual effects and animations
class EffectsManager {
    constructor() {
        this.snowContainer = document.getElementById('snow');
        this.snowflakeCount = 150;
        this.weatherCondition = 'normal'; // normal, storm, blizzard, clear
        
        this.initSnow();
        this.updateWeatherDisplay();
        
        // Set up periodic weather changes
        setInterval(() => {
            this.changeWeather();
        }, 180000); // Every 3 minutes
    }
    
    initSnow() {
        if (!this.snowContainer) return;
        
        // Clear any existing snowflakes
        this.snowContainer.innerHTML = '';
        
        // Create snowflakes
        for (let i = 0; i < this.snowflakeCount; i++) {
            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');
            
            // Random properties
            const size = Math.random() * 5 + 1;
            const posX = Math.random() * window.innerWidth;
            const delay = Math.random() * 10;
            const duration = Math.random() * 10 + 10;
            const opacity = Math.random() * 0.7 + 0.3;
            
            snowflake.style.width = `${size}px`;
            snowflake.style.height = `${size}px`;
            snowflake.style.left = `${posX}px`;
            snowflake.style.animationDuration = `${duration}s`;
            snowflake.style.animationDelay = `${delay}s`;
            snowflake.style.opacity = opacity;
            
            this.snowContainer.appendChild(snowflake);
        }
    }
    
    changeWeather() {
        const conditions = ['normal', 'storm', 'blizzard', 'clear'];
        const weights = [0.4, 0.3, 0.2, 0.1]; // Weighted probabilities
        
        // Don't change to the same condition
        let newCondition;
        do {
            // Select based on weighted probabilities
            const random = Math.random();
            let cumulativeWeight = 0;
            
            for (let i = 0; i < conditions.length; i++) {
                cumulativeWeight += weights[i];
                if (random < cumulativeWeight) {
                    newCondition = conditions[i];
                    break;
                }
            }
        } while (newCondition === this.weatherCondition);
        
        this.weatherCondition = newCondition;
        this.updateWeatherDisplay();
        
        // Log to terminal if available
        if (window.terminal) {
            let message;
            
            switch (this.weatherCondition) {
                case 'normal':
                    message = 'Weather update: Standard winter conditions. Light snowfall, wind 15-25 km/h.';
                    break;
                case 'storm':
                    message = 'Weather update: Storm approaching. Increased snowfall, wind 35-50 km/h.';
                    break;
                case 'blizzard':
                    message = 'ALERT: Blizzard conditions detected. Heavy snowfall, wind 60-80 km/h. Whiteout conditions likely.';
                    break;
                case 'clear':
                    message = 'Weather update: Conditions clearing. Minimal snowfall, improved visibility.';
                    break;
            }
            
            window.terminal.addTerminalLine(message, this.weatherCondition === 'blizzard' ? 'warning' : '');
            
            // Update temperature
            const baseTemp = -48;
            let tempAdjustment = 0;
            
            switch (this.weatherCondition) {
                case 'storm':
                    tempAdjustment = -5 - Math.floor(Math.random() * 5);
                    break;
                case 'blizzard':
                    tempAdjustment = -10 - Math.floor(Math.random() * 8);
                    break;
                case 'clear':
                    tempAdjustment = 5 + Math.floor(Math.random() * 5);
                    break;
            }
            
            const newTemp = baseTemp + tempAdjustment;
            document.getElementById('temperature').textContent = `${newTemp}°C`;
        }
    }
    
    updateWeatherDisplay() {
        // Adjust snow animation and appearance based on weather
        const snowflakes = document.querySelectorAll('.snowflake');
        
        snowflakes.forEach(snowflake => {
            // Reset any existing classes
            snowflake.classList.remove('storm', 'blizzard', 'clear');
            
            // Apply new weather condition
            if (this.weatherCondition !== 'normal') {
                snowflake.classList.add(this.weatherCondition);
            }
            
            // Adjust animation properties
            let durationMultiplier = 1;
            let opacityMultiplier = 1;
            
            switch (this.weatherCondition) {
                case 'storm':
                    durationMultiplier = 0.7; // Faster
                    snowflake.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
                    break;
                case 'blizzard':
                    durationMultiplier = 0.4; // Much faster
                    opacityMultiplier = 1.3; // More visible
                    snowflake.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
                    break;
                case 'clear':
                    durationMultiplier = 1.5; // Slower
                    opacityMultiplier = 0.6; // Less visible
                    break;
            }
            
            // Update animation duration
            const baseDuration = parseFloat(snowflake.style.animationDuration);
            snowflake.style.animationDuration = `${baseDuration * durationMultiplier}s`;
            
            // Update opacity
            const baseOpacity = parseFloat(snowflake.style.opacity);
            snowflake.style.opacity = Math.min(1, baseOpacity * opacityMultiplier);
        });
        
        // Apply weather effects to the body
        document.body.dataset.weather = this.weatherCondition;
    }
    
    // Apply typed text effect to an element
    applyTypedText(element, text, speed = 50) {
        if (!element) return;
        
        element.textContent = '';
        
        let i = 0;
        const typeNextChar = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeNextChar, speed);
            }
        };
        
        typeNextChar();
    }
    
    // Add glitch effect to an element
    addGlitchEffect(element, duration = 2000) {
        if (!element) return;
        
        element.classList.add('glitch');
        
        setTimeout(() => {
            element.classList.remove('glitch');
        }, duration);
    }
    
    // Simulate a system error
    simulateSystemError() {
        // Add glitch effect to terminal
        const terminal = document.querySelector('.terminal');
        if (terminal) {
            this.addGlitchEffect(terminal, 3000);
        }
        
        // Add error message to terminal
        if (window.terminal) {
            window.terminal.addTerminalLine('SYSTEM ERROR DETECTED', 'error');
            
            setTimeout(() => {
                window.terminal.addTerminalLine('Attempting to recover...', 'warning');
                
                setTimeout(() => {
                    window.terminal.addTerminalLine('System stabilized. Some data may have been lost.', 'warning');
                }, 2000);
            }, 1500);
        }
        
        // Flicker the lights
        document.body.classList.add('flicker');
        setTimeout(() => {
            document.body.classList.remove('flicker');
        }, 3000);
    }
    
    // Update current date/time
    updateDateTime() {
        const now = new Date();
        const dateElement = document.getElementById('current-date');
        
        if (dateElement) {
            const year = 2054;
            const currentMonth = now.getMonth();
            const currentDay = now.getDate();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentSecond = now.getSeconds();
            
            const formattedDate = `${year}-${String(currentMonth + 1).padStart(2, '0')}-${String(currentDay).padStart(2, '0')} ${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}:${String(currentSecond).padStart(2, '0')}`;
            
            dateElement.textContent = formattedDate;
        }
    }
}

// Initialize effects manager when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    window.effectsManager = new EffectsManager();
    
    // Update date/time every second
    setInterval(() => {
        if (window.effectsManager) {
            window.effectsManager.updateDateTime();
        }
    }, 1000);
    
    // Random system errors occasionally
    setInterval(() => {
        if (window.effectsManager && Math.random() > 0.95) {
            window.effectsManager.simulateSystemError();
        }
    }, 300000); // Every 5 minutes with 5% chance
});