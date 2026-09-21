import os

base_dir = r"m:\Antigravity"
index_path = os.path.join(base_dir, "index.html")
css_path = os.path.join(base_dir, "css", "style.css")
templates_path = os.path.join(base_dir, "js", "templates.js")
generator_path = os.path.join(base_dir, "js", "generator.js")
cardnews_path = os.path.join(base_dir, "js", "cardnews.js")
app_path = os.path.join(base_dir, "js", "app.js")
out_path = os.path.join(base_dir, "viralmaker_portable.html")

with open(index_path, "r", encoding="utf-8", errors="replace") as f:
    html = f.read()

with open(css_path, "r", encoding="utf-8", errors="replace") as f:
    css = f.read()

with open(templates_path, "r", encoding="utf-8", errors="replace") as f:
    templates_js = f.read()

with open(generator_path, "r", encoding="utf-8", errors="replace") as f:
    generator_js = f.read()

with open(cardnews_path, "r", encoding="utf-8", errors="replace") as f:
    cardnews_js = f.read()

with open(app_path, "r", encoding="utf-8", errors="replace") as f:
    app_js = f.read()

import re

# Replace stylesheet link flexibly
html = re.sub(r'<link\s+rel=["\']stylesheet["\']\s+href=["\']css/style\.css(?:\?[^"\']*)?["\']\s*>', f'<style>\n{css}\n</style>', html)

# Replace script tags flexibly
script_pattern = r'<!-- Scripts.*?-->\s*(?:<script\s+src=["\']js/[^"\']+\.js(?:\?[^"\']*)?["\']\s*></script>\s*)+'
inlined_scripts = f"""<script>
{templates_js}
{generator_js}
{cardnews_js}
{app_js}
</script>"""
html = re.sub(script_pattern, lambda m: inlined_scripts, html, flags=re.DOTALL)

with open(out_path, "w", encoding="utf-8") as f:
    f.write(html)

print(f"Successfully generated portable standalone file: {out_path} (Size: {len(html)} bytes)")
