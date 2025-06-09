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

// Cosmic Timeline JavaScript - Add to static/js/script.js

// Cosmic Timeline Data
const cosmicEpochs = {
    'big-bang': {
        title: 'The Big Bang',
        time: 'Time = 0',
        temperature: '∞',
        description: `
            <p>The Big Bang marks the beginning of our universe as we know it. At this moment, all matter, energy, space, and time began from an infinitely hot, dense point called a singularity.</p>
            
            <h4>What We Know:</h4>
            <ul>
                <li>All fundamental forces were unified</li>
                <li>Space and time began expanding</li>
                <li>Temperature and density were infinite</li>
                <li>The universe was smaller than a subatomic particle</li>
            </ul>
            
            <h4>Leading Theories:</h4>
            <ul>
                <li><strong>Quantum Fluctuations:</strong> Random quantum events in a pre-existing quantum vacuum</li>
                <li><strong>Cyclic Models:</strong> Our universe is part of an endless cycle of expansion and contraction</li>
                <li><strong>Multiverse Theory:</strong> Our Big Bang was one of many in a larger multiverse</li>
                <li><strong>String Theory:</strong> Colliding higher-dimensional "branes" triggered our universe's birth</li>
            </ul>
        `,
        stats: {
            'Age': '0 seconds',
            'Temperature': 'Infinite',
            'Size': 'Singularity',
            'Density': 'Infinite'
        }
    },
    
    'inflation': {
        title: 'Cosmic Inflation',
        time: '10⁻³⁶ to 10⁻³² seconds',
        temperature: '10²⁸ K',
        description: `
            <p>Inflation is a period of exponential expansion that occurred in the first fraction of a second. The universe expanded faster than the speed of light, growing by a factor of at least 10²⁶.</p>
            
            <h4>What Happened:</h4>
            <ul>
                <li>Universe expanded exponentially</li>
                <li>Quantum fluctuations stretched to cosmic scales</li>
                <li>Temperature dropped dramatically</li>
                <li>Universe became flat and homogeneous</li>
            </ul>
            
            <h4>Evidence for Inflation:</h4>
            <ul>
                <li>Cosmic microwave background uniformity</li>
                <li>Flatness of space</li>
                <li>Absence of magnetic monopoles</li>
                <li>Large-scale structure patterns</li>
            </ul>
        `,
        stats: {
            'Duration': '10⁻³⁶ seconds',
            'Expansion Factor': '> 10²⁶',
            'Temperature': '10²⁸ K',
            'Size': 'Grapefruit sized'
        }
    },
    
    'particle-soup': {
        title: 'Particle Era',
        time: '1 second after Big Bang',
        temperature: '10¹⁰ K',
        description: `
            <p>The universe was a hot, dense soup of fundamental particles and antiparticles. Protons and neutrons began to form from quarks and gluons.</p>
            
            <h4>Key Events:</h4>
            <ul>
                <li>Quarks combined to form protons and neutrons</li>
                <li>Matter slightly outnumbered antimatter</li>
                <li>Weak nuclear force separated from electromagnetic force</li>
                <li>Neutrinos decoupled from matter</li>
            </ul>
            
            <h4>Particles Present:</h4>
            <ul>
                <li>Protons and neutrons</li>
                <li>Electrons and positrons</li>
                <li>Neutrinos and photons</li>
                <li>Small amounts of antimatter</li>
            </ul>
        `,
        stats: {
            'Age': '1 second',
            'Temperature': '10¹⁰ K',
            'Density': '10⁵ g/cm³',
            'Main Components': 'Particles & radiation'
        }
    },
    
    'nucleosynthesis': {
        title: 'Big Bang Nucleosynthesis',
        time: '3-20 minutes after Big Bang',
        temperature: '10⁹ K',
        description: `
            <p>The first atomic nuclei formed as the universe cooled enough for protons and neutrons to stick together. This created the light elements we observe today.</p>
            
            <h4>Elements Formed:</h4>
            <ul>
                <li><strong>Hydrogen:</strong> ~75% of all matter</li>
                <li><strong>Helium-4:</strong> ~25% of all matter</li>
                <li><strong>Deuterium:</strong> Heavy hydrogen isotope</li>
                <li><strong>Lithium-7:</strong> Tiny amounts</li>
            </ul>
            
            <h4>Why No Heavier Elements?</h4>
            <p>The universe expanded and cooled too quickly for nuclear reactions to create elements heavier than lithium. These would have to wait for the first stars.</p>
        `,
        stats: {
            'Duration': '17 minutes',
            'Temperature': '10⁹ K',
            'Hydrogen Created': '75%',
            'Helium Created': '25%'
        }
    },
    
    'recombination': {
        title: 'Recombination & CMB',
        time: '380,000 years after Big Bang',
        temperature: '3,000 K',
        description: `
            <p>The universe cooled enough for electrons to combine with nuclei, forming the first neutral atoms. This made the universe transparent to light for the first time.</p>
            
            <h4>What Happened:</h4>
            <ul>
                <li>First neutral hydrogen atoms formed</li>
                <li>Universe became transparent</li>
                <li>Cosmic Microwave Background was released</li>
                <li>Photons could travel freely through space</li>
            </ul>
            
            <h4>The Cosmic Microwave Background:</h4>
            <p>The CMB is the afterglow of this event - the oldest light in the universe that we can observe today. It shows tiny temperature fluctuations that would later grow into galaxies.</p>
        `,
        stats: {
            'Age': '380,000 years',
            'Temperature': '3,000 K',
            'CMB Temperature Today': '2.7 K',
            'First Atoms': 'Hydrogen & Helium'
        }
    },
    
    'dark-ages': {
        title: 'The Dark Ages',
        time: '380,000 - 400 million years',
        temperature: '100 K',
        description: `
            <p>A period when the universe had no light sources. The CMB had faded, and the first stars had not yet formed. The universe was filled with neutral hydrogen gas.</p>
            
            <h4>Characteristics:</h4>
            <ul>
                <li>No stars or galaxies existed</li>
                <li>Universe filled with neutral hydrogen</li>
                <li>Dark matter began forming structures</li>
                <li>Gravity slowly pulled matter together</li>
            </ul>
            
            <h4>Structure Formation:</h4>
            <p>Although dark, this period was crucial. Dark matter was clumping together under gravity, creating the scaffolding upon which the first stars and galaxies would form.</p>
        `,
        stats: {
            'Duration': '400 million years',
            'Temperature': '100 K → 20 K',
            'Light Sources': 'None',
            'Main Process': 'Structure formation'
        }
    },
    
    'first-stars': {
        title: 'First Stars (Population III)',
        time: '400 million years after Big Bang',
        temperature: '20 K',
        description: `
            <p>The first stars were massive, bright, and short-lived. Made only of hydrogen and helium, they were very different from modern stars.</p>
            
            <h4>Properties of First Stars:</h4>
            <ul>
                <li><strong>Mass:</strong> 100-1000 times our Sun</li>
                <li><strong>Composition:</strong> Only hydrogen and helium</li>
                <li><strong>Lifetime:</strong> Just a few million years</li>
                <li><strong>Death:</strong> Massive supernovae or direct black hole collapse</li>
            </ul>
            
            <h4>Their Legacy:</h4>
            <ul>
                <li>Created the first heavy elements in their cores</li>
                <li>Reionized the universe with their intense radiation</li>
                <li>Seeded space with metals for future star formation</li>
                <li>Formed the first stellar-mass black holes</li>
            </ul>
        `,
        stats: {
            'First Stars Age': '400 million years',
            'Typical Mass': '100-1000 M☉',
            'Lifetime': '2-10 million years',
            'Elements Created': 'Carbon to iron'
        }
    },
    
    'galaxy-formation': {
        title: 'Galaxy Formation',
        time: '1-2 billion years after Big Bang',
        temperature: '10 K',
        description: `
            <p>Dark matter halos merged and grew, capturing gas that cooled and formed the first galaxies. These early galaxies were smaller and more chaotic than modern ones.</p>
            
            <h4>Formation Process:</h4>
            <ul>
                <li>Dark matter halos merged hierarchically</li>
                <li>Gas fell into gravitational wells</li>
                <li>Star formation proceeded in bursts</li>
                <li>Supermassive black holes began growing</li>
            </ul>
            
            <h4>Types of Early Galaxies:</h4>
            <ul>
                <li><strong>Starburst Galaxies:</strong> Rapid, intense star formation</li>
                <li><strong>Dwarf Galaxies:</strong> Small but numerous</li>
                <li><strong>Protogalaxies:</strong> Irregular, gas-rich systems</li>
            </ul>
        `,
        stats: {
            'First Galaxies': '1 billion years',
            'Typical Mass': '10⁸-10¹⁰ M☉',
            'Star Formation Rate': '10-100 M☉/year',
            'Gas Fraction': '50-90%'
        }
    },
    
    'solar-system': {
        title: 'Solar System Formation',
        time: '4.6 billion years ago',
        temperature: 'Variable',
        description: `
            <p>Our Solar System formed from the collapse of a molecular cloud enriched with heavy elements from previous generations of stars.</p>
            
            <h4>Formation Timeline:</h4>
            <ul>
                <li><strong>0-1 million years:</strong> Gravitational collapse and disk formation</li>
                <li><strong>1-10 million years:</strong> Planetesimal formation</li>
                <li><strong>10-100 million years:</strong> Planetary accretion</li>
                <li><strong>100-500 million years:</strong> Late heavy bombardment</li>
            </ul>
            
            <h4>Key Processes:</h4>
            <ul>
                <li>Dust grains stuck together to form planetesimals</li>
                <li>Rocky planets formed in the inner system</li>
                <li>Gas giants captured atmospheres beyond the frost line</li>
                <li>Leftover debris became asteroids and comets</li>
            </ul>
        `,
        stats: {
            'Formation Time': '4.6 billion years ago',
            'Duration': '500 million years',
            'Planets Formed': '8 major planets',
            'Current Age': '4.6 billion years'
        }
    },
    
    'life-earth': {
        title: 'Life on Earth',
        time: '3.5-4 billion years ago',
        temperature: '15°C (Earth surface)',
        description: `
            <p>Life emerged on Earth relatively quickly after the planet formed, beginning with simple single-celled organisms and eventually evolving into complex multicellular life.</p>
            
            <h4>Major Milestones:</h4>
            <ul>
                <li><strong>4.0 Ga:</strong> Possible earliest life (disputed)</li>
                <li><strong>3.5 Ga:</strong> Definitive evidence of life (stromatolites)</li>
                <li><strong>2.4 Ga:</strong> Great Oxidation Event</li>
                <li><strong>1.5 Ga:</strong> First eukaryotic cells</li>
                <li><strong>540 Ma:</strong> Cambrian explosion</li>
            </ul>
            
            <h4>Astrobiology Implications:</h4>
            <p>The rapid emergence of life on Earth suggests that life might be common in the universe, given suitable conditions.</p>
        `,
        stats: {
            'First Life': '3.5-4.0 billion years ago',
            'Oxygen Atmosphere': '2.4 billion years ago',
            'Complex Cells': '1.5 billion years ago',
            'Current Diversity': '8.7 million species'
        }
    },
    
    'dark-energy': {
        title: 'Dark Energy Domination',
        time: '5 billion years ago',
        temperature: '2.7 K (CMB)',
        description: `
            <p>Around 5 billion years ago, dark energy began to dominate the universe's energy budget, causing the expansion to accelerate rather than slow down.</p>
            
            <h4>The Transition:</h4>
            <ul>
                <li>Matter density decreased due to expansion</li>
                <li>Dark energy density remained constant</li>
                <li>Universe transitioned from deceleration to acceleration</li>
                <li>Large-scale structure formation slowed</li>
            </ul>
            
            <h4>What is Dark Energy?</h4>
            <ul>
                <li>Makes up ~68% of the universe today</li>
                <li>Causes space itself to expand faster</li>
                <li>Nature remains one of physics' biggest mysteries</li>
                <li>Possible explanations: vacuum energy, modified gravity, or new fields</li>
            </ul>
        `,
        stats: {
            'Transition': '5 billion years ago',
            'Dark Energy': '68% of universe',
            'Current Effect': 'Accelerating expansion',
            'Discovery': '1998 (Nobel Prize 2011)'
        }
    },
    
    'present': {
        title: 'Present Day Universe',
        time: '13.8 billion years after Big Bang',
        temperature: '2.7 K (CMB)',
        description: `
            <p>Today's universe is dominated by dark energy and continues to expand and cool. We live in an era of active research and discovery about cosmic evolution.</p>
            
            <h4>Current Research Frontiers:</h4>
            <ul>
                <li><strong>Dark Matter:</strong> Searching for particles and mapping cosmic web</li>
                <li><strong>Dark Energy:</strong> Understanding its nature and future effects</li>
                <li><strong>Gravitational Waves:</strong> New window into cosmic events</li>
                <li><strong>Exoplanets:</strong> Searching for life beyond Earth</li>
                <li><strong>Early Universe:</strong> James Webb Space Telescope observations</li>
            </ul>
            
            <h4>Future Outlook:</h4>
            <ul>
                <li>Continued expansion and cooling</li>
                <li>Star formation will eventually cease</li>
                <li>Galaxies will drift apart</li>
                <li>Ultimate fate depends on dark energy</li>
            </ul>
            
            <h4>Major Missions & Discoveries:</h4>
            <ul>
                <li>Hubble Space Telescope</li>
                <li>Planck CMB mission</li>
                <li>LIGO gravitational wave detection</li>
                <li>Event Horizon Telescope (black hole imaging)</li>
                <li>James Webb Space Telescope</li>
            </ul>
        `,
        stats: {
            'Universe Age': '13.8 billion years',
            'Observable Diameter': '93 billion light-years',
            'Dark Energy': '68%',
            'Matter (Dark + Normal)': '32%'
        }
    }
};

