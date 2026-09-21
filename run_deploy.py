import subprocess
import os

os.chdir(r"m:\Antigravity")

with open("deploy.log", "w", encoding="utf-8") as log:
    def log_run(cmd):
        log.write(f"RUNNING: {' '.join(cmd)}\n")
        res = subprocess.run(cmd, capture_output=True, text=True)
        log.write(f"STDOUT:\n{res.stdout}\n")
        log.write(f"STDERR:\n{res.stderr}\n")
        log.write(f"RETURNCODE: {res.returncode}\n\n")
        return res

    log_run(["git", "status"])
    log_run(["git", "add", "-A"])
    log_run(["git", "commit", "-m", "ViralMaker v2.1 update: 9:16 shortform and channel grouping"])
    log_run(["git", "push", "origin", "main", "--force"])

print("Deploy run complete. Check deploy.log.")
