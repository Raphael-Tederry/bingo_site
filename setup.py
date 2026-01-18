"""
Bingo Site - Main Setup Script

This script sets up both the backend and frontend environments for the Bingo Site.
It creates virtual environments, installs dependencies, and prepares the project for running.

Usage:
    python setup.py
"""

import subprocess
import sys
import os


def run_command(command, cwd=None, shell=True):
    """
    Execute a shell command
    
    Reason: Simplify command execution with error handling
    Called by: Setup functions
    Input: 
        command (str) - Command to execute
        cwd (str) - Working directory
        shell (bool) - Whether to use shell
    Output: None
    """
    print(f"\n>>> Running: {command}")
    if cwd:
        print(f"    in directory: {cwd}")
    try:
        subprocess.run(command, shell=shell, check=True, cwd=cwd)
        print(f"✓ Success: {command}")
    except subprocess.CalledProcessError as e:
        print(f"✗ Error running command: {command}")
        print(f"  Error details: {e}")
        return False
    return True


def setup_backend():
    """
    Set up the backend environment
    
    Reason: Automate backend setup process
    Called by: Main execution
    Input: None
    Output: bool - Success status
    """
    print("\n" + "=" * 60)
    print("BACKEND SETUP")
    print("=" * 60)
    
    backend_dir = os.path.join(os.getcwd(), "backend")
    
    if not os.path.exists(backend_dir):
        print("✗ Backend directory not found!")
        return False
    
    # Create virtual environment
    if not os.path.exists(os.path.join(backend_dir, ".venv")):
        print("\n[1/3] Creating virtual environment...")
        if not run_command(f"{sys.executable} -m venv .venv", cwd=backend_dir):
            return False
    else:
        print("\n[1/3] Virtual environment already exists")
    
    # Determine the correct paths
    if sys.platform == "win32":
        pip_path = os.path.join(backend_dir, ".venv", "Scripts", "pip.exe")
        python_path = os.path.join(backend_dir, ".venv", "Scripts", "python.exe")
    else:
        pip_path = os.path.join(backend_dir, ".venv", "bin", "pip")
        python_path = os.path.join(backend_dir, ".venv", "bin", "python")
    
    # Upgrade pip
    print("\n[2/3] Upgrading pip...")
    if not run_command(f'"{python_path}" -m pip install --upgrade pip', cwd=backend_dir):
        return False
    
    # Install requirements
    print("\n[3/3] Installing dependencies...")
    if not run_command(f'"{pip_path}" install -r requirements.txt', cwd=backend_dir):
        return False
    
    print("\n✓ Backend setup complete!")
    return True


def setup_frontend():
    """
    Set up the frontend environment
    
    Reason: Automate frontend setup process
    Called by: Main execution
    Input: None
    Output: bool - Success status
    """
    print("\n" + "=" * 60)
    print("FRONTEND SETUP")
    print("=" * 60)
    
    frontend_dir = os.path.join(os.getcwd(), "frontend")
    
    if not os.path.exists(frontend_dir):
        print("✗ Frontend directory not found!")
        return False
    
    # Check if node_modules exists
    if os.path.exists(os.path.join(frontend_dir, "node_modules")):
        print("\n[1/1] Dependencies already installed")
        print("✓ Frontend setup complete!")
        return True
    
    # Install dependencies
    print("\n[1/1] Installing npm dependencies (this may take a while)...")
    if not run_command("npm install", cwd=frontend_dir):
        return False
    
    print("\n✓ Frontend setup complete!")
    return True


def check_profiles():
    """
    Check if profile files exist
    
    Reason: Verify profiles directory is properly set up
    Called by: Main execution
    Input: None
    Output: bool - Success status
    """
    print("\n" + "=" * 60)
    print("PROFILES CHECK")
    print("=" * 60)
    
    profiles_dir = os.path.join(os.getcwd(), "profiles")
    
    if not os.path.exists(profiles_dir):
        print("✗ Profiles directory not found!")
        return False
    
    profiles = [f for f in os.listdir(profiles_dir) if f.endswith('.txt')]
    
    if len(profiles) == 0:
        print("⚠ Warning: No profile files found in profiles directory!")
        print("  Add .txt files with comma-separated values to create profiles.")
        return True
    
    print(f"\n✓ Found {len(profiles)} profile(s):")
    for profile in profiles:
        print(f"  - {profile}")
    
    return True


def create_env_file():
    """
    Create .env.local file for frontend if it doesn't exist
    
    Reason: Set up environment variables
    Called by: Main execution
    Input: None
    Output: None
    """
    env_file = os.path.join(os.getcwd(), "frontend", ".env.local")
    
    if os.path.exists(env_file):
        print("\n✓ .env.local already exists")
        return
    
    print("\n" + "=" * 60)
    print("ENVIRONMENT CONFIGURATION")
    print("=" * 60)
    
    try:
        with open(env_file, 'w') as f:
            f.write("NEXT_PUBLIC_API_URL=http://localhost:8000\n")
        print("\n✓ Created .env.local file")
    except Exception as e:
        print(f"\n⚠ Could not create .env.local: {e}")
        print("  You may need to create it manually.")


def main():
    """
    Main setup function
    
    Reason: Orchestrate complete project setup
    Called by: Script execution
    Input: None
    Output: None
    """
    print("\n")
    print("=" * 60)
    print("BINGO SITE - COMPLETE SETUP")
    print("=" * 60)
    print("\nThis script will set up both the backend and frontend.")
    print("Make sure you have Python 3.8+ and Node.js 18+ installed.")
    
    input("\nPress Enter to continue...")
    
    # Setup backend
    if not setup_backend():
        print("\n✗ Backend setup failed!")
        sys.exit(1)
    
    # Setup frontend
    if not setup_frontend():
        print("\n✗ Frontend setup failed!")
        sys.exit(1)
    
    # Check profiles
    check_profiles()
    
    # Create env file
    create_env_file()
    
    # Final instructions
    print("\n" + "=" * 60)
    print("✓ SETUP COMPLETE!")
    print("=" * 60)
    print("\nTo start the application:")
    print("\n1. Start the backend (in one terminal):")
    print("   cd backend")
    if sys.platform == "win32":
        print("   .venv\\Scripts\\activate")
    else:
        print("   source .venv/bin/activate")
    print("   python main.py")
    print("\n2. Start the frontend (in another terminal):")
    print("   cd frontend")
    print("   npm run dev")
    print("\n3. Open your browser to http://localhost:3000")
    print("\nEnjoy playing Bingo! 🎉")
    print()


if __name__ == "__main__":
    main()
