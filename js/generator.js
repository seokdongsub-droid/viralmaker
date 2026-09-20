/**
 * generator.js
 * 2030 여성 인플루언서 / 라이프스타일 크리에이터 감성 톤앤매너 카피라이팅 엔진
 * 쿠팡 파트너스, 아마존 재팬, 네이버 스마트스토어 등 링크 맞춤 분석 지원
 */

class ContentGenerator {
  constructor() {
    this.geminiModels = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.0-flash'];
  }

  // 쇼핑몰 플랫폼 자동 감지
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

    // 2. 텍스트 채널 생성 (여성 말투 기반)
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

  // 한국어 인스타 카드뉴스 5장 슬라이드 (여성 감성)
  generateKoreanCardNews(p) {
    const name = p.name;
    const memo = p.memo;
    const isCoupang = p.platform === 'coupang';

    return [
      {
        slideNum: 1,
        type: 'cover',
        badge: isCoupang ? '🚀 로켓배송 득템' : 'HOT ITEM 🤍',
        mainTitle: `${name}\n솔직 찐후기 푼다!`,
        subTitle: isCoupang ? '내일 바로 도착! 직접 써보고 감탄한 리얼 후기' : '삶의 질 수직상승! 왜 다들 극찬하는지 알겠네 🥹',
        extra: isCoupang ? '로켓배송 무료반품 혜택' : '지금 주문 시 한정 할인 혜택'
      },
      {
        slideNum: 2,
        type: 'problem',
        badge: 'CHECK POINT ㅠㅠ',
        mainTitle: '매일 반복되는 이 불편함\n혹시 참고 계셨나요?',
        subTitle: `${memo}\n더 이상 참지 말고 하루라도 빨리 바꿔보세용!`,
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
        subTitle: `${isCoupang ? '로켓배송으로 빠르게 받아보세요!\n' : ''}구매 및 상세 링크는 프로필에서 바로 확인 가능해용!`,
        extra: isCoupang ? '쿠팡 와우회원 추가 할인' : '한정 수량 조기 마감 주의'
      }
    ];
  }

  // 일본어 인스타 카드뉴스 5장 슬라이드 (日本語バージョン・女子力高め)
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

