/**
 * templates.js
 * 카드뉴스 테마, 샘플 데이터, 한국어/일본어 카드뉴스 슬라이드 및 복붙용 템플릿 사전
 */

const CardNewsThemes = {
  'modern-dark': {
    name: '모던 다크 (Modern Dark)',
    bg: '#0F172A',
    cardBg: '#1E293B',
    primary: '#38BDF8',
    secondary: '#818CF8',
    textMain: '#FFFFFF',
    textSub: '#94A3B8',
    accentBadge: '#F43F5E',
    badgeText: '#FFFFFF',
    borderColor: '#334155'
  },
  'warm-minimal': {
    name: '감성 웜 베이지 (Warm Minimal)',
    bg: '#FAF7F2',
    cardBg: '#FFFFFF',
    primary: '#B45309',
    secondary: '#D97706',
    textMain: '#292524',
    textSub: '#78716C',
    accentBadge: '#B45309',
    badgeText: '#FFFFFF',
    borderColor: '#E7E5E4'
  },
  'clean-white': {
    name: '스튜디오 화이트 (Clean Studio)',
    bg: '#F8FAFC',
    cardBg: '#FFFFFF',
    primary: '#2563EB',
    secondary: '#3B82F6',
    textMain: '#0F172A',
    textSub: '#64748B',
    accentBadge: '#2563EB',
    badgeText: '#FFFFFF',
    borderColor: '#E2E8F0'
  },
  'vivid-sale': {
    name: '비비드 특가 (Vivid Sale)',
    bg: '#18181B',
    cardBg: '#27272A',
    primary: '#FACC15',
    secondary: '#FB923C',
    textMain: '#FFFFFF',
    textSub: '#E4E4E7',
    accentBadge: '#EF4444',
    badgeText: '#FFFFFF',
    borderColor: '#3F3F46'
  },
  'japanese-zen': {
    name: '재팬 젠 감성 (Japanese Zen)',
    bg: '#F4F5F0',
    cardBg: '#FFFFFF',
    primary: '#475569',
    secondary: '#64748B',
    textMain: '#1E293B',
    textSub: '#64748B',
    accentBadge: '#E11D48',
    badgeText: '#FFFFFF',
    borderColor: '#E2E8F0'
  }
};

// 원클릭 초간단 테스트용 샘플 데이터 (링크 + 메모)
const SampleQuickInputs = [
  {
    title: '목마사지기 (55% 한정특가)',
    link: 'https://smartstore.naver.com/sample/products/neck-care',
    memo: '하루 15분 거북목 승모근 케어, 깃털 무게 145g 온열 기능',
    name: '무선 온열 넥케어 마사지기'
  },
  {
    title: '시카 수분앰플 (1+1 이벤트)',
    link: 'https://brand.naver.com/sample/cica-ampoule',
    memo: '병풀 78% 붉은기 즉각 진정, 속건조 0% 저자극 K-뷰티 앰플',
    name: '시카 판테놀 리페어 수분 앰플'
  },
  {
    title: '세라믹 올인원팬 (주말 특가)',
    link: 'https://shopping.naver.com/sample/ceramic-pan',
    memo: 'PFOA 불검출 친환경 코팅, 냄비와 팬 올인원 딥 디자인, 인덕션 호환',
    name: '세라믹 논스틱 올인원 멀티팬'
  }
];

// 일본 현지 SNS 문체 및 해시태그 사전
const JapaneseCopyVocab = {
  hashtagsJP: {
    threads: ['#おすすめ', '#買ってよかった', '#便利グッズ', '#QOL向上', '#ライフハック', '#正直レビュー'],
    ameba: ['#アメブロ', '#購入品紹介', '#正直レビュー', '#便利アイテム', '#プチプラ', '#お気に入り', '#暮らしを楽しむ']
  }
};
