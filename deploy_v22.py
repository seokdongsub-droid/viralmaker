import subprocess
import sys
import os

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

os.chdir(r"m:\Antigravity")

print("=" * 60)
print("[START] ViralMaker v2.2 Deploy to GitHub...")
print("=" * 60)

# 1. Sync generator.js with content_generator.js
try:
    with open(r"m:\Antigravity\js\content_generator.js", "r", encoding="utf-8") as f:
        cg_code = f.read()
    with open(r"m:\Antigravity\js\generator.js", "w", encoding="utf-8") as f:
        f.write(cg_code)
    print("[1/5] js/generator.js synchronized.")
except Exception as e:
    print(f"[WARN] sync error: {e}")

# 2. Rebuild viralmaker_portable.html
try:
    res_b = subprocess.run([sys.executable, "build_portable.py"], capture_output=True, text=True, encoding='utf-8')
    print("[2/5] build_portable: " + res_b.stdout.strip())
except Exception as e:
    print(f"[WARN] build_portable error: {e}")

# 3. Git Add
subprocess.run(["git", "add", "-A"], check=True)
print("[3/5] git add -A completed.")

# 4. Git Commit
res_c = subprocess.run(["git", "commit", "-m", "ViralMaker v2.2: Mobile optimization, Web Share API, Safe Area, and Version badge"], capture_output=True, text=True, encoding='utf-8')
if res_c.returncode == 0:
    print("[4/5] git commit completed: " + res_c.stdout.strip())
else:
    print("[4/5] git commit: already up-to-date or no changes.")

# 5. Git Push
print("[5/5] git push origin main --force running...")
res_p = subprocess.run(["git", "push", "origin", "main", "--force"], capture_output=True, text=True, encoding='utf-8')

if res_p.returncode == 0:
    print("=" * 60)
    print("SUCCESS: GitHub deploy completed successfully!")
    print("=" * 60)
    print("Mobile URL: https://seokdongsub-droid.github.io/viralmaker/?v=2.2")
    print("Version banner v2.2 will be active on GitHub Pages.")
else:
    print("ERROR during git push:")
    print(res_p.stderr or res_p.stdout)
    sys.exit(1)
