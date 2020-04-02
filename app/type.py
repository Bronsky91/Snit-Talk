import sys 
from pynput import keyboard
import time

time.sleep(.5)
keyboard.Controller().type(sys.argv[1])