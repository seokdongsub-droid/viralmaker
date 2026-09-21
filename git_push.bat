@echo off
cd /d "M:\Antigravity"
echo [1/3] Building portable HTML...
python build_portable.py
echo [2/3] Adding and committing files...
git add -A
git commit -m "ViralMaker v2.4: Multi-platform affiliate expansion (Ohou, Kurly, Oasis, Toss, Naver)"
echo [3/3] Pushing to GitHub origin main...
git push origin main --force
echo.
echo ========================================================
echo SUCCESS: Deployed to GitHub Pages!
echo URL: https://seokdongsub-droid.github.io/viralmaker/?v=2.4
echo ========================================================
echo.
pause