  // --- 여성 말투 5대 채널 복붙용 로컬 템플릿 생성 엔진 ---
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
      // 1. 한국 스레드 (2030 여성 인플루언서 일상 찐후기체)
      return `언니들… 나 진짜 이거 써보고 신세계 열렸잖아 🥹🤍
왜 다들 ${name} 좋다고 난리쳤는지 이제야 완벽 이해함 ㅠㅠ

솔직히 반신반의하면서 샀는데,
${memo}
써보자마자 바로 내 인생템 등극했잖아 👏

${isCoupang ? '🚀 로켓배송이라 주문하고 다음 날 바로 문앞에 와서 더 감동이었음!' : '매일 고생하던 나 자신한테 미안해질 정도로 삶의 질 수직상승템 인정이야 🤍'}

지금 할인 중이라 필요했던 언니들은 얼른 쟁여둬!
👉 구매 링크: ${link}

궁금한 점 있는 언니들은 댓글 남겨주면 솔직하게 다 알려줄게용 💬💖${coupangDisclaimer}

#아이템추천 #내돈내산 #꿀템 #생활꿀팁 #스레드쇼핑 #인생템`;
    }

    if (channel === 'threads-jp') {
      // 2. 일본 스레드 (일본 2030 여성/OL/인플루언서 바즈 문체)
      return `正直これ買ってなかったら今年一番後悔してたかも…！🥹🤍
SNSで話題の『${name}』、実際に使ってみたら想像以上に神アイテムすぎて感動しちゃった💭💕

【実際に使ってリアルに感動したポイント👇】
・${memo}
・毎日のプチストレスがこれ1つでゼロになったの…！

${isAmazon ? '📦 Amazonプライム対応だからすぐ届くのも最高に助かる…！' : 'もっと早く買えばよかった大優勝アイテム🏆'}
気になってた人はタイムセール含めてぜひチェックしてみてね〜！🤍

🔗 詳細・購入リンクはこちらから👇
${link}

質問あれば気軽にコメントしてね🥰 全部お返事します💌${amazonDisclaimer}

#おすすめ #買ってよかった #便利グッズ #QOL向上 #Amazon購入品 #ライフハック #正直レビュー #女子力向上`;
    }

    if (channel === 'naver-blog') {
      // 3. 네이버 블로그 (친절하고 다정한 2030 여성/새댁 블로거 톤)
      return `# [솔직후기] 삶의 질 수직상승! ${name} 내돈내산 직접 써본 장단점 총정리 🤍

안녕하세요 여러분! 일상의 유용한 꿀템을 솔직하게 리뷰하는 블로거예요 🥰✨

오늘은 요즘 SNS와 커뮤니티에서 정말 핫하게 떠오르고 있는 **[${name}]**을 직접 내돈내산해서 꼼꼼하게 써본 찐후기를 전해드리려고 해요 💕

---

## 📦 첫인상 및 언박싱 🎀
택배 상자 뜯자마자 감탄했어요! 패키지부터 군더더기 없이 너무 깔끔하고 예뻐서 개봉하자마자 마음에 쏙 들더라구요 🤍 마감 처리도 정말 꼼꼼해서 언박싱하는 내내 기분이 좋아졌답니다.

---

## 💡 실제로 써보고 반해버린 핵심 포인트 ✨
- **핵심 특징:** ${memo}
- 며칠간 꾸준히 써보니까 왜 진작 안 샀을까 후회될 정도로 일상이 너무 편해진 거 있죠 ㅠㅠ
- 솔직히 저 혼자만 알고 있기 너무 아까워서 주변 친구들한테도 엄청 입소문 내고 있어요 🥰
${isCoupang ? '- **배송:** 쿠팡 로켓배송으로 주문 다음 날 바로 안전하게 수령해서 넘 좋았어용 🚀' : ''}

---

## 🎯 이런 분들께 특히 추천드려요! 💖
- 매일 반복되는 피로와 번거로움을 싹 날려버리고 싶으신 분들
- 감성 넘치는 디자인과 탄탄한 품질을 모두 챙기고 싶으신 분들

---

## 💰 구매처 및 할인 정보 바로가기 🛍️
현재 특별 프로모션 및 할인이 진행 중이니, 관심 있으신 분들은 아래 링크를 통해 알뜰하게 혜택 챙겨보세용!

▼ 제품 상세 정보 및 구매 바로가기
${link}

궁금하신 점이 있으시다면 언제든 편하게 댓글 남겨주세용.
오늘도 향기롭고 행복한 하루 보내세요! 감사합니다 🥰✨${coupangDisclaimer}

#${name.replace(/\s+/g, '')} #솔직후기 #내돈내산 #제품추천 #인생템 #살림꿀팁 #일상리뷰`;
    }

    if (channel === 'ameba-jp') {
      // 4. 일본 아메바 블로그 (사랑스럽고 다정한 일본 여성 블로거 톤)
      return `皆様こんにちは🌸
いつもブログに遊びに来てくださりありがとうございます🥰💕

今日は、SNSや口コミでも大人気でずっと気になっていた
**【${name}】** を実際に購入して試してみたので、正直にレビューしたいと思います✨

結論から言うと…
「なんでもっと早く買わなかったんだろう〜！」と感動しちゃうレベルの大満足アイテムでした🥹🤍

---

### 🌸 お気に入り＆感動ポイント 🎀
・${memo}
・毎日の暮らしがぐっと快適になって、ストレスが本当に軽くなりました💭
${isAmazon ? '・Amazonプライム便で注文後すぐに届いたのも助かりました📦💕' : ''}

私と同じように毎日の家事やお仕事で忙しい女性의 皆様には、
全力でおすすめしたい神アイテムです🥰✨

---

### 🛒 お得なキャンペーン＆購入先 🛍️
現在、期間限定のお得なキャンペーンが実施されているそうです！
人気商品のため気になる方はお早めにチェックしてみてくださいね🛒💨

▶︎ 商品の詳細・公式ページはこちら💕
${link}

最後まで読んでくださり、本当にありがとうございました！
よかったら「いいね」やフォローもポチッとしていただけるととっても嬉しいです🥰✨${amazonDisclaimer}

#アメブロ #購入品紹介 #正直レビュー #便利アイテム #プチプラ #お気に入り #Amazon購入品 #暮らしを楽しむ`;
    }

    if (channel === 'instagram') {
      // 5. 인스타그램 피드 (인스타 감성 2030 여성 쇼핑/리뷰 톤)
      return `✨ 인친님들… 저 드디어 인생템 찾았어요 🥹🤍✨
━━━━━━━━━━━━━━━━━
요즘 SNS에서 대란 난 화제의 바로 그 아이템,
👉 [${name}] 직접 써본 리얼 찐후기 들고 왔어용 🎀

평소에 겪던 불편함을 싹 해결해줘서
요즘 매일매일 감탄하면서 쓰고 있는 중이랍니다 🤍

💡 요거 진짜 물건인 이유 CHECK!
✔ ${memo}
✔ 감성 넘치는 깔끔한 디자인 & 확실한 사용 만족도
${isCoupang ? '✔ 로켓배송으로 내일 바로 도착해서 힐링 시작 🚀\n' : ''}✔ 갓성비까지 완벽해서 주변에도 열렬히 추천 중 🥰

📍 구매 방법
프로필 링크(@계정명) 클릭 또는 아래 링크에서
특별 할인가로 바로 만나보실 수 있어용! 🛍️
🔗 ${link}

도움이 되셨다면 [저장🏷️ & 좋아요💖] 꾹 눌러두시고 나중에 꺼내보세용!
━━━━━━━━━━━━━━━━━${coupangDisclaimer}
#${name.replace(/\s+/g, '')} #아이템추천 #내돈내산 #인스타쇼핑 #살림꿀팁 #꿀템추천 #인기템 #선물추천 #인생템 #쇼핑스타그램 #일상템 #득템 #특가정보 #한정특가 #제품리뷰`;
    }

    return '';
  }

  // --- Gemini API (고급 튜닝) ---
  async generateWithGemini(channel, p, apiKey) {
    const isCoupang = p.platform === 'coupang';
    const isAmazon = p.platform === 'amazon_jp';

    const prompt = `
You are an expert female social media influencer & lifestyle e-commerce copywriter.
Create a high-converting, ready-to-copy-paste promotional post for [${channel}] for this product:
- Product Name: ${p.name}
- Product Link: ${p.link} (Platform: ${p.platform})
- Core Notes: ${p.memo}

CRITICAL TONE REQUIREMENTS:
- Tone: Charming, emotional, trendy 20s-30s FEMALE influencer/blogger voice (여성 인플루언서 / 여성 일상 톤앤매너).
- Korean endings: Use friendly, lovely feminine phrasing like "~했어용", "~인 거 있죠!", "~더라구요 ㅠㅠ", "~했어요 ㅎㅎ", and warm emojis (🤍, 🥹, 💖, ✨, 🎀).
- Japanese endings: Use authentic Japanese female influencer/OL tone like "~しちゃいました💕", "~してみてね🤍", "~すぎる…！🥹", "みんなもぜひチェックしてみてね🥰".

Special Requirements:
${isCoupang ? '- Since this is a Coupang link, ensure you append the required Korean affiliate disclosure at the end: "※ 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다." and naturally mention fast delivery.' : ''}
${isAmazon ? '- Since this is an Amazon Japan link, write in natural Japanese social media commerce style and include: "※ 当アカウントはAmazonアソシエイト・プログラムの参加者です。" at the end.' : ''}

Return ONLY the copy-paste-ready text, without explanations.
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
