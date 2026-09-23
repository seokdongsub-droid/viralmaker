/**
 * cardnews.js
 * 인스타그램 쇼핑 카드뉴스 렌더링 엔진 (한국어/일본어 2개 언어 실시간 전환 지원)
 * 이미지 및 동영상(Video 프레임 캡처) 지원
 */

class CardNewsStudioEngine {
  constructor() {
    this.currentLanguage = 'ko'; // 'ko' or 'ja'
    this.slides_ko = [];
    this.slides_ja = [];
    this.slideCount = 4; // 가변 슬라이드 장수 (3장, 4장 데이즈홈, 5장)
    this.currentSlideIndex = 0;
    this.themeKey = 'photo-overlay';
    this.ratio = '4:5'; // '4:5' (1080x1350) 인스타 세로 황금비율 기본, '9:16' (숏폼), '1:1' (정사각)
    this.userImage = null; // Image object (from image or video capture)
    this.slideImages = [null, null, null, null, null]; // 5개 슬라이드별 독립 AI 실사 씬 이미지
    this.fontFamilyMode = 'gothic'; // 'gothic' or 'serif' (감성 명조체)
    this.canvas = null;
    this.ctx = null;
    this.previewContainer = null;
  }

  setFontFamilyMode(mode) {
    this.fontFamilyMode = mode;
    this.render();
  }

  toggleFontFamily() {
    this.fontFamilyMode = (this.fontFamilyMode === 'serif') ? 'gothic' : 'serif';
    this.render();
    return this.fontFamilyMode;
  }

  toggleTextPosition() {
    const cur = this.getCurrentSlide();
    if (!cur) return 'center';
    const curPos = cur.textPosition || (cur.type === 'cover' ? 'bottom' : 'center');
    if (curPos === 'bottom') cur.textPosition = 'top';
    else if (curPos === 'top') cur.textPosition = 'center';
    else cur.textPosition = 'bottom';
    this.render();
    return cur.textPosition;
  }

  setSlideCount(count) {
    if (count < 3 || count > 5) return;
    this.slideCount = count;
    if (this.currentSlideIndex >= count) {
      this.currentSlideIndex = count - 1;
    }
    this.render();
  }

  toggleSlideCount() {
    const nextCount = (this.slideCount === 3) ? 4 : (this.slideCount === 4) ? 5 : 3;
    this.setSlideCount(nextCount);
    return nextCount;
  }

  init(canvasElement, previewContainer) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.previewContainer = previewContainer;

    // 기본 초기 슬라이드
    this.slides_ko = [
      { slideNum: 1, type: 'cover', badge: 'HOT ITEM 🔥', mainTitle: '삶의 질 수직상승!\n추천 아이템 솔직 후기', subTitle: 'SNS 대란템 직접 써보고 남기는 찐후기', extra: '지금 구매 시 특별 할인 혜택' },
      { slideNum: 2, type: 'problem', badge: 'CHECK LIST 🤔', mainTitle: '매일 반복되는 불편함\n혹시 겪고 계신가요?', subTitle: '바쁜 일상 속 피로와 스트레스,\n더 이상 참지 마세요!', extra: '현대인 필수 체크 포인트' },
      { slideNum: 3, type: 'solution', badge: 'SOLUTION 💡', mainTitle: '이 제품 하나로\n고민 완전 해결!', subTitle: '✔ 독보적인 프리미엄 핵심 기능\n✔ 확실한 실사용 만족도', extra: '직접 써보면 감탄 나오는 효과' },
      { slideNum: 4, type: 'detail', badge: '핵심 포인트 3가지 🔍', mainTitle: '디테일이 다른 이유', subTitle: '1. 초경량 & 뛰어난 휴대성\n2. 누구나 간편한 조작\n3. 안전하고 탄탄한 내구성', extra: '후기가 증명하는 완성도' },
      { slideNum: 5, type: 'cta', badge: 'SPECIAL EVENT 🎁', mainTitle: '놓치면 후회할\n기간 한정 프로모션!', subTitle: '지금 특별 할인가로 만나보세요!\n구매는 프로필 링크를 확인하세요.', extra: '재고 소진 시 조기 마감' }
    ];

    this.slides_ja = [
      { slideNum: 1, type: 'cover', badge: '大バズり中 🔥', mainTitle: '【SNSで話題】\n神アイテム本音レビュー！', subTitle: 'QOL爆上がり確定！もっと早く買えばよかった🥹', extra: '大人気のため売り切れ注意⚠️' },
      { slideNum: 2, type: 'problem', badge: 'こんなお悩みありませんか？🤔', mainTitle: '毎日のプチストレス\n我慢していませんか？', subTitle: '「もっと快適に過ごしたい…」\n日常의悩みをこれ1つでスッキリ解消！', extra: '見逃せないチェックポイント' },
      { slideNum: 3, type: 'solution', badge: 'お悩み解決 💡', mainTitle: 'これ1つで\n暮らしが変わる！', subTitle: '✔ 圧倒的な使いやすさと満足度\n✔ 一度使ったらもう手放せない便利さ', extra: 'リアルな口コミでも大絶賛✨' },
      { slideNum: 4, type: 'detail', badge: '選ばれる3つの理由 🔍', mainTitle: '使って実感した\n決定的なポイント', subTitle: '1. デザイン性と機能性の両立\n2. 誰でも簡単＆快適に使える設計\n3. 圧倒的な高コスパで大満足', extra: 'リピート率が高い納得のクオリティ' },
      { slideNum: 5, type: 'cta', badge: 'お得情報 🎁', mainTitle: '今だけの特別チャンス！\n限定キャンペーン中', subTitle: '気になったら今すぐチェック！\n詳細はプロフィールのリンクから🔗✨', extra: '在庫限りのためお早めに！' }
    ];

    this.updateCanvasDimensions();
    this.render();
  }

  get slides() {
    const raw = this.currentLanguage === 'ja' ? this.slides_ja : this.slides_ko;
    return raw.slice(0, this.slideCount || 4);
  }

  set slides(val) {
    if (this.currentLanguage === 'ja') {
      this.slides_ja = val;
    } else {
      this.slides_ko = val;
    }
    if (val && Array.isArray(val)) {
      this.slideCount = val.length;
    }
  }

  setGeneratedSlides(slidesKo, slidesJa) {
    if (slidesKo) {
      this.slides_ko = slidesKo;
      this.slideCount = slidesKo.length;
    }
    if (slidesJa) this.slides_ja = slidesJa;
    this.currentSlideIndex = 0;
    this.render();
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
    this.render();
  }

  setTheme(themeKey) {
    if (CardNewsThemes[themeKey]) {
      this.themeKey = themeKey;
      this.render();
    }
  }

  setRatio(ratio) {
    this.ratio = ratio;
    this.updateCanvasDimensions();
    this.render();
  }

  updateCanvasDimensions() {
    if (!this.canvas) return;
    if (this.ratio === '4:5') {
      this.canvas.width = 1080;
      this.canvas.height = 1350;
      this.canvas.style.aspectRatio = '4 / 5';
      this.canvas.style.maxWidth = '340px';
    } else if (this.ratio === '9:16') {
      this.canvas.width = 1080;
      this.canvas.height = 1920;
      this.canvas.style.aspectRatio = '9 / 16';
      this.canvas.style.maxWidth = '290px';
    } else {
      this.canvas.width = 1080;
      this.canvas.height = 1080;
      this.canvas.style.aspectRatio = '1 / 1';
      this.canvas.style.maxWidth = '340px';
    }
  }

  // 이미지 또는 비디오 프레임 DataURL 등록 (단일 사진 또는 전체 기본 배경)
  setUserMedia(dataUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.userImage = img;
      // 전체 슬라이드 기본값으로도 세팅 (개별 이미지가 없을 때 폴백)
      this.render();
    };
    img.src = dataUrl;
  }

  // 🎨 슬라이드별 개별 씬 이미지 등록 (0 ~ 4)
  setSlideImage(index, dataOrBlobUrl) {
    if (index < 0 || index > 4 || !dataOrBlobUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.slideImages[index] = img;
      if (this.currentSlideIndex === index) {
        this.render();
      }
    };
    img.src = dataOrBlobUrl;
  }

  // 5개 슬라이드 전체 이미지 일괄 등록
  setAllSlideImages(urls) {
    if (!Array.isArray(urls)) return;
    urls.forEach((u, i) => {
      if (u) this.setSlideImage(i, u);
    });
  }

  // 모든 슬라이드 이미지 초기화
  clearSlideImages() {
    this.slideImages = [null, null, null, null, null];
    this.render();
  }

  // ✂️ 2x2 4분할 격자 콜라주 사진 1장을 4장의 개별 슬라이드로 자동 분할 & 배분
  splitAndSet4GridCollage(dataOrImg, callback) {
    const handleImage = (img) => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      const halfW = Math.floor(w / 2);
      const halfH = Math.floor(h / 2);

      // 미세한 테두리 공백/구분선을 정밀하게 고려한 4분할 좌표
      const quadrants = [
        { sx: 0, sy: 0 },         // 1번: 좌상단 (표지 풀샷)
        { sx: halfW, sy: 0 },     // 2번: 우상단 (사용 액션)
        { sx: 0, sy: halfH },     // 3번: 좌하단 (디테일/특징)
        { sx: halfW, sy: halfH }  // 4번: 우하단 (완성/결과)
      ];

      const splitDataUrls = quadrants.map(q => {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = halfW;
        offCanvas.height = halfH;
        const ctx = offCanvas.getContext('2d');
        ctx.drawImage(img, q.sx, q.sy, halfW, halfH, 0, 0, halfW, halfH);
        return offCanvas.toDataURL('image/jpeg', 0.95);
      });

      this.clearSlideImages();
      this.setRatio('4:5'); // 4컷 분할 시 인스타 4:5 최적 규격으로 자동 세팅
      this.setSlideCount(4); // 4장 모드로 자동 동기화
      splitDataUrls.forEach((url, idx) => {
        this.setSlideImage(idx, url);
      });
      this.setUserMedia(splitDataUrls[0]);
      this.render();

      if (typeof callback === 'function') {
        callback(splitDataUrls);
      }
    };

    if (typeof dataOrImg === 'string') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => handleImage(img);
      img.src = dataOrImg;
    } else if (dataOrImg instanceof HTMLImageElement) {
      handleImage(dataOrImg);
    }
  }

  // 현재 슬라이드의 활성 이미지 반환
  getCurrentSlideImage() {
    return this.slideImages[this.currentSlideIndex] || this.userImage;
  }

  // 동영상 파일에서 썸네일 자동 캡처
  captureVideoFrame(videoFile, onReady) {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(videoFile);
    video.muted = true;
    video.playsInline = true;

    video.onloadeddata = () => {
      video.currentTime = Math.min(0.5, video.duration / 2);
    };

    video.onseeked = () => {
      const capCanvas = document.createElement('canvas');
      capCanvas.width = video.videoWidth || 720;
      capCanvas.height = video.videoHeight || 720;
      const capCtx = capCanvas.getContext('2d');
      capCtx.drawImage(video, 0, 0, capCanvas.width, capCanvas.height);
      const dataUrl = capCanvas.toDataURL('image/jpeg', 0.9);
      this.setUserMedia(dataUrl);
      if (onReady) onReady(dataUrl);
    };
  }

  getCurrentSlide() {
    const list = this.slides;
    return list[this.currentSlideIndex] || list[0];
  }

  updateCurrentSlide(data) {
    const cur = this.getCurrentSlide();
    if (cur) {
      if (data.badge !== undefined) cur.badge = data.badge;
      if (data.mainTitle !== undefined) cur.mainTitle = data.mainTitle;
      if (data.subTitle !== undefined) cur.subTitle = data.subTitle;
      if (data.extra !== undefined) cur.extra = data.extra;
      this.render();
    }
  }

  nextSlide() {
    if (this.currentSlideIndex < this.slides.length - 1) {
      this.currentSlideIndex++;
      this.render();
      return true;
    }
    return false;
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
      this.render();
      return true;
    }
    return false;
  }

  // --- 메인 렌더링 루프 ---
  render(targetCtx = null, targetSlide = null, targetWidth = null, targetHeight = null) {
    const ctx = targetCtx || this.ctx;
    const slide = targetSlide || this.getCurrentSlide();
    const width = targetWidth || this.canvas.width;
    const height = targetHeight || this.canvas.height;
    const theme = CardNewsThemes[this.themeKey] || CardNewsThemes['modern-dark'];
    const isJP = this.currentLanguage === 'ja';
    let fontFam = isJP ? '"Noto Sans JP", sans-serif' : '-apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
    if (this.fontFamilyMode === 'serif') {
      fontFam = isJP 
        ? '"Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", serif' 
        : '"Nanum Myeongjo", "Batang", "Noto Serif KR", "Apple SD Gothic Neo", serif';
    }

    if (!ctx || !slide) return;

    // 📸 인스타 포토 감성 테마 (Dayz 스타일: 실사진 전체 배경 + 감성 외곽선 자막)
    if (this.themeKey === 'photo-overlay') {
      this.drawDayzPhotoOverlaySlide(ctx, width, height, theme, slide, fontFam, isJP);
      return;
    }

    // 1. 배경
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);

    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
    bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. 상단 헤더
    ctx.save();
    const pad = 80;
    const topY = 90;

    ctx.font = `600 28px ${fontFam}`;
    ctx.fillStyle = theme.textSub;
    ctx.textAlign = 'left';
    ctx.fillText(isJP ? 'RECOMMENDED ITEM ✦' : 'PICK ITEM ✦', pad, topY);

    const curStr = String(slide.slideNum).padStart(2, '0');
    const totalStr = String(this.slides.length).padStart(2, '0');
    ctx.textAlign = 'right';
    ctx.font = `700 28px ${fontFam}`;
    ctx.fillStyle = theme.primary;
    ctx.fillText(`${curStr} `, width - pad - 45, topY);
    ctx.fillStyle = theme.textSub;
    ctx.fillText(`/ ${totalStr}`, width - pad, topY);
    ctx.restore();

    // 3. 슬라이드 본문
    if (slide.type === 'cover') {
      this.drawCoverSlide(ctx, width, height, theme, slide, fontFam);
    } else if (slide.type === 'problem') {
      this.drawProblemSlide(ctx, width, height, theme, slide, fontFam);
    } else if (slide.type === 'solution' || slide.type === 'detail') {
      this.drawContentSlide(ctx, width, height, theme, slide, fontFam);
    } else if (slide.type === 'cta') {
      this.drawCtaSlide(ctx, width, height, theme, slide, fontFam);
    } else {
      this.drawContentSlide(ctx, width, height, theme, slide, fontFam);
    }

    // 4. 하단 인디케이터
    this.drawFooter(ctx, width, height, theme, slide, fontFam, isJP);
  }

  drawFooter(ctx, width, height, theme, slide, fontFam, isJP) {
    ctx.save();
    const is916 = (this.ratio === '9:16');
    const bottomY = is916 ? (height - 200) : (height - 80);
    const pad = is916 ? 60 : 80;
    const dotCount = this.slides.length;
    const dotRadius = is916 ? 8 : 6;
    const dotGap = 20;

    for (let i = 0; i < dotCount; i++) {
      ctx.beginPath();
      const x = pad + (i * dotGap);
      ctx.arc(x, bottomY, dotRadius, 0, Math.PI * 2);
      if (i === slide.slideNum - 1) {
        ctx.fillStyle = theme.primary;
        ctx.fill();
      } else {
        ctx.fillStyle = theme.borderColor;
        ctx.fill();
      }
    }

    ctx.textAlign = 'right';
    ctx.font = `600 26px ${fontFam}`;
    ctx.fillStyle = theme.textSub;
    if (slide.slideNum < this.slides.length) {
      ctx.fillText(isJP ? 'スワイプして次へ ➔' : '옆으로 넘겨보기 ➔', width - pad, bottomY + 4);
    } else {
      ctx.fillStyle = theme.accentBadge;
      ctx.fillText(isJP ? 'プロフリンクからチェック🔗' : '프로필 링크에서 확인 ✨', width - pad, bottomY + 4);
    }
    ctx.restore();
  }

  drawBadge(ctx, text, x, y, theme, fontFam) {
    ctx.save();
    ctx.font = `800 26px ${fontFam}`;
    const textWidth = ctx.measureText(text).width;
    const padX = 24;
    const badgeW = textWidth + (padX * 2);
    const badgeH = 48;

    this.roundRect(ctx, x, y, badgeW, badgeH, 24);
    ctx.fillStyle = theme.accentBadge;
    ctx.fill();

    ctx.fillStyle = theme.badgeText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + (badgeW / 2), y + (badgeH / 2));
    ctx.restore();
    return badgeH;
  }

  // 📸 Dayzhome 스타일: 실사진 전체 배경 + 감성 외곽선 자막 렌더러 (1:1 피드 & 9:16 숏폼 완벽 호환)
  drawDayzPhotoOverlaySlide(ctx, width, height, theme, slide, fontFam, isJP) {
    const is916 = (this.ratio === '9:16');
    const slideIdx = (slide && slide.slideNum ? slide.slideNum - 1 : this.currentSlideIndex);
    const targetImg = this.slideImages[slideIdx] || this.userImage;

    // 1. Fullscreen Image Cover (슬라이드별 개별 씬 이미지 또는 단일 사진 스마트 5단 앵글 연출)
    if (targetImg && (targetImg.complete || targetImg.naturalWidth > 0) && (targetImg.naturalWidth !== 0)) {
      const img = targetImg;
      const imgNaturalW = img.naturalWidth || img.width;
      const imgNaturalH = img.naturalHeight || img.height;
      const imgRatio = imgNaturalW / imgNaturalH;
      const canvasRatio = width / height;

      // 기본 커버(Cover) 크기 계산
      let baseW, baseH;
      if (imgRatio > canvasRatio) {
        baseH = height;
        baseW = height * imgRatio;
      } else {
        baseW = width;
        baseH = width / imgRatio;
      }

      // 💡 [스마트 5단 앵글 연출]: 단일 사진일 때 각도·줌·초점을 다르게 자동 연출
      const isSingleImage = !this.slideImages[slideIdx] && Boolean(this.userImage);
      let scale = 1.0;
      let focalShiftY = 0; // 중심 이동

      if (isSingleImage) {
        if (slideIdx === 0) {
          // 1번 표지: 정구도 안정적인 풀스크린 샷 (100%)
          scale = 1.0;
          focalShiftY = 0;
        } else if (slideIdx === 1) {
          // 2번 고민: 시선 집중 은은한 줌인 (112%) + 감성 비네팅
          scale = 1.12;
          focalShiftY = -0.04;
        } else if (slideIdx === 2) {
          // 3번 사용: 중심부 다이내믹 액션 클로즈업 줌 (128%)
          scale = 1.28;
          focalShiftY = 0.04;
        } else if (slideIdx === 3) {
          // 4번 디테일: 소재·질감 초근접 매크로 접사 줌 (146%)
          scale = 1.46;
          focalShiftY = 0.08;
        } else if (slideIdx === 4) {
          // 5번 완성: 피니시 와이드 컷 (106%)
          scale = 1.06;
          focalShiftY = -0.02;
        }
      }

      const drawW = baseW * scale;
      const drawH = baseH * scale;
      const drawX = (width - drawW) / 2;
      const drawY = (height - drawH) / 2 + (focalShiftY * height * 0.15);

      ctx.save();
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // 2번 슬라이드: 문제/고민 연출용 감성 비네팅 효과
      if (isSingleImage && slideIdx === 1) {
        const vignGrad = ctx.createRadialGradient(width / 2, height / 2, width * 0.25, width / 2, height / 2, width * 0.75);
        vignGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignGrad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
        ctx.fillStyle = vignGrad;
        ctx.fillRect(0, 0, width, height);
      }
      ctx.restore();
    } else {
      // 사진 미첨부 시: 심플하고 세련된 프리미엄 다크 스튜디오 배경 (중앙 중복 텍스트 완전 제거)
      const studioGrad = ctx.createLinearGradient(0, 0, width, height);
      studioGrad.addColorStop(0, '#1e1b4b');   // Deep indigo
      studioGrad.addColorStop(0.5, '#0f172a'); // Slate dark
      studioGrad.addColorStop(1, '#18181b');   // Zinc dark
      ctx.fillStyle = studioGrad;
      ctx.fillRect(0, 0, width, height);

      // 중앙 앰비언트 글로우 원
      const radialGlow = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.45);
      radialGlow.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
      radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // 은은한 스튜디오 그리드 텍스처
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let gy = 0; gy < height; gy += 120) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }
    }

    // 2. Gradients for text contrast (숏폼 세이프존 고려)
    const topGradH = is916 ? 260 : 180;
    const topGrad = ctx.createLinearGradient(0, 0, 0, topGradH);
    topGrad.addColorStop(0, 'rgba(0,0,0,0.55)');
    topGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, width, topGradH);

    const botGradH = is916 ? 560 : 380;
    const botGrad = ctx.createLinearGradient(0, height - botGradH, 0, height);
    botGrad.addColorStop(0, 'rgba(0,0,0,0)');
    botGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = botGrad;
    ctx.fillRect(0, height - botGradH, width, botGradH);

    // 3. Top right badge: [광고] / 【PR】 (숏폼 상단 여백 세이프존)
    ctx.save();
    ctx.textAlign = 'right';
    const topBadgeY = is916 ? 130 : 65;
    ctx.font = `700 24px ${fontFam}`;
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText(isJP ? '【PR】' : '[광고]', width - 55, topBadgeY);
    ctx.restore();

    // 4. Outlined text helper (White text with black stroke + shadow)
    const drawOutlinedText = (text, x, y, font, fill = '#FFFFFF', stroke = 'rgba(0,0,0,0.95)', strokeWidth = 9, align = 'center') => {
      ctx.save();
      ctx.font = font;
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 3;
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.strokeText(text, x, y);
      ctx.fillStyle = fill;
      ctx.fillText(text, x, y);
      ctx.restore();
    };

    const isSerif = this.fontFamilyMode === 'serif';
    const strokeWidth = isSerif ? 7 : 9;
    const pos = slide.textPosition || (slide.type === 'cover' ? 'bottom' : 'center');

    if (slide.type === 'cover' && pos === 'bottom') {
      // 1번 표지 (하단 배치): 실사진 전체 배경 + 하단 왼쪽 굵은 화이트 볼드 타이틀 (Dayzhome 시그니처)
      const pad = is916 ? 70 : 65;
      let startY = is916 ? (height - 400) : (height - 160);
      const titleLines = slide.mainTitle.split('\n');
      const titleSize = is916 ? 66 : 62;
      const titleStep = is916 ? 88 : 82;

      for (let i = titleLines.length - 1; i >= 0; i--) {
        drawOutlinedText(titleLines[i], pad, startY, `${isSerif ? '800' : '900'} ${titleSize}px ${fontFam}`, '#FFFFFF', 'rgba(0,0,0,0.95)', strokeWidth + 1, 'left');
        startY -= titleStep;
      }

      const defaultSub = isJP ? 'SNS話題のリアル口コミ' : 'SNS 화제의 찐후기';
      const sub = (slide.subTitle || '').split('\n')[0] || defaultSub;
      const subSize = is916 ? 34 : 32;
      drawOutlinedText(sub, pad, startY - 14, `700 ${subSize}px ${fontFam}`, '#F8FAFC', 'rgba(0,0,0,0.85)', strokeWidth - 2, 'left');
    } else if (slide.type === 'cover' && pos === 'top') {
      // 1번 표지 (상단 배치): 감성 푸드/라이프스타일 매거진 타이틀 (과일롤 스타일)
      let curY = is916 ? 300 : 170;
      const titleLines = slide.mainTitle.split('\n');
      const titleSize = is916 ? 62 : 58;
      const titleStep = is916 ? 84 : 78;

      titleLines.forEach(line => {
        drawOutlinedText(line, width / 2, curY, `${isSerif ? '800' : '900'} ${titleSize}px ${fontFam}`, '#FFFFFF', 'rgba(0,0,0,0.95)', strokeWidth + 1, 'center');
        curY += titleStep;
      });

      const defaultSub = isJP ? 'SNS話題のリアル口コミ' : 'SNS 화제의 찐후기';
      const sub = (slide.subTitle || '').split('\n')[0] || defaultSub;
      const subSize = is916 ? 32 : 30;
      drawOutlinedText(sub, width / 2, curY + 6, `600 ${subSize}px ${fontFam}`, '#F8FAFC', 'rgba(0,0,0,0.85)', strokeWidth - 2, 'center');
    } else {
      // 2~5번 슬라이드 (또는 중앙 표지): 상단(top) / 중앙(center) / 하단(bottom) 유연한 배치
      const rawLines = [
        ...(slide.mainTitle || '').split('\n').filter(Boolean),
        ...(slide.subTitle || '').split('\n').filter(Boolean)
      ];

      if (slide.type === 'cta') {
        const ctaLine = isJP ? '👉 詳細はプロフィールのリンクから！🤍' : '👉 제품 정보는 프로필 링크 확인! 🤍';
        if (!rawLines.some(l => l.includes('링크') || l.includes('ナド') || l.includes('나도'))) {
          rawLines.push(ctaLine);
        }
      }

      // 긴 문장 스마트 자동 줄바꿈 (화면 밖 텍스트 잘림 원천 차단)
      const formattedLines = [];
      rawLines.forEach((line) => {
        const clean = line.replace(/^[✔\d\.\s]+/, '').trim();
        if (clean.length > 20) {
          const mid = Math.ceil(clean.length / 2);
          const splitIdx = clean.lastIndexOf(' ', mid) > 0 ? clean.lastIndexOf(' ', mid) : mid;
          formattedLines.push(clean.substring(0, splitIdx).trim());
          formattedLines.push(clean.substring(splitIdx).trim());
        } else if (clean) {
          formattedLines.push(clean);
        }
      });

      const displayLines = formattedLines.slice(0, 5);
      const fontSize = is916 ? 46 : 42;
      const lineStep = is916 ? 78 : 70;
      const totalH = displayLines.length * (lineStep - 4);
      
      let y;
      if (pos === 'top') {
        y = is916 ? 320 : 190;
      } else if (pos === 'bottom') {
        y = is916 ? (height - 480 - totalH) : (height - 240 - totalH);
      } else {
        const centerY = is916 ? (height * 0.46) : (height / 2);
        y = centerY - (totalH / 2) + 34;
      }

      displayLines.forEach((line) => {
        drawOutlinedText(line, width / 2, y, `${isSerif ? '700' : '800'} ${fontSize}px ${fontFam}`, '#FFFFFF', 'rgba(0,0,0,0.95)', strokeWidth, 'center');
        y += lineStep;
      });
    }

    // 하단 인디케이터 점 5개 (숏폼 세이프존 반영)
    ctx.save();
    const dotCount = this.slides.length;
    const dotGap = 22;
    const totalDotW = (dotCount - 1) * dotGap;
    const startX = (width - totalDotW) / 2;
    const dotY = is916 ? (height - 230) : (height - 45);
    for (let i = 0; i < dotCount; i++) {
      ctx.beginPath();
      ctx.arc(startX + (i * dotGap), dotY, i === slide.slideNum - 1 ? 7 : 4, 0, Math.PI * 2);
      ctx.fillStyle = i === slide.slideNum - 1 ? '#FFFFFF' : 'rgba(255,255,255,0.45)';
      ctx.fill();
    }
    ctx.restore();
  }

  drawCoverSlide(ctx, width, height, theme, slide, fontFam) {
    const pad = 80;
    let curY = 170;

    if (slide.badge) {
      this.drawBadge(ctx, slide.badge, pad, curY, theme, fontFam);
      curY += 80;
    }

    ctx.save();
    ctx.font = `900 66px ${fontFam}`;
    ctx.fillStyle = theme.textMain;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const titleLines = slide.mainTitle.split('\n');
    titleLines.forEach(line => {
      ctx.fillText(line, pad, curY);
      curY += 82;
    });

    curY += 10;
    ctx.font = `500 30px ${fontFam}`;
    ctx.fillStyle = theme.textSub;
    ctx.fillText(slide.subTitle, pad, curY);
    curY += 55;
    ctx.restore();

    const imgBoxX = pad;
    const imgBoxY = curY + 20;
    const imgBoxW = width - (pad * 2);
    const imgBoxH = height - imgBoxY - 140;

    this.drawImageContainer(ctx, imgBoxX, imgBoxY, imgBoxW, imgBoxH, theme);
  }

  drawProblemSlide(ctx, width, height, theme, slide, fontFam) {
    const pad = 80;
    let curY = 200;

    if (slide.badge) {
      this.drawBadge(ctx, slide.badge, pad, curY, theme, fontFam);
      curY += 90;
    }

    ctx.save();
    ctx.font = `900 64px ${fontFam}`;
    ctx.fillStyle = theme.textMain;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const titleLines = slide.mainTitle.split('\n');
    titleLines.forEach(line => {
      ctx.fillText(line, pad, curY);
      curY += 82;
    });

    curY += 40;
    const cardW = width - (pad * 2);
    const cardH = height - curY - 160;
    this.roundRect(ctx, pad, curY, cardW, cardH, 28);
    ctx.fillStyle = theme.cardBg;
    ctx.fill();
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    let textY = curY + 60;
    ctx.font = `600 36px ${fontFam}`;
    ctx.fillStyle = theme.primary;
    ctx.fillText(this.currentLanguage === 'ja' ? '⚠ チェックリスト' : '⚠ 문제점 체크', pad + 50, textY);
    textY += 65;

    ctx.font = `500 34px ${fontFam}`;
    ctx.fillStyle = theme.textMain;
    const subLines = slide.subTitle.split('\n');
    subLines.forEach(line => {
      this.wrapText(ctx, line, pad + 50, textY, cardW - 100, 52);
      textY += 60;
    });

    if (slide.extra) {
      textY += 40;
      ctx.font = `700 30px ${fontFam}`;
      ctx.fillStyle = theme.accentBadge;
      ctx.fillText(`👉 ${slide.extra}`, pad + 50, textY);
    }
    ctx.restore();
  }

  drawContentSlide(ctx, width, height, theme, slide, fontFam) {
    const pad = 80;
    let curY = 180;

    if (slide.badge) {
      this.drawBadge(ctx, slide.badge, pad, curY, theme, fontFam);
      curY += 90;
    }

    ctx.save();
    ctx.font = `900 60px ${fontFam}`;
    ctx.fillStyle = theme.textMain;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const titleLines = slide.mainTitle.split('\n');
    titleLines.forEach(line => {
      ctx.fillText(line, pad, curY);
      curY += 76;
    });

    curY += 35;
    const cardW = width - (pad * 2);
    const cardH = height - curY - 160;
    this.roundRect(ctx, pad, curY, cardW, cardH, 28);
    ctx.fillStyle = theme.cardBg;
    ctx.fill();
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    let itemY = curY + 60;
    const lines = slide.subTitle.split('\n').filter(Boolean);

    lines.forEach((line) => {
      this.roundRect(ctx, pad + 40, itemY - 6, 44, 44, 12);
      ctx.fillStyle = theme.primary;
      ctx.fill();

      ctx.font = `700 24px ${fontFam}`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✓', pad + 62, itemY + 16);

      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = `600 34px ${fontFam}`;
      ctx.fillStyle = theme.textMain;
      this.wrapText(ctx, line.replace(/^[✔\d\.\s]+/, ''), pad + 105, itemY, cardW - 160, 48);

      itemY += 100;
    });

    if (slide.extra) {
      itemY += 20;
      ctx.font = `600 30px ${fontFam}`;
      ctx.fillStyle = theme.textSub;
      ctx.fillText(`💡 ${slide.extra}`, pad + 45, itemY);
    }
    ctx.restore();
  }

  drawCtaSlide(ctx, width, height, theme, slide, fontFam) {
    const pad = 80;
    let curY = 200;

    if (slide.badge) {
      this.drawBadge(ctx, slide.badge, pad, curY, theme, fontFam);
      curY += 90;
    }

    ctx.save();
    ctx.font = `900 64px ${fontFam}`;
    ctx.fillStyle = theme.textMain;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const titleLines = slide.mainTitle.split('\n');
    titleLines.forEach(line => {
      ctx.fillText(line, pad, curY);
      curY += 80;
    });

    curY += 40;
    const boxW = width - (pad * 2);
    const boxH = height - curY - 160;

    const grad = ctx.createLinearGradient(pad, curY, pad + boxW, curY + boxH);
    grad.addColorStop(0, theme.cardBg);
    grad.addColorStop(1, theme.bg);
    this.roundRect(ctx, pad, curY, boxW, boxH, 32);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = theme.accentBadge;
    ctx.lineWidth = 3;
    ctx.stroke();

    let contentY = curY + 70;
    ctx.font = `800 44px ${fontFam}`;
    ctx.fillStyle = theme.primary;
    ctx.fillText('SPECIAL OFFER 🎁', pad + 50, contentY);
    contentY += 75;

    ctx.font = `600 36px ${fontFam}`;
    ctx.fillStyle = theme.textMain;
    const subLines = slide.subTitle.split('\n');
    subLines.forEach(line => {
      this.wrapText(ctx, line, pad + 50, contentY, boxW - 100, 52);
      contentY += 60;
    });

    contentY += 40;
    const btnW = boxW - 100;
    const btnH = 80;
    this.roundRect(ctx, pad + 50, contentY, btnW, btnH, 20);
    ctx.fillStyle = theme.accentBadge;
    ctx.fill();

    ctx.font = `800 32px ${fontFam}`;
    ctx.fillStyle = theme.badgeText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const ctaBtnText = this.currentLanguage === 'ja' ? 'プロフィールのリンクから今すぐ購入 ➔' : '프로필 링크에서 바로 확인하기 ➔';
    ctx.fillText(ctaBtnText, pad + 50 + (btnW / 2), contentY + (btnH / 2));
    ctx.restore();
  }

  drawImageContainer(ctx, x, y, w, h, theme) {
    ctx.save();
    this.roundRect(ctx, x, y, w, h, 28);
    ctx.clip();

    if (this.userImage && this.userImage.complete) {
      const img = this.userImage;
      const imgRatio = img.width / img.height;
      const boxRatio = w / h;
      let drawW, drawH, drawX, drawY;

      if (imgRatio > boxRatio) {
        drawH = h;
        drawW = h * imgRatio;
        drawX = x + (w - drawW) / 2;
        drawY = y;
      } else {
        drawW = w;
        drawH = w / imgRatio;
        drawX = x;
        drawY = y + (h - drawH) / 2;
      }
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      const shadowGrad = ctx.createLinearGradient(x, y + h - 120, x, y + h);
      shadowGrad.addColorStop(0, 'rgba(0,0,0,0)');
      shadowGrad.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(x, y, w, h);
    } else {
      ctx.fillStyle = theme.cardBg;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = theme.borderColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '80px sans-serif';
      ctx.fillStyle = theme.primary;
      ctx.fillText('🛍️', x + (w / 2), y + (h / 2) - 35);

      ctx.font = '700 32px sans-serif';
      ctx.fillStyle = theme.textMain;
      ctx.fillText(this.currentLanguage === 'ja' ? '商品画像・動画を添付してください' : '제품 사진이나 영상을 첨부해보세요!', x + (w / 2), y + (h / 2) + 40);

      ctx.font = '500 24px sans-serif';
      ctx.fillStyle = theme.textSub;
      ctx.fillText(this.currentLanguage === 'ja' ? 'スマホのアルバムから選択' : '스마트폰 사진첩에서 터치하여 선택', x + (w / 2), y + (h / 2) + 85);
    }
    ctx.restore();
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) return;
    const words = text.split('');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n];
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  async shareOrSaveCurrentSlide(onFallbackModal) {
    const dataUrl = this.canvas.toDataURL('image/png');
    // 최신 모바일 브라우저의 네이티브 공유 및 사진첩 저장 (Web Share API)
    if (navigator.share && navigator.canShare) {
      try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], `CardNews_${this.currentLanguage}_Slide_${this.currentSlideIndex + 1}.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'ViralMaker 카드뉴스',
            text: '바이럴메이커에서 제작한 감성 카드뉴스'
          });
          return true;
        }
      } catch (err) {
        if (err.name === 'AbortError') return false; // 사용자가 공유창을 닫음
        console.warn('Web Share API fallback:', err);
      }
    }

    // Web Share 미지원 시 길게 누르기 팝업 모달 fallback
    if (onFallbackModal) {
      onFallbackModal(dataUrl);
    } else {
      this.downloadCurrentSlide();
    }
    return false;
  }

  downloadCurrentSlide() {
    const link = document.createElement('a');
    link.download = `CardNews_${this.currentLanguage}_Slide_${this.currentSlideIndex + 1}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }

  async getAllSlideDataUrls() {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = this.canvas.width;
    offCanvas.height = this.canvas.height;
    const offCtx = offCanvas.getContext('2d');
    const urls = [];

    for (let i = 0; i < this.slides.length; i++) {
      const slide = this.slides[i];
      this.render(offCtx, slide, offCanvas.width, offCanvas.height);
      urls.push(offCanvas.toDataURL('image/png'));
    }
    return urls;
  }

  async downloadAllSlides() {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = this.canvas.width;
    offCanvas.height = this.canvas.height;
    const offCtx = offCanvas.getContext('2d');

    for (let i = 0; i < this.slides.length; i++) {
      const slide = this.slides[i];
      this.render(offCtx, slide, offCanvas.width, offCanvas.height);
      const link = document.createElement('a');
      link.download = `CardNews_${this.currentLanguage}_Slide_${i + 1}.png`;
      link.href = offCanvas.toDataURL('image/png');
      link.click();
      await new Promise(r => setTimeout(r, 400));
    }
  }

  // 최신 모바일 브라우저 5장 일괄 사진첩 저장 / 공유
  async shareOrSaveAllSlides(onFallbackModal) {
    const dataUrls = await this.getAllSlideDataUrls();
    if (navigator.share && navigator.canShare) {
      try {
        const files = [];
        for (let i = 0; i < dataUrls.length; i++) {
          const res = await fetch(dataUrls[i]);
          const blob = await res.blob();
          files.push(new File([blob], `CardNews_${this.currentLanguage}_Slide_${i + 1}.png`, { type: 'image/png' }));
        }
        if (navigator.canShare({ files })) {
          await navigator.share({
            files,
            title: 'ViralMaker 5단 카드뉴스',
            text: '바이럴메이커에서 제작한 감성 카드뉴스 5장'
          });
          return true;
        }
      } catch (err) {
        if (err.name === 'AbortError') return false;
        console.warn('Batch Web Share failed, falling back to sequential download:', err);
      }
    }
    // Web Share 미지원 브라우저는 일괄 다운로드 실행
    await this.downloadAllSlides();
    return true;
  }

  getCurrentDataUrl() {
    return this.canvas.toDataURL('image/png');
  }
}

const CardNewsStudio = new CardNewsStudioEngine();
window.CardNewsStudio = CardNewsStudio;
if (typeof globalThis !== 'undefined') {
  globalThis.CardNewsStudio = CardNewsStudio;
}
