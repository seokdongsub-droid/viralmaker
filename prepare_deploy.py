import os

# Remove test file if exists
test_file = r"m:\Antigravity\js\test_clean.js"
if os.path.exists(test_file):
    os.remove(test_file)
    print("Removed test_clean.js")

# Sync generator.js with content_generator.js for safety
clean_path = r"m:\Antigravity\js\content_generator.js"
gen_path = r"m:\Antigravity\js\generator.js"
if os.path.exists(clean_path):
    with open(clean_path, "r", encoding="utf-8") as f:
        code = f.read()
    with open(gen_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Synchronized generator.js cleanly")

print("Cleanup and preparation complete.")
