// static/js/script.js

// Utility Functions
function roundNumber(num, decimals = 2) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function formatScientificNotation(num, decimals = 2) {
    if (Math.abs(num) < 1e-3 || Math.abs(num) >= 1e6) {
        return num.toExponential(decimals);
    }
    return roundNumber(num, decimals);
}

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading"></div>';
    }
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

// Animation and UI Enhancement
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in animation to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.module-card, .result-card, .law-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Initialize page-specific functionality
    initializePageSpecificFeatures();
    
    // Add form validation
    addFormValidation();
    
    // Initialize tooltips
    initializeTooltips();
});

// Page-specific initialization
function initializePageSpecificFeatures() {
    const currentPath = window.location.pathname;
    
    switch(currentPath) {
        case '/thermodynamics':
            initializeThermodynamics();
            break;
        case '/quantum':
            initializeQuantum();
            break;
        case '/relativity':
            initializeRelativity();
            break;
        case '/cosmology':
            initializeCosmology();
            break;
    }
}

// Thermodynamics specific functions
function initializeThermodynamics() {
    const form = document.querySelector('.calculator-form');
    if (!form) return;
    
    // Add real-time calculation
    const inputs = form.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', debounce(calculateThermodynamicsRealTime, 500));
    });
    
    // Add temperature conversion helpers
    addTemperatureConversion();
}

function calculateThermodynamicsRealTime() {
    const T1 = parseFloat(document.getElementById('T1')?.value);
    const T2 = parseFloat(document.getElementById('T2')?.value);
    
    if (T1 && T2 && T1 > T2 && T1 > 0 && T2 > 0) {
        const efficiency = 1 - (T2 / T1);
        showRealTimeResult('Efficiency: ' + roundNumber(efficiency * 100, 2) + '%');
    } else {
        hideRealTimeResult();
    }
}

function addTemperatureConversion() {
    const T1Input = document.getElementById('T1');
    const T2Input = document.getElementById('T2');
    
    if (T1Input) {
        addConversionHelper(T1Input, 'T1');
    }
    if (T2Input) {
        addConversionHelper(T2Input, 'T2');
    }
}

function addConversionHelper(input, id) {
    const helper = document.createElement('div');
    helper.className = 'conversion-helper';
    helper.innerHTML = `
        <small>Convert: 
            <a href="#" onclick="convertToKelvin('${id}', 'celsius')">°C to K</a> | 
            <a href="#" onclick="convertToKelvin('${id}', 'fahrenheit')">°F to K</a>
        </small>
    `;
    input.parentNode.appendChild(helper);
}

function convertToKelvin(inputId, fromUnit) {
    const input = document.getElementById(inputId);
    const value = parseFloat(input.value);
    
    if (isNaN(value)) return;
    
    let kelvin;
    switch(fromUnit) {
        case 'celsius':
            kelvin = value + 273.15;
            break;
        case 'fahrenheit':
            kelvin = (value - 32) * 5/9 + 273.15;
            break;
        default:
            return;
    }
    
    input.value = roundNumber(kelvin, 2);
    input.dispatchEvent(new Event('input'));
}

// Quantum Mechanics specific functions
function initializeQuantum() {
    // Add interactive controls for quantum parameters
    addQuantumSliders();
    
    // Add energy level visualization
    addEnergyLevelDiagram();
}

function addQuantumSliders() {
    const nInput = document.getElementById('n');
    const LInput = document.getElementById('L');
    
    if (nInput) {
        addSlider(nInput, 1, 10, 1);
    }
    if (LInput) {
        addSlider(LInput, 0.1, 5, 0.1);
    }
}

function addSlider(input, min, max, step) {
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = input.value;
    slider.className = 'parameter-slider';
    
    slider.addEventListener('input', function() {
        input.value = this.value;
        input.form.submit();
    });
    
    input.addEventListener('input', function() {
        slider.value = this.value;
    });
    
    input.parentNode.appendChild(slider);
}

function addEnergyLevelDiagram() {
    // This would create an energy level diagram
    // Implementation would depend on available data
    console.log('Energy level diagram initialization');
}

// Relativity specific functions
function initializeRelativity() {
    // Add mass presets for common objects
    addMassPresets();
    
    // Add unit conversions
    addMassUnitConversion();
}

function addMassPresets() {
    const massInput = document.getElementById('mass');
    if (!massInput) return;
    
    const presets = [
        { name: 'Earth', mass: 5.972e24 },
        { name: 'Sun', mass: 1.989e30 },
        { name: 'Milky Way SMBH', mass: 8.2e36 },
        { name: 'Stellar Black Hole (10 M☉)', mass: 1.989e31 }
    ];
    
    const presetDiv = document.createElement('div');
    presetDiv.className = 'mass-presets';
    presetDiv.innerHTML = '<small>Quick presets: ' + 
        presets.map(p => `<a href="#" onclick="setMass(${p.mass})">${p.name}</a>`).join(' | ') + 
        '</small>';
    
    massInput.parentNode.appendChild(presetDiv);
}

function setMass(mass) {
    const massInput = document.getElementById('mass');
    if (massInput) {
        massInput.value = mass;
        massInput.form.submit();
    }
}

function addMassUnitConversion() {
    const massInput = document.getElementById('mass');
    if (!massInput) return;
    
    const conversionDiv = document.createElement('div');
    conversionDiv.className = 'unit-conversion';
    conversionDiv.innerHTML = `
        <small>Convert: 
            <a href="#" onclick="convertMass('solar')">Solar Masses</a> | 
            <a href="#" onclick="convertMass('earth')">Earth Masses</a>
        </small>
    `;
    
    massInput.parentNode.appendChild(conversionDiv);
}

function convertMass(unit) {
    const value = prompt(`Enter mass in ${unit}:`);
    if (!value || isNaN(value)) return;
    
    const massInput = document.getElementById('mass');
    let kg;
    
    switch(unit) {
        case 'solar':
            kg = parseFloat(value) * 1.989e30;
            break;
        case 'earth':
            kg = parseFloat(value) * 5.972e24;
            break;
        default:
            return;
    }
    
    massInput.value = kg;
    massInput.form.submit();
}

// Cosmology specific functions
function initializeCosmology() {
    // Add Hubble constant presets
    addHubblePresets();
    
    // Add distance unit conversions
    addDistanceConversion();
    
    // Initialize APOD image zoom
    initializeImageZoom();
}

function addHubblePresets() {
    const h0Input = document.getElementById('H0');
    if (!h0Input) return;
    
    const presets = [
        { name: 'Planck 2018', value: 67.4 },
        { name: 'HST Key Project', value: 72 },
        { name: 'WMAP', value: 70.0 },
        { name: 'Riess et al. 2019', value: 74.0 }
    ];
    
    const presetDiv = document.createElement('div');
    presetDiv.className = 'hubble-presets';
    presetDiv.innerHTML = '<small>H₀ measurements: ' + 
        presets.map(p => `<a href="#" onclick="setHubbleConstant(${p.value})">${p.name}</a>`).join(' | ') + 
        '</small>';
    
    h0Input.parentNode.appendChild(presetDiv);
}

function setHubbleConstant(value) {
    const h0Input = document.getElementById('H0');
    if (h0Input) {
        h0Input.value = value;
        h0Input.form.submit();
    }
}

function addDistanceConversion() {
    const distanceInput = document.getElementById('distance');
    if (!distanceInput) return;
    
    const conversionDiv = document.createElement('div');
    conversionDiv.className = 'distance-conversion';
    conversionDiv.innerHTML = `
        <small>1 Mpc ≈ 3.26 million light-years ≈ 3.086 × 10²² meters</small>
    `;
    
    distanceInput.parentNode.appendChild(conversionDiv);
}

function initializeImageZoom() {
    const apodImage = document.querySelector('.apod-image');
    if (!apodImage) return;
    
    apodImage.style.cursor = 'zoom-in';
    apodImage.addEventListener('click', function() {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <img src="${this.src}" alt="${this.alt}" style="max-width: 90vw; max-height: 90vh;">
            </div>
        `;
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.9); display: flex; justify-content: center; 
            align-items: center; z-index: 10000; cursor: zoom-out;
        `;
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    });
}

// Form validation
function addFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        clearFieldError(input);
        
        if (!input.value.trim()) {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'number') {
            const value = parseFloat(input.value);
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);
            
            if (isNaN(value)) {
                showFieldError(input, 'Please enter a valid number');
                isValid = false;
            } else if (min !== undefined && value < min) {
                showFieldError(input, `Value must be at least ${min}`);
                isValid = false;
            } else if (max !== undefined && value > max) {
                showFieldError(input, `Value must be at most ${max}`);
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function showFieldError(input, message) {
    input.classList.add('error');
    
    // Remove existing error message
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = 'color: #f44336; font-size: 0.875rem; margin-top: 0.25rem;';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
}

function clearFieldError(input) {
    input.classList.remove('error');
    const errorDiv = input.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('mousemove', moveTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = this.getAttribute('data-tooltip');
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        z-index: 10000;
        pointer-events: none;
        max-width: 200px;
    `;
    
    document.body.appendChild(tooltip);
    this.tooltipElement = tooltip;
    moveTooltip.call(this, e);
}

function hideTooltip() {
    if (this.tooltipElement) {
        this.tooltipElement.remove();
        this.tooltipElement = null;
    }
}

function moveTooltip(e) {
    if (this.tooltipElement) {
        this.tooltipElement.style.left = e.pageX + 10 + 'px';
        this.tooltipElement.style.top = e.pageY - 30 + 'px';
    }
}

// Real-time results
function showRealTimeResult(message) {
    let resultDiv = document.getElementById('real-time-result');
    
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'real-time-result';
        resultDiv.className = 'real-time-result';
        resultDiv.style.cssText = `
            background: rgba(52, 152, 219, 0.1);
            border: 1px solid #3498db;
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
            color: #2980b9;
            font-weight: 600;
        `;
        
        const form = document.querySelector('.calculator-form');
        if (form) {
            form.appendChild(resultDiv);
        }
    }
    
    resultDiv.textContent = message;
    resultDiv.style.display = 'block';
}

function hideRealTimeResult() {
    const resultDiv = document.getElementById('real-time-result');
    if (resultDiv) {
        resultDiv.style.display = 'none';
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// API calls for calculations
async function calculateWithAPI(type, params) {
    try {
        showLoading('calculation-result');
        
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: type,
                params: params
            })
        });
        
        const data = await response.json();
        hideLoading('calculation-result');
        
        if (data.success) {
            return data;
        } else {
            throw new Error(data.error || 'Calculation failed');
        }
    } catch (error) {
        hideLoading('calculation-result');
        console.error('API Error:', error);
        showNotification('Calculation error: ' + error.message, 'error');
        return null;
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        max-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    switch(type) {
        case 'error':
            notification.style.background = '#f44336';
            break;
        case 'success':
            notification.style.background = '#4caf50';
            break;
        case 'warning':
            notification.style.background = '#ff9800';
            break;
        default:
            notification.style.background = '#2196f3';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit forms
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeForm = document.querySelector('form:focus-within');
        if (activeForm) {
            activeForm.submit();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const modal = document.querySelector('.image-modal');
        if (modal) {
            modal.remove();
        }
    }
});

// Enhanced plotting functions
function createEnhancedPlot(containerId, data, layout, config = {}) {
    const defaultConfig = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d'],
        displaylogo: false
    };
    
    const defaultLayout = {
        autosize: true,
        margin: { l: 50, r: 50, t: 50, b: 50 },
        paper_bgcolor: 'rgba(255,255,255,0.95)',
        plot_bgcolor: 'rgba(248,249,250,0.5)',
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        ...layout
    };
    
    return Plotly.newPlot(containerId, data, defaultLayout, { ...defaultConfig, ...config });
}

function updatePlot(containerId, update) {
    return Plotly.update(containerId, update);
}

// Export functions for global access
window.PhysicsApp = {
    roundNumber,
    formatScientificNotation,
    showNotification,
    calculateWithAPI,
    createEnhancedPlot,
    updatePlot,
    setMass,
    setHubbleConstant,
    convertToKelvin,
    convertMass
};

// Dark mode toggle (bonus feature)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Add dark mode styles
const darkModeStyles = `
    .dark-mode {
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    }
    
    .dark-mode .main-header {
        background: rgba(0, 0, 0, 0.95);
    }
    
    .dark-mode .hero-section,
    .dark-mode .calculator-card,
    .dark-mode .theory-section,
    .dark-mode .law-card,
    .dark-mode .result-card,
    .dark-mode .module-card {
        background: rgba(44, 62, 80, 0.95);
        color: #ecf0f1;
    }
    
    .dark-mode .input-group input {
        background: rgba(52, 73, 94, 0.8);
        color: #ecf0f1;
        border-color: #7f8c8d;
    }
    
    .dark-mode .equation-display {
        background: rgba(52, 73, 94, 0.5);
        color: #ecf0f1;
    }
`;

// Add dark mode styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = darkModeStyles;
document.head.appendChild(styleSheet);

console.log('Physics App JavaScript loaded successfully!');