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

print("=" * 55)
print("🚀 ViralMaker GitHub 자동 업데이트 시작...")
print("=" * 55)

try:
    print("\n[1/4] generator.js 및 포터블 단독 파일 자동 동기화 중...")
    with open(r"m:\Antigravity\js\content_generator.js", "r", encoding="utf-8") as f:
        cg_code = f.read()
    with open(r"m:\Antigravity\js\generator.js", "w", encoding="utf-8") as f:
        f.write(cg_code)

    import build_portable
    print("  ✓ 단독 포터블 파일(viralmaker_portable.html) 생성 완료!")

    print("\n[2/4] 변경된 모든 파일 수집 중...")
    subprocess.run(["git", "add", "-A"], check=True)

    print("\n[3/4] v2.2 모바일 최적화 커밋 생성 중...")
    commit_res = subprocess.run(["git", "commit", "-m", "ViralMaker v2.2: Mobile optimization, Web Share API, and version banner"], capture_output=True, text=True)
    if commit_res.returncode == 0:
        print("  ✓ 최신 변경사항 커밋 완료!")
    else:
        print("  (새로 변경된 파일이 없거나 이미 커밋되었습니다)")

    print("\n[4/4] 깃허브 서버로 안전 전송 중 (Push)...")
    push_res = subprocess.run(["git", "push", "origin", "main", "--force"], capture_output=True, text=True)

    with open(r"m:\Antigravity\git_push_result.txt", "w", encoding="utf-8") as rf:
        rf.write(f"ReturnCode: {push_res.returncode}\n")
        rf.write(f"STDOUT:\n{push_res.stdout}\n")
        rf.write(f"STDERR:\n{push_res.stderr}\n")

    if push_res.returncode == 0:
        print("\n" + "=" * 55)
        print("✅ [성공] 깃허브 업로드가 완벽하게 성공했습니다!")
        print("=" * 55)
        print("\n📱 약 15초 뒤 스마트폰에서 아래 주소로 접속하세요:")
        print("   👉 https://seokdongsub-droid.github.io/viralmaker/?v=2.2")
        print("\n🏷️ 화면 맨 위에 초록색 [🟢 v2.2 최신 버전 적용됨]이")
        print("   보이면 최신 버전으로 정상 반영된 것입니다!")
        print("=" * 55)
    else:
        print("\n" + "=" * 55)
        print("⚠️ 깃허브 전송 중 오류가 발생했습니다:")
        print(push_res.stderr or push_res.stdout)
        print("=" * 55)

except Exception as e:
    with open(r"m:\Antigravity\git_push_result.txt", "w", encoding="utf-8") as rf:
        rf.write(f"EXCEPTION: {e}\n")
    print(f"\n❌ 실행 중 오류 발생: {e}")

input("\n종료하려면 엔터(Enter) 키를 누르세요...")
