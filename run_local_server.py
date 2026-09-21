import socket
import subprocess
import sys
import os

os.chdir(r"m:\Antigravity")

def get_local_ips():
    ips = []
    try:
        host = socket.gethostname()
        for ip in socket.gethostbyname_ex(host)[2]:
            if not ip.startswith("127."):
                ips.append(ip)
    except Exception:
        pass
    return ips

ips = get_local_ips()

print("=" * 60)
print("🚀 ViralMaker 내 컴퓨터 실시간 서버 실행 중...")
print("=" * 60)
print("💡 같은 와이파이(집/사무실)에 연결된 스마트폰으로 접속하세요!")
print("💡 코드가 수정되면 폰에서 [새로고침]만 누르면 0.1초 만에 즉시 반영됩니다.")
print("\n📱 스마트폰 브라우저 주소창에 아래 주소를 입력하세요:")
for ip in ips:
    print(f"   👉 http://{ip}:8080")
if not ips:
    print("   👉 http://localhost:8080")

print("\n" + "=" * 60)
print("(서버를 종료하시려면 이 창을 닫으시면 됩니다)")
print("=" * 60 + "\n")

subprocess.run([sys.executable, "-m", "http.server", "8080", "--directory", r"m:\Antigravity"])
