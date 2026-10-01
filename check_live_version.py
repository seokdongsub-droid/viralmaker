import urllib.request
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

urls = [
    'https://seokdongsub-droid.github.io/viralmaker/index.html',
    'https://seokdongsub-droid.github.io/viralmaker/sw.js',
    'https://seokdongsub-droid.github.io/viralmaker/?v=4.1_20261001_124444'
]

for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
            badges = re.findall(r'v\d+\.\d+[^<"\']*', content[:2000])
            print(f"[{url}]")
            print(f"  Status: {resp.status}")
            print(f"  Found versions: {badges}")
    except Exception as e:
        print(f"[{url}] Error: {e}")
