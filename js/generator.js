/**
 * generator.js (ContentGeneratorEngine v3.0)
 * 5대 제휴 플랫폼 감지, 3~5장 가변 카드뉴스 씬 기획,
 * 제미나이(Gemini) 카드별 씬 프롬프트 생성기,
 * 스레드 4종 바이럴 젬(Gem) 피드 엔진, 네이버 블로그 1200x900 가이드,
 * 아메바/티스토리 인라인 HTML 및 쿠팡 인플루언서 자동 DM 키트 통합 모듈
 */

class ContentGeneratorEngine {
  constructor() {
    this.geminiModels = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash'
    ];
  }

  // 쇼핑몰 플랫폼 감지 (쿠팡, 오늘의집, 마켓컬리, 오아시스, 토스, 네이버 스마트스토어, 아마존 재팬 등)
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

  // 제품 카테고리 추론 (식품, 살림/주방, 리빙/가전, 뷰티 등)
  inferCategory(product) {
    const text = `${product.name || ''} ${product.memo || ''} ${product.link || ''}`.toLowerCase();
    if (text.includes('립') || text.includes('틴트') || text.includes('앰플') || text.includes('세럼') || text.includes('크림') || text.includes('패치') || text.includes('화장') || text.includes('뷰티')) {
      return 'beauty';
    }
    if (text.includes('페이퍼') || text.includes('과일') || text.includes('간식') || text.includes('디저트') || text.includes('레시피') || text.includes('소스') || text.includes('팬') || text.includes('다지기') || text.includes('주방') || text.includes('요리')) {
      return 'kitchen_food';
    }
    if (text.includes('마사지') || text.includes('넥케어') || text.includes('청소') || text.includes('스폰지') || text.includes('워터블럭') || text.includes('수납') || text.includes('선반') || text.includes('배수구') || text.includes('진공')) {
      return 'living';
    }
    return 'general';
  }

  // 💡 카테고리별 최적 이미지 장수(3컷 vs 4컷) 및 추천 근거 제공
  recommendCutCount(product) {
    const cat = this.inferCategory(product);
    const text = `${product.name || ''} ${product.memo || ''}`.toLowerCase();
    
    // 조리도구 / 프라이팬 / 냄비 / 칼 / 뷰티 / 화장품: 4컷 추천
    if (cat === 'beauty' || /팬|도마|칼|냄비|그릇|조리|주방|식기|다지기|프라이팬|뚝배기/.test(text)) {
      return {
        count: 4,
        categoryName: cat === 'beauty' ? '뷰티/코스메틱' : '주방용품/조리도구',
        reason: '표지 ➔ 실사용 액션 ➔ 소재/발색 초근접 접사 ➔ 완성/CTA 4단계 풀스토리가 가장 전환율이 높습니다.',
        badge: '🎯 4컷 추천 (풀스토리)'
      };
    }

    // 수납 / 정리 / 청소 / 욕실 / 간편식 레시피: 3컷 추천
    if (cat === 'living' || /수납|정리|선반|압축|청소|욕실|페이퍼|과일|디저트|레시피/.test(text)) {
      return {
        count: 3,
        categoryName: /페이퍼|과일|디저트|레시피/.test(text) ? '간편 레시피' : '살림/수납/정리',
        reason: '비포(고민 후킹) ➔ 1초 해결 과정 ➔ 완벽한 애프터 3단계 스피드 임팩트가 가장 효과적입니다.',
        badge: '⚡ 3컷 추천 (스피드 임팩트)'
      };
    }

    // 기본: 인스타그램 표준 4컷 데이즈홈 스타일
    return {
      count: 4,
      categoryName: '생활/일반 상품',
      reason: '인스타그램 피드에서 가장 검증된 4컷 스토리텔링을 권장합니다.',
      badge: '🎯 4컷 권장'
    };
  }

  // 전체 결과 일괄 생성 (3~5장 가변 장수 및 수익화 모드 지원)
  async generateAll(product, apiKey = '', slideCount = 4, monetizationMode = 'link') {
    const name = this.inferProductName(product);
    const link = product.link || 'https://link.coupang.com/...';
    const memo = product.memo || '삶의 질을 2배로 올려주는 필수 대란템';
    const platform = (product.platform && product.platform !== 'general') 
      ? product.platform 
      : this.detectPlatform(link);
    const category = this.inferCategory(product);

    const cleanProduct = { ...product, name, link, memo, platform, category, slideCount, monetizationMode };

    // 1. 카드뉴스 슬라이드 생성 (3장 / 4장 데이즈홈 / 5장 표준)
    const cardnews_ko = this.generateCardNewsSlides(cleanProduct, slideCount, 'ko', monetizationMode);
    const cardnews_ja = this.generateCardNewsSlides(cleanProduct, slideCount, 'ja', monetizationMode);

    // 2. 제미나이(Gemini) 카드별 씬 이미지 프롬프트 패키지 생성
    const geminiPrompts = this.generateGeminiPrompts(cleanProduct, slideCount, 'ko', monetizationMode);

    // 3. 스레드(Threads) 4종 바이럴 젬(Gem) 피드 생성
    const threadsFeeds = this.generateThreadsFeeds(cleanProduct);

    // 4. 네이버 블로그 1200x900 사진 가이드 및 SEO 본문 생성
    const naverBlog = this.generateNaverBlogPost(cleanProduct, slideCount);

    // 5. 아메바/티스토리 매거진 인라인 HTML 생성
    const editorialHtml = this.generateEditorialHtml(cleanProduct, slideCount);

    // 6. 쿠팡 인플루언서 자동 DM 1초 세팅 키트 생성
    const coupangAutoDmKit = this.generateCoupangAutoDmKit(cleanProduct);

    // 기존 호환 채널 텍스트 매핑
    const texts = {
      'threads-kr': `${threadsFeeds.type1.body_ko}\n\n${threadsFeeds.pinned_comment_ko}`,
      'threads-jp': `${threadsFeeds.type1.body_ja}\n\n${threadsFeeds.pinned_comment_ja}`,
      'naver-blog': naverBlog.fullText,
      'ameba-jp': editorialHtml.htmlCode,
      'instagram': this.generateInstagramCaption(cleanProduct, slideCount, monetizationMode)
    };

    return {
      cardnews_ko,
      cardnews_ja,
      geminiPrompts,
      threadsFeeds,
      naverBlog,
      editorialHtml,
      coupangAutoDmKit,
      texts,
      product: cleanProduct
    };
  }

  // ==========================================
  // ① 가변 카드뉴스 슬라이드 렌더러 데이터 생성
  // ==========================================
  generateCardNewsSlides(p, count = 4, lang = 'ko', monetizationMode = 'link') {
    const isJa = lang === 'ja';
    const name = p.name;
    const memo = p.memo;
    const cat = p.category;
    const isBeauty = cat === 'beauty';
    const isDM = monetizationMode === 'dm';

    if (count === 3) {
      // ⚡ 3장: 스피드 임팩트형 (과일 라이스페이퍼 롤 스타일)
      if (isJa) {
        return [
          {
            slideNum: 1,
            type: 'cover',
            textPosition: 'top',
            badge: 'もちっと爽やか ✦',
            mainTitle: `${name}`,
            subTitle: '火を使わずに作れる、見た目もかわいい神アイテム',
            extra: 'おうちカフェにぴったり'
          },
          {
            slideNum: 2,
            type: 'detail',
            textPosition: 'top',
            badge: 'POINT 01 🔍',
            mainTitle: 'さっと濡らして\nきゅっと巻くだけ',
            subTitle: `${memo}\n誰でも1分でプロ級の仕上がり`,
            extra: '洗い物も少なくて超快適'
          },
          {
            slideNum: 3,
            type: 'cta',
            textPosition: 'top',
            badge: 'QUESTION 🤍',
            mainTitle: isDM ? 'どのフルーツ入れたい？\n情報は「ナド」残してね！' : 'どのフルーツ入れたい？\n保存して作ってみてね',
            subTitle: isDM ? 'コメントで「ナド」と書くとDMでリンクをお届け💌' : '商品の詳細リンクはプロフィールのリンクから🔗',
            extra: '保存しておくと便利！'
          }
        ];
      }
      return [
        {
          slideNum: 1,
          type: 'cover',
          textPosition: 'top',
          badge: '쫀득상큼 ✦',
          mainTitle: `${name}`,
          subTitle: '불 없이 만드는 비주얼 대란, 이 조합은 무조건 저장각',
          extra: '손님 접대·홈카페 필수'
        },
        {
          slideNum: 2,
          type: 'detail',
          textPosition: 'top',
          badge: '재료 & 꿀팁 🔍',
          mainTitle: '재료는 간단하게\n살짝 적신 뒤 돌돌 말면 끝',
          subTitle: `${memo}\n똥손도 식당 퀄리티로 완성되는 비법`,
          extra: '설거지도 1개로 끝남'
        },
        {
          slideNum: 3,
          type: 'cta',
          textPosition: 'top',
          badge: 'Q&A / 저장 🤍',
          mainTitle: isDM ? '어떤 거 넣어보고 싶나요?\n정보는 "나도" 남겨줘!🤍' : '어떤 거 넣어보고 싶나요?\n저장하고 만들어보세요',
          subTitle: isDM ? '댓글에 "나도" 남겨주시면 최저가 구매처 DM 쏴드려요!' : '📍 영상 속 사용 제품 정보는 프로필 링크(또는 첫 댓글)에!',
          extra: '저장해두고 필요할 때 꺼내보세요'
        }
      ];
    }

    if (count === 4) {
      // 🎯 4장: 데이즈홈 / 데이즈코어 시그니처 템플릿 (MAC 립스틱 / 4단 실사 증명 스타일)
      if (isJa) {
        return [
          {
            slideNum: 1,
            type: 'cover',
            textPosition: 'bottom',
            badge: '話題の神アイテム 🔥',
            mainTitle: `【SNSで大バズり】\n${name} 不動の1位`,
            subTitle: isBeauty ? '女優リップ可愛いと思ったら全部これだった件💄' : 'これ知ってから暮らしのストレス完全にゼロになった件✨',
            extra: '完売前に要チェック⚠️'
          },
          {
            slideNum: 2,
            type: 'detail',
            textPosition: 'center',
            badge: 'POINT 01 ✨',
            mainTitle: isBeauty ? '発色に色味まで神がかってると話題\n女優たちも撮影でガチ愛用中' : '1秒で使えて圧倒的に便利すぎる\n毎日のプチストレスがスッキリ解消',
            subTitle: memo,
            extra: 'リアルな口コミ大絶賛'
          },
          {
            slideNum: 3,
            type: 'detail',
            textPosition: 'center',
            badge: 'POINT 02 🔍',
            mainTitle: isBeauty ? '塗った瞬間パッと顔が華やかになって\n清楚で上品な雰囲気に大変身 ㅠㅠ❤️' : '使った瞬間「なぜ今まで買わなかったのか」\n手放せない生活必需品に確定 ㅠㅠ❤️',
            subTitle: '✔ 誰でも簡単 ✔ 失敗なし ✔ 圧倒的クオリティ',
            extra: '今年の優勝アイテム'
          },
          {
            slideNum: 4,
            type: 'cta',
            textPosition: 'center',
            badge: 'SPECIAL CTA 🎁',
            mainTitle: isDM ? '清楚が推しなら絶対これ買い!!!!\n情報は「ナド」残してね!🤍' : '迷ったら絶対これ買い!!!!\n詳細はプロフィールのリンクから🔗',
            subTitle: isDM ? 'コメントで「ナド」と書くとDMで購入リンクをお届け💌' : 'プロフィールのリンクから【513番】を検索してね！',
            extra: '保存して後でチェック'
          }
        ];
      }
      return [
        {
          slideNum: 1,
          type: 'cover',
          textPosition: 'bottom',
          badge: 'HOT 대란템 🔥',
          mainTitle: isBeauty ? `여배우 립 이쁘다.. 싶으면 전부 이거였음;\n${name} 부동의 1위` : `살림 편해졌다 싶으면 전부 이거였음;\n${name} 부동의 1위`,
          subTitle: isBeauty ? '여배우들도 촬영 때 진짜 많이 쓴다는 찐애정템 💄' : '진작 살 걸 왜 여태 고생했나 싶은 삶의 질 수직상승템 ✨',
          extra: '품절 대란 주의'
        },
        {
          slideNum: 2,
          type: 'detail',
          textPosition: 'center',
          badge: 'CHECK POINT 01 ✨',
          mainTitle: isBeauty ? '발색력에 색감까지 미쳤다는 추천템ㅠㅠ\n전문가들도 촬영 때 진짜 많이 쓴다고 함' : '써보는 순간 번거로움 싹 사라지는 추천템ㅠㅠ\n자취생·주부들 사이에서 입소문 난 이유가 있음',
          subTitle: memo,
          extra: '후기 평점 4.9점'
        },
        {
          slideNum: 3,
          type: 'detail',
          textPosition: 'center',
          badge: 'CHECK POINT 02 🔍',
          mainTitle: isBeauty ? '바르는 순간 확 화사해지고\n청순한 느낌은 물론 분위기까지 우아해짐 ㅠㅠ❤️' : '사용하는 순간 일상 스트레스 확 줄어들고\n설거지·시간 낭비 1초 만에 해결됨 ㅠㅠ❤️',
          subTitle: '✔ 누구나 쉬운 사용법 ✔ 독보적인 실사용 만족도 ✔ 가성비 끝판왕',
          extra: '재구매율 1위'
        },
        {
          slideNum: 4,
          type: 'cta',
          textPosition: 'center',
          badge: 'SPECIAL CTA 🎁',
          mainTitle: isDM ? '인생템 찾고 있다면 무조건 이거임!!!!\n정보는 "나도" 남겨줘!🤍' : '인생템 찾고 있다면 무조건 이거임!!!!\n제품 정보는 프로필 링크 확인🔗',
          subTitle: isDM ? '댓글에 "나도" 남겨주시면 최저가 구매처 DM 바로 쏴드려요!' : '👉 프로필링크에서 [513번]을 검색해주세요!',
          extra: '놓치면 후회할 핫딜'
        }
      ];
    }

    // 📚 5장: 표준 스토리텔링형
    return this.generateKoreanCardNews(p);
  }

  // ==========================================
  // ② 제미나이(Gemini) 카드별 씬 프롬프트 생성기
  // ==========================================
  // ==========================================
  // ② 제미나이(Gemini) 카드별 씬 프롬프트 생성기 (멀티모달 이미지 첨부 완벽 대응)
  // ==========================================
  generateGeminiPrompts(p, count = 4, lang = 'ko', monetizationMode = 'link') {
    const name = p.name;
    const cat = p.category;
    const isBeauty = cat === 'beauty';
    const isFood = cat === 'kitchen_food';
    const isDM = monetizationMode === 'dm';
    const prompts = [];

    // 멀티모달(Vision) 공통 지침: 첨부된 실제 제품 사진/상세페이지 캡처를 레퍼런스로 활용
    const multimodalHeader = `[📌 제미나이 멀티모달 시각 참조 지침]\n함께 첨부한 제품 사진(또는 상세페이지 캡처) 속 실제 제품의 외형, 디자인, 색상, 재질을 100% 동일하게 반영하여 생성할 것.\n\n`;
    const cleanNegative = 'Strict negative prompt: no text, no words, no letters, no hangul, no typography, no alphabet, no labels, no watermark, no logo, no cheap sales graphics, no blurry noise, pure clean photograph only.';

    if (count === 3) {
      // ⚡ 3장: 스피드 임팩트형 (수납/정리/간편레시피)
      const p1 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Professional appetizing editorial lifestyle photography of finished ${name}.
Composition: Close-up hero shot placed cleanly on a modern table or slate plate.
Lighting: Warm soft studio lighting with gentle natural reflections.
${cleanNegative}
이미지 생성해줘.`;

      const p2 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Neat demonstration or flat-lay preparation shot of ${name} in actual practical use.
Composition: Clean kitchen/home countertop setting, showing effortless step-by-step handling.
${cleanNegative}
이미지 생성해줘.`;

      const p3 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Extreme macro close-up showing stunning details, texture, and satisfying results of ${name}.
Composition: High clarity detail shot eliciting strong desire and engagement.
${cleanNegative}
이미지 생성해줘.`;

      prompts.push({
        slideNum: 1,
        title: '1번 표지/완성 컷 (Hero Hook)',
        role: '1번 완성 메인 컷 (Hero Hook)',
        previewHint: '4:5 인스타 | 첨부 이미지 참조',
        exactText: `쫀득상큼\n${name}`,
        promptText: p1,
        prompt: p1
      });

      prompts.push({
        slideNum: 2,
        title: '2번 준비 & 실사용 컷 (Prep & Action)',
        role: '2번 재료 준비 & 조리 컷 (Ingredients & Prep)',
        previewHint: '4:5 인스타 | 첨부 이미지 참조',
        exactText: '재료는 간단하게\n살짝 적신 뒤 돌돌 말면 끝',
        promptText: p2,
        prompt: p2
      });

      prompts.push({
        slideNum: 3,
        title: '3번 클라이맥스 디테일 & CTA 컷 (Detail & CTA)',
        role: '3번 단면 클로즈업 & CTA 컷 (Cutaway & Question)',
        previewHint: '4:5 인스타 | 첨부 이미지 참조',
        exactText: isDM ? '어떤 거 넣어보고 싶나요?\n정보는 "나도" 남겨줘!🤍' : '어떤 거 넣어보고 싶나요?\n저장하고 만들어보세요',
        promptText: p3,
        prompt: p3
      });

      return prompts;
    }

    if (count === 4) {
      // 🎯 4장: 데이즈홈 스타일 (조리도구/뷰티/생활용품 추천)
      const p1 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Ultra-high quality authentic lifestyle product shot of ${name} held in hand or sitting gracefully on a warm minimalist table.
Composition: Clean focus on the product, natural soft bokeh in background. Bottom-left gradient vignette for text readability.
${cleanNegative}
이미지 생성해줘.`;

      const p2 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Hands-on real demonstration shot showing practical usage of ${name}. ${isBeauty ? 'Showing realistic texture swatch on the palm of hand with natural skin tone.' : 'Human hands actively demonstrating how effortlessly the product works.'}
Composition: Centered hands-on action, genuine home/studio lighting.
${cleanNegative}
이미지 생성해줘.`;

      const p3 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Macro zoom close-up highlighting the superior finish, moisture, and fine craftsmanship of ${name}.
Composition: High-detail close-up shot capturing reflections, gloss, and premium build quality.
${cleanNegative}
이미지 생성해줘.`;

      const p4 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: ${isBeauty ? 'Aesthetic close-up of beautiful model lips or skin wearing the product, holding the item gracefully.' : 'Satisfying final outcome scene showing the product proudly placed in a clean, modern home environment.'}
Composition: Confident, aesthetic, highly desirable visual.
${cleanNegative}
이미지 생성해줘.`;

      // 4컷 개별 씬 등록
      prompts.push({
        slideNum: 1,
        title: '1번 표지 씬 (Social Proof & Hero)',
        role: '1번 표지 씬 (Social Proof & Hero)',
        previewHint: '4:5 인스타 | 첨부 이미지 참조',
        exactText: isBeauty ? `여배우 립 이쁘다.. 싶으면 전부 이거였음;\n${name} 부동의 1위` : `살림 편해졌다 싶으면 전부 이거였음;\n${name} 부동의 1위`,
        promptText: p1,
        prompt: p1
      });

      prompts.push({
        slideNum: 2,
        title: '2번 1차 실사용/발색 씬 (Hands-on Action)',
        role: '2번 1차 실사용/발색 씬 (Hands-on Action & Proof)',
        previewHint: '4:5 인스타 | 첨부 이미지 참조',
        exactText: isBeauty ? '발색력에 색감까지 미쳤다는 추천템ㅠㅠ\n여배우들도 촬영 때 진짜 많이 쓴다고 함' : '1초 만에 끝나서 감탄 나오는 추천템ㅠㅠ\n직접 써보니까 왜 대란템인지 바로 납득됨',
        promptText: p2,
        prompt: p2
      });

      prompts.push({
        slideNum: 3,
        title: '3번 제형/질감/디테일 씬 (Macro Texture & Sheen)',
        role: '3번 제형/질감/디테일 씬 (Macro Texture & Sheen)',
        previewHint: '4:5 인스타 | 첨부 이미지 참조',
        exactText: isBeauty ? '바르는 순간 확 화사해지고\n청순한 느낌은 물론 분위기까지 우아해짐 ㅠㅠ❤️' : '사용하는 순간 일상 스트레스 확 줄어들고\n설거지·시간 낭비 1초 만에 해결됨 ㅠㅠ❤️',
        promptText: p3,
        prompt: p3
      });

      prompts.push({
        slideNum: 4,
        title: '4번 최종 결과 & 댓글 트리거 씬 (Climax & CTA)',
        role: '4번 최종 결과 & 댓글 트리거 씬 (Climax & CTA)',
        previewHint: '4:5 인스타 | 첨부 이미지 참조',
        exactText: isDM ? '인생템 찾고 있다면 무조건 이거임!!!!\n정보는 "나도" 남겨줘!🤍' : '인생템 찾고 있다면 무조건 이거임!!!!\n제품 정보는 프로필 링크 확인🔗',
        promptText: p4,
        prompt: p4
      });

      // 🌟 [추가 보너스] 1장에 4컷 콜라주를 한 번에 만드는 올인원 프롬프트
      const collagePrompt = `${multimodalHeader}Canvas: A single high-resolution image divided cleanly into a 2x2 grid (4 equal panels: top-left, top-right, bottom-left, bottom-right).
Panel 1 (Top-Left): Aesthetic hero lifestyle shot of ${name} held in hand or sitting gracefully on a warm minimalist table.
Panel 2 (Top-Right): Hands-on real demonstration shot showing practical usage and action of ${name}.
Panel 3 (Bottom-Left): Extreme macro close-up highlighting the superior finish, fine material texture, and craftsmanship of ${name}.
Panel 4 (Bottom-Right): Satisfying climax scene showing the product proudly placed in a clean, modern aesthetic living space.
Style: Professional commercial photography, clean thin borders between panels, photorealistic, warm home ambient lighting.
${cleanNegative}
이미지 생성해줘.`;

      prompts.push({
        slideNum: 'ALL',
        title: '⚡ [1초 완성용] 4컷 콜라주 올인원 프롬프트 (2x2 그리드)',
        role: '4컷 콜라주 올인원 (2x2 그리드)',
        previewHint: '1초 분할 연동 ✂️',
        exactText: '4컷 일괄 생성 ➔ 1초 분할',
        promptText: collagePrompt,
        prompt: collagePrompt
      });

      return prompts;
    }

    // 5장 기본
    return this.generate5ScenePrompts(name, cat).map((pPrompt, idx) => {
      const fullP = `${multimodalHeader}${pPrompt}\n${cleanNegative}\n이미지 생성해줘.`;
      return {
        slideNum: idx + 1,
        title: `${idx + 1}번 슬라이드 씬`,
        role: `${idx + 1}번 슬라이드 씬`,
        previewHint: '4:5 인스타 | 첨부 이미지 참조',
        exactText: `${name} 추천 후기`,
        promptText: fullP,
        prompt: fullP
      };
    });
  }

  // ==========================================
  // ③ 스레드(Threads) 4종 바이럴 젬(Gem) 피드 엔진
  // ==========================================
  generateThreadsFeeds(p) {
    const name = p.name;
    const memo = p.memo;
    const link = p.link || 'https://link.coupang.com/...';
    const platId = p.platform || 'coupang';
    const isAmazon = platId === 'amazon_jp';

    // 쿠팡 파트너스 공정위 문구
    const ftcDisclaimer = '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.';

    // 유형 1: 공포자극/의외성형
    const type1 = {
      title: '유형 1. 공포자극/의외성형',
      desc: '첫 문장에서 도구의 반전 효과 및 의외성 후킹',
      body_ko: `아직도 손목 아프고 고생하면서 일일이 다 하는 사람 있어? 진심 이거 알고 내 인생이 바뀜;; 도마 꺼내고 썰고 사방에 튀는 거 개스트레스였는데 이건 그냥 쓱 쓰면 1초 만에 끝남. 심지어 정리도 너무 편해서 설거지도 확 줄어듦. 하... 왜 이제 샀지 내 손목 눈감아.

자세한 후기랑 정보는 첫 댓글에 남겨둘게!`,
      body_ja: `まだこれ知らずに毎日プチストレス溜めてる人いる？ガチでこれ知ってから人生変わったわ… 準備も片付けも超面倒だったけど、これ使うだけで一瞬で終わる。しかも洗い物も劇的に減るし最高。マジで神グッズすぎる。

詳しいレビューと購入先は最初の返信に載せておくね！`,
      body_ja_trans: '아직도 이거 모르고 매일 소소한 스트레스 쌓아두는 사람 있어? 진짜로 이거 알고 나서 인생이 바뀌었어… 준비도 뒷정리도 엄청 귀찮았는데, 이거 쓰는 것만으로 순식간에 끝남. 게다가 설거지도 획기적으로 줄어들고 최고야. 진심 신박템(갓템)임.'
    };

    // 유형 2: 신기함/숫자 중심형 (1분/1초 컷)
    const type2 = {
      title: '유형 2. 신기함/숫자 중심형',
      desc: '1분 만에 / 1초 컷 등 시간 단축과 시각적 쾌감 후킹',
      body_ko: `1분 만에 준비랑 요리 한 방에 뚝딱 끝내는 법 방금 알아냄. 그냥 툭 얹고 꾹 누르면 1초 컷으로 완벽하게 정리됨. 손재주 없는 똥손들도 이건 무조건 전문가 퀄리티 나옴. 내구성도 탄탄하고 깔끔해서 보는 내내 쾌감 쩔어 진짜;;

궁금한 사람들을 위해 링크 첫 댓글에 달아둠!`,
      body_ja: `1分で準備から後片付けまで終わらせる時短ワザ見つけた。乗せてギュッと押すだけで1秒で完璧に仕上がるのヤバない？ 料理苦手でもこれなら絶対プロ並み。しっかりした作りで見てて超スッキリするんだけどww

気になった人向けにリンクは最初の返信に貼っておくね！`,
      body_ja_trans: '1분 만에 준비부터 뒷정리까지 끝내는 시간 단축 꿀팁 찾아냄. 얹어서 꾹 누르기만 하면 1초 만에 완벽하게 마무리되는 거 미치지 않음? 요리 서툴러도 이거라면 무조건 프로 수준임. 튼튼한 만듦새라 보고 있으면 엄청 속 시원해ㅋㅋ'
    };

    // 유형 3: 찡찡이/가치 입증형 (설거지·귀차니즘 고충 해결)
    const type3 = {
      title: '유형 3. 찡찡이/가치 입증형',
      desc: '퇴근 후 뒷정리/설거지 극단적 고충 해결과 삶의 질 상승',
      body_ko: `먹고는 싶은데 도마랑 주방기구 다 꺼내서 씻기 귀찮아서 참는 사람 나뿐만 아니지? 이거 쓰면 도마나 잡다한 도구 아예 필요 없음. 수집 용기 안으로 쏙 들어가니까 그대로 쓰면 끝남. 싱크대 끈적해질 일도 없고 설거지도 1개로 끝. 진심 올해 최고 잘 산 템이다.

필요한 사람 있을까 봐 첫 댓글에 정보 남겨둠!`,
      body_ja: `食べたいけど、まな板や道具を洗うのが面倒で諦めてるの私だけじゃないよね？これ使えばまな板ガチでいらない。そのまま容器に全部入るからボウルに入れるだけ。キッチンもベタベタしないし洗い物も激減。今年の優勝アイテム確定。

欲しい人向けに最初の返信に情報載せておいたよ！`,
      body_ja_trans: '먹고는 싶은데 도마나 도구들 씻는 게 귀찮아서 포기하는 거 나뿐만 아니지? 이거 쓰면 도마가 진짜로 필요 없음. 그대로 용기에 쏙 들어가니까 그릇에 넣기만 하면 됨. 주방도 끈적거리지 않고 설거지도 격감. 올해의 우승템 확정.'
    };

    // 유형 4: 훈수/논쟁 유도형 (장비빨 질문)
    const type4 = {
      title: '유형 4. 훈수/논쟁 유도형',
      desc: '요리는 장비빨 vs 아니다 댓글 싸움 유도 후킹',
      body_ko: `솔직히 일상 살림이나 요리는 장비빨인 거 다들 인정? 아직도 손목 아프게 구식 방법 고집하는 사람 보면 내가 다 답답함. 안전하고 편하게 만들어주는 꿀템들이 널렸는데 왜 안 써? 자취생이든 주부든 이거 없으면 주방에서 시간 낭비하는 거임. 반박 시 내 말이 맞음.

정보 궁금한 사람 첫 댓글 확인해봐!`,
      body_ja: `ぶっちゃけ家事も料理もアイテム次第って皆も思うよね？未だに手首痛くしながら古いやり方にこだわってる人見るともどかしくなる。便利で安全な神グッズがたくさんあるのになんで使わないの？ 一人暮らしでも主婦でもこれないと時間の無駄だよ。異論は認めないww

気になる人は最初の返信チェックしてみて！`,
      body_ja_trans: '솔직히 살림도 요리도 아이템(장비) 빨이라는 거 다들 생각하지? 아직도 손목 아파가면서 옛날 방식 고집하는 사람 보면 답답해짐. 편리하고 안전한 신박템들이 널렸는데 왜 안 써? 1인 가구든 주부든 이거 없으면 시간 낭비야. 이견은 인정 안 함ㅋㅋ'
    };

    // 2단계: 추천 미디어 매칭 가이드
    const mediaGuide = {
      highlight: `도구의 기능과 핵심 쾌감이 가장 시원하게 드러나는 1~3초 액션 구간 추천 (${name}의 작동 순간)`,
      capture: `완성된 깔끔한 결과물과 함께 ${name}의 디자인이 돋보이는 클로즈업 사진 추천`
    };

    // 3단계: 첫 댓글 고정용 수익화 문구 (스팸 필터 안전 단일 링크 + 공정위 문구 완비)
    const pinned_comment_ko = `다들 이거 어디서 샀냐고 물어보셔서 링크 남겨둘게! 🤍

👉 최저가 바로가기: ${link}

(※ ${ftcDisclaimer})`;

    const pinned_comment_ja = `みんなこれどこで買ったか気になってるみたいだからリンク貼っとくね！✨

👉 最安値はこちら: ${isAmazon ? link : 'https://amzn.to/example'}

(※ Amazonアソシエイト・プログラムの参加者として適格販売により収入を得ています。)`;

└ 💡 일본어 뜻 (한국어 해석):
다들 이거 쓸 때 제일 짜증 나는 게 뭐야? ✨
✓ ${name}으로 시간 단축 & 설거지에서 완전 해방
✓ 손목에 부담 없이 누구나 1초 만에 프로급 마무리
🔽 영상에서 사용한 애용 아이템은 여기 🔽
(Amazon 링크)`;

    return {
      type1,
      type2,
      type3,
      type4,
      mediaGuide,
      pinned_comment_ko,
      pinned_comment_ja
    };
  }

  // ==========================================
  // ④ 네이버 블로그 1200x900 사진 가이드 & SEO 본문
  // ==========================================
  generateNaverBlogPost(p, imageCount = 4) {
    const name = p.name;
    const memo = p.memo;
    const link = p.link || 'https://link.coupang.com/...';
    const platId = p.platform || 'coupang';
    const isFood = p.category === 'kitchen_food';

    const ftcText = '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.';

    const fullText = `[${name}] 솔직 후기! 내돈내산 삶의 질 수직상승템 추천

[이미지 1 삽입: 완성된 ${name} 대표 메인 컷 (1200x900 가로형, 무자막 고화질 실사)]

일상에서 작은 불편함 때문에 은근히 스트레스 받을 때가 많죠.
그럴 때 제대로 된 아이템 하나만 더해주면 생활의 질이 확 달라집니다.

오늘은 SNS에서 입소문 난 화제의 추천템, **${name}**을 소개해 드릴게요!
${memo} 덕분에 요즘 집안일과 일상이 2배는 더 편해졌답니다.

---

준비물 및 구성

[이미지 2 삽입: ${name} 본품 및 정갈하게 준비된 재료/도구 컷 (1200x900 가로형)]

* ${name} 본품
* 깔끔한 사용 환경 및 기본 준비물

이 제품은 복잡한 조작 없이 누구나 직관적으로 사용할 수 있는 것이 가장 큰 장점이에요.
군더더기 없는 디자인이라 어디에 두어도 인테리어를 해치지 않습니다.

---

사용하는 법 (STEP BY STEP)

1. 제품을 꺼내어 위치를 잡아요.
처음 사용할 때도 설명서가 필요 없을 만큼 조립이나 세팅이 아주 간단합니다.

2. 가볍게 원터치로 작동해요.
[이미지 3 삽입: 손으로 제품을 작동하거나 사용하는 리얼 액션 컷 (1200x900 가로형)]
힘들이지 않고 가볍게 눌러주기만 하면 순식간에 작업이 끝나요.
손목에 무리가 가지 않아서 자주 써도 전혀 부담이 없습니다.

3. 깔끔하게 마무리하면 완성!
[이미지 4 삽입: 완벽하게 정돈되거나 완성된 결과물 단면/디테일 컷 (1200x900 가로형)]
작업 후 뒷정리까지 간편해서 설거지나 청소 거리가 획기적으로 줄어듭니다.

---

실사용자가 전하는 작은 꿀팁 💡

* 오래 방치하지 말고 사용 직후 가볍게 헹궈주기
* 올바른 각도로 눌러주면 훨씬 힘이 덜 듦
* 자주 쓰는 공간 동선에 두고 손쉽게 꺼내 쓰기

---

마무리 및 구매 정보

${name}은 가성비와 실용성을 모두 잡아서 주변 지인들에게도 자신 있게 권하고 있는 찐추천템이에요.
매일 반복되는 번거로움에 지치셨다면 꼭 한번 써보시길 추천드립니다!

여러분이라면 이 아이템, 어떻게 활용해보고 싶으신가요? 댓글로 공유해 주세요! 😊

📍 포스팅에 사용한 정품 최저가 구매처는 아래 링크에서 확인하실 수 있습니다:
👉 ${link}

${ftcText}

#${name.replace(/\s+/g, '')} #살림템추천 #내돈내산추천 #삶의질향상 #인생템 #자취꿀템 #주부스타그램 #꿀템리뷰 #살림노하우 #생활꿀팁 #쿠팡추천템 #가성비갑 #살림스타그램 #신박템 #홈스타그램`;

    return {
      title: `[${name}] 솔직 후기! 내돈내산 삶의 질 수직상승템 추천`,
      fullText,
      photoCount: imageCount,
      dimensions: '1200 x 900px (4:3 가로형)',
      hashtags: `#${name.replace(/\s+/g, '')} #살림템추천 #내돈내산추천 #삶의질향상 #인생템 #자취꿀템 #주부스타그램 #꿀템리뷰 #살림노하우 #생활꿀팁 #쿠팡추천템 #가성비갑 #살림스타그램 #신박템 #홈스타그램`
    };
  }

  // ==========================================
  // ⑤ 아메바/티스토리 매거진 인라인 HTML 생성기
  // ==========================================
  generateEditorialHtml(p, imageCount = 4) {
    const name = p.name;
    const memo = p.memo;
    const link = p.link || 'https://link.coupang.com/...';

    const htmlCode = `<div style="max-width:760px;margin:0 auto;font-family:Arial,'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,sans-serif;line-height:1.8;color:#2f2a24;">
  <div style="padding:28px 24px;border-radius:18px;background:#f8f2e7;margin-bottom:26px;">
    <p style="display:inline-block;margin:0 0 12px;padding:5px 13px;border-radius:999px;background:#71804a;color:#fff;font-size:13px;font-weight:bold;letter-spacing:1px;">LIFE HACK ITEM</p>
    <h2 style="margin:0 0 12px;font-size:28px;line-height:1.35;color:#2f2a24;">もちっと爽やか＆生活激変<br>${name}</h2>
    <p style="margin:0;font-size:16px;color:#6a5d4f;">毎日の小さなストレスをゼロにする大バズり神アイテム</p>
  </div>

  <p>[画像1を挿入：完成・使用イメージ]</p>

  <p>毎日の生活の中で、ちょっとした手間やイライラを感じることってありますよね。</p>
  <p>そんなときは、この<strong>${name}</strong>を導入するだけで、家事や日常が劇的にラクになります。今回はSNSでも話題の便利アイテムを徹底レビューします。</p>

  <hr style="border:none;border-top:1px solid #e2d6c6;margin:30px 0;">

  <h3 style="font-size:22px;margin:0 0 14px;color:#3d352e;">特徴と魅力</h3>
  <p>[画像2を挿入：道具のディテール・準備写真]</p>

  <div style="padding:20px 22px;border-radius:14px;background:#fff8ed;border:1px solid #eadcc9;margin:18px 0 26px;">
    <ul style="margin:0;padding-left:20px;">
      <li>${memo}</li>
      <li>誰でも1秒で簡単操作＆失敗なし</li>
      <li>洗い物や後片付けの手間が激減</li>
      <li>シンプルで美しいインテリア調デザイン</li>
    </ul>
  </div>

  <span style="display:inline-block;padding:5px 13px;border-radius:999px;background:#71804a;color:#fff;font-size:13px;font-weight:bold;letter-spacing:1px;">STEP 01</span>
  <h3 style="font-size:22px;margin:10px 0 12px;color:#3d352e;">サッと取り出してセット</h3>
  <p>[画像3を挿入：手元のアクション写真]</p>
  <p>複雑なセッティングは一切なし。手首に負担をかけずにワンアクションで使えます。</p>

  <span style="display:inline-block;margin-top:20px;padding:5px 13px;border-radius:999px;background:#71804a;color:#fff;font-size:13px;font-weight:bold;letter-spacing:1px;">STEP 02</span>
  <h3 style="font-size:22px;margin:10px 0 12px;color:#3d352e;">あっという間に仕上がり完成</h3>
  <p>[画像4を挿入：美しい仕上がり断面・結果写真]</p>
  <p>仕上がりもプロ並み。散らかりがちなキッチンやリビングもピカピカに保てます。</p>

  <div style="padding:20px 22px;border-radius:14px;background:#f4f7ee;border-left:5px solid #71804a;margin:28px 0;">
    <h3 style="font-size:20px;margin:0 0 10px;color:#3d352e;">💡 おすすめの愛用アイテム</h3>
    <p style="margin:0 0 8px;">今回使ったおすすめの愛用品リンクはこちらからチェックできます：</p>
    <p style="margin:0;"><a href="${link}" style="color:#71804a;font-weight:bold;text-decoration:underline;">👉 ${name} 公式お得リンクはこちら</a></p>
  </div>

  <div style="padding:22px 24px;border-radius:16px;background:#f8f2e7;margin-top:30px;">
    <h3 style="font-size:21px;margin:0 0 10px;color:#3d352e;">まとめ</h3>
    <p style="margin:0;">時短にもなって暮らしの質が上がる納得のクオリティです。気になった方はぜひお早めにチェックしてみてください！</p>
  </div>

  <h3 style="font-size:21px;margin:30px 0 12px;color:#3d352e;">画像の代替テキスト (Alt Text)</h3>
  <ol style="padding-left:22px;">
    <li>${name}の全体がわかる高品質な完成カット写真</li>
    <li>${name}のディテールと素材感が伝わるク로즈업写真</li>
    <li>手元で簡単に使える様子を撮影したアクション工程写真</li>
    <li>美しく仕上がった状態を撮影した断面・結果写真</li>
  </ol>
</div>`;

    return {
      htmlCode,
      altList: [
        `${name}의 전체가 돋보이는 고품질 대표 컷 사진`,
        `${name}의 디테일과 질감이 전해지는 클로즈업 사진`,
        `손으로 간편하게 사용하는 모습을 담은 액션 공정 사진`,
        `완벽하게 마무리된 상태를 담은 결과 사진`
      ]
    };
  }

  // ==========================================
  // ⑥ 쿠팡 인플루언서 자동 DM 1초 세팅 키트
  // ==========================================
  generateCoupangAutoDmKit(p) {
    const name = p.name;
    const link = p.link || 'https://link.coupang.com/...';

    return {
      keywords: ['나도', '나두', '링크', '정보', '513', '구매처'],
      keywordsText: '나도, 나두, 링크, 정보, 513, 구매처',
      triggerKeywords: '나도, 나두, 링크, 정보, 513, 구매처',
      autoReply: `DM으로 요청하신 최저가 구매 링크와 상세 정보 보내드렸어요! 확인해 보세요 💌`,
      autoReplyComment: `DM으로 요청하신 최저가 구매 링크와 상세 정보 보내드렸어요! 확인해 보세요 💌`,
      followerDm: `안녕하세요! 요청하신 [${name}] 최저가 구매 좌표입니다 🤍
늘 응원해 주셔서 감사합니다 ❤️ 아래 링크에서 할인 혜택을 확인해 보세요!
👉 최저가 구매하기: ${link}

(※ 이 포스팅은 쿠팡 파트너스 활동의 일환으로 수수료를 제공받습니다.)`,
      nonFollowerDm: `요청하신 [${name}] 최저가 구매 좌표입니다 🤍
👉 최저가 구매하기: ${link}

팔로우해 두시면 매주 삶의 질 상승 대란템 정보를 가장 먼저 받아보실 수 있어요 ✨
(※ 이 포스팅은 쿠팡 파트너스 활동의 일환으로 수수료를 제공받습니다.)`,
      productLink: link
    };
  }

  // 인스타 캡션 헬퍼
  generateInstagramCaption(p, count, monetizationMode) {
    const name = p.name;
    const memo = p.memo;
    const link = p.link || 'https://link.coupang.com/...';
    const isDM = monetizationMode === 'dm';

    if (isDM) {
      return `${name} 써보고 삶의 질 수직상승한 찐후기..🤍

SNS에서 다들 극찬하길래 데려왔는데
직접 써보니까 왜 인생템이라고 하는지 바로 납득됨;;

${memo}

매일 반복되던 작은 불편함들이 싹 해결돼서
요즘 하루하루가 너무 편하고 기분 좋은 거 있죠 ✨

꾸안꾸 삶의 질 상승템 좋아한다면 이건 진짜 소장각!
정보는 “나도” 남겨주세요🤍

✅ 제품은 프로필링크에서도 확인 가능해요!
👉 프로필링크에서 513번 검색해주세요!

#${name.replace(/\s+/g, '')} #살림템 #인생템 #꿀템추천 #내돈내산 #삶의질수직상승 #살림스타그램 #소장각`;
    }

    return `${name} 써보고 삶의 질 수직상승한 찐후기..🤍

SNS에서 다들 극찬하길래 데려왔는데
직접 써보니까 왜 인생템이라고 하는지 바로 납득됨;;

${memo}

매일 반복되던 작은 불편함들이 싹 해결돼서
요즘 하루하루가 너무 편하고 기분 좋은 거 있죠 ✨

📍 사진 속 사용 제품 상세 정보 및 최저가 링크:
👉 프로필 링크(또는 첫 댓글 링크)에서 확인하세요! 🔗

#${name.replace(/\s+/g, '')} #살림템 #인생템 #꿀템추천 #내돈내산 #삶의질수직상승 #살림스타그램`;
  }

  // 한국어 인스타 카드뉴스 5장 슬라이드 (호환성 유지)
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
        textPosition: 'bottom',
        badge: badge,
        mainTitle: `${name}\n솔직하게 써본 후기 ✨`,
        subTitle: benefit,
        extra: `${shortName} 혜택 놓치지 마세요`
      },
      {
        slideNum: 2,
        type: 'problem',
        textPosition: 'center',
        badge: 'CHECK POINT ㅠㅠ',
        mainTitle: '매일 반복되는 이 불편함\n혹시 참고 계셨나요?',
        subTitle: `${memo}\n더 이상 참지 말고 하루라도 빨리 바꿔보세요!`,
        extra: 'SNS 대란템'
      },
      {
        slideNum: 3,
        type: 'solution',
        textPosition: 'center',
        badge: 'SOLUTION ✨',
        mainTitle: `${name}\n하나로 고민 완전 해결!`,
        subTitle: `✔ 누구나 체감하는 확실한 실사용 만족도\n✔ 감성 넘치는 디자인 & 뛰어난 편의성`,
        extra: '직접 써보면 감탄 나오는 확실한 효과'
      },
      {
        slideNum: 4,
        type: 'detail',
        textPosition: 'center',
        badge: '반해버린 포인트 3가지 🔍',
        mainTitle: '디테일이 다른 이유',
        subTitle: `1. 믿고 쓰는 안전하고 탄탄한 품질\n2. 일상 속 편리함을 극대화한 설계\n3. 후기가 증명하는 독보적인 가성비`,
        extra: '재구매율이 높은 이유가 있더라구요'
      },
      {
        slideNum: 5,
        type: 'cta',
        textPosition: 'center',
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
        textPosition: 'bottom',
        badge: isAmazon ? 'Amazonベストセラー 🔥' : '大バズり中 🤍',
        mainTitle: `【SNSで話題】\n${name}\n本音レビュー！`,
        subTitle: isAmazon ? 'Amazonで即買い！QOL爆上がり確定アイテム🥹' : 'QOL爆上がり確定！もっと早く買えばよかった🥹💕',
        extra: isAmazon ? 'プライム対応・翌日配送 📦' : '大人気のため売り切れ注意⚠️'
      },
      {
        slideNum: 2,
        type: 'problem',
        textPosition: 'center',
        badge: 'こんなお悩みありませんか？💭',
        mainTitle: '毎日のプチストレス\n我慢していませんか？',
        subTitle: '「もっと快適に過ごしたい…」\n日常の悩みをこれ1つでスッキリ解消！',
        extra: '見逃せないチェックポイント'
      },
      {
        slideNum: 3,
        type: 'solution',
        textPosition: 'center',
        badge: 'お悩み解決 💡',
        mainTitle: `${name}\nで暮らしが変わる！`,
        subTitle: '✔ 圧倒的な使いやすさと満足度\n✔ 一度使ったらもう手放せない便利さ',
        extra: 'リアルな口コミでも大絶賛✨'
      },
      {
        slideNum: 4,
        type: 'detail',
        textPosition: 'center',
        badge: '選ばれる3つの理由 🔍',
        mainTitle: '使って実感した\n決定的なポイント',
        subTitle: '1. デザイン性と機能性の両立\n2. 誰でも簡単＆快適に使える設計\n3. 圧倒的な高コスパで大満足',
        extra: 'リピート率が高い納得のクオリティ'
      },
      {
        slideNum: 5,
        type: 'cta',
        textPosition: 'center',
        badge: 'お得情報 🎁',
        mainTitle: '今だけの特別チャンス！\n限定キャンペーン中',
        subTitle: isAmazon ? 'Amazonタイムセール中！\n詳細はプロフィールのリンクから🔗✨' : '気になったら今すぐチェック！\n詳細はプロフィールのリンクから🔗✨',
        extra: '在庫限りのためお早めに！'
      }
    ];
  }

  // 로컬 템플릿 생성 헬퍼
  generateLocalTemplate(channel, p) {
    if (channel === 'threads-kr') {
      const feeds = this.generateThreadsFeeds(p);
      return `${feeds.type1.body_ko}\n\n${feeds.pinned_comment_ko}`;
    }
    if (channel === 'threads-jp') {
      const feeds = this.generateThreadsFeeds(p);
      return `${feeds.type1.body_ja}\n\n${feeds.pinned_comment_ja}`;
    }
    if (channel === 'naver-blog') {
      return this.generateNaverBlogPost(p).fullText;
    }
    if (channel === 'ameba-jp') {
      return this.generateEditorialHtml(p).htmlCode;
    }
    return this.generateInstagramCaption(p, 4, p.monetizationMode || 'link');
  }

  // 5단 실사 프롬프트 생성 헬퍼
  generate5ScenePrompts(productName, category = '') {
    const pLower = (productName + ' ' + category).toLowerCase();
    let subject = productName || 'lifestyle aesthetic product';
    let vibe = {
      heroLighting: 'warm golden hour morning light',
      heroSetting: 'modern cozy Nordic interior countertop',
      actionVerb: 'hands naturally interacting with',
      detailFocus: 'premium matte surface texture, precision craftmanship',
      resultContext: 'harmonious warm modern living space'
    };

    if (pLower.includes('팬') || pLower.includes('계란') || pLower.includes('다지기') || pLower.includes('주방') || pLower.includes('스프레이')) {
      vibe = {
        heroLighting: 'bright clean natural kitchen window sunlight',
        heroSetting: 'luxury white marble kitchen counter with fresh herbs and olive oil bottle',
        actionVerb: 'chef hands skillfully using',
        detailFocus: 'non-stick premium coating, sizzling oil droplets, precision stainless finish',
        resultContext: 'mouth-watering home-cooked meal proudly plated on ceramic dish'
      };
    } else if (pLower.includes('마사지') || pLower.includes('넥케어') || pLower.includes('베개') || pLower.includes('온열')) {
      vibe = {
        heroLighting: 'gentle calming amber evening glow',
        heroSetting: 'minimalist peaceful bedroom with fluffy linen cushions',
        actionVerb: 'relaxed person comfortably wearing',
        detailFocus: 'soft breathable fabric texture, ergonomic curve, subtle indicator light',
        resultContext: 'peaceful stress-free rest scene, deep relaxation atmosphere'
      };
    } else if (pLower.includes('립') || pLower.includes('틴트') || pLower.includes('화장품') || pLower.includes('앰플')) {
      vibe = {
        heroLighting: 'soft diffused beauty vanity lighting',
        heroSetting: 'clean aesthetic marble vanity with soft flowers in background',
        actionVerb: 'hands gently holding or swatching',
        detailFocus: 'dewy glowing texture, silky moisture drops, elegant packaging',
        resultContext: 'radiant clean glowing aesthetic beauty scene'
      };
    }

    return [
      `award-winning product hero photograph of ${subject}, placed on ${vibe.heroSetting}, ${vibe.heroLighting}, shallow depth of field, 8k professional magazine shot, no watermark`,
      `close-up candid documentary photo of real life problem or preparation scene, clean atmospheric home, subtle tension, authentic real lighting, high resolution, no watermark`,
      `hands-on dynamic action photograph, human ${vibe.actionVerb} ${subject} in active use, motion clarity, authentic functional angle, 8k photo, no watermark`,
      `extreme macro close-up detail shot of ${subject}, focusing on ${vibe.detailFocus}, exquisite macro reflections, razor sharp focus, 8k photo, no watermark`,
      `dreamy aesthetic lifestyle interior scene featuring ${vibe.resultContext}, with ${subject} proudly placed, cozy warm evening glow, peaceful happiness, 8k photo`
    ];
  }

  // AI 생성 이미지를 Blob URL로 다운로드
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

  // 슬라이드 AI 이미지 일괄 병렬/순차 생성
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
