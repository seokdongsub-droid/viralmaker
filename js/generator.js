/**
 * generator.js (ContentGeneratorEngine)
 * 쇼핑몰 플랫폼 감지, 5대 채널 복붙 카피 생성 및 Gemini Vision AI 이미지 분석 모듈
 * 스레드(Threads) 계정 보호를 위한 [1단계: 본문] + [2단계: 첫 댓글] 2단계 분리 구조 탑재
 */

class ContentGeneratorEngine {
  constructor() {
    this.geminiModels = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash'
    ];
  }

  // 쇼핑몰 플랫폼 감지 (쿠팡, 오늘의집, 마켓컬리, 오아시스, 토스, 네이버 스마트스토어, 아마존 등)
  detectPlatform(urlStr) {
    if (!urlStr) return 'general';
    const lower = urlStr.toLowerCase();
    if (lower.includes('coupang.com') || lower.includes('link.coupang.com')) {
      return 'coupang';
    }
    if (lower.includes('ohou.se') || lower.includes('todayhouse')) {
      return 'ohou';
    }
    if (lower.includes('kurly.com')) {
      return 'kurly';
    }
    if (lower.includes('oasis.co.kr')) {
      return 'oasis';
    }
    if (lower.includes('toss.im') || lower.includes('tossbank.com') || lower.includes('toss.app') || lower.includes('toss')) {
      return 'toss';
    }
    if (lower.includes('amazon.co.jp') || lower.includes('amzn.to') || lower.includes('amzn.asia')) {
      return 'amazon_jp';
    }
    if (lower.includes('smartstore.naver.com') || lower.includes('brand.naver.com') || lower.includes('shopping.naver.com') || lower.includes('naver.com')) {
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

    return { body: text, comment: '' };
  }

  // 전체 결과 일괄 생성
  async generateAll(product, apiKey = '') {
    const name = this.inferProductName(product);
    const link = product.link || 'https://link.com';
    const memo = product.memo || '삶의 질을 높여주는 필수 추천 아이템';
    const platform = (product.platform && product.platform !== 'general') 
      ? product.platform 
      : this.detectPlatform(link);

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
    const platId = p.platform || 'general';
    const plat = (typeof AffiliatePlatforms !== 'undefined' && AffiliatePlatforms[platId]) 
      ? AffiliatePlatforms[platId] 
      : (typeof AffiliatePlatforms !== 'undefined' ? AffiliatePlatforms['general'] : null);

    const badge = plat ? plat.badgeText : 'MY FAVORITE 🤍';
    const benefit = plat ? plat.deliveryBenefit : '써보고 너무 만족스러워서 공유하는 찐추천템 🥹';
    const shortName = plat ? plat.shortName : '특가';

    return [
      {
        slideNum: 1,
        type: 'cover',
        badge: badge,
        mainTitle: `${name}\n솔직하게 써본 후기 ✨`,
        subTitle: benefit,
        extra: `${shortName} 혜택 놓치지 마세요`
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
        subTitle: `${shortName} 혜택으로 빠르게 만나보세요!\n구매 및 상세 링크는 프로필/첫댓글에서 바로 확인 가능해요!`,
        extra: '한정 수량 조기 마감 주의'
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
    const platId = p.platform || 'general';
    const plat = (typeof AffiliatePlatforms !== 'undefined' && AffiliatePlatforms[platId]) 
      ? AffiliatePlatforms[platId] 
      : (typeof AffiliatePlatforms !== 'undefined' ? AffiliatePlatforms['general'] : null);

    // 플랫폼별 자연스러운 배송/구매 감탄 문구
    let platformExperience = '진작 살 걸 왜 이제야 샀나 싶을 정도!';
    if (platId === 'coupang') {
      platformExperience = '배송도 로켓으로 다음 날 바로 문앞에 와서 기다릴 틈도 없었어요 🚀';
    } else if (platId === 'ohou') {
      platformExperience = '오늘의집에서 꼼꼼히 후기 보고 골랐는데 인테리어도 안 해치고 감성 폭발이에요 🏠🤍';
    } else if (platId === 'kurly') {
      platformExperience = '컬리 샛별배송으로 새벽에 신선하게 도착해서 아침부터 기분 좋게 언박싱했어요 💜';
    } else if (platId === 'oasis') {
      platformExperience = '오아시스 새벽배송으로 친환경 산지직송 안심하고 바로 받아봤어요 🌱✨';
    } else if (platId === 'toss') {
      platformExperience = '토스쇼핑에서 특가 떴을 때 쉐어링크 타고 알뜰하게 쟁여서 가성비 만족도 200%예요 ⚡';
    } else if (platId === 'smartstore') {
      platformExperience = '네이버 도착보장으로 안전하고 빠르게 도착해서 찐만족 중이에요 📦';
    }

    // 플랫폼별 공정위 문구 (쿠팡, 오늘의집, 컬리, 오아시스, 토스, 스마트스토어 등)
    const platDisclaimer = (plat && plat.disclaimer) ? `\n\n${plat.disclaimer}` : '';
    const isAmazon = platId === 'amazon_jp';
    const amazonDisclaimer = isAmazon 
      ? '\n\n※ 当アカウントはAmazonアソシエイト・プログラムの参加者です。' 
      : '';

    if (channel === 'threads-kr') {
      // 1. 한국 스레드: [1단계: 본문] + [2단계: 첫 번째 댓글]
      return `📌 [1단계: 본문 포스팅에 복붙] (사진/영상 첨부, 외부 링크 없음으로 계정 보호 🛡️)
─────────────────────
진짜 이거 써보고 요즘 삶의 질 수직상승했어요 🥹🤍
SNS에서 다들 극찬하길래 반신반의하면서 들여왔는데
직접 써보니까 왜 인생템이라고 하는지 바로 납득됨…✨

${memo}

매일 반복되던 작은 불편함들이 싹 해결돼서
요즘 하루하루가 너무 편하고 기분 좋은 거 있죠 🫧
${platformExperience}

혹시 저처럼 고민해보신 분 계신가요?
다들 어떻게 해결하고 계신지 댓글로 꿀팁 공유해주세요! 👀💬

#내돈내산 #아이템추천 #삶의질수직상승 #살림템 #꿀템 #일상공유 #인생템

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 [2단계: 첫 번째 댓글에 바로 복붙] (업로드 후 내 글에 답글로 등록 🔗)
─────────────────────
사진/영상에 나온 [${name}] 상세 정보랑 최저가 링크 물어보시는 분들이 많아서 댓글로 남겨둘게요!
필요하신 분들은 아래 링크나 프로필 링크에서 확인하실 수 있어요 👇
🔗 ${link}

혹시 사용감이나 더 궁금한 점 있으시면 편하게 답글 남겨주세요! 솔직하게 다 알려드릴게요 🤍${platDisclaimer}`;
    }

    if (channel === 'threads-jp') {
      // 2. 일본 스레드
      return `📌【ステップ1：本文にコピペ】（写真・動画添付、外部リンク一切なしでアカウント保護 🛡️）
─────────────────────
これ使い始めてから、毎日のプチストレスが本当にゼロになった🥹🤍
SNSでめちゃくちゃバズってて気になってたんだけど、
もっと早く買えばよかった…！完全にQOL爆上がりアイテム✨

${memo}

毎日の生活がぐっと快適になって、小さなイライラもスッキリ解消💭
デザインも可愛くてお気に入り🫧

みんなはこういう便利グッズ使ってる？
おすすめあったらぜひコメントで教えてね〜！👀💬

#買ってよかった #おすすめ #QOL向上 #便利グッズ #ライフハック #正直レビュー #暮らしを楽しむ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬【ステップ2：最初の返信コメントにコピペ】（投稿後、自分の投稿にリプライ 🔗）
─────────────────────
写真・動画に出てきた【${name}】の詳細やお得な購入先リンクをまとめておきました！
気になった方はこちらからチェックしてみてね👇💕
🔗 ${link}

使ってみた感想や質問があれば、お気軽にコメントしてね🥰${amazonDisclaimer}`;
    }

    if (channel === 'naver-blog') {
      // 3. 네이버 블로그 (스마트에디터 ONE 서식)
      return `안녕하세요 여러분! 오늘도 기분 좋은 하루 보내고 계신가요? 🤍
오늘은 요즘 제 삶의 질을 200% 수직상승시켜 준 찐추천템,
**[${name}]** 솔직 내돈내산 후기를 들고 왔어요! ✨

SNS에서 워낙 입소문이 자자해서 반신반의하며 데려왔는데,
결론부터 말씀드리면 "진작 살 걸 왜 이제야 샀나" 싶을 만큼 대만족 중인 아이템이에요 🥹

---

### ✨ 직접 써보고 반한 핵심 포인트!

✔ **${memo}**
✔ 작은 디테일까지 신경 쓴 깔끔한 마감과 디자인
✔ ${platformExperience}

평소에 은근히 신경 쓰이고 번거로웠던 부분들을 싹 해결해 주니까
일상 속 피로감이 확 줄어들고 능률도 훨씬 올라가더라구요 :)

---

### 🛍️ 최저가 구매처 & 혜택 정보 공유

많은 분들이 댓글로 구매처 문의를 주셔서 바로가기 링크 남겨둘게요!
자세한 스펙이나 현재 진행 중인 할인 프로모션은 아래 공식 링크에서 확인하실 수 있어요 👇

👉 [${name}] 최저가 바로가기
🔗 ${link}

직접 꼼꼼히 써보고 솔직하게 작성한 후기인 만큼,
비슷한 고민을 하고 계셨던 분들께 작은 도움이 되었으면 좋겠습니다!
도움이 되셨다면 공감과 이웃 추가 부탁드려요 🤍${platDisclaimer}`;
    }

    if (channel === 'ameba-jp') {
      // 4. 일본 아메바 블로그
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
現在、お得なキャンペーンやセールが実施されているようなので、
気になっていた方はぜひチェックしてみてくださいね🛒💨

▶︎ 商品の詳細・公式ページはこちら💕
${link}

最後まで読んでくださり、本当にありがとうございました！
よかったら「いいね」やフォローもポチッとしていただけるととっても励みになります🥰✨${amazonDisclaimer}

#アメブロ #購入品紹介 #正直レビュー #便利アイテム #プチプラ #お気に入り #暮らしを楽しむ`;
    }

    if (channel === 'instagram') {
      // 5. 인스타그램 피드
      return `✨ 요즘 제 일상에서 가장 만족스럽게 쓰고 있는 최애템 공유해요 🥹🤍
━━━━━━━━━━━━━━━━━
눈여겨보고 있다가 드디어 데려온
👉 [${name}] 직접 써본 솔직 후기 🫧

평소에 은근히 신경 쓰이고 번거로웠던 부분들을
깔끔하게 해결해 줘서 요즘 매일 손이 가는 아이템이에요 🤍

💡 직접 써보고 느낀 포인트 CHECK
✔ ${memo}
✔ 깔끔하고 감성적인 디자인 & 확실한 실용성
✔ 써볼수록 만족스러워서 주변에도 조용히 추천 중 :)

📍 구매 정보
프로필 링크 또는 아래 링크에서
자세한 정보와 할인가로 확인하실 수 있어요 🛍️
🔗 ${link}

나중에 필요할 때 찾아보시려면 [저장🏷️] 해두시고,
궁금한 점은 편하게 댓글로 남겨주세요 🤍
━━━━━━━━━━━━━━━━━${platDisclaimer}
#${name.replace(/\s+/g, '')} #내돈내산 #아이템추천 #살림템 #꿀템추천 #인스타쇼핑 #일상템 #감성템 #삶의질수직상승 #추천템`;
    }

    return '';
  }

  // --- Gemini API (고급 텍스트 튜닝) ---
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

  // --- 📸 Gemini Vision (제품 사진 / 상세페이지 캡처 AI 분석) ---
  async analyzeProductImageWithVision(dataUrl, apiKey) {
    if (!apiKey || !apiKey.trim()) {
      throw new Error('Gemini API 키가 필요합니다.');
    }
    if (!dataUrl || !dataUrl.includes(',')) {
      throw new Error('유효한 이미지 데이터가 없습니다.');
    }

    const [header, base64Data] = dataUrl.split(',');
    const mimeMatch = header.match(/data:([^;]+);base64/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    const visionPrompt = `
당신은 대한민국 1등 커머스 바이럴 마케터이자 전문 카피라이터입니다.
제공된 이미지는 온라인 쇼핑몰(쿠팡, 오늘의집, 마켓컬리, 오아시스마켓, 토스쇼핑, 네이버 스마트스토어 등)의 [실제 제품 사진]이거나 [상세페이지 캡처 스크린샷]입니다.

이 이미지를 정밀 분석하여 스레드, 블로그, 인스타그램 카드뉴스 제작에 바로 사용할 수 있도록 다음 JSON 형식으로만 응답해 주세요:

{
  "productName": "가장 부르기 쉽고 직관적인 핵심 제품명 (예: 무선 온열 넥케어 마사지기, 저당 굴소스, 슬라이딩 싱크대 수납랙 등 2~5단어)",
  "keyFeatures": [
    "핵심 장점/스펙 1 (구체적 숫자나 주요 성분, 효능)",
    "핵심 장점/스펙 2 (실제 사용 시 해결해주는 불편함/고통)",
    "핵심 장점/스펙 3 (감성, 가성비 또는 만족도 포인트)"
  ],
  "viralMemo": "SNS에서 실제 사용자가 감탄하며 쓴 듯한 생생한 내돈내산 2~3줄 후킹 메모 (불렛 없이 자연스러운 구어체: ~해서 대박, ~라 삶의 질 수직상승 등)",
  "suggestedCategory": "kitchen 또는 living 또는 lifestyle"
}

반드시 다른 부연설명 없이 순수 JSON만 출력하세요.
`;

    for (const model of this.geminiModels) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: visionPrompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Data
                  }
                }
              ]
            }],
            generationConfig: {
              temperature: 0.2,
              response_mime_type: "application/json"
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            let cleanJson = rawText.trim();
            if (cleanJson.startsWith('```json')) {
              cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            } else if (cleanJson.startsWith('```')) {
              cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
            }
            const parsed = JSON.parse(cleanJson);
            return {
              success: true,
              productName: parsed.productName || '화제의 인기 추천템',
              keyFeatures: parsed.keyFeatures || [],
              viralMemo: parsed.viralMemo || (parsed.keyFeatures ? parsed.keyFeatures.join(', ') : ''),
              suggestedCategory: parsed.suggestedCategory || 'kitchen'
            };
          }
        }
      } catch (e) {
        console.warn(`Vision model ${model} failed:`, e);
      }
    }

    throw new Error('AI 비전 분석에 실패했습니다. API 키와 네트워크 연결을 확인해주세요.');
  }

  // --- 🎨 5단 스토리텔링 AI 이미지 자동 생성 엔진 (직장인 15초 모바일 전용) ---

  // 한국어 제품명을 고품질 AI 이미지 프롬프트용 영문 키워드로 스마트 변환
  translateProductToEnglish(name) {
    if (!name) return 'aesthetic lifestyle home product';
    const lower = name.toLowerCase();

    // 빈출 인기 바이럴 키워드 사전 매핑
    const dict = [
      { kr: /계란말이|달걀/g, en: 'Japanese tamagoyaki rolled egg pan with savory golden rolled omelette' },
      { kr: /마늘\s*다지기|야채\s*다지기|초퍼/g, en: 'compact cordless electric garlic chopper food mincer with chopped garlic' },
      { kr: /오일\s*스프레이|기름\s*스프레이/g, en: 'sleek glass olive oil mister spray bottle on modern kitchen counter' },
      { kr: /굴소스|소스|페스토/g, en: 'gourmet low-sugar culinary sauce bottle with appetizing cooked dish' },
      { kr: /두부|한우|고기|식재료/g, en: 'fresh organic premium cooking ingredients on wooden board' },
      { kr: /배수구|실리콘\s*덮개|덮개/g, en: 'clean hygienic silicone sink drain cover in modern pristine kitchen' },
      { kr: /수납랙|하부장|선반|양념선반/g, en: 'modern minimalist sliding organizer shelf under sink with neatly organized bottles' },
      { kr: /트롤리|이동식\s*선반/g, en: 'slim minimalist aesthetic rolling cart trolley neatly organized in cozy home' },
      { kr: /워터블럭|스펀지|행주/g, en: 'clean PVA absorbent water block sponge wiping spotless kitchen counter' },
      { kr: /마사지기|넥케어|목\s*마사지/g, en: 'modern ergonomic cordless neck massager device with soothing warm ambient glow' },
      { kr: /휴지통|쓰레기통/g, en: 'minimalist modern smart motion sensor trash can in stylish apartment' },
      { kr: /진공포장기|진공/g, en: 'sleek compact cordless food vacuum sealer machine with sealed food' },
      { kr: /선풍기|목걸이\s*선풍기/g, en: 'ultra lightweight portable neck fan personal cooler in clean modern style' },
      { kr: /앰플|세럼|시카|판테놀|화장품/g, en: 'luxury minimalist glass dropper skincare serum bottle on warm stone surface' },
      { kr: /텀블러|보온병/g, en: 'modern pastel insulated stainless steel tumbler with reusable straw' },
      { kr: /청소기|무선\s*청소기/g, en: 'lightweight cordless handheld mini vacuum cleaner cleaning sleek modern desk' },
      { kr: /베개|경추베개/g, en: 'ergonomic memory foam neck contour pillow on cozy minimalist white bed' },
      { kr: /스탠드|조명|무드등/g, en: 'aesthetic warm ambient minimalist bedside table lamp glowing at night' },
      { kr: /에어프라이어/g, en: 'sleek modern matte compact air fryer on clean kitchen counter' },
      { kr: /프라이팬|냄비/g, en: 'premium ceramic nonstick cooking pan with delicious appetizing dish' }
    ];

    for (const item of dict) {
      if (item.kr.test(lower)) {
        return item.en;
      }
    }

    // 매칭되지 않는 일반 상품인 경우 자연스러운 라이프스타일 상품으로 조합
    const cleanName = name.replace(/[\[\]\(\)\★\🔥\✨\⚡\🤍]/g, '').trim();
    return `stylish modern Korean lifestyle product (${cleanName}), minimalist high-end consumer goods`;
  }

  // 카테고리별 인테리어 배경 & 분위기 프리셋
  getCategoryVibe(category, name) {
    const text = (category + ' ' + name).toLowerCase();
    if (text.includes('kitchen') || text.includes('요리') || text.includes('주방') || text.includes('식재료') || text.includes('팬') || text.includes('오일') || text.includes('마늘')) {
      return {
        setting: 'a sunlit cozy minimalist kitchen with warm wooden countertop and white ceramic tiles',
        problemContext: 'messy cluttered cooking scene with cooking grease splatter and cooking frustration',
        actionContext: 'hands cooking effortlessly and smoothly with joyful kitchen workflow',
        detailContext: 'premium nonstick food-grade texture, sturdy ergonomic handle, perfect craftsmanship',
        resultContext: 'delicious freshly prepared appetizing meal on clean aesthetic breakfast table'
      };
    }
    if (text.includes('living') || text.includes('살림') || text.includes('수납') || text.includes('인테리어') || text.includes('욕실') || text.includes('청소')) {
      return {
        setting: 'a modern Scandinavian cozy home interior with natural oak wood and tidy white aesthetic',
        problemContext: 'disorganized cluttered messy living room space causing daily tidying stress',
        actionContext: 'smooth one-touch effortless organization transforming the room in seconds',
        detailContext: 'durable seamless materials, smooth silent sliding mechanism, sleek minimal design',
        resultContext: 'spotless impeccably organized aesthetic cozy room bringing total peace of mind'
      };
    }
    // 기본 라이프/뷰티/헬스케어
    return {
      setting: 'a serene warm aesthetic modern apartment interior with soft sunlight and lush green plants',
      problemContext: 'exhausting daily fatigue, neck stiffness or cluttered stressful daily routine',
      actionContext: 'relaxing comfortably while enjoying the effortless modern smart convenience',
      detailContext: 'luxurious soft-touch finish, precision engineering, intuitive minimalist buttons',
      resultContext: 'blissful comfortable lifestyle, renewed peaceful energy in a cozy modern home'
    };
  }

  // 5대 슬라이드 스토리별 프롬프트 자동 조립
  generate5ScenePrompts(productName, category = '') {
    const subject = this.translateProductToEnglish(productName);
    const vibe = this.getCategoryVibe(category, productName);

    return [
      // 1번 슬라이드: 표지 (시선 강탈 히어로 샷 / 완성형 비주얼)
      `professional commercial product photography of ${subject}, centered hero composition, ${vibe.setting}, soft golden hour ambient lighting, clean aesthetic, Instagram viral lifestyle photo, 8k resolution, photorealistic`,

      // 2번 슬라이드: 공감/문제 (사용 전 불편함과 일상 속 스트레스 상황)
      `relatable authentic scene of ${vibe.problemContext}, natural indoor lighting, cinematic documentary photography, moody candid storytelling photo`,

      // 3번 슬라이드: 해결/실사용 (실제 사용하며 문제를 단숨에 해결하는 액션 컷)
      `close-up dynamic action shot of person using ${subject}, ${vibe.actionContext}, bright natural daylight, crisp sharp focus, satisfying lifestyle moment, 8k`,

      // 4번 슬라이드: 디테일/특징 (재질, 마감, 기능 초근접 접사 컷)
      `macro detailed close-up shot of ${subject}, ${vibe.detailContext}, soft shallow depth of field, elegant studio lighting, tactile premium feeling`,

      // 5번 슬라이드: 만족/결과 (삶의 질이 수직상승한 감성 라이프스타일 컷)
      `dreamy aesthetic lifestyle interior scene featuring ${vibe.resultContext}, with ${subject} proudly placed, cozy warm evening glow, peaceful happiness, 8k photo`
    ];
  }

  // AI 생성 이미지를 Blob URL로 다운로드하여 캔버스 Tainted 원천 차단
  async fetchAiImageBlobUrl(prompt, seed = Math.floor(Math.random() * 1000000)) {
    const encoded = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=1080&height=1920&nologo=true&seed=${seed}&enhance=true`;
    
    try {
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    } catch (e) {
      console.warn('Direct blob fetch fallback to image url:', e);
      return url;
    }
  }

  // 5개 슬라이드 전체 AI 이미지 일괄 병렬/순차 생성 (진행 콜백 지원)
  async generate5SceneImages(productName, category = '', onProgress = null) {
    const prompts = this.generate5ScenePrompts(productName, category);
    const baseSeed = Math.floor(Math.random() * 900000) + 100000;
    const results = [];

    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];
      const seed = baseSeed + (i * 73);
      try {
        if (onProgress) onProgress(i, 'loading', null);
        const imgUrl = await this.fetchAiImageBlobUrl(prompt, seed);
        results.push(imgUrl);
        if (onProgress) onProgress(i, 'done', imgUrl);
      } catch (err) {
        console.warn(`Slide ${i + 1} AI image generation failed:`, err);
        results.push(null);
        if (onProgress) onProgress(i, 'error', null);
      }
    }
    return results;
  }
}

const ContentGenerator = new ContentGeneratorEngine();
window.ContentGenerator = ContentGenerator;
if (typeof globalThis !== 'undefined') {
  globalThis.ContentGenerator = ContentGenerator;
}
