from flask import Flask, render_template, request, jsonify
import numpy as np
from dotenv import load_dotenv
import os
import requests
import logging

load_dotenv()
NASA_API_KEY = os.getenv("NASA_API_KEY")

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Physics constants
PHYSICS_CONSTANTS = {
    'G': 6.67430e-11,  # Gravitational constant
    'c': 299792458,    # Speed of light (m/s)
    'h': 6.62607015e-34,  # Planck constant
    'k_B': 1.380649e-23,  # Boltzmann constant
    'pi': np.pi
}

# ---------------- Home ----------------
@app.route('/')
def index():
    return render_template('index.html')

# ---------------- Thermodynamics ----------------
@app.route('/thermodynamics', methods=['GET', 'POST'])
def thermodynamics():
    efficiency = None
    T1 = T2 = None
    error_message = None
    
    # Thermodynamic laws and explanations
    laws = [
        {
            'law': 'First Law of Thermodynamics',
            'statement': 'Energy cannot be created or destroyed, only transferred or converted from one form to another.',
            'description': 'This law is a version of the law of conservation of energy, adapted for thermodynamic systems.',
            'equation': 'ΔU = Q - W'
        },
        {
            'law': 'Second Law of Thermodynamics',
            'statement': 'Entropy of an isolated system always increases over time.',
            'description': 'This law explains the natural tendency of systems to evolve towards thermodynamic equilibrium or maximum entropy.',
            'equation': 'ΔS ≥ 0'
        },
        {
            'law': 'Third Law of Thermodynamics',
            'statement': 'As temperature approaches absolute zero, the entropy of a system approaches a constant minimum.',
            'description': 'At absolute zero (0 K), the system should theoretically be in a state of perfect order, meaning zero entropy.',
            'equation': 'lim(T→0) S = S₀'
        }
    ]
    
    if request.method == 'POST':
        try:
            T1 = float(request.form.get('T1', 0))
            T2 = float(request.form.get('T2', 0))
            
            # Validation
            if T1 <= 0 or T2 <= 0:
                error_message = "Temperatures must be positive (above absolute zero)"
            elif T1 <= T2:
                error_message = "Hot reservoir temperature (T1) must be greater than cold reservoir temperature (T2)"
            else:
                # Carnot efficiency calculation
                efficiency = 1 - (T2 / T1)
                efficiency_percent = efficiency * 100
                
        except (ValueError, TypeError):
            error_message = "Please enter valid numerical values for temperatures"
    
    return render_template('thermodynamics.html', 
                         efficiency=efficiency, 
                         T1=T1, 
                         T2=T2, 
                         laws=laws,
                         error_message=error_message)

# ---------------- Quantum Mechanics ----------------
@app.route('/quantum', methods=['GET', 'POST'])
def quantum():
    n = int(request.args.get('n', 1))
    L = float(request.args.get('L', 1))
    
    # Ensure n is positive
    n = max(1, n)
    L = max(0.1, L)  # Prevent division by zero
    
    try:
        x = np.linspace(0, L, 500)
        # Particle in a box wavefunction
        psi = np.sqrt(2/L) * np.sin(n * np.pi * x / L)
        # Energy levels
        energy = (n**2 * np.pi**2 * PHYSICS_CONSTANTS['h']**2) / (2 * 9.109e-31 * L**2)  # Using electron mass
        
        # Probability density
        psi_squared = psi**2
        
    except Exception as e:
        logger.error(f"Error in quantum calculation: {e}")
        x = [0, 1]
        psi = [0, 0]
        psi_squared = [0, 0]
        energy = 0
    
    return render_template('quantum.html', 
                         x=x.tolist(), 
                         psi=psi.tolist(),
                         psi_squared=psi_squared.tolist(),
                         energy=energy, 
                         n=n, 
                         L=L)

# ---------------- General Relativity ----------------
@app.route('/relativity', methods=['GET', 'POST'])
def relativity():
    mass = float(request.args.get('mass', 1.0))
    
    # Ensure positive mass
    mass = max(0.001, mass)
    
    try:
        # Schwarzschild radius calculation
        schwarzschild_radius = 2 * PHYSICS_CONSTANTS['G'] * mass / PHYSICS_CONSTANTS['c']**2
        
        # Time dilation factor (for objects near the event horizon)
        time_dilation = 1 / np.sqrt(1 - schwarzschild_radius / (2 * schwarzschild_radius))
        
        # Escape velocity
        escape_velocity = np.sqrt(2 * PHYSICS_CONSTANTS['G'] * mass / schwarzschild_radius)
        
    except Exception as e:
        logger.error(f"Error in relativity calculation: {e}")
        schwarzschild_radius = 0
        time_dilation = 1
        escape_velocity = 0
    
    return render_template('relativity.html', 
                         mass=mass, 
                         radius=schwarzschild_radius,
                         time_dilation=time_dilation,
                         escape_velocity=escape_velocity)

# ---------------- Cosmology ----------------
@app.route('/cosmology', methods=['GET', 'POST'])
def cosmology():
    apod = None
    api_error = None
    
    # Try to get NASA APOD
    if NASA_API_KEY:
        try:
            url = f"https://api.nasa.gov/planetary/apod?api_key={NASA_API_KEY}"  # Fixed URL
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            apod = response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"NASA API error: {e}")
            api_error = "Could not fetch NASA image of the day"
        except Exception as e:
            logger.error(f"Error processing NASA API response: {e}")
            api_error = "Error processing NASA data"
    else:
        api_error = "NASA API key not configured"
    
    # Hubble's Law calculations
    H0 = float(request.args.get('H0', 70.0))  # km/s/Mpc
    distance = float(request.args.get('distance', 1000.0))  # Mpc
    
    try:
        # Recession velocity
        velocity = H0 * distance
        
        # Age of universe (simplified calculation)
        age_universe = 1 / (H0 * 1e3 / 3.086e22) / (365.25 * 24 * 3600)  # in years
        
        # Critical density
        critical_density = 3 * (H0 * 1e3 / 3.086e22)**2 / (8 * np.pi * PHYSICS_CONSTANTS['G'])
        
    except Exception as e:
        logger.error(f"Error in cosmology calculation: {e}")
        velocity = 0
        age_universe = 0
        critical_density = 0
    
    return render_template('cosmology.html', 
                         H0=H0, 
                         distance=distance, 
                         velocity=velocity, 
                         age_universe=age_universe,
                         critical_density=critical_density,
                         apod=apod,
                         api_error=api_error)

# ---------------- API Endpoints ----------------
@app.route('/api/calculate', methods=['POST'])
def api_calculate():
    """API endpoint for calculations"""
    data = request.get_json()
    calculation_type = data.get('type')
    params = data.get('params', {})
    
    try:
        if calculation_type == 'thermodynamics':
            T1, T2 = params['T1'], params['T2']
            if T1 > T2 > 0:
                efficiency = 1 - (T2 / T1)
                return jsonify({'efficiency': efficiency, 'success': True})
            else:
                return jsonify({'error': 'Invalid temperatures', 'success': False})
        
        # Add more calculation types as needed
        
    except Exception as e:
        return jsonify({'error': str(e), 'success': False})
    
    return jsonify({'error': 'Unknown calculation type', 'success': False})

# ---------------- Error Handlers ----------------
@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

# ---------------- Run ----------------
if __name__ == '__main__':
    app.run(debug=True)