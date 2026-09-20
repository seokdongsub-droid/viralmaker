/**
 * content_generator.js
 * 쇼핑몰 플랫폼 감지 및 5대 채널 복붙 카피 생성 모듈
 * 스레드(Threads) 계정 보호를 위한 [1단계: 본문(영상/사진, 링크 절대 없음)] + [2단계: 첫 댓글(링크 & 정보)] 2단계 분리 구조 탑재
 */

class ContentGenerator {
  constructor() {
    this.geminiModels = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash'
    ];
  }

  // 쇼핑몰 플랫폼 감지
  detectPlatform(urlStr) {
    if (!urlStr) return 'general';
    const lower = urlStr.toLowerCase();
    if (lower.includes('coupang.com') || lower.includes('link.coupang.com')) {
      return 'coupang';
    }
    if (lower.includes('amazon.co.jp') || lower.includes('amzn.to') || lower.includes('amzn.asia')) {
      return 'amazon_jp';
    }
    if (lower.includes('smartstore.naver.com') || lower.includes('brand.naver.com') || lower.includes('shopping.naver.com')) {
      return 'smartstore';
    }
    if (lower.includes('tenping.kr')) {
      return 'tenping';
    }
    return 'general';
  }

  // 제품명 추론
  inferProductName(product) {
    if (product.name && product.name.trim()) return product.name.trim();
    if (product.memo && product.memo.trim()) {
      const firstLine = product.memo.split(/[\n,]/)[0].trim();
      if (firstLine.length > 0 && firstLine.length <= 25) return firstLine;
    }
    if (product.link) {
      try {
        const url = new URL(product.link);
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts.length > 0) {
          const last = decodeURIComponent(pathParts[pathParts.length - 1]).replace(/[-_]/g, ' ');
          if (last.length >= 2 && last.length <= 25) return last;
        }
      } catch (e) {}
    }
    return '화제의 인기 추천템';
  }

  // 스레드 본문 & 댓글 2단계 분리 헬퍼
  splitThreadsPost(text) {
    if (!text) return { body: '', comment: '' };

    // 한국어 구분자 검사
    const koMatch = text.match(/(?:━+\s*)?💬\s*\[2단계[^\n]*\][^\n]*\n(?:[─━-]+\n)?([\s\S]*)$/);
    if (koMatch) {
      const comment = koMatch[1].trim();
      const bodyPart = text.substring(0, koMatch.index);
      const cleanBody = bodyPart
        .replace(/^📌\s*\[1단계[^\n]*\][^\n]*\n([─━-]+\n)?/, '')
        .trim();
      return { body: cleanBody, comment };
    }

    // 일본어 구분자 검사
    const jaMatch = text.match(/(?:━+\s*)?💬\s*【ステップ2[^\n]*】[^\n]*\n(?:[─━-]+\n)?([\s\S]*)$/);
    if (jaMatch) {
      const comment = jaMatch[1].trim();
      const bodyPart = text.substring(0, jaMatch.index);
      const cleanBody = bodyPart
        .replace(/^📌\s*【ステップ1[^\n]*】[^\n]*\n([─━-]+\n)?/, '')
        .trim();
      return { body: cleanBody, comment };
    }

    // Gemini 생성 구분자 검사 (===COMMENT===)
    if (text.includes('===COMMENT===')) {
      const parts = text.split('===COMMENT===');
      return {
        body: parts[0].replace(/^📌[^\n]*\n/, '').trim(),
        comment: parts[1].replace(/^💬[^\n]*\n/, '').trim()
      };
    }

    // fallback
    return { body: text, comment: '' };
  }

  // 전체 결과 일괄 생성
  async generateAll(product, apiKey = '') {
    const name = this.inferProductName(product);
    const link = product.link || 'https://link.com';
    const memo = product.memo || '삶의 질을 높여주는 필수 추천 아이템';
    const platform = this.detectPlatform(link);

    const cleanProduct = { ...product, name, link, memo, platform };

    // 1. 카드뉴스 슬라이드 생성 (한국어 / 일본어 2개 버전)
    const cardnews_ko = this.generateKoreanCardNews(cleanProduct);
    const cardnews_ja = this.generateJapaneseCardNews(cleanProduct);

    // 2. 텍스트 채널 생성
    const channels = ['threads-kr', 'threads-jp', 'naver-blog', 'ameba-jp', 'instagram'];
    const texts = {};

    for (const ch of channels) {
      try {
        if (apiKey && apiKey.trim()) {
          texts[ch] = await this.generateWithGemini(ch, cleanProduct, apiKey.trim());
        } else {
          texts[ch] = this.generateLocalTemplate(ch, cleanProduct);
        }
      } catch (err) {
        texts[ch] = this.generateLocalTemplate(ch, cleanProduct);
      }
    }

    return {
      cardnews_ko,
      cardnews_ja,
      texts,
      product: cleanProduct
    };
  }

  // 한국어 인스타 카드뉴스 5장 슬라이드
  generateKoreanCardNews(p) {
    const name = p.name;
    const memo = p.memo;
    const isCoupang = p.platform === 'coupang';

    return [
      {
        slideNum: 1,
        type: 'cover',
        badge: isCoupang ? '🚀 로켓배송 내돈내산' : 'MY FAVORITE 🤍',
        mainTitle: `${name}\n솔직하게 써본 후기 ✨`,
        subTitle: isCoupang ? '내일 바로 도착! 요즘 삶의 질 제대로 올려주는 꿀템' : '써보고 너무 만족스러워서 공유하는 찐추천템 🥹',
        extra: isCoupang ? '로켓배송 무료반품 혜택' : '지금 주문 시 한정 할인 혜택'
      },
      {
        slideNum: 2,
        type: 'problem',
        badge: 'CHECK POINT ㅠㅠ',
        mainTitle: '매일 반복되는 이 불편함\n혹시 참고 계셨나요?',
        subTitle: `${memo}\n더 이상 참지 말고 하루라도 빨리 바꿔보세요!`,
        extra: 'SNS 대란템'
      },
      {
        slideNum: 3,
        type: 'solution',
        badge: 'SOLUTION ✨',
        mainTitle: `${name}\n하나로 고민 완전 해결!`,
        subTitle: `✔ 누구나 체감하는 확실한 실사용 만족도\n✔ 감성 넘치는 디자인 & 뛰어난 편의성`,
        extra: '직접 써보면 감탄 나오는 확실한 효과'
      },
      {
        slideNum: 4,
        type: 'detail',
        badge: '반해버린 포인트 3가지 🔍',
        mainTitle: '디테일이 다른 이유',
        subTitle: `1. 믿고 쓰는 안전하고 탄탄한 품질\n2. 일상 속 편리함을 극대화한 설계\n3. 후기가 증명하는 독보적인 가성비`,
        extra: '재구매율이 높은 이유가 있더라구요'
      },
      {
        slideNum: 5,
        type: 'cta',
        badge: 'SPECIAL EVENT 🎁',
        mainTitle: '놓치면 후회할\n기간 한정 특별 프로모션',
        subTitle: `${isCoupang ? '로켓배송으로 빠르게 받아보세요!\n' : ''}구매 및 상세 링크는 프로필에서 바로 확인 가능해요!`,
        extra: isCoupang ? '쿠팡 와우회원 추가 할인' : '한정 수량 조기 마감 주의'
      }
    ];
  }

  // 일본어 인스타 카드뉴스 5장 슬라이드
  generateJapaneseCardNews(p) {
    const name = p.name;
    const isAmazon = p.platform === 'amazon_jp';

    return [
      {
        slideNum: 1,
        type: 'cover',
        badge: isAmazon ? 'Amazonベストセラー 🔥' : '大バズり中 🤍',
        mainTitle: `【SNSで話題】\n${name}\n本音レビュー！`,
        subTitle: isAmazon ? 'Amazonで即買い！QOL爆上がり確定アイテム🥹' : 'QOL爆上がり確定！もっと早く買えばよかった🥹💕',
        extra: isAmazon ? 'プライム対応・翌日配送 📦' : '大人気のため売り切れ注意⚠️'
      },
      {
        slideNum: 2,
        type: 'problem',
        badge: 'こんなお悩みありませんか？💭',
        mainTitle: '毎日のプチストレス\n我慢していませんか？',
        subTitle: '「もっと快適に過ごしたい…」\n日常の悩みをこれ1つでスッキリ解消！',
        extra: '見逃せないチェックポイント'
      },
      {
        slideNum: 3,
        type: 'solution',
        badge: 'お悩み解決 💡',
        mainTitle: `${name}\nで暮らしが変わる！`,
        subTitle: '✔ 圧倒的な使いやすさと満足度\n✔ 一度使ったらもう手放せない便利さ',
        extra: 'リアルな口コミでも大絶賛✨'
      },
      {
        slideNum: 4,
        type: 'detail',
        badge: '選ばれる3つの理由 🔍',
        mainTitle: '使って実感した\n決定的なポイント',
        subTitle: '1. デザイン性と機能性の両立\n2. 誰でも簡単＆快適に使える設計\n3. 圧倒的な高コスパで大満足',
        extra: 'リピート率が高い納得のクオリティ'
      },
      {
        slideNum: 5,
        type: 'cta',
        badge: 'お得情報 🎁',
        mainTitle: '今だけの特別チャンス！\n限定キャンペーン中',
        subTitle: isAmazon ? 'Amazonタイムセール中！\n詳細はプロフィールのリンクから🔗✨' : '気になったら今すぐチェック！\n詳細はプロフィールのリンクから🔗✨',
        extra: '在庫限りのためお早めに！'
      }
    ];
  }

  // --- 5대 채널 복붙용 로컬 템플릿 생성 엔진 ---
  generateLocalTemplate(channel, p) {
    const name = p.name;
    const link = p.link || 'https://example.com';
    const memo = p.memo || '삶의 질을 높여주는 필수 추천 아이템';
    const isCoupang = p.platform === 'coupang';
    const isAmazon = p.platform === 'amazon_jp';

    // 쿠팡 파트너스 공정위 문구
    const coupangDisclaimer = isCoupang 
      ? '\n\n※ 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.' 
      : '';

    // 아마존 어소시에이트 공정위 문구
    const amazonDisclaimer = isAmazon 
      ? '\n\n※ 当アカウントはAmazonアソシエイト・プログラムの参加者です。' 
      : '';

    if (channel === 'threads-kr') {
      // 1. 한국 스레드: [1단계: 본문 (사진/영상 첨부, 외부 링크 없음! 계정 보호)] + [2단계: 첫 번째 댓글 (링크 & 정보)]
      return `📌 [1단계: 본문 포스팅에 복붙] (사진/영상 첨부, 외부 링크 없음으로 계정 보호 🛡️)
─────────────────────
진짜 이거 써보고 요즘 삶의 질 수직상승했어요 🥹🤍
SNS에서 다들 극찬하길래 반신반의하면서 들여왔는데
직접 써보니까 왜 인생템이라고 하는지 바로 납득됨…✨

${memo}

매일 반복되던 작은 불편함들이 싹 해결돼서
요즘 하루하루가 너무 편하고 기분 좋은 거 있죠 🫧
${isCoupang ? '배송도 다음 날 바로 문앞에 와서 기다릴 틈도 없었어요 🚀' : '진작 살 걸 왜 이제야 샀나 싶을 정도!'}

혹시 저처럼 고민해보신 분 계신가요?
다들 어떻게 해결하고 계신지 댓글로 꿀팁 공유해주세요! 👀💬

#내돈내산 #아이템추천 #삶의질수직상승 #살림템 #꿀템 #일상공유 #인생템

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 [2단계: 첫 번째 댓글에 바로 복붙] (업로드 후 내 글에 답글로 등록 🔗)
─────────────────────
사진/영상에 나온 [${name}] 상세 정보랑 최저가 링크 물어보시는 분들이 많아서 댓글로 남겨둘게요!
필요하신 분들은 아래 링크나 프로필 링크에서 확인하실 수 있어요 👇
🔗 ${link}

혹시 사용감이나 더 궁금한 점 있으시면 편하게 답글 남겨주세요! 솔직하게 다 알려드릴게요 🤍${coupangDisclaimer}`;
    }

    if (channel === 'threads-jp') {
      // 2. 일본 스레드: [ステップ1：本文 (動画・写真添付用、リンクなしでアカウント保護)] + [ステップ2：返信コメント (リンク/詳細)]
      return `📌【ステップ1：本文投稿用】（動画・写真と一緒に投稿／リンクなしでアカウント保護🛡️）
─────────────────────
これ、正直買ってなかったら今年一番後悔してたかも…！🥹🤍
SNSや口コミで見かけて気になってたんだけど、
実際に使ってみたら想像以上に神アイテムすぎて感動しちゃった💭✨

フォロワーさんにもぜひ知ってほしいお気に入りポイント👇
・${memo}
・毎日の小さなプチストレスがこれ1つでゼロになったの…！

生活の質が爆上がりして、なんでもっと早く買わなかったんだろうって本気で思ってる🤍

これ本当に便利すぎるんだけど、
みんなのおすすめの愛用品や裏技があればぜひコメントで教えてね！👀💬

#おすすめ #買ってよかった #便利グッズ #QOL向上 #ライフハック #正直レビュー

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬【ステップ2：最初の返信コメント用】（投稿後、自分の投稿にリプライで登録🔗）
─────────────────────
動画や写真に出てきた【${name}】の詳細や、私が使っているおすすめ情報はプロフィールのリンクや下記にまとめておいたよ！
気になった方は今すぐチェックしてみてね👇💕
🔗 ${link}

質問があれば気軽にコメントしてね🥰 全部お返事します💌${amazonDisclaimer}`;
    }

    if (channel === 'naver-blog') {
      // 3. 네이버 블로그 (친절하고 감성적인 2030 여성 라이프스타일 블로거 톤)
      return `# [솔직후기] 삶의 질 수직상승! ${name} 내돈내산 직접 써본 장단점 총정리 🤍

안녕하세요 여러분! 일상의 소소한 행복과 유용한 꿀템을 기록하는 블로그입니다 ☕✨

오늘은 요즘 SNS에서 정말 자주 보여서 눈여겨보고 있던 **[${name}]**을 직접 내돈내산으로 구매해 사용해 본 솔직한 후기를 남겨보려고 해요 💕

---

## 📦 첫인상 및 패키지 🤍
배송받자마자 열어봤는데 군더더기 없이 깔끔하고 감성적인 패키지가 너무 마음에 들더라구요 :)
마감도 꼼꼼하고 전체적인 디테일이 좋아서 개봉할 때부터 기분이 좋아지는 느낌이었어요.

---

## 💡 실제로 써보고 반한 점 & 솔직 후기 ✨
- **주요 포인트:** ${memo}
- 직접 며칠간 써보니 '왜 이제야 샀을까' 싶을 정도로 일상의 작은 불편함들을 싹 해결해 주더라구요.
- 과장 없이 담백하게 말씀드리면, 최근에 산 것들 중에 만족도 1위예요 🤍
${isCoupang ? '- **배송:** 로켓배송으로 다음 날 아침 문 앞에 바로 도착해서 기다림 없이 쓸 수 있어 넘 편했어요 🚀\n' : ''}
---

## 🎯 이런 분들께 잘 맞을 것 같아요 :)
- 매일 반복되는 번거로움을 줄이고 삶의 여유를 챙기고 싶으신 분
- 실용적이면서도 감성적인 디자인까지 모두 챙기고 싶으신 분

---

## 💰 제품 정보 및 구매 링크 🛍️
궁금해하실 분들을 위해 제가 구매했던 링크와 상세 정보 남겨둘게요.
현재 할인 및 프로모션 진행 중이니 필요하신 분들은 참고해보세요 :)

▼ ${name} 상세 정보 바로가기
${link}

혹시 더 궁금하신 점이 있다면 언제든 편하게 댓글 남겨주세요 💬
오늘도 기분 좋은 하루 보내세요! 🤍${coupangDisclaimer}

#내돈내산 #솔직후기 #${name.replace(/\s+/g, '')} #아이템추천 #일상기록 #살림꿀팁 #삶의질향상`;
    }

    if (channel === 'ameba-jp') {
      // 4. 일본 아메바 블로그 (사랑스럽고 다정한 일본 여성 블로거 톤)
      return `皆様こんにちは🌸
いつもブログに遊びに来てくださりありがとうございます🥰💕

今日は、SNSや口コミでも話題になっていてずっと気になっていた
**【${name}】** を実際に使ってみたので、正直にレビューしたいと思います✨

結論から言うと…
「なんでもっと早く使わなかったんだろう〜！」と感動しちゃうくらい大満足のアイテムでした🥹🤍

---

### 🌸 お気に入り＆感動ポイント 🎀
・${memo}
・毎日の暮らしがぐっと快適になって、小さなストレスが本当にスッキリ解消されました💭
${isAmazon ? '・Amazonプライム便で注文後すぐに届いたのもすごく助かりました📦💕' : ''}

私と同じように毎日の家事やお仕事で忙しい女性の皆様には、
心からおすすめしたいお気に入りアイテムです🥰✨

---

### 🛒 お得なキャンペーン＆購入先 🛍️
현재, お得なキャンペーンやセールが実施されているようなので、
気になっていた方はぜひチェックしてみてくださいね🛒💨

▶︎ 商品の詳細・公式ページはこちら💕
${link}

最後まで読んでくださり、本当にありがとうございました！
よかったら「いいね」やフォローもポチッとしていただけるととっても励みになります🥰✨${amazonDisclaimer}

#アメブロ #購入品紹介 #正直レビュー #便利アイテム #プチプラ #お気に入り #Amazon購入品 #暮らしを楽しむ`;
    }

    if (channel === 'instagram') {
      // 5. 인스타그램 피드 (감성적이고 세련된 2030 여성 인플루언서 피드)
      return `✨ 요즘 제 일상에서 가장 만족스럽게 쓰고 있는 최애템 공유해요 🥹🤍
━━━━━━━━━━━━━━━━━
눈여겨보고 있다가 드디어 데려온
👉 [${name}] 직접 써본 솔직 후기 🫧

평소에 은근히 신경 쓰이고 번거로웠던 부분들을
깔끔하게 해결해 줘서 요즘 매일 손이 가는 아이템이에요 🤍

💡 직접 써보고 느낀 포인트 CHECK
✔ ${memo}
✔ 깔끔하고 감성적인 디자인 & 확실한 실용성
${isCoupang ? '✔ 로켓배송으로 바로 다음 날 도착해서 넘 편함 🚀\n' : ''}✔ 써볼수록 만족스러워서 주변에도 조용히 추천 중 :)

📍 구매 정보
프로필 링크 또는 아래 링크에서
자세한 정보와 할인가로 확인하실 수 있어요 🛍️
🔗 ${link}

나중에 필요할 때 찾아보시려면 [저장🏷️] 해두시고,
궁금한 점은 편하게 댓글로 남겨주세요 🤍
━━━━━━━━━━━━━━━━━${coupangDisclaimer}
#${name.replace(/\s+/g, '')} #내돈내산 #아이템추천 #살림템 #꿀템추천 #인스타쇼핑 #일상템 #감성템 #삶의질수직상승 #추천템`;
    }

    return '';
  }

  // --- Gemini API (고급 튜닝) ---
  async generateWithGemini(channel, p, apiKey) {
    const isCoupang = p.platform === 'coupang';
    const isAmazon = p.platform === 'amazon_jp';
    const isThreads = channel === 'threads-kr' || channel === 'threads-jp';

    const threadsRule = `
CRITICAL ALGORITHM & SAFETY RULE FOR THREADS:
Threads will algorithmically BAN or severely limit reach (0 views) if external affiliate/promotional links are in the main post!
Therefore, you MUST format the output in EXACTLY TWO PARTS separated by:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${channel === 'threads-jp' ? '💬【ステップ2：最初の返信コメント用】' : '💬 [2단계: 첫 번째 댓글에 바로 복붙]'}

PART 1 (Main Post / 本文):
- Engaging personal story, lifestyle hook, recipe or hack, media prompt (photo/video attached).
- NO EXTERNAL LINKS WHATSOEVER in Part 1!
- MUST end with an interactive question to drive comments (e.g. "혹시 저처럼 고민해보신 분 계신가요? 댓글로 알려주세요! 👀💬" or "誰か上手く焼ける裏技知らない？👀").

PART 2 (First Comment / 返信コメント):
- The creator's immediate reply to their own post.
- Friendly transition ("영상/사진 속 아이템 정보 물어보셔서 남겨둬요!" / "動画・写真に出てきた商品の詳細はプロフィールのリンクや下記にまとめておいたよ！").
- The product link: ${p.link}
- The affiliate disclosure: ${isCoupang ? '※ 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.' : (isAmazon ? '※ 当アカウントはAmazonアソシエイト・プログラムの参加者です。' : '')}
`;

    const prompt = `
You are an expert social media influencer & lifestyle e-commerce copywriter.
Create a high-converting, ready-to-copy-paste promotional post for [${channel}] for this product:
- Product Name: ${p.name}
- Product Link: ${p.link} (Platform: ${p.platform})
- Core Notes: ${p.memo}

CRITICAL TONE & STYLE RULES:
- Tone: Natural, charming, aesthetic, and emotional 20s-30s FEMALE lifestyle influencer / blogger voice (여성 라이프스타일 인플루언서 / 내돈내산 톤앤매너).
- STRICT PROHIBITION: NEVER use artificial, cheesy, or forced words like "언니", "언니들", "공주님들". Do NOT address the audience as "언니들".
- Korean phrasing: Use warm, refined feminine endings like "~했어요 🤍", "~인 거 있죠!", "~더라구요 ㅠㅠ", "~추천드려요 :)", and aesthetic emojis (🤍, 🥹, ✨, 🫧, 🌿, ☕).
- Japanese phrasing: Use natural, trendy Japanese female influencer/OL tone like "~しちゃいました💕", "~してみてね🤍", "~すぎる…！🥹", "ぜひチェックしてみてね🥰".

${isThreads ? threadsRule : `
Special Requirements:
${isCoupang ? '- Since this is a Coupang link, ensure you append the required Korean affiliate disclosure at the end: "※ 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다." and naturally mention fast delivery.' : ''}
${isAmazon ? '- Since this is an Amazon Japan link, write in natural Japanese social media commerce style and include: "※ 当アカウントはAmazonアソシエイト・プログラムの参加者です。" at the end.' : ''}
`}

Return ONLY the copy-paste-ready text, without conversational explanations.
`;

    for (const model of this.geminiModels) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim()) return text.trim();
        }
      } catch (e) {}
    }
    return this.generateLocalTemplate(channel, p);
  }
}

window.ContentGenerator = new ContentGenerator();
