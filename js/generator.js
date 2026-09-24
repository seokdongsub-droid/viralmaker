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
    const textLower = `${name} ${memo}`.toLowerCase();
    const isBeauty = cat === 'beauty' || /립|틴트|화장|뷰티|세럼|크림|앰플|패치/.test(textLower);
    const isFood = cat === 'kitchen_food' || /단호박|호박|레시피|에프|과일|식단|요리|간식|디저트|소스|에어프라이어|파스타|고기|토마토/.test(textLower);
    const isDM = monetizationMode === 'dm';

    if (count === 1) {
      // 🌟 1장: 단독 피드 / 원컷 임팩트 / 썸네일
      if (isJa) {
        return [
          {
            slideNum: 1,
            type: 'cover',
            textPosition: 'bottom',
            badge: '神アイテム 찐レビュー 🔥',
            mainTitle: `${name}\n本音で使ってみた感想 ✨`,
            subTitle: isDM ? '詳細はコメントで「ナド」と書くとDMでお届け💌' : `${memo}\n👉 商品リンクはプロフィールのリンクから🔗`,
            extra: 'QOL爆上がり確定'
          }
        ];
      }
      return [
        {
          slideNum: 1,
          type: 'cover',
          textPosition: 'bottom',
          badge: 'SNS 대란템 찐후기 🔥',
          mainTitle: `${name}\n솔직 실사용 리뷰 ✨`,
          subTitle: isDM ? '구매처 정보는 댓글로 "나도" 남겨주시면 DM 쏴드려요!' : `${memo}\n👉 제품 상세 정보는 프로필 링크 확인🔗`,
          extra: '삶의 질 수직상승 꿀템'
        }
      ];
    }

    if (count === 2) {
      // ⚡ 2장: 비포 & 애프터 / 초간단 2컷 완성형
      if (isJa) {
        return [
          {
            slideNum: 1,
            type: 'problem',
            textPosition: 'center',
            badge: 'BEFORE & お悩み 🤔',
            mainTitle: 'まだこれで悩んでいませんか？\n毎日のプチストレス解消！',
            subTitle: `${memo}\n一日も早く買い替えて生活を快適に！`,
            extra: 'チェックポイント'
          },
          {
            slideNum: 2,
            type: 'cta',
            textPosition: 'center',
            badge: 'AFTER & 解決 💡',
            mainTitle: `${name}\nこれ1つで完全解決！`,
            subTitle: isDM ? 'コメントで「ナド」と書くと最安値リンクをDMでお届け💌' : `👉 プロフィールのリンクから [${name}] をチェック！🔗`,
            extra: '今すぐチェック！'
          }
        ];
      }
      return [
        {
          slideNum: 1,
          type: 'problem',
          textPosition: 'center',
          badge: 'BEFORE & 고민 🤔',
          mainTitle: '아직도 이것 때문에\n스트레스 받고 계신가요?',
          subTitle: `${memo}\n더 이상 참지 말고 하루라도 빨리 바꿔보세요!`,
          extra: 'SNS 화제의 꿀템'
        },
        {
          slideNum: 2,
          type: 'cta',
          textPosition: 'center',
          badge: 'AFTER & 완벽 해결 💡',
          mainTitle: `${name}\n하나로 고민 완전 해결!`,
          subTitle: isDM ? '댓글에 "나도" 남겨주시면 최저가 구매처 DM 바로 쏴드려요!' : `👉 프로필 링크에서 [${name}] 상세 정보를 확인하세요! 🔗`,
          extra: '삶의 질 수직상승'
        }
      ];
    }

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
      // 🎯 4장: 데이즈홈 / 데이즈코어 시그니처 템플릿 (8,000댓글 바이럴 검증 공식)
      if (isJa) {
        if (isFood) {
          return [
            {
              slideNum: 1,
              type: 'cover',
              textPosition: 'bottom',
              badge: '話題のレシピ 🎃',
              mainTitle: '毎朝これ食べたら\n2週間で-5KG消えた！',
              subTitle: 'もちもちで甘くてガチで美味い件ㅠㅠ',
              extra: 'エアフライヤー超簡単'
            },
            {
              slideNum: 2,
              type: 'detail',
              textPosition: 'center',
              badge: 'POINT 01 👩‍🍳',
              mainTitle: '簡単すぎて毎日食べてたら\nお腹周りスッキリしてきたww',
              subTitle: memo || '材料入れてエアフライヤーで焼くだけで完成',
              extra: '手間ゼロ'
            },
            {
              slideNum: 3,
              type: 'detail',
              textPosition: 'center',
              badge: 'POINT 02 ✨',
              mainTitle: '作り置きして1週間食べても\n美味しすぎて全然飽きないㅠㅠ',
              subTitle: '✔ カリッともちもち ✔ スイーツ並みの甘さ ✔ カロリー控えめ',
              extra: 'リピート確定'
            },
            {
              slideNum: 4,
              type: 'cta',
              textPosition: 'center',
              badge: 'SPECIAL CTA 💙',
              mainTitle: isDM ? '材料入れて焼くだけで完成！\nレシピは「ナド」残してね！💙🩵' : '材料入れて焼くだけで完成！\nレシピはプロフィールのリンクから🔗',
              subTitle: isDM ? 'コメントで「ナド」と書くとDMでレシピ＆道具情報をお届け💌' : `プロフィールのリンクから【${name}】をチェックしてね！`,
              extra: '保存して後でチェック'
            }
          ];
        }
        if (isBeauty) {
          return [
            {
              slideNum: 1,
              type: 'cover',
              textPosition: 'bottom',
              badge: '女優愛用アイテム 💄',
              mainTitle: `女優たちが溺愛する\n${name} 不動の1位`,
              subTitle: '女優リップ可愛いと思ったら全部これだった件💄',
              extra: '完売前に要チェック⚠️'
            },
            {
              slideNum: 2,
              type: 'detail',
              textPosition: 'center',
              badge: 'POINT 01 ✨',
              mainTitle: '発色に色味まで神がかってると話題\n女優たちも撮影でガチ愛用中',
              subTitle: memo || 'サッと塗るだけで顔色がパッと明るくなる',
              extra: '撮影現場の定番'
            },
            {
              slideNum: 3,
              type: 'detail',
              textPosition: 'center',
              badge: 'POINT 02 🔍',
              mainTitle: '塗った瞬間パッと顔が華やかになって\n清楚で上品な雰囲気に大変身 ㅠㅠ❤️',
              subTitle: '✔ イエベ・ブルベ神リップ ✔ 色持ち抜群 ✔ うるツヤ質感',
              extra: '今年の優勝アイテム'
            },
            {
              slideNum: 4,
              type: 'cta',
              textPosition: 'center',
              badge: 'SPECIAL CTA 🤍',
              mainTitle: isDM ? '清楚が推しなら絶対これ買い!!!!\n情報は「ナド」残してね!🤍' : '清楚が推しなら絶対これ買い!!!!\n詳細はプロフィールのリンクから🔗',
              subTitle: isDM ? 'コメントで「ナド」と書くとDMで購入リンクをお届け💌' : `プロフィールのリンクから【${name}】をチェックしてね！`,
              extra: '保存して後でチェック'
            }
          ];
        }
        return [
          {
            slideNum: 1,
            type: 'cover',
            textPosition: 'bottom',
            badge: '話題の神アイテム 🔥',
            mainTitle: `使った人が絶賛する\n${name} 不동の1位`,
            subTitle: 'これ知ってから暮らしのストレス完全にゼロになった件✨',
            extra: '完売前に要チェック⚠️'
          },
          {
            slideNum: 2,
            type: 'detail',
            textPosition: 'center',
            badge: 'POINT 01 ✨',
            mainTitle: '1秒で使えて圧倒的に便利すぎる\n毎日のプチストレスがスッキリ解消',
            subTitle: memo,
            extra: 'リアルな口コミ大絶賛'
          },
          {
            slideNum: 3,
            type: 'detail',
            textPosition: 'center',
            badge: 'POINT 02 🔍',
            mainTitle: '使った瞬間「なぜ今まで買わなかったのか」\n手放せない生活必需品に確定 ㅠㅠ❤️',
            subTitle: '✔ 誰でも簡単 ✔ 失敗なし ✔ 圧倒的クオリティ',
            extra: '今年の優勝アイテム'
          },
          {
            slideNum: 4,
            type: 'cta',
            textPosition: 'center',
            badge: 'SPECIAL CTA 🎁',
            mainTitle: isDM ? '生活の質上げたいなら絶対これ買い!!!!\n情報は「ナド」残してね!🤍' : '迷ったら絶対これ買い!!!!\n詳細はプロフィールのリンクから🔗',
            subTitle: isDM ? 'コメントで「ナド」と書くとDMで購入リンクをお届け💌' : `프로필의 링크에서【${name}】를 확인하세요!`,
            extra: '保存して後でチェック'
          }
        ];
      }

      // 🇰🇷 한국어 4컷: 데이즈홈/데이즈코어 실제 8,000댓글 포맷 100% 구현
      if (isFood) {
        return [
          {
            slideNum: 1,
            type: 'cover',
            textPosition: 'bottom',
            badge: 'SNS 화제 레시피 🎃',
            mainTitle: '아침마다 먹었더니\n2주 만에 -5KG 삭제!',
            subTitle: '쫀득하고 달달한게 진짜 맛있음 ㅠㅠ',
            extra: '초간단 에프 다이어트'
          },
          {
            slideNum: 2,
            type: 'detail',
            textPosition: 'center',
            badge: 'CHECK POINT 01 👩‍🍳',
            mainTitle: '만들기 쉬워서 매일 먹었더니\n뱃살이 쏙 들어감ㄷㄷ',
            subTitle: memo || '재료만 넣고 에어프라이어 돌리면 끝! 세상 간편함',
            extra: '간편함 끝판왕'
          },
          {
            slideNum: 3,
            type: 'detail',
            textPosition: 'center',
            badge: 'CHECK POINT 02 ✨',
            mainTitle: '한 번 해두면 일주일 내내 먹는데\n너무 맛있어서 질리지도 않음ㅠㅠ',
            subTitle: '✔ 겉바속쫀 식감 ✔ 디저트 같은 달달함 ✔ 칼로리 부담 제로',
            extra: '식단 스트레스 제로'
          },
          {
            slideNum: 4,
            type: 'cta',
            textPosition: 'center',
            badge: 'SPECIAL CTA 💙',
            mainTitle: isDM ? '재료 몽땅 넣고 에프 돌리면 끝!\n초간단레시피 "나도" 남겨죠! 💙🩵' : '재료 몽땅 넣고 에프 돌리면 끝!\n초간단레시피는 프로필링크 확인🔗',
            subTitle: isDM ? '댓글에 "나도" 남겨주시면 재료+에프 꿀조합 정보 DM 바로 쏴드려요!' : `👉 프로필링크에서 [${name}] 레시피 & 재료 확인!`,
            extra: 'ManyChat 댓글 자동화'
          }
        ];
      }

      if (isBeauty) {
        return [
          {
            slideNum: 1,
            type: 'cover',
            textPosition: 'bottom',
            badge: '여배우 찐애정템 💄',
            mainTitle: `여배우들이 애정하는\n${name} 부동의 1위`,
            subTitle: '여배우 립 이쁘다.. 싶으면 전부 이거였음;',
            extra: '품절 대란 주의'
          },
          {
            slideNum: 2,
            type: 'detail',
            textPosition: 'center',
            badge: 'CHECK POINT 01 ✨',
            mainTitle: '발색력에 색감까지 미쳤다는 추천템ㅠㅠ\n여배우들도 촬영 때 진짜 많이 쓴다고함',
            subTitle: memo || '슥 바르자마자 맑고 투명하게 생기 살아남',
            extra: '실제 촬영장 필수템'
          },
          {
            slideNum: 3,
            type: 'detail',
            textPosition: 'center',
            badge: 'CHECK POINT 02 🔍',
            mainTitle: '바르는 순간 확 화사해지고\n청순한 느낌은 물론 분위기까지 우아해짐 ㅠㅠ❤️',
            subTitle: '✔ 웜톤·쿨톤 인생립 ✔ 지속력 끝판왕 ✔ 촉촉 물광 광채',
            extra: '꾸안꾸 청순 치트키'
          },
          {
            slideNum: 4,
            type: 'cta',
            textPosition: 'center',
            badge: 'SPECIAL CTA 🤍',
            mainTitle: isDM ? '청순이 추구미라면 무조건 이거임!!!!\n정보는 "나도" 남겨죠!🤍' : '청순이 추구미라면 무조건 이거임!!!!\n제품 정보는 프로필 링크 확인🔗',
            subTitle: isDM ? '댓글에 "나도" 남겨주시면 최저가 구매처 DM 바로 쏴드려요!' : `👉 프로필링크에서 [${name}] 확인하기 🔗`,
            extra: '소장각 인생립'
          }
        ];
      }

      // 살림/주방도구/일반형
      return [
        {
          slideNum: 1,
          type: 'cover',
          textPosition: 'bottom',
          badge: '삶의 질 수직상승 🔥',
          mainTitle: `써본 사람들마다 극찬하는\n${name} 부동의 1위`,
          subTitle: '이거 쓰고 살림 스트레스 제로됨;',
          extra: 'SNS 대란템'
        },
        {
          slideNum: 2,
          type: 'detail',
          textPosition: 'center',
          badge: 'CHECK POINT 01 ✨',
          mainTitle: '손목 아프고 고생하던 시절 싹 끝남ㄷㄷ\n1초 만에 깔끔해져서 속이 다 시원함',
          subTitle: memo || '복잡한 준비와 번거로운 설거지까지 1번에 해결',
          extra: '시간 단축 200%'
        },
        {
          slideNum: 3,
          type: 'detail',
          textPosition: 'center',
          badge: 'CHECK POINT 02 🔍',
          mainTitle: '직접 써보고 왜 진작 안 샀나 후회함ㅠㅠ\n자취생·주부 필수템인 이유가 있음',
          subTitle: '✔ 누구나 쉬운 사용법 ✔ 만족도 100% ✔ 삶의 질 수직상승',
          extra: '재구매율 1위'
        },
        {
          slideNum: 4,
          type: 'cta',
          textPosition: 'center',
          badge: 'SPECIAL CTA 🎁',
          mainTitle: isDM ? '삶의 질 수직상승템 찾고 있다면 무조건 이거임!!!!\n정보는 "나도" 남겨죠!🤍' : '삶의 질 수직상승템 찾고 있다면 무조건 이거임!!!!\n제품 정보는 프로필 링크 확인🔗',
          subTitle: isDM ? '댓글에 "나도" 남겨주시면 최저가 구매처 DM 바로 쏴드려요!' : `👉 프로필링크에서 [${name}]을(를) 확인하세요! 🔗`,
          extra: '놓치면 후회할 핫딜'
        }
      ];
    }

    // 📚 5장 이상: 표준 스토리텔링형 + 가변 확장 슬라이드
    const baseSlides = this.generateKoreanCardNews(p);
    if (count <= 5) return baseSlides;

    // 5장이 넘을 때: CTA 직전에 디테일/비교/활용팁 슬라이드를 순차적으로 삽입
    const result = baseSlides.slice(0, 4); // 1~4 슬라이드 유지
    const ctaSlide = { ...baseSlides[4] }; // 5번 CTA 슬라이드 복제

    const extraThemes = [
      { badge: '비포 & 애프터 🔍', mainTitle: '직접 써보고 느낀\n확실한 전후 차이점', subTitle: '✔ 일상 속 사소한 불편함 100% 해소\n✔ 주변 사람들에게도 추천하고픈 완성도' },
      { badge: '200% 활용 꿀팁 💡', mainTitle: '알아두면 유용한\n실전 꿀팁 & 보관법', subTitle: '✔ 오래오래 처음처럼 쓰는 관리 노하우\n✔ 똥손도 1초 만에 마스터하는 비법' },
      { badge: '타사 비교 & 스펙 ⚖️', mainTitle: '기존 제품들과\n비교할 수 없는 압도적 차이', subTitle: '✔ 더 가볍고, 더 튼튼하고, 더 편리한 설계\n✔ 가성비와 퀄리티를 모두 잡은 갓성비' },
      { badge: '자주 묻는 질문 FAQ ❓', mainTitle: '구매 전 궁금했던 점\n핵심만 콕 짚어 정리', subTitle: '✔ 사용 방법과 세척/관리 주의사항\n✔ 안심하고 쓸 수 있는 검증된 안전성' },
      { badge: '언박싱 & 패키지 📦', mainTitle: '실물 언박싱 & 구성품\n깔끔한 포장과 디테일', subTitle: '✔ 선물용으로도 손색없는 프리미엄 패키지\n✔ 받아보는 순간 만족스러운 실물 비주얼' }
    ];

    for (let i = 5; i < count; i++) {
      const themeIdx = (i - 5) % extraThemes.length;
      const theme = extraThemes[themeIdx];
      result.push({
        slideNum: i,
        type: 'detail',
        textPosition: 'center',
        badge: theme.badge,
        mainTitle: theme.mainTitle,
        subTitle: `${memo}\n${theme.subTitle}`,
        extra: 'SNS 대란템'
      });
    }

    // 마지막 슬라이드는 항상 CTA로 배치
    ctaSlide.slideNum = count;
    result.push(ctaSlide);
    return result;
  }

  // ==========================================
  // ② 제미나이(Gemini) 카드별 씬 프롬프트 생성기
  // ==========================================
  // ==========================================
  // ② 제미나이(Gemini) 카드별 씬 프롬프트 생성기 (멀티모달 이미지 첨부 완벽 대응)
  // ==========================================
  generateGeminiPrompts(p, count = 4, lang = 'ko', monetizationMode = 'link') {
    const name = p.name;
    const memo = p.memo || '';
    const cat = p.category;
    const textLower = `${name} ${memo}`.toLowerCase();
    const isBeauty = cat === 'beauty' || /립|틴트|화장|뷰티|세럼|크림|앰플|패치/.test(textLower);
    const isFood = cat === 'kitchen_food' || /단호박|호박|레시피|에프|과일|식단|요리|간식|디저트|소스|에어프라이어|파스타|고기|토마토/.test(textLower);
    const isDM = monetizationMode === 'dm';
    const prompts = [];

    // 멀티모달(Vision) 공통 지침: 첨부된 실제 제품 사진/상세페이지 캡처를 레퍼런스로 활용
    const multimodalHeader = `[📌 제미나이 멀티모달 시각 참조 지침]\n함께 첨부한 제품 사진(또는 상세페이지 캡처) 속 실제 제품의 외형, 디자인, 색상, 재질을 100% 동일하게 반영하여 생성할 것.\n\n`;
    const cleanNegative = 'Strict negative prompt: no text, no words, no letters, no hangul, no typography, no alphabet, no labels, no watermark, no logo, no cheap sales graphics, no blurry noise, pure clean photograph only.';

    if (count === 1) {
      const p1 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Commercial hero lifestyle shot of ${name} beautifully positioned in aesthetic modern interior.
Composition: Clean center framing, studio rim lighting, crisp sharp focus.
${cleanNegative}
이미지 생성해줘.`;

      prompts.push({
        slideNum: 1,
        title: '1번 단독 원컷 피드 (Single Hero Shot)',
        role: '1번 단독 원컷 피드 (Single Hero Shot)',
        previewHint: '4:5 인스타 | 단독 피드',
        exactText: `${name}\n솔직 실사용 리뷰`,
        promptText: p1,
        prompt: p1
      });
      return prompts;
    }

    if (count === 2) {
      const p1 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Realistic relatable before scene highlighting daily frustration or inconvenience related to ${name}.
Composition: Authentic lifestyle setting conveying the need for an effortless solution.
${cleanNegative}
이미지 생성해줘.`;

      const p2 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Dramatic satisfying after scene showcasing ${name} solving the issue with perfection.
Composition: Pristine, tidy, bright, harmonious lifestyle environment highlighting the product.
${cleanNegative}
이미지 생성해줘.`;

      const collagePrompt2 = `${multimodalHeader}Canvas: A single high-resolution image divided cleanly into 2 equal side-by-side vertical panels (1x2 grid: Left panel and Right panel) with a clean thin dividing line.
Panel 1 (Left, 50% width): Relatable before/problem scene showing daily trouble, clutter, or inconvenience before having ${name}.
Panel 2 (Right, 50% width): Satisfying after/solution scene showing ${name} actively resolving the problem in a clean, bright, harmonious modern home environment.
Style: Professional authentic editorial lifestyle photography, photorealistic, clean thin vertical divider border between panels.
${cleanNegative}
이미지 생성해줘.`;

      prompts.push({
        slideNum: 'ALL',
        title: '⚡ [1초 완성용] 2컷 좌우 분할 올인원 프롬프트 (1x2 그리드)',
        role: '2컷 좌우 분할 올인원 (1x2 그리드)',
        previewHint: '1초 2분할 연동 ✂️',
        exactText: '2컷 일괄 생성 ➔ 1초 좌우 분할',
        promptText: collagePrompt2,
        prompt: collagePrompt2
      });

      prompts.push({
        slideNum: 1,
        title: '1번 비포/고민 컷 (Before Hook)',
        role: '1번 비포/고민 컷 (Before Hook)',
        previewHint: '4:5 인스타 | 고민 유발',
        exactText: '아직도 이것 때문에 스트레스 받고 계신가요?',
        promptText: p1,
        prompt: p1
      });

      prompts.push({
        slideNum: 2,
        title: '2번 애프터/해결 컷 (After Solution CTA)',
        role: '2번 애프터/해결 컷 (After Solution CTA)',
        previewHint: '4:5 인스타 | 완벽 해결',
        exactText: `${name}\n하나로 고민 완전 해결!`,
        promptText: p2,
        prompt: p2
      });
      return prompts;
    }

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

      const collagePrompt3 = `${multimodalHeader}Canvas: A single high-resolution image cleanly divided into 3 equal vertical panels side-by-side (1x3 grid: Left, Center, Right) with clean thin divider borders.
Panel 1 (Left, 33.3% width): Hero hook shot showcasing ${name} beautifully presented in a warm, aesthetic home setting.
Panel 2 (Center, 33.3% width): Hands-on demonstration or step-by-step preparation shot showing ${name} effortlessly in action.
Panel 3 (Right, 33.3% width): Extreme macro close-up highlighting satisfying final details, textures, and perfection of ${name}.
Style: Professional commercial editorial photography, photorealistic, thin vertical dividing lines.
${cleanNegative}
이미지 생성해줘.`;

      prompts.push({
        slideNum: 'ALL',
        title: '⚡ [1초 완성용] 3컷 3분할 올인원 프롬프트 (1x3 그리드)',
        role: '3컷 3분할 올인원 (1x3 그리드)',
        previewHint: '1초 3분할 연동 ✂️',
        exactText: '3컷 일괄 생성 ➔ 1초 3분할',
        promptText: collagePrompt3,
        prompt: collagePrompt3
      });

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
      // 🎯 4장: 데이즈홈 / 데이즈코어 시그니처 템플릿 (8,000댓글 바이럴 실사 프롬프트)
      let p1, p2, p3, p4, collagePrompt4;

      if (isFood) {
        p1 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: POV extreme appetizing close-up of a person's hand wearing a transparent disposable plastic food prep glove (비닐장갑), holding warm freshly roasted caramelized ${name} slices with golden glistening sheen and slight roasted charred edges.
Composition: Hand centered holding the appetizing food, warm cozy Korean apartment kitchen in background with soft natural daylight.
Style: Authentic mobile photography shot on iPhone 15 Pro, natural daylight, candid food creator UGC aesthetic, sharp high-resolution textures, no CGI, no 3D cartoon render.
${cleanNegative}
이미지 생성해줘.`;

        p2 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Hands-on action shot of a person wearing a clear plastic food prep glove holding a single crescent slice of roasted caramelized ${name} against a clean neutral countertop, showing tender golden-orange interior texture and roasted skin.
Composition: Focus on the single roasted piece, natural daylight, candid lifestyle photo.
Style: Authentic Korean lifestyle creator mobile photography, shot on iPhone 15 Pro, natural textures, photorealistic.
${cleanNegative}
이미지 생성해줘.`;

        p3 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Close-up shot of light-colored wooden chopsticks gently picking up a tender, glistening roasted ${name} slice from a rustic ceramic bowl filled with freshly cooked pieces.
Composition: Clean wooden chopsticks in action, delicious steam rising gently, soft natural warm kitchen lighting.
Style: Authentic home cooking UGC photography, shot on iPhone 15 Pro, ultra-realistic food textures.
${cleanNegative}
이미지 생성해줘.`;

        p4 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Top-down hero shot of generous pile of freshly air-fried golden caramelized ${name} slices presented in a warm stoneware plate, held in hand with clear vinyl glove ready to serve.
Composition: Highly appetizing, mouth-watering social media presentation, natural bright daylight.
Style: Authentic viral Instagram creator photo, shot on iPhone 15 Pro, photorealistic 8k.
${cleanNegative}
이미지 생성해줘.`;

        collagePrompt4 = `${multimodalHeader}Canvas: A single high-resolution image divided cleanly into a 2x2 grid (4 equal panels: top-left, top-right, bottom-left, bottom-right) with clean thin dividing borders.
Panel 1 (Top-Left): POV close-up of a hand wearing a transparent plastic food prep glove holding steaming warm caramelized roasted ${name} slices.
Panel 2 (Top-Right): Hand in clear food glove holding a single crescent slice of roasted caramelized ${name} showing delicious soft interior.
Panel 3 (Bottom-Left): Light wooden chopsticks picking up one roasted caramelized slice from a rustic ceramic bowl.
Panel 4 (Bottom-Right): Appetizing final plate of roasted ${name} slices held in hand with clear glove, golden roasted finish.
Style: Authentic Korean food creator UGC lifestyle photography, shot on iPhone 15 Pro, natural warm daylight, photorealistic, thin divider lines between panels.
${cleanNegative}
이미지 생성해줘.`;
      } else if (isBeauty) {
        p1 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: POV aesthetic close-up shot of a human hand holding the sleek open ${name} tube and cap, showing the rich pigmented bullet with hydrating sheen, clean minimalist aesthetic room in background.
Composition: Clean focus on the product, natural soft bokeh in background, warm natural lighting.
Style: Authentic Korean beauty influencer mobile photo, shot on iPhone 15 Pro, natural textures, no CGI.
${cleanNegative}
이미지 생성해줘.`;

        p2 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Close-up swatch demonstration of ${name} color swatched smoothly across the natural human palm and inner wrist, showing realistic skin pores, healthy hydration sheen, and rich true-to-life pigment.
Composition: Clear palm swatch, soft natural daylight, authentic makeup review aesthetic.
Style: Authentic cosmetic UGC photography, shot on iPhone 15 Pro, photorealistic 8k.
${cleanNegative}
이미지 생성해줘.`;

        p3 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Ultra-close macro shot of the natural palm swatch glistening under soft sunlight, revealing delicate satin moisture and smooth vibrant color gradient of ${name}.
Composition: Macro detail on skin swatch texture and glossy finish.
Style: Crisp, authentic beauty mobile photography, shot on iPhone 15 Pro, photorealistic.
${cleanNegative}
이미지 생성해줘.`;

        p4 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Extreme close-up of beautifully hydrated, natural lips wearing ${name} with soft blurred edges, holding the open product tube gracefully next to the cheek.
Composition: Confident, radiant, aesthetic beauty close-up, soft window lighting.
Style: Authentic Korean beauty creator UGC photo, shot on iPhone 15 Pro, photorealistic.
${cleanNegative}
이미지 생성해줘.`;

        collagePrompt4 = `${multimodalHeader}Canvas: A single high-resolution image divided cleanly into a 2x2 grid (4 equal panels: top-left, top-right, bottom-left, bottom-right) with clean thin dividing borders.
Panel 1 (Top-Left): POV shot of hand holding open ${name} tube and cap, elegant product presentation.
Panel 2 (Top-Right): Realistic cosmetic swatch of ${name} on human palm skin showing natural skin pores and rich pigment.
Panel 3 (Bottom-Left): Macro close-up of the glossy hydrated texture and delicate sheen of the palm swatch.
Panel 4 (Bottom-Right): Close-up of beautiful hydrated lips wearing ${name}, holding the product tube gracefully.
Style: Professional authentic Korean beauty creator UGC photography, shot on iPhone 15 Pro, warm daylight, photorealistic, thin divider lines between panels.
${cleanNegative}
이미지 생성해줘.`;
      } else {
        // 주방도구 / 살림 / 생활용품
        p1 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Ultra-high quality authentic lifestyle product shot of ${name} held in hand or sitting gracefully on a warm minimalist kitchen/home table.
Composition: Clean focus on the product, natural soft bokeh in background, warm natural lighting.
Style: Authentic mobile photography shot on iPhone 15 Pro, natural daylight, candid creator UGC aesthetic.
${cleanNegative}
이미지 생성해줘.`;

        p2 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Hands-on real demonstration shot showing practical 1-second usage and effortless operation of ${name}.
Composition: Centered hands-on action in clean Korean apartment setting.
Style: Authentic creator UGC lifestyle photography, shot on iPhone 15 Pro, photorealistic.
${cleanNegative}
이미지 생성해줘.`;

        p3 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Macro zoom close-up highlighting the superior finish, sturdy build quality, and fine craftsmanship details of ${name}.
Composition: High-detail close-up shot capturing natural reflections and premium texture.
Style: Crisp, authentic mobile photography, shot on iPhone 15 Pro, photorealistic.
${cleanNegative}
이미지 생성해줘.`;

        p4 = `${multimodalHeader}Canvas: 1080 x 1350px vertical, 4:5 Instagram safe aspect ratio.
Scene: Satisfying final outcome scene showing ${name} perfectly utilized in a clean, aesthetic modern living space.
Composition: Confident, aesthetic, highly desirable visual.
Style: Authentic lifestyle photography, shot on iPhone 15 Pro, photorealistic.
${cleanNegative}
이미지 생성해줘.`;

        collagePrompt4 = `${multimodalHeader}Canvas: A single high-resolution image divided cleanly into a 2x2 grid (4 equal panels: top-left, top-right, bottom-left, bottom-right) with clean thin dividing borders.
Panel 1 (Top-Left): Aesthetic hero lifestyle shot of ${name} held in hand or sitting on a warm table.
Panel 2 (Top-Right): Hands-on real demonstration shot showing practical usage and action of ${name}.
Panel 3 (Bottom-Left): Extreme macro close-up highlighting superior build quality and fine material texture of ${name}.
Panel 4 (Bottom-Right): Satisfying climax scene showing ${name} transforming the space into a clean, aesthetic environment.
Style: Professional authentic Korean creator UGC photography, shot on iPhone 15 Pro, warm home ambient lighting, thin divider borders.
${cleanNegative}
이미지 생성해줘.`;
      }

      prompts.push({
        slideNum: 'ALL',
        title: '⚡ [1초 완성용] 4컷 콜라주 올인원 프롬프트 (2x2 그리드)',
        role: '4컷 콜라주 올인원 (2x2 그리드)',
        previewHint: '1초 4분할 연동 ✂️',
        exactText: '4컷 일괄 생성 ➔ 1초 분할',
        promptText: collagePrompt4,
        prompt: collagePrompt4
      });

      // 4컷 개별 씬 등록
      let t1, t2, t3, t4;
      if (isFood) {
        t1 = '아침마다 먹었더니\n2주 만에 -5KG 삭제!';
        t2 = '만들기 쉬워서 매일 먹었더니\n뱃살이 쏙 들어감ㄷㄷ';
        t3 = '한 번 해두면 일주일 내내 먹는데\n너무 맛있어서 질리지도 않음ㅠㅠ';
        t4 = isDM ? '재료 몽땅 넣고 에프 돌리면 끝!\n초간단레시피 "나도" 남겨죠! 💙🩵' : '재료 몽땅 넣고 에프 돌리면 끝!\n초간단레시피는 프로필링크 확인🔗';
      } else if (isBeauty) {
        t1 = `여배우 립 이쁘다.. 싶으면 전부 이거였음;\n${name} 부동의 1위`;
        t2 = '발색력에 색감까지 미쳤다는 추천템ㅠㅠ\n여배우들도 촬영 때 진짜 많이 쓴다고 함';
        t3 = '바르는 순간 확 화사해지고\n청순한 느낌은 물론 분위기까지 우아해짐 ㅠㅠ❤️';
        t4 = isDM ? '청순이 추구미라면 무조건 이거임!!!!\n정보는 "나도" 남겨죠!🤍' : '청순이 추구미라면 무조건 이거임!!!!\n제품 정보는 프로필 링크 확인🔗';
      } else {
        t1 = `써본 사람들마다 극찬하는\n${name} 부동의 1위`;
        t2 = '손목 아프고 고생하던 시절 싹 끝남ㄷㄷ\n1초 만에 깔끔해져서 속이 다 시원함';
        t3 = '직접 써보고 왜 진작 안 샀나 후회함ㅠㅠ\n자취생·주부 필수템인 이유가 있음';
        t4 = isDM ? '삶의 질 수직상승템 찾고 있다면 무조건 이거임!!!!\n정보는 "나도" 남겨죠!🤍' : '삶의 질 수직상승템 찾고 있다면 무조건 이거임!!!!\n제품 정보는 프로필 링크 확인🔗';
      }

      prompts.push({
        slideNum: 1,
        title: '1번 표지 씬 (Social Proof & Hero)',
        role: '1번 표지 씬 (Social Proof & Hero)',
        previewHint: '4:5 인스타 | 첨부 이미지 참조',
        exactText: t1,
        promptText: p1,
        prompt: p1
      });

      prompts.push({
        slideNum: 2,
        title: '2번 1차 실사용/발색 씬 (Hands-on Action)',
        role: '2번 1차 실사용/발색 씬 (Hands-on Action & Proof)',
        previewHint: '4:5 인스타 | 첨부 이미지 참조',
        exactText: t2,
        promptText: p2,
        prompt: p2
      });

      prompts.push({
        slideNum: 3,
        title: '3번 제형/질감/디테일 씬 (Macro Texture & Sheen)',
        role: '3번 제형/질감/디테일 씬 (Macro Texture & Sheen)',
        previewHint: '4:5 인스타 | 첨부 이미지 참조',
        exactText: t3,
        promptText: p3,
        prompt: p3
      });

      prompts.push({
        slideNum: 4,
        title: '4번 최종 결과 & 댓글 트리거 씬 (Climax & CTA)',
        role: '4번 최종 결과 & 댓글 트리거 씬 (Climax & CTA)',
        previewHint: '4:5 인스타 | 첨부 이미지 참조',
        exactText: t4,
        promptText: p4,
        prompt: p4
      });

      return prompts;
    }

    // 📚 5장 이상 가변 슬라이드용 제미나이 프롬프트 생성
    const basePrompts = this.generate5ScenePrompts(name, cat);
    const extraScenes = [
      `Extreme macro visual comparison showing pristine texture and flawless build quality of ${name}`,
      `Practical everyday demonstration shot highlighting clever functional usage and maintenance of ${name}`,
      `Aesthetic still life showcasing premium unboxing presentation and authentic packaging of ${name}`,
      `Editorial living interior shot demonstrating ${name} elevating modern room atmosphere seamlessly`,
      `Final grand aesthetic scene capturing the unmatched elegance and lifestyle value of ${name}`
    ];
    while (basePrompts.length < count) {
      const extraIdx = (basePrompts.length - 5) % extraScenes.length;
      basePrompts.push(extraScenes[extraIdx]);
    }
    const finalPrompts = basePrompts.slice(0, count);

    // 🌟 [추가] 5컷 이상 시 올인원 프롬프트 (상단 2컷 + 하단 3컷 그리드)
    const collagePrompt5 = `${multimodalHeader}Canvas: A single high-resolution image cleanly divided into 5 panels (Top row: 2 equal panels, Bottom row: 3 equal panels) with clean thin divider borders.
Top Row (50% height):
- Panel 1 (Top-Left, 50% width): Hero lifestyle hook shot showcasing ${name} in a minimalist aesthetic setting.
- Panel 2 (Top-Right, 50% width): Problem or before-state shot emphasizing daily inconvenience or need.
Bottom Row (50% height):
- Panel 3 (Bottom-Left, 33.3% width): Hands-on action shot demonstrating effortless use of ${name}.
- Panel 4 (Bottom-Center, 33.3% width): High-detail macro close-up highlighting craftsmanship, texture, and quality.
- Panel 5 (Bottom-Right, 33.3% width): Satisfying final outcome showcasing the product in a clean modern room.
Style: Professional authentic editorial lifestyle photography, clean thin border dividers, photorealistic.
${cleanNegative}
이미지 생성해줘.`;

    const promptItems = [
      {
        slideNum: 'ALL',
        title: `⚡ [1초 완성용] ${count}컷 올인원 프롬프트 (상단 2컷 + 하단 3컷 그리드)`,
        role: `${count}컷 올인원 (상단 2컷 + 하단 3컷 그리드)`,
        previewHint: `1초 ${count}분할 연동 ✂️`,
        exactText: `${count}컷 일괄 생성 ➔ 1초 분할`,
        promptText: collagePrompt5,
        prompt: collagePrompt5
      }
    ];

    finalPrompts.forEach((pPrompt, idx) => {
      const fullP = `${multimodalHeader}${pPrompt}\n${cleanNegative}\n이미지 생성해줘.`;
      promptItems.push({
        slideNum: idx + 1,
        title: `${idx + 1}번 슬라이드 씬`,
        role: `${idx + 1}번 슬라이드 씬`,
        previewHint: '4:5 인스타 | 첨부 이미지 참조',
        exactText: `${name} (${idx + 1}/${count})`,
        promptText: fullP,
        prompt: fullP
      });
    });
    return promptItems;
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

    // 제휴 플랫폼 맞춤 공정위 문구 (쿠팡, 오늘의집, 컬리, 오아시스, 토스 등)
    const platMeta = (typeof AffiliatePlatforms !== 'undefined' && AffiliatePlatforms[platId])
      ? AffiliatePlatforms[platId]
      : (typeof AffiliatePlatforms !== 'undefined' ? AffiliatePlatforms['coupang'] : null);
    const ftcDisclaimer = (platMeta && platMeta.disclaimer) 
      ? platMeta.disclaimer.replace(/^※\s*/, '') 
      : '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.';

    const category = p.category || this.inferCategory(p);
    const textLower = `${name} ${memo}`.toLowerCase();
    const isFood = /과일|참외|토마토|고기|삼겹살|한우|다짐육|식단|굴소스|소스|파스타|두부|콩나물|요거트|그래놀라|식재료/.test(textLower);
    const isBeauty = category === 'beauty';
    const isLiving = category === 'living' || /수납|선반|트롤리|정리|청소|휴지통|스펀지|워터블럭|배수구|마사지|넥케어|선풍기|보풀|진공/.test(textLower);

    let type1, type2, type3, type4;

    if (isBeauty) {
      type1 = {
        title: '유형 1. 공포자극/의외성형 (뷰티)',
        desc: '피부 스트레스 후킹 및 즉각적인 개선 체감',
        body_ko: `아직도 비싼 돈 주고 샵 가서 관리받는 사람 있어? 진심 ${name} 알고 내 피부 인생 바뀜;; ${memo}. 화장도 1도 안 뜨고 하루 종일 촉촉해서 주변에서 피부과 어디 다니냐고 물어봄... 진작 살 걸 그랬음 매일 아침마다 감탄 중.\n\n다들 피부 관리할 때 제일 스트레스 받는 게 뭐야? 댓글 남겨줘!\n\n자세한 후기랑 구매처는 첫 댓글에 남겨둘게!`,
        body_ja: `まだ高いお金払ってサロン通ってる人いる？ガチで${name}知ってから肌の調子レベチになったわ… ${memo}。メイク崩れもゼロだし周りからも何使ってるか聞かれまくる。もっと早く出会いたかった…！\n\n詳しいレビューと購入先は最初の返信に載せておくね！`,
        body_ja_trans: `아직도 비싼 돈 내고 살롱 다니는 사람 있어? 진심 ${name} 알고 나서 피부 상태 레벨이 달라짐… ${memo}. 메이크업 무너짐도 제로고 주변에서도 뭐 쓰냐고 계속 물어봄. 더 일찍 알았어야 했는데…! 자세한 후기와 구매처는 첫 댓글에 남겨둘게!`
      };
      type2 = {
        title: '유형 2. 신기함/숫자 중심형 (뷰티)',
        desc: '10초 만에 끝나는 에스테틱 물광 피부 후킹',
        body_ko: `10초 만에 에스테틱 다녀온 듯 물광 피부 만드는 법 방금 알아냄. 그냥 슥 바르면 1초 컷으로 피부에 쏙 흡수됨. ${name} 발색이랑 밀착력 미쳤음;; ${memo}. 초보자도 대충 발라도 실패 없이 은은한 윤광 도는 거 신기함.\n\n물광 피부 꿀팁 더 아는 거 있어? 댓글로 알려줘!\n\n궁금한 사람들을 위해 링크 첫 댓글에 달아둠!`,
        body_ja: `10秒でサロン帰りみたいなツヤ肌作る裏ワザ見つけた。サッと塗るだけで一瞬で肌に馴染むの神すぎ。${name}密着感がレベチ;; ${memo}。誰でもプロ級の仕上がり確定。\n\n気になった人向けにリンクは最初の返信に貼っておくね！`,
        body_ja_trans: `10초 만에 살롱 다녀온 것 같은 윤광 피부 만드는 꿀팁 찾아냄. 슥 바르기만 하면 순식간에 피부에 밀착되는 거 갓템임. ${name} 밀착감이 남다름;; ${memo}. 누구라도 프로급 마무리 확정.`
      };
      type3 = {
        title: '유형 3. 찡찡이/가치 입증형 (뷰티)',
        desc: '귀찮은 스킨케어/화장 단계 단축 및 인생템 입증',
        body_ko: `피부 관리하고는 싶은데 기초 5개씩 챙겨 바르기 귀찮아서 대충 자던 사람 나뿐만 아니지? ${name} 쓰면 복잡한 케어 아예 필요 없음. ${memo}. 속건조 싹 잡아주고 얼굴에서 자연광 돔. 진심 올해 최고 잘 산 템이다.\n\n스킨케어 단계 귀찮아서 대충 바르는 사람 손? 공감하면 댓글 달아줘ㅋㅋ\n\n필요한 사람 있을까 봐 첫 댓글에 정보 남겨둠!`,
        body_ja: `スキンケア頑張りたいけど、何ステップも重ねるの面倒で寝落ちしてたの私だけじゃないよね？${name}使えばこれ1本で完結。${memo}。乾燥知らずで自然なツヤ爆誕。今年の優勝コスメ確定。\n\n欲しい人向けに最初の返信に情報載せておいたよ！`,
        body_ja_trans: `스킨케어 열심히 하고 싶지만 여러 단계 바르는 거 귀찮아서 그냥 자던 사람 나뿐만이 아니지? ${name} 쓰면 이거 하나로 완결. ${memo}. 건조함 없이 자연스러운 광채 탄생. 올해의 우승 코스메 확정.`
      };
      type4 = {
        title: '유형 4. 훈수/논쟁 유도형 (뷰티)',
        desc: '피부는 화장품 장비빨 vs 아니다 논쟁 유도',
        body_ko: `솔직히 피부는 화장품 장비빨인 거 다들 인정? 아직도 정착 못 하고 비싼 거 이것저것 갈아타는 사람 보면 내가 다 답답함. ${name} 하나면 고민 싹 해결되는데 왜 안 써? ${memo}. 직접 써보면 왜 다들 추천하는지 바로 체감됨.\n\n피부는 화장품빨이다 vs 타고난 피부다, 다들 생각은? 댓글 남겨줘!\n\n정보 궁금한 사람 첫 댓글 확인해봐!`,
        body_ja: `ぶっちゃけ美肌もコスメのアイテム次第って皆も思うよね？未だに迷走して高いの買い漁ってる人見るともどかしくなる。${name}使えば一発で解決するのに何で試さないの？ ${memo}。異論は認めないww\n\n気になる人は最初の返信チェックしてみて！`,
        body_ja_trans: `솔직히 꿀피부도 화장품 아이템 빨이라는 거 다들 생각하지? 아직도 방황하면서 비싼 것만 사는 사람 보면 답답해짐. ${name} 쓰면 한 방에 해결되는데 왜 안 써? ${memo}. 반박은 인정 안 함ㅋㅋ`
      };
    } else if (isFood) {
      type1 = {
        title: '유형 1. 공포자극/의외성형 (식품/식단)',
        desc: '맛없는 식단/요리 고통 해결 및 신세계 맛 경험',
        body_ko: `아직도 식단 챙긴다고 맛없는 거 억지로 참고 고생하는 사람 있어? 진심 ${name} 알고 내 식단 인생이 바뀜;; ${memo}. 고급 레스토랑 맛인데 간편하기까지 해서 매일 이것만 먹는 중. 진작 쟁여둘 걸 그랬음.\n\n다들 식단 챙길 때 제일 힘든 게 뭐야? 댓글로 알려줘!\n\n자세한 후기랑 정보는 첫 댓글에 남겨둘게!`,
        body_ja: `まだ我慢して不味いダイエット食食べてる人いる？ガチで${name}知ってから食生活レベチになったわ… ${memo}。お店レベルの美味しさなのにヘルシーで最高。もっと早く買えばよかった…！\n\n詳しいレビューと購入先は最初の返信に載せておくね！`,
        body_ja_trans: `아직도 참아가며 맛없는 다이어트식 먹는 사람 있어? 진심 ${name} 알고 나서 식생활 레벨이 달라짐… ${memo}. 식당 수준의 맛인데 건강하고 최고야.`
      };
      type2 = {
        title: '유형 2. 신기함/숫자 중심형 (식품/식단)',
        desc: '1분 만에 끝내는 브런치/집밥 꿀조합 후킹',
        body_ko: `1분 만에 성수동 브런치 카페 비주얼 뚝딱 끝내는 치트키 방금 알아냄. ${name} 하나만 더해주면 1초 컷으로 비주얼 폭발함. ${memo}. 요리 서툰 사람도 이건 무조건 그럴싸하게 완성됨 보는 내내 침 고여 진짜;;\n\n이 조합 말고 또 맛있는 꿀조합 아는 사람 있어? 댓글 공유 좀!\n\n궁금한 사람들을 위해 링크 첫 댓글에 달아둠!`,
        body_ja: `1分でおしゃれカフェの味を再現する神ワザ見つけた。${name}使うだけで一瞬でプロの味覚に仕上がる。${memo}。料理苦手でも絶対失敗しないから試してみて！\n\n気になった人向けにリンクは最初の返信に貼っておくね！`,
        body_ja_trans: `1분 만에 감성 카페 맛 재현하는 신의 기술 찾아냄. ${name} 쓰는 것만으로 순식간에 프로의 맛으로 완성됨. ${memo}. 요리 서툴러도 절대 실패 안 하니까 먹어봐!`
      };
      type3 = {
        title: '유형 3. 찡찡이/가치 입증형 (식품/식단)',
        desc: '준비/설거지 귀차니즘 해결과 배달음식 절약',
        body_ko: `밥은 맛있게 먹고 싶은데 준비하고 설거지하는 거 귀찮아서 배달 시키던 사람 나뿐만 아니지? ${name} 쓰면 번거로운 준비 아예 필요 없음. ${memo}. 뒷정리도 1분 컷이라 배달비도 확 줄어듦. 진심 올해 최고 잘 산 템이다.\n\n퇴근하고 밥 차려 먹기 귀찮은 사람 나뿐만 아니지? 공감하면 댓글 달아줘ㅋㅋ\n\n필요한 사람 있을까 봐 첫 댓글에 정보 남겨둠!`,
        body_ja: `美味しいご飯食べたいけど、準備も洗い物も面倒で出前頼んでたの私だけじゃないよね？${name}使えばまな板も道具も不要。${memo}。食費も浮くし片付けも秒殺。今年の優勝確定。\n\n欲しい人向けに最初の返信に情報載せておいたよ！`,
        body_ja_trans: `맛있는 밥 먹고 싶은데 준비도 설거지도 귀찮아서 배달 시키던 거 나뿐만이 아니지? ${name} 쓰면 도마도 도구도 불필요. ${memo}. 식비도 아끼고 뒷정리도 순삭. 올해의 우승 확정.`
      };
      type4 = {
        title: '유형 4. 훈수/논쟁 유도형 (식품/식단)',
        desc: '집밥/식단은 식재료빨 vs 정성 논쟁 유도',
        body_ko: `솔직히 집밥이랑 식단 관리는 식재료빨인 거 다들 인정? ${name} 하나만 바꿔도 삶의 질이랑 맛이 차원이 다른데 왜 안 먹어? ${memo}. 자취생이든 직장인이든 써보면 왜 다들 쟁여두는지 바로 알게 됨.\n\n집밥은 재료빨이다 vs 손맛/정성이다, 다들 어떻게 생각해? 댓글 남겨줘!\n\n정보 궁금한 사람 첫 댓글 확인해봐!`,
        body_ja: `ぶっちゃけ自炊もダイエットも素材とアイテム次第って皆も思うよね？${name}に変えるだけでクオリティが別次元なのに何で試さないの？ ${memo}。一人暮らしなら絶対必須。異論は認めないww\n\n気になる人は最初の返信チェックしてみて！`,
        body_ja_trans: `솔직히 집밥도 다이어트도 재료와 아이템 빨이라는 거 다들 생각하지? ${name}으로 바꾸기만 해도 퀄리티가 다른 차원인데 왜 안 써? ${memo}. 자취생이라면 무조건 필수야.`
      };
    } else if (isLiving) {
      type1 = {
        title: '유형 1. 공포자극/의외성형 (살림/수납/힐링)',
        desc: '일상 고충/공간 부족/피로 후킹 및 1초 해결',
        body_ko: `아직도 집 좁다고 스트레스 받거나 몸 고생하면서 일일이 참는 사람 있어? 진심 ${name} 알고 내 일상이 바뀜;; ${memo}. 1초 만에 깔끔해지고 삶의 질 수직상승함. 심지어 정리도 너무 편함. 진작 살 걸 그랬음 퇴근하고 집 들어올 때마다 뿌듯함.\n\n집에서 제일 정리 안 되고 거슬리는 공간이 어디야? 댓글 남겨줘!\n\n자세한 후기랑 정보는 첫 댓글에 남겨둘게!`,
        body_ja: `まだ家が狭いとか毎日のプチストレス我慢してる人いる？ガチで${name}知ってから暮らしが一変したわ… ${memo}。一瞬でスッキリ片付いてQOL爆上がり。もっと早く買えばよかった…！\n\n詳しいレビューと購入先は最初の返信に載せておくね！`,
        body_ja_trans: `아직도 집이 좁다거나 매일의 소소한 스트레스 참는 사람 있어? 진심 ${name} 알고 나서 생활이 완전히 달라짐… ${memo}. 순식간에 깔끔해지고 삶의 질 떡상. 더 일찍 살 걸…!`
      };
      type2 = {
        title: '유형 2. 신기함/숫자 중심형 (살림/수납/힐링)',
        desc: '1분 만에 공간/피로 싹 정리하는 시각적 쾌감 후킹',
        body_ko: `1분 만에 고민거리 싹 해결하고 삶의 질 2배 올리는 치트키 방금 알아냄. 그냥 툭 두고 1초 컷으로 쓰기만 하면 끝남. ${name} 디자인도 깔끔하고 내구성 탄탄해서 만족도 200%임;; ${memo}.\n\n삶의 질 수직상승템 또 아는 거 있어? 다른 꿀템도 댓글로 추천해줘!\n\n궁금한 사람들을 위해 링크 첫 댓글에 달아둠!`,
        body_ja: `1分で部屋も気分もスッキリさせる神ワザ見つけた。置くだけ・使うだけで1秒で完璧に整うのヤバない？ ${name}見た目も機能も満点で見てて超快感ww ${memo}。\n\n気になった人向けにリンクは最初の返信に貼っておくね！`,
        body_ja_trans: `1분 만에 방도 기분도 깔끔하게 만드는 신의 기술 찾아냄. 두기만 해도 1초 만에 완벽하게 정돈되는 거 미치지 않음? ${name} 외형도 기능도 만점이라 보고 있으면 엄청 쾌감 쩔어ㅋㅋ`
      };
      type3 = {
        title: '유형 3. 찡찡이/가치 입증형 (살림/수납/힐링)',
        desc: '퇴근 후 귀차니즘 해결 및 극단적 삶의 질 상승',
        body_ko: `퇴근하고 나서 귀찮아서 집안일이나 피로 푸는 거 미루던 사람 나뿐만 아니지? ${name} 쓰면 번거로운 과정 아예 필요 없음. ${memo}. 시간 낭비 없이 1초 만에 해결되니까 너무 편함. 진심 올해 최고 잘 산 템이다.\n\n퇴근하고 집안일 미루다가 주말에 몰아서 하는 사람 손? 공감하면 댓글 달아줘ㅋㅋ\n\n필요한 사람 있을까 봐 첫 댓글에 정보 남겨둠!`,
        body_ja: `仕事帰りに部屋の片付けやセルフケア面倒で放置してたの私だけじゃないよね？${name}使えば手間がゼロに。${memo}。時間もストレスも劇的に減る。今年の優勝アイテム確定。\n\n欲しい人向けに最初の返信に情報載せておいたよ！`,
        body_ja_trans: `퇴근하고 방 정리나 셀프케어 귀찮아서 방치하던 거 나뿐만이 아니지? ${name} 쓰면 번거로움이 제로. ${memo}. 시간도 스트레스도 극적으로 줄어듦. 올해의 우승 아이템 확정.`
      };
      type4 = {
        title: '유형 4. 훈수/논쟁 유도형 (살림/수납/힐링)',
        desc: '살림/자취는 장비빨 논쟁 유도',
        body_ko: `솔직히 일상 살림이나 자취는 장비빨인 거 다들 인정? 아직도 몸 고생하면서 옛날 방식 고집하는 사람 보면 내가 다 답답함. ${name}처럼 편하게 만들어주는 꿀템들이 널렸는데 왜 안 써? ${memo}. 자취생이든 주부든 직접 써보면 삶의 질이 달라짐.\n\n자취/살림은 아이템빨이다 vs 아니다, 다들 생각은? 댓글 남겨줘!\n\n정보 궁금한 사람 첫 댓글 확인해봐!`,
        body_ja: `ぶっちゃけ暮らしも一人暮らしもアイテム次第って皆も思うよね？未だに手作業で面倒なことやってる人見るともどかしくなる。${name}使えば一瞬で快適になるのに何で使わないの？ ${memo}。異論は認めないww\n\n気になる人は最初の返信チェックしてみて！`,
        body_ja_trans: `솔직히 일상도 자취도 아이템 빨이라는 거 다들 생각하지? 아직도 수작업으로 번거로운 일 하는 사람 보면 답답해짐. ${name} 쓰면 순식간에 쾌적해지는데 왜 안 써? ${memo}. 이견은 인정 안 함ㅋㅋ`
      };
    } else {
      // 주방 조리도구 및 일반형
      type1 = {
        title: '유형 1. 공포자극/의외성형 (조리도구/살림)',
        desc: '첫 문장에서 도구의 반전 효과 및 의외성 후킹',
        body_ko: `아직도 손목 아프고 고생하면서 일일이 다 하는 사람 있어? 진심 ${name} 알고 내 인생이 바뀜;; ${memo}. 도마 꺼내고 썰고 사방에 튀는 거 스트레스였는데 이건 그냥 쓱 쓰면 1초 만에 끝남. 심지어 정리도 너무 편해서 설거지도 확 줄어듦. 진작 쓸 걸 그랬음 손목 편하고 시간 확 줄어듦.\n\n다들 요리하거나 살림할 때 제일 귀찮은 게 뭐야? 댓글 남겨줘!\n\n자세한 후기랑 정보는 첫 댓글에 남겨둘게!`,
        body_ja: `まだこれ知らずに毎日プチストレス溜めてる人いる？ガチで${name}知ってから人生変わったわ… ${memo}。準備も片付けも超面倒だったけど、これ使うだけで一瞬で終わる。しかも洗い物も劇的に減るし最高。マジで神グッズすぎる。\n\n詳しいレビューと購入先は最初の返信に載せておくね！`,
        body_ja_trans: `아직도 이거 모르고 매일 소소한 스트레스 쌓아두는 사람 있어? 진심 ${name} 알고 나서 인생이 바뀌었어… ${memo}. 준비도 뒷정리도 엄청 귀찮았는데, 이거 쓰는 것만으로 순식간에 끝남. 게다가 설거지도 획기적으로 줄어들고 최고야. 진심 신박템임.`
      };
      type2 = {
        title: '유형 2. 신기함/숫자 중심형 (조리도구/살림)',
        desc: '1분 만에 / 1초 컷 등 시간 단축과 시각적 쾌감 후킹',
        body_ko: `1분 만에 준비랑 요리 한 방에 뚝딱 끝내는 법 방금 알아냄. 그냥 툭 얹고 꾹 누르면 1초 컷으로 완벽하게 끝남. ${name} 써보니까 요리 서툰 사람도 이건 무조건 전문가 퀄리티 나옴. ${memo}. 내구성도 탄탄하고 깔끔해서 보고 있으면 속 시원함;;\n\n이거 써본 사람 또 있어? 다른 꿀팁 있으면 댓글로 알려줘!\n\n궁금한 사람들을 위해 링크 첫 댓글에 달아둠!`,
        body_ja: `1分で準備から後片付けまで終わらせる時短ワザ見つけた。${name}乗せてギュッと押すだけで1秒で完璧に仕上がるのヤバない？ 料理苦手でもこれなら絶対プロ並み。${memo}。見てて超スッキリするんだけどww\n\n気になった人向けにリンクは最初の返信に貼っておくね！`,
        body_ja_trans: `1분 만에 준비부터 뒷정리까지 끝내는 시간 단축 꿀팁 찾아냄. ${name} 얹어서 꾹 누르기만 하면 1초 만에 완벽하게 마무리되는 거 미치지 않음? 요리 서툴러도 이거라면 무조건 프로 수준임. ${memo}. 보고 있으면 엄청 속 시원해ㅋㅋ`
      };
      type3 = {
        title: '유형 3. 찡찡이/가치 입증형 (조리도구/살림)',
        desc: '퇴근 후 뒷정리/설거지 극단적 고충 해결과 삶의 질 상승',
        body_ko: `먹고는 싶은데 도마랑 주방기구 다 꺼내서 씻기 귀찮아서 참는 사람 나뿐만 아니지? ${name} 쓰면 도마나 잡다한 도구 아예 필요 없음. ${memo}. 싱크대 끈적해질 일도 없고 설거지도 1개로 끝. 진심 올해 최고 잘 산 템이다.\n\n요리하고 뒷정리하는 거 나만 귀찮아? 공감하면 댓글 달아줘ㅋㅋ\n\n필요한 사람 있을까 봐 첫 댓글에 정보 남겨둠!`,
        body_ja: `食べたいけど、まな板や道具を洗うのが面倒で諦めてるの私だけじゃないよね？${name}使えばまな板ガチでいらない。${memo}。キッチンもベタベタしないし洗い物も激減。今年の優勝アイテム確定。\n\n欲しい人向けに最初の返信に情報載せておいたよ！`,
        body_ja_trans: `먹고는 싶은데 도마나 도구들 씻는 게 귀찮아서 포기하는 거 나뿐만 아니지? ${name} 쓰면 도마가 진짜로 필요 없음. ${memo}. 주방도 끈적거리지 않고 설거지도 격감. 올해의 우승템 확정.`
      };
      type4 = {
        title: '유형 4. 훈수/논쟁 유도형 (조리도구/살림)',
        desc: '요리는 장비빨 vs 아니다 댓글 싸움 유도 후킹',
        body_ko: `솔직히 일상 살림이나 요리는 장비빨인 거 다들 인정? 아직도 손목 아프게 구식 방법 고집하는 사람 보면 내가 다 답답함. ${name}처럼 안전하고 편하게 만들어주는 꿀템들이 널렸는데 왜 안 써? ${memo}. 자취생이든 주부든 직접 써보면 주방에 있는 시간이 확 줄어듦.\n\n주방 살림은 도구빨이다 vs 손맛이다, 다들 생각은? 댓글 남겨줘!\n\n정보 궁금한 사람 첫 댓글 확인해봐!`,
        body_ja: `ぶっちゃけ家事も料理もアイテム次第って皆も思うよね？未だに手首痛くしながら古いやり方にこだわってる人見るともどかしくなる。${name}使えば便利で安全な神グッズがたくさんあるのになんで使わないの？ ${memo}。異論は認めないww\n\n気になる人は最初の返信チェックしてみて！`,
        body_ja_trans: `솔직히 살림도 요리도 아이템 빨이라는 거 다들 생각하지? 아직도 손목 아파가면서 옛날 방식 고집하는 사람 보면 답답해짐. ${name} 쓰면 편리하고 안전한 신박템들이 널렸는데 왜 안 써? ${memo}. 이견은 인정 안 함ㅋㅋ`
      };
    }

    // 2단계: 추천 미디어 매칭 가이드
    const mediaGuide = {
      highlight: `도구의 기능과 핵심 쾌감이 가장 시원하게 드러나는 1~3초 액션 구간 추천 (${name}의 작동 순간)`,
      capture: `완성된 깔끔한 결과물과 함께 ${name}의 디자인이 돋보이는 클로즈업 사진 추천`
    };

    // 3단계: 첫 댓글 고정용 수익화 문구 (스팸 필터 안전 단일 링크 + 공정위 문구 완비)
    let commentLeadKo = '다들 이거 어디서 샀냐고 물어보셔서 링크 남겨둘게! 🤍';
    if (isBeauty) {
      commentLeadKo = '피부과/화장품 어디 거냐고 디엠 많이 주셔서 좌표 남겨둘게! 🤍';
    } else if (isFood) {
      commentLeadKo = '식단/재료 어디서 쟁여두냐고 문의 많아서 제가 사는 최저가처 남겨둘게! 🤍';
    } else if (isLiving) {
      commentLeadKo = '공간/인테리어 문의 주신 분들 보시라고 구매 좌표 남겨둘게! 🤍';
    }

    const pinned_comment_ko = `${commentLeadKo}

👉 최저가 바로가기: ${link}

(※ ${ftcDisclaimer})`;

    const pinned_comment_ja = `みんなこれどこで買ったか気になってるみたいだからリンク貼っとくね！✨

👉 最安値はこちら: ${isAmazon ? link : 'https://amzn.to/example'}

(※ Amazonアソシエイト・プログラムの参加者として適格販売により収入を得ています。)

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
    const platMeta = (typeof AffiliatePlatforms !== 'undefined' && AffiliatePlatforms[platId])
      ? AffiliatePlatforms[platId]
      : (typeof AffiliatePlatforms !== 'undefined' ? AffiliatePlatforms['coupang'] : null);
    const ftcText = (platMeta && platMeta.disclaimer)
      ? platMeta.disclaimer.replace(/^※\s*/, '')
      : '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.';

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

    const title = `[${name}] 솔직 후기! 내돈내산 삶의 질 수직상승템 추천`;
    const cleanBody = fullText
      .replace(title, '')
      .replace(/\[이미지 \d+ 삽입:[^\]]+\]\n*/g, '')
      .trim();

    return {
      title,
      fullText,
      cleanBody,
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
  // ⑥ 쿠팡 인플루언서 자동 DM 1초 세팅 키트 (ManyChat 3중 수익화 번들 엔진)
  // ==========================================
  generateCoupangAutoDmKit(p) {
    const name = p.name;
    const memo = p.memo || '';
    const link = p.link || 'https://link.coupang.com/...';
    const platId = p.platform || 'coupang';
    const platMeta = (typeof AffiliatePlatforms !== 'undefined' && AffiliatePlatforms[platId])
      ? AffiliatePlatforms[platId]
      : (typeof AffiliatePlatforms !== 'undefined' ? AffiliatePlatforms['coupang'] : null);
    const disclaimer = (platMeta && platMeta.disclaimer) ? platMeta.disclaimer : '※ 본 게시물은 제휴마케팅 활동의 일환으로 일정 수수료를 제공받습니다.';

    const textLower = `${name} ${memo}`.toLowerCase();
    const isBeauty = p.category === 'beauty' || /립|틴트|화장|뷰티|세럼|크림|앰플|패치/.test(textLower);
    const isFood = p.category === 'kitchen_food' || /단호박|호박|레시피|에프|과일|식단|요리|간식|디저트|소스|에어프라이어|파스타|고기|토마토/.test(textLower);

    let bundleItem2 = '함께 쓰면 2배 편한 추천 에어프라이어/도구';
    let bundleLink2 = 'https://link.coupang.com/a/synergy-tool';
    let bundleItem3 = '부담 없는 0칼로리 소스/알룰로스 시럽';
    let bundleLink3 = 'https://link.coupang.com/a/synergy-sauce';

    if (isBeauty) {
      bundleItem2 = '입술 각질 잠재우는 보습 립밤/립플럼퍼';
      bundleLink2 = 'https://link.coupang.com/a/synergy-lipcare';
      bundleItem3 = '하루종일 무너짐 없는 롱래스팅 메이크업 픽서';
      bundleLink3 = 'https://link.coupang.com/a/synergy-fixer';
    } else if (!isFood) {
      bundleItem2 = '공간 활용 200% 올려주는 정리 수납 트레이';
      bundleLink2 = 'https://link.coupang.com/a/synergy-tray';
      bundleItem3 = '자국 없이 깨끗하게 닦이는 전용 클리너';
      bundleLink3 = 'https://link.coupang.com/a/synergy-cleaner';
    }

    const followerDm = `안녕하세요! 요청하신 [${name}] 정보와 꿀조합 키트 보내드려요 🤍
늘 응원해 주셔서 감사합니다 ❤️ 아래 링크에서 확인해 보세요!

1️⃣ 메인 아이템 (${name}):
👉 최저가 구매처: ${link}

2️⃣ 시너지 꿀조합 01 (${bundleItem2}):
👉 바로가기: ${bundleLink2}

3️⃣ 시너지 꿀조합 02 (${bundleItem3}):
👉 바로가기: ${bundleLink3}

(${disclaimer})`;

    const nonFollowerDm = `요청하신 [${name}] 정보와 꿀조합 키트입니다 🤍

1️⃣ 메인 아이템 (${name}):
👉 최저가 구매처: ${link}

2️⃣ 시너지 꿀조합 01 (${bundleItem2}):
👉 바로가기: ${bundleLink2}

3️⃣ 시너지 꿀조합 02 (${bundleItem3}):
👉 바로가기: ${bundleLink3}

💡 팔로우해 두시면 매주 삶의 질 상승 대란템 정보를 가장 먼저 받아보실 수 있어요 ✨
(${disclaimer})`;

    return {
      keywords: ['나도', '나두', '레시피', '정보', '좌표', '구매처', '링크'],
      keywordsText: '나도, 나두, 레시피, 정보, 좌표, 구매처, 링크',
      triggerKeywords: '나도, 나두, 레시피, 정보, 좌표, 구매처, 링크',
      autoReply: `DM으로 요청하신 [${name}] 레시피 & 최저가 구매 링크 보내드렸어요! 메시지 요청함을 확인해 보세요 💌`,
      autoReplyComment: `DM으로 요청하신 최저가 구매 링크와 상세 정보 보내드렸어요! 보관함(요청) 확인해 보세요 💌`,
      followerDm,
      nonFollowerDm,
      productLink: link
    };
  }

  // ==========================================
  // 인스타그램 캡션 생성기 (8,000댓글 바이럴 호흡 & 공정위 문구 완비)
  // ==========================================
  generateInstagramCaption(p, count, monetizationMode) {
    const name = p.name;
    const memo = p.memo || '';
    const link = p.link || 'https://link.coupang.com/...';
    const isDM = monetizationMode === 'dm';
    const category = p.category || this.inferCategory(p);
    const textLower = `${name} ${memo}`.toLowerCase();
    const isFood = category === 'kitchen_food' || /단호박|호박|레시피|에프|과일|식단|요리|간식|디저트|소스|에어프라이어|파스타|고기|토마토/.test(textLower);
    const isBeauty = category === 'beauty' || /립|틴트|화장|뷰티|세럼|크림|앰플|패치/.test(textLower);
    const platId = p.platform || 'coupang';
    const platMeta = (typeof AffiliatePlatforms !== 'undefined' && AffiliatePlatforms[platId])
      ? AffiliatePlatforms[platId]
      : (typeof AffiliatePlatforms !== 'undefined' ? AffiliatePlatforms['coupang'] : null);
    const ftcDisclaimer = (platMeta && platMeta.disclaimer) ? platMeta.disclaimer : '※ 본 게시물은 제휴마케팅 활동의 일환으로 일정 수수료를 제공받습니다.';

    // 고유 검색 번호 생성 (데이즈홈 시그니처: "프로필링크에서 464번 검색해주세요!")
    let searchNum = '464';
    if (isBeauty) searchNum = '513';
    else if (!isFood) searchNum = '327';

    if (isFood) {
      if (isDM) {
        return `만드는데 5분컷! 이거 먹고 감량했다는 사람이 왜 이렇게 많은지 알겠네요👀

