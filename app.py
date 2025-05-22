from flask import Flask, render_template, request
import numpy as np

app = Flask(__name__)

# Home 
@app.route('/')
def index():
    return render_template('index.html')

# Thermodynamics 
@app.route('/thermodynamics', methods=['GET', 'POST'])
def thermodynamics():
    efficiency = None
    T1 = T2 = None
    if request.method == 'POST':
        try:
            T1 = float(request.form['T1'])
            T2 = float(request.form['T2'])
            if T1 > T2 and T1 > 0:
                efficiency = 1 - (T2 / T1)
            else:
                efficiency = -1
        except ValueError:
            efficiency = -1
    return render_template('thermodynamics.html', efficiency=efficiency, T1=T1, T2=T2)

# Quantum Mechanics 
@app.route('/quantum', methods=['GET', 'POST'])
def quantum():
    n = L = 1
    x = np.linspace(0, 1, 500)
    psi = np.sqrt(2) * np.sin(n * np.pi * x)
    energy = (n**2 * np.pi**2) / 2
    return render_template('quantum.html', x=x.tolist(), psi=psi.tolist(), energy=energy, n=n)

# General Relativity
@app.route('/relativity', methods=['GET', 'POST'])
def relativity():
    mass = request.args.get('mass', default=1.0, type=float)
    G = 6.67430e-11
    c = 3e8
    schwarzschild_radius = 2 * G * mass / c**2
    return render_template('relativity.html', mass=mass, radius=schwarzschild_radius)

# Cosmology 
@app.route('/cosmology', methods=['GET', 'POST'])
def cosmology():
    H0 = request.args.get('H0', default=70.0, type=float)  # km/s/Mpc
    distance = request.args.get('distance', default=1000.0, type=float)  # Mpc
    velocity = H0 * distance
    age_universe = 1 / (H0 * 1e3 / (3.086e22)) / (60 * 60 * 24 * 365.25)  # in years
    return render_template('cosmology.html', H0=H0, distance=distance, velocity=velocity, age_universe=age_universe)

# Run 
if __name__ == '__main__':
    app.run(debug=True)