// Initialize Cosmic Timeline when DOM is loaded
function initializeCosmicTimeline() {
    // Only initialize if we're on the cosmology page and timeline exists
    if (!document.querySelector('.cosmic-timeline-section')) {
        return;
    }
    
    // Add click events to timeline epochs
    const epochs = document.querySelectorAll('.timeline-epoch');
    const modal = document.getElementById('epoch-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (!modal || !closeModal) {
        console.error('Timeline modal elements not found');
        return;
    }
    
    epochs.forEach(epoch => {
        epoch.addEventListener('click', function() {
            const epochId = this.getAttribute('data-epoch');
            showEpochDetails(epochId);
        });
    });
    
    // Close modal events
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Timeline controls
    const zoomOutBtn = document.getElementById('timeline-zoom-out');
    const zoomInBtn = document.getElementById('timeline-zoom-in');
    const resetBtn = document.getElementById('timeline-reset');
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => adjustTimelineZoom(0.8));
    }
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => adjustTimelineZoom(1.2));
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', () => resetTimelineView());
    }
    
    console.log('Cosmic Timeline initialized successfully!');
}

function showEpochDetails(epochId) {
    const epoch = cosmicEpochs[epochId];
    if (!epoch) {
        console.error('Epoch not found:', epochId);
        return;
    }
    
    const modal = document.getElementById('epoch-modal');
    const detailsContainer = document.getElementById('epoch-details');
    
    if (!modal || !detailsContainer) {
        console.error('Modal elements not found');
        return;
    }
    
    // Build stats HTML
    const statsHTML = Object.entries(epoch.stats)
        .map(([label, value]) => `
            <div class="stat-item">
                <div class="stat-label">${label}</div>
                <div class="stat-value">${value}</div>
            </div>
        `).join('');
    
    detailsContainer.innerHTML = `
        <h3>${epoch.title}</h3>
        <p><strong>Time:</strong> ${epoch.time}</p>
        
        <div class="epoch-stats">
            ${statsHTML}
        </div>
        
        <div class="epoch-description">
            ${epoch.description}
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Add fade-in animation
    detailsContainer.style.opacity = '0';
    setTimeout(() => {
        detailsContainer.style.transition = 'opacity 0.3s ease';
        detailsContainer.style.opacity = '1';
    }, 50);
}

function adjustTimelineZoom(factor) {
    const track = document.querySelector('.timeline-track');
    if (!track) return;
    
    const currentWidth = parseInt(track.style.width) || 1000;
    const newWidth = Math.max(800, Math.min(3000, currentWidth * factor));
    track.style.width = newWidth + 'px';
    
    // Add smooth transition
    track.style.transition = 'width 0.3s ease';
    setTimeout(() => {
        track.style.transition = '';
    }, 300);
}

function resetTimelineView() {
    const track = document.querySelector('.timeline-track');
    const container = document.querySelector('.timeline-container');
    
    if (track) {
        track.style.width = '1000px';
        track.style.transition = 'width 0.3s ease';
        setTimeout(() => {
            track.style.transition = '';
        }, 300);
    }
    
    if (container) {
        container.scrollLeft = 0;
    }
}

// Keyboard navigation for timeline
function handleTimelineKeyboard(e) {
    const modal = document.getElementById('epoch-modal');
    if (!modal || modal.style.display !== 'block') return;
    
    if (e.key === 'Escape') {
        modal.style.display = 'none';
        e.preventDefault();
    }
    
    // Arrow key navigation between epochs
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        navigateEpochs(e.key === 'ArrowRight' ? 1 : -1);
        e.preventDefault();
    }
}

function navigateEpochs(direction) {
    const epochKeys = Object.keys(cosmicEpochs);
    const currentTitle = document.querySelector('#epoch-details h3');
    
    if (!currentTitle) return;
    
    const currentIndex = epochKeys.findIndex(key => 
        cosmicEpochs[key].title === currentTitle.textContent
    );
    
    if (currentIndex !== -1) {
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < epochKeys.length) {
            showEpochDetails(epochKeys[newIndex]);
        }
    }
}

// Add timeline functionality to the main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cosmic timeline
    initializeCosmicTimeline();
    
    // Add keyboard event listener for timeline navigation
    document.addEventListener('keydown', handleTimelineKeyboard);
});

// Export timeline functions for potential external use
if (typeof window.PhysicsApp !== 'undefined') {
    window.PhysicsApp.timeline = {
        showEpochDetails,
        adjustTimelineZoom,
        resetTimelineView,
        navigateEpochs
    };
}

console.log('Cosmic Timeline JavaScript loaded!');