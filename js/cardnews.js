/**
 * cardnews.js
 * 인스타그램 쇼핑 카드뉴스 렌더링 엔진 (한국어/일본어 2개 언어 실시간 전환 지원)
 * 이미지 및 동영상(Video 프레임 캡처) 지원
 */

class CardNewsStudio {
  constructor() {
    this.currentLanguage = 'ko'; // 'ko' or 'ja'
    this.slides_ko = [];
    this.slides_ja = [];
    this.currentSlideIndex = 0;
    this.themeKey = 'modern-dark';
    this.ratio = '1:1'; // '1:1' (1080x1080) or '4:5' (1080x1350)
    this.userImage = null; // Image object (from image or video capture)
    this.canvas = null;
    this.ctx = null;
    this.previewContainer = null;
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
      { slideNum: 2, type: 'problem', badge: 'こんなお悩みありませんか？🤔', mainTitle: '毎日のプチストレス\n我慢していませんか？', subTitle: '「もっと快適に過ごしたい…」\n日常の悩みをこれ1つでスッキリ解消！', extra: '見逃せないチェックポイント' },
      { slideNum: 3, type: 'solution', badge: 'お悩み解決 💡', mainTitle: 'これ1つで\n暮らしが変わる！', subTitle: '✔ 圧倒的な使いやすさと満足度\n✔ 一度使ったらもう手放せない便利さ', extra: 'リアルな口コミでも大絶賛✨' },
      { slideNum: 4, type: 'detail', badge: '選ばれる3つの理由 🔍', mainTitle: '使って実感した\n決定的なポイント', subTitle: '1. デザイン性と機能性の両立\n2. 誰でも簡単＆快適に使える設計\n3. 圧倒的な高コスパで大満足', extra: 'リピート率が高い納得のクオリティ' },
      { slideNum: 5, type: 'cta', badge: 'お得情報 🎁', mainTitle: '今だけの特別チャンス！\n限定キャンペーン中', subTitle: '気になったら今すぐチェック！\n詳細はプロフィールのリンクから🔗✨', extra: '在庫限りのためお早めに！' }
    ];

    this.updateCanvasDimensions();
    this.render();
  }

  get slides() {
    return this.currentLanguage === 'ja' ? this.slides_ja : this.slides_ko;
  }

  set slides(val) {
    if (this.currentLanguage === 'ja') {
      this.slides_ja = val;
    } else {
      this.slides_ko = val;
    }
  }

  setGeneratedSlides(slidesKo, slidesJa) {
    if (slidesKo) this.slides_ko = slidesKo;
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
    if (this.ratio === '4:5') {
      this.canvas.width = 1080;
      this.canvas.height = 1350;
    } else {
      this.canvas.width = 1080;
      this.canvas.height = 1080;
    }
  }

  // 이미지 또는 비디오 프레임 DataURL 등록
  setUserMedia(dataUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.userImage = img;
      this.render();
    };
    img.src = dataUrl;
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

    if (!ctx || !slide) return;

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
    const fontFam = isJP ? '"Noto Sans JP", sans-serif' : '-apple-system, sans-serif';

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
    const bottomY = height - 80;
    const pad = 80;
    const dotCount = this.slides.length;
    const dotRadius = 6;
    const dotGap = 18;

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

  downloadCurrentSlide() {
    const link = document.createElement('a');
    link.download = `CardNews_${this.currentLanguage}_Slide_${this.currentSlideIndex + 1}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
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

  getCurrentDataUrl() {
    return this.canvas.toDataURL('image/png');
  }
}

window.CardNewsStudio = new CardNewsStudio();
