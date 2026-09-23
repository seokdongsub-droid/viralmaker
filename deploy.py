import subprocess
import sys
import os
import datetime

# 콘솔 UTF-8 출력 보장
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

base_dir = r"M:\Antigravity"
os.chdir(base_dir)
log_file_path = os.path.join(base_dir, "deploy_log.txt")

now = datetime.datetime.now()
timestamp_str = now.strftime("%Y%m%d_%H%M%S")
timestamp_display = now.strftime("%Y-%m-%d %H:%M:%S")

print("=" * 60)
print(f"🚀 [ViralMaker v2.8] 깃허브 자동 배포 시작 ({timestamp_display})")
print("=" * 60)

log_entries = []

def log(msg, also_print=True):
    log_entries.append(msg)
    if also_print:
        print(msg)

def run_cmd(cmd_list, step_name):
    cmd_str = " ".join(cmd_list)
    log(f"\n▶ [{step_name}] 실행: {cmd_str}")
    try:
        res = subprocess.run(cmd_list, capture_output=True, text=True, encoding='utf-8', errors='replace')
        if res.stdout and res.stdout.strip():
            log(f"  [출력]\n{res.stdout.strip()}")
        if res.stderr and res.stderr.strip():
            log(f"  [알림/오류]\n{res.stderr.strip()}")
        log(f"  [종료 코드]: {res.returncode}")
        return res
    except Exception as e:
        log(f"  ❌ 실행 실패 예외 발생: {str(e)}")
        return None

# 1. 단독 포터블 파일 생성
log("\n[1/3] 단독 포터블 파일(viralmaker_portable.html) 번들링...")
try:
    import build_portable
    log("  ✓ build_portable.py 실행 완료!")
except Exception as e:
    log(f"  ⚠️ build_portable 모듈 직접 실행 시도...")
    run_cmd([sys.executable, "build_portable.py"], "build_portable")

# 2. Git Status & Add
run_cmd(["git", "status", "-s"], "Git Status Before Add")
res_add = run_cmd(["git", "add", "-A"], "Git Add")
run_cmd(["git", "status", "-s"], "Git Status After Add")

# 3. Git Commit
commit_msg = f"ViralMaker v3.0: All-In-One Studio (Multi-Platform, Dayzhome Canvas, Card-by-Card Gemini Prompts, 4-Type Threads) ({timestamp_str})"
res_commit = run_cmd(["git", "commit", "-m", commit_msg], "Git Commit")
run_cmd(["git", "log", "-n", "3", "--oneline"], "Recent Git Commits")

# 4. Git Push
log("\n[2/3] 깃허브 원격 서버로 전송 중 (Git Push)...")
res_push = run_cmd(["git", "push", "origin", "main", "--force"], "Git Push")

# 5. 결과 판정 및 안내
print("\n" + "=" * 60)
success = (res_push is not None and res_push.returncode == 0)

if success:
    print("🎉 ✅ [성공] 최신 v3.0 올인원 버전이 깃허브 서버로 안전하게 전송되었습니다!")
    print("=" * 60)
    print("\n📱 [스마트폰 접속 안내]")
    print("1. 깃허브 서버가 새 코드를 배포하는 데 약 40초 ~ 1분 30초가 소요됩니다.")
    print(f"2. 캐시 없이 즉시 최신 버전을 열 수 있는 타임스탬프 전용 주소:")
    print(f"   👉 https://seokdongsub-droid.github.io/viralmaker/?v=3.0_{timestamp_str}")
    print("\n3. 화면 상단에 [v3.0 올인원 에디션 적용됨]이 보이면 최신 버전 적용 성공입니다!")
    log(f"\n배포 성공 결과: https://seokdongsub-droid.github.io/viralmaker/?v=3.0_{timestamp_str}")
else:
    print("⚠️ ❌ [주의] 깃허브 전송 중 오류가 발생했습니다.")
    print("자세한 원인은 생성된 'deploy_log.txt' 파일을 확인해 주세요.")
    print("=" * 60)

# 로그 파일 저장
try:
    with open(log_file_path, "w", encoding="utf-8") as lf:
        lf.write(f"=== ViralMaker Deploy Log ({timestamp_display}) ===\n")
        lf.write("\n".join(log_entries))
        lf.write("\n\n=== End of Log ===\n")
    print(f"\n📝 상세 로그가 '{log_file_path}'에 저장되었습니다.")
except Exception as le:
    print(f"로그 파일 저장 실패: {le}")
