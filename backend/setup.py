"""
Bingo Backend Setup Script

This script helps set up the backend environment for the Bingo website.
It creates a virtual environment and installs all required dependencies.

Usage:
    python setup.py
"""

import subprocess
import sys
import os


def run_command(command, shell=True):
    """
    Execute a shell command
    
    Reason: Simplify command execution with error handling
    Called by: Main setup functions
    Input: 
        command (str) - Command to execute
        shell (bool) - Whether to use shell
    Output: None
    """
    print(f"\n>>> Running: {command}")
    try:
        subprocess.run(command, shell=shell, check=True)
        print(f"✓ Success: {command}")
    except subprocess.CalledProcessError as e:
        print(f"✗ Error running command: {command}")
        print(f"  Error details: {e}")
        sys.exit(1)


def setup_backend():
    """
    Set up the backend environment
    
    Reason: Automate backend setup process
    Called by: Main execution
    Input: None
    Output: None
    """
    print("=" * 60)
    print("BINGO BACKEND SETUP")
    print("=" * 60)
    
    # Check if we're already in the backend directory
    if not os.path.basename(os.getcwd()) == "backend":
        if os.path.exists("backend"):
            os.chdir("backend")
            print("✓ Changed to backend directory")
        else:
            print("✗ Backend directory not found!")
            sys.exit(1)
    
    # Create virtual environment
    if not os.path.exists(".venv"):
        print("\n[1/3] Creating virtual environment...")
        run_command(f"{sys.executable} -m venv .venv")
    else:
        print("\n[1/3] Virtual environment already exists")
    
    # Determine the correct pip path
    if sys.platform == "win32":
        pip_path = ".venv\\Scripts\\pip.exe"
        python_path = ".venv\\Scripts\\python.exe"
    else:
        pip_path = ".venv/bin/pip"
        python_path = ".venv/bin/python"
    
    # Upgrade pip
    print("\n[2/3] Upgrading pip...")
    run_command(f"{python_path} -m pip install --upgrade pip")
    
    # Install requirements
    print("\n[3/3] Installing dependencies...")
    run_command(f"{pip_path} install -r requirements.txt")
    
    print("\n" + "=" * 60)
    print("✓ BACKEND SETUP COMPLETE!")
    print("=" * 60)
    print("\nTo activate the virtual environment:")
    if sys.platform == "win32":
        print("  .venv\\Scripts\\activate")
    else:
        print("  source .venv/bin/activate")
    print("\nTo start the server:")
    print("  python main.py")
    print("  or")
    print("  uvicorn main:app --reload")
    print()


if __name__ == "__main__":
    setup_backend()
