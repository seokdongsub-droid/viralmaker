import subprocess
import os
import sys

os.chdir(r"m:\Antigravity")

with open(r"m:\Antigravity\push_result.txt", "w", encoding="utf-8") as out:
    out.write("=== GIT STATUS ===\n")
    s = subprocess.run(["git", "status"], capture_output=True, text=True, encoding='utf-8')
    out.write(s.stdout + "\n" + s.stderr + "\n")

    out.write("=== GIT PUSH ATTEMPT ===\n")
    p = subprocess.run(["git", "push", "origin", "main", "--force"], capture_output=True, text=True, encoding='utf-8')
    out.write(f"Return code: {p.returncode}\n")
    out.write(f"STDOUT:\n{p.stdout}\n")
    out.write(f"STDERR:\n{p.stderr}\n")

print("Finished. Results written to push_result.txt")