쫀득하고 달달해서
디저트 같은데,

재료만 넣고
에프에 돌리면 끝.

너무 맛있어서
매일 먹게 되는 레시피인데
관리할 때도 부담이 적더라고요✨

레시피와 재료 정보는
"나도" 남겨주세요! 💙🩵

✔ 제품 및 재료는 프로필링크에서 확인 가능해요
👉 프로필링크에서 ${searchNum} 검색해주세요!
📸 ⓒviralmaker 복제 🚫

(${ftcDisclaimer})

#식단관리 #다이어트레시피 #에어프라이어요리 #초간단요리 #다이어트식단 #자취요리 #간식추천 #간편식 #홈쿡`;
      }
      return `만드는데 5분컷! 이거 먹고 감량했다는 사람이 왜 이렇게 많은지 알겠네요👀

쫀득하고 달달해서
디저트 같은데,

재료만 넣고
에프에 돌리면 끝.

너무 맛있어서
매일 먹게 되는 레시피인데
관리할 때도 부담이 적더라고요✨

📍 초간단 레시피 & 사용 재료 최저가 정보:
👉 프로필 링크에서 ${searchNum} 검색해주세요! 🔗
(재료 품절 빠르니 재고 있을 때 쟁여두세요!)

📸 ⓒviralmaker 복제 🚫

(${ftcDisclaimer})

#식단관리 #다이어트레시피 #에어프라이어요리 #초간단요리 #다이어트식단 #자취요리 #간식추천 #간편식 #홈쿡`;
    }

    if (isBeauty) {
      if (isDM) {
        return `여배우 립 예쁘다 싶으면 은근 다 이거였음..💄❤️

여배우들도 촬영 때 자주 쓴다는
${name} 인기 립인데
발색이 진짜 너무 예뻐요🥹

슥 바르면 얼굴은 화사해지고
청순하면서도 우아한 분위기가 확 살아남✨

꾸안꾸 청순립 좋아한다면
이건 진짜 소장각🤍
정보는 "나도" 남겨주세요💌

✔ 제품은 프로필링크에서 확인 가능해요
👉 프로필링크에서 ${searchNum}번 검색해주세요!
📸 ⓒviralmaker 복제 🚫

(${ftcDisclaimer})

#뷰티스타그램 #립스틱추천 #여배우립 #인생립 #코덕스타그램 #웜톤립 #쿨톤립 #화장품추천 #메이크업`;
      }
      return `여배우 립 예쁘다 싶으면 은근 다 이거였음..💄❤️

여배우들도 촬영 때 자주 쓴다는
${name} 인기 립인데
발색이 진짜 너무 예뻐요🥹

슥 바르면 얼굴은 화사해지고
청순하면서도 우아한 분위기가 확 살아남✨

꾸안꾸 청순립 좋아한다면 이건 진짜 소장각🤍
📍 [${name}] 최저가 구매 좌표 & 컬러 정보:
👉 프로필링크에서 ${searchNum}번 검색해주세요! 🔗

📸 ⓒviralmaker 복제 🚫

(${ftcDisclaimer})

#뷰티스타그램 #립스틱추천 #여배우립 #인생립 #코덕스타그램 #웜톤립 #쿨톤립 #화장품추천 #메이크업`;
    }

    // 살림 / 주방용품 / 일반
    if (isDM) {
      return `써보고 삶의 질 수직상승한 찐후기..🤍✨

친구들이 집 놀러올 때마다
어디서 샀냐고 물어보던
${name}인데 직접 써보니 차원이 다름🥹

1초 만에 깔끔해지고
복잡하던 정리가 싹 끝나서
하루하루가 너무 편해지는 거 있죠✨

삶의 질 상승템 좋아한다면
이건 진짜 소장각🤍
정보는 "나도" 남겨주세요💌

✔ 제품은 프로필링크에서 확인 가능해요
👉 프로필링크에서 ${searchNum}번 검색해주세요!
📸 ⓒviralmaker 복제 🚫

(${ftcDisclaimer})

#살림템 #인생템 #꿀템추천 #내돈내산 #삶의질수직상승 #살림스타그램 #소장각 #자취꿀템 #주부스타그램`;
    }

    return `써보고 삶의 질 수직상승한 찐후기..🤍✨

친구들이 집 놀러올 때마다
어디서 샀냐고 물어보던
${name}인데 직접 써보니 차원이 다름🥹

1초 만에 깔끔해지고
복잡하던 정리가 싹 끝나서
하루하루가 너무 편해지는 거 있죠✨

삶의 질 상승템 좋아한다면 이건 진짜 소장각🤍
📍 [${name}] 최저가 구매 좌표 & 상세 정보:
👉 프로필링크에서 ${searchNum}번 검색해주세요! 🔗

📸 ⓒviralmaker 복제 🚫

(${ftcDisclaimer})

#살림템 #인생템 #꿀템추천 #내돈내산 #삶의질수직상승 #살림스타그램 #소장각 #자취꿀템 #주부스타그램`;
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
