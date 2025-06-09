# setup_static_files.py
import requests
import os
from pathlib import Path

def create_directory_structure():
    """Create the proper directory structure for static files"""
    directories = [
        'static',
        'static/css',
        'static/js',
        'static/images',
        'templates'
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"Created directory: {directory}")

def download_plotly():
    """Download Plotly.js library"""
    print("Downloading Plotly.js...")
    url = "https://cdn.plot.ly/plotly-latest.min.js"
    
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        with open("static/js/plotly-latest.min.js", "wb") as f:
            f.write(response.content)
        
        print("✓ Plotly downloaded to static/js/plotly-latest.min.js")
        
    except requests.RequestException as e:
        print(f"✗ Error downloading Plotly: {e}")
        print("You can manually download it from: https://cdn.plot.ly/plotly-latest.min.js")

def download_additional_libraries():
    """Download additional useful libraries"""
    libraries = [
        {
            "name": "Chart.js",
            "url": "https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js",
            "filename": "static/js/chart.min.js"
        },
        {
            "name": "Math.js",
            "url": "https://unpkg.com/mathjs@11.11.0/lib/browser/math.min.js",
            "filename": "static/js/math.min.js"
        }
    ]
    
    for lib in libraries:
        print(f"Downloading {lib['name']}...")
        try:
            response = requests.get(lib['url'], timeout=30)
            response.raise_for_status()
            
            with open(lib['filename'], "wb") as f:
                f.write(response.content)
            
            print(f"✓ {lib['name']} downloaded to {lib['filename']}")
            
        except requests.RequestException as e:
            print(f"✗ Error downloading {lib['name']}: {e}")

def create_example_env_file():
    """Create an example .env file"""
    env_content = """# Physics Web App Environment Variables
# Get your NASA API key from: https://api.nasa.gov/

NASA_API_KEY=your_nasa_api_key_here

# Flask configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your_secret_key_here

# Optional: Database configuration
# DATABASE_URL=sqlite:///physics_app.db
"""
    
    if not os.path.exists('.env'):
        with open('.env.example', 'w') as f:
            f.write(env_content)
        print("✓ Created .env.example file")
        print("  → Copy this to .env and add your NASA API key")
    else:
        print("✓ .env file already exists")

def create_requirements_file():
    """Create requirements.txt file"""
    requirements = """Flask==2.3.3
python-dotenv==1.0.0
numpy==1.24.3
requests==2.31.0
gunicorn==21.2.0
"""
    
    with open('requirements.txt', 'w') as f:
        f.write(requirements)
    
    print("✓ Created requirements.txt")

def create_gitignore():
    """Create .gitignore file"""
    gitignore_content = """# Environment variables
.env

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Flask
instance/
.webassets-cache

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
"""
    
    if not os.path.exists('.gitignore'):
        with open('.gitignore', 'w') as f:
            f.write(gitignore_content)
        print("✓ Created .gitignore")

def create_readme():
    """Create README.md file"""
    readme_content = """# Physics & Chemistry Web App

An interactive web application for exploring fundamental physics concepts including thermodynamics, quantum mechanics, general relativity, and cosmology.

## Features

- **Thermodynamics**: Calculate Carnot engine efficiency and explore thermodynamic laws
- **Quantum Mechanics**: Visualize particle-in-a-box wavefunctions and energy levels
- **General Relativity**: Compute black hole properties and spacetime effects
- **Cosmology**: Explore universe expansion with Hubble's Law and NASA APOD integration

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and add your NASA API key
   ```

4. Run the application:
   ```bash
   python app.py
   ```

5. Open http://localhost:5000 in your browser

## Getting NASA API Key

1. Visit https://api.nasa.gov/
2. Generate an API key (free)
3. Add it to your .env file

## Technologies Used

- **Backend**: Flask, NumPy
- **Frontend**: HTML5, CSS3, JavaScript, Plotly.js
- **APIs**: NASA APOD API
- **Math Rendering**: MathJax

## Project Structure

```
physics-app/
├── app.py                 # Main Flask application
├── templates/             # HTML templates
├── static/               # CSS, JavaScript, images
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - see LICENSE file for details
"""
    
    if not os.path.exists('README.md'):
        with open('README.md', 'w') as f:
            f.write(readme_content)
        print("✓ Created README.md")

def main():
    """Main setup function"""
    print("Setting up Physics Web App static files...")
    print("=" * 50)
    
    # Create directory structure
    create_directory_structure()
    print()
    
    # Download libraries
    download_plotly()
    download_additional_libraries()
    print()
    
    # Create configuration files
    create_example_env_file()
    create_requirements_file()
    create_gitignore()
    create_readme()
    print()
    
    print("=" * 50)
    print("Setup complete! Next steps:")
    print("1. Move the improved CSS to static/css/style.css")
    print("2. Move the improved JavaScript to static/js/script.js")
    print("3. Copy .env.example to .env and add your NASA API key")
    print("4. Install requirements: pip install -r requirements.txt")
    print("5. Run the app: python app.py")
    print()
    print("Your directory structure should now look like:")
    print("├── app.py")
    print("├── templates/")
    print("├── static/")
    print("│   ├── css/")
    print("│   ├── js/")
    print("│   └── images/")
    print("├── requirements.txt")
    print("├── .env.example")
    print("└── README.md")

if __name__ == "__main__":
    main()