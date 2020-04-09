## install pynput with python shell if not install already

import subprocess
import sys

reqs = subprocess.check_output([sys.executable, '-m', 'pip', 'freeze'])
installed_packages = [r.decode().split('==')[0] for r in reqs.split()]

if not 'pynput' in installed_packages:
    subprocess.check_call([sys.executable, "-m", "pip", "install", 'pynput'])