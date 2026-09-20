import os

base_dir = r"m:\Antigravity"
index_path = os.path.join(base_dir, "index.html")
css_path = os.path.join(base_dir, "css", "style.css")
templates_path = os.path.join(base_dir, "js", "templates.js")
generator_path = os.path.join(base_dir, "js", "content_generator.js")
cardnews_path = os.path.join(base_dir, "js", "cardnews.js")
app_path = os.path.join(base_dir, "js", "app.js")
out_path = os.path.join(base_dir, "viralmaker_portable.html")

with open(index_path, "r", encoding="utf-8") as f:
    html = f.read()

with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

with open(templates_path, "r", encoding="utf-8") as f:
    templates_js = f.read()

with open(generator_path, "r", encoding="utf-8") as f:
    generator_js = f.read()

with open(cardnews_path, "r", encoding="utf-8") as f:
    cardnews_js = f.read()

with open(app_path, "r", encoding="utf-8") as f:
    app_js = f.read()

# Replace <link rel="stylesheet" href="css/style.css"> with <style>...</style>
html = html.replace('<link rel="stylesheet" href="css/style.css">', f'<style>\n{css}\n</style>')

# Replace script tags with inlined scripts
scripts_to_replace = """  <script src="js/templates.js"></script>
  <script src="js/content_generator.js"></script>
  <script src="js/cardnews.js"></script>
  <script src="js/app.js"></script>"""

inlined_scripts = f"""  <script>
{templates_js}
{generator_js}
{cardnews_js}
{app_js}
  </script>"""

html = html.replace(scripts_to_replace, inlined_scripts)

with open(out_path, "w", encoding="utf-8") as f:
    f.write(html)

print(f"Successfully generated portable standalone file: {out_path} (Size: {len(html)} bytes)")
