import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

samples = [
    "[오늘의집] 모던 원목 서랍장 3단 https://ohou.se/productions/123456/open",
    "https://ohou.se/productions/123456/open",
    "https://ozip.to/abcde",
    "[오늘의집] 오굿데이 특가 [마켓비] 3단 서랍장 https://ohou.se/productions/999. 지금 확인해보세요!",
    "쿠팡! | [로켓배송] 맥 MAC 립스틱 https://link.coupang.com/a/xyz"
]

for s in samples:
    m = re.search(r'https?://[^\s"\'<>]+', s)
    if not m:
        print("NO MATCH:", s)
        continue
    raw_url = m.group(0)
    url = re.sub(r'[\)\]\}>.,;:~]+$', '', raw_url)
    non_url = s.replace(raw_url, '').replace(url, '').strip()
    title = re.sub(r'(쿠팡!*|오늘의집|마켓컬리|오아시스마켓*|토스쇼핑*|네이버쇼핑|스마트스토어|올리브영)[\s|:/-]*', '', non_url, flags=re.I)
    title = re.sub(r'\[(로켓배송|로켓와우|특가|단독|오늘의딜|오굿데이|한정특가|할인|무료배송|오늘출발|쿠팡|오늘의집)\]', '', title, flags=re.I)
    title = re.sub(r'(오굿데이|단독특가|한정특가|오늘의딜|로켓배송|로켓와우|무료배송|오늘출발)[\s|:/-]*', '', title, flags=re.I)
    title = re.sub(r'(지금\s*(.*에서\s*)?확인해보세요!?|앱에서\s*확인해보세요!?|자세한\s*내용은\s*(링크에서)?!?|링크를\s*눌러\s*확인해보세요!?)', '', title, flags=re.I)
    title = re.sub(r'[\r\n]+', ' ', title)
    title = re.sub(r'^[\s|:/\-_[\]~·•]+|[\s|:/\-_[\]~·•]+$', '', title).strip()
    print(f"URL: {url:<45} | Title: {repr(title)}")
