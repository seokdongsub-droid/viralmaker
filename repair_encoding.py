with open("js/content_generator.js", "rb") as f:
    raw = f.read()

try:
    raw.decode("utf-8")
    print("content_generator.js is already valid UTF-8.")
except UnicodeDecodeError as e:
    print(f"UTF-8 decode error at {e.start}-{e.end}: {e}")
    start = max(0, e.start - 30)
    end = min(len(raw), e.end + 30)
    print("Bytes around error:", raw[start:end])
    try:
        # Check if the whole file was saved in CP949 / EUC-KR
        decoded = raw.decode("cp949")
        print("Successfully decoded as CP949! Converting to UTF-8...")
        with open("js/content_generator.js", "w", encoding="utf-8") as f:
            f.write(decoded)
        print("Saved cleanly as UTF-8.")
    except Exception as e2:
        print("CP949 failed too. Fixing with utf-8 errors='replace':", e2)
        # Try finding the bad bytes and inspect
        # Most likely just 1-2 bad bytes in a comment or string
        decoded = raw.decode("utf-8", errors="replace")
        with open("js/content_generator.js", "w", encoding="utf-8") as f:
            f.write(decoded)
        print("Saved cleanly as UTF-8 (replaced corrupted bytes).")
