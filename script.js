// =========================================================
// STATE
// =========================================================
const state = {
  speakerName: '',
  avatarSrc: null,
  avatarDataUrl: null,
  sourceLang: 'vi-VN',
  targetLang: 'en',
  firebaseConfig: {
    apiKey: "AIzaSyAHIrVVcWhilGQmEqn19VAjNOpYZ6kJg8Y",
    authDomain: "translator-conference.firebaseapp.com",
    databaseURL: "https://translator-conference-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "translator-conference",
    storageBucket: "translator-conference.firebasestorage.app",
    messagingSenderId: "414600908356",
    appId: "1:414600908356:web:8942de62b57bf615687611",
    measurementId: "G-MP392ECQGJ",
  },
  sessionId: null,
  viewerUrl: null,
  isPresenting: false,
  isMicOn: false,
  recognition: null,
  db: null,
  sessionRef: null,
  translationLog: [],
  viewerCount: 0,
  maxViewerCount: 0,
  isAutoTTS: true,
  silenceTimer: null,
  isTranslating: false,
  sessionStartTime: null,
  sessionEndTime: null,
  uiLang: 'vi', // Ngôn ngữ giao diện: 'vi' hoặc 'en'
  viewerCountListener: null, // Store listener reference for proper cleanup
  firebaseUpdateTimer: null, // Debounce timer for Firebase updates
};

// =========================================================
// TRANSLATIONS
// =========================================================
const translations = {
  vi: {
    // Setup page
    brandTagline: 'Dịch Thuật Hội Nghị Thời Gian Thực',
    speakerInfo: 'Thông Tin Diễn Giả',
    speakerName: 'Tên Diễn Giả',
    speakerNamePlaceholder: 'Nguyễn Văn A',
    avatar: 'Ảnh Đại Diện',
    chooseImage: '📁 Chọn ảnh từ thiết bị',
    orUrl: 'hoặc URL',
    language: 'Ngôn Ngữ',
    sourceLang: 'Ngôn ngữ gốc',
    targetLang: 'Ngôn ngữ đích',
    createRoom: '✨ Tạo Phòng Dịch Thuật',
    errorEnterName: 'Vui lòng nhập tên diễn giả.',
    
    // Lobby page
    sessionId: 'Session ID',
    creating: 'Đang tạo...',
    viewersCount: 'người đang theo dõi',
    viewers: 'viewers',
    step1: 'Người tham dự <strong>quét mã QR</strong> bằng camera điện thoại',
    step2: 'Trình duyệt mở trang theo dõi — <strong>không cần cài app</strong>',
    step3: 'Nhấn <strong>"Bắt Đầu"</strong> khi sẵn sàng trình chiếu',
    startPresentation: '▶ Bắt Đầu Trình Chiếu',
    backToSetup: '← Quay Lại Thiết Lập',
    
    // Present page
    endSession: '✕ Kết Thúc',
    clickToEnableMic: 'Nhấn để bật mic',
    listening: 'Đang nghe... (nhấn để tắt)',
    turnOffMic: 'Tắt mic',
    turnOnMic: 'Bật mic',
    autoRead: 'Tự động đọc',
    on: 'BẬT',
    off: 'TẮT',
    turnOffAutoRead: 'Tắt tự động đọc',
    turnOnAutoRead: 'Bật tự động đọc',
    realtimeTranslation: '🌐 Bảng Dịch Thuật Thời Gian Thực',
    waiting: '⏸ Đang chờ',
    listeningStatus: '● Đang nghe',
    translating: '⟳ Đang dịch...',
    recognizingText: 'Văn bản đang nhận diện sẽ hiển thị tại đây...',
    translatingText: 'Đang dịch...',
    original: 'Nguyên bản',
    translation: 'Bản dịch',
    
    // Stats page
    statistics: 'Thống Kê Phiên Dịch',
    duration: 'Thời gian',
    translationsCount: 'Số câu đã dịch',
    maxViewers: 'Số người xem tối đa',
    thankYou: 'Cảm ơn bạn đã sử dụng VoiceBridge!',
    backToLobby: '← Quay Lại Lobby',
    
    // Viewer page
    connecting: 'Đang kết nối...',
    waitingSpeaker: 'Đang chờ diễn giả bắt đầu...',
    broadcasting: 'Đang phát sóng',
    sessionEnded: 'Phiên đã kết thúc',
    listeningViewer: 'Đang lắng nghe...',
    waitingStart: 'Đang chờ diễn giả bắt đầu',
    willShowHere: 'Phiên dịch sẽ hiển thị tại đây theo thời gian thực',
    sessionEndedTitle: 'Phiên đã kết thúc',
    thankYouViewer: 'Cảm ơn bạn đã lắng nghe!',
    canReview: 'Bạn vẫn có thể xem lại nội dung dịch bên dưới',
    reviewContent: 'Xem lại nội dung',
    cannotConnect: 'Không thể kết nối',
    needFirebase: 'Trang này cần Firebase để đồng bộ. Yêu cầu diễn giả chia sẻ QR code được tạo từ ứng dụng đã cấu hình Firebase.',
    errorCopyUrl: 'URL chưa sẵn sàng để copy',
  },
  en: {
    // Setup page
    brandTagline: 'Real-Time Conference Translation',
    speakerInfo: 'Speaker Information',
    speakerName: 'Speaker Name',
    speakerNamePlaceholder: 'John Doe',
    avatar: 'Avatar',
    chooseImage: '📁 Choose image from device',
    orUrl: 'or URL',
    language: 'Language',
    sourceLang: 'Source language',
    targetLang: 'Target language',
    createRoom: '✨ Create Translation Room',
    errorEnterName: 'Please enter speaker name.',
    
    // Lobby page
    sessionId: 'Session ID',
    creating: 'Creating...',
    viewersCount: 'viewers watching',
    viewers: 'viewers',
    step1: 'Attendees <strong>scan QR code</strong> with phone camera',
    step2: 'Browser opens viewer page — <strong>no app needed</strong>',
    step3: 'Click <strong>"Start"</strong> when ready to present',
    startPresentation: '▶ Start Presentation',
    backToSetup: '← Back to Setup',
    
    // Present page
    endSession: '✕ End',
    clickToEnableMic: 'Click to enable mic',
    listening: 'Listening... (click to stop)',
    turnOffMic: 'Turn off mic',
    turnOnMic: 'Turn on mic',
    autoRead: 'Auto-read',
    on: 'ON',
    off: 'OFF',
    turnOffAutoRead: 'Turn off auto-read',
    turnOnAutoRead: 'Turn on auto-read',
    realtimeTranslation: '🌐 Real-Time Translation Panel',
    waiting: '⏸ Waiting',
    listeningStatus: '● Listening',
    translating: '⟳ Translating...',
    recognizingText: 'Recognized text will appear here...',
    translatingText: 'Translating...',
    original: 'Original',
    translation: 'Translation',
    
    // Stats page
    statistics: 'Session Statistics',
    duration: 'Duration',
    translationsCount: 'Translations count',
    maxViewers: 'Max viewers',
    thankYou: 'Thank you for using VoiceBridge!',
    backToLobby: '← Back to Lobby',
    
    // Viewer page
    connecting: 'Connecting...',
    waitingSpeaker: 'Waiting for speaker to start...',
    broadcasting: 'Broadcasting',
    sessionEnded: 'Session ended',
    listeningViewer: 'Listening...',
    waitingStart: 'Waiting for speaker to start',
    willShowHere: 'Translation will appear here in real-time',
    sessionEndedTitle: 'Session Ended',
    thankYouViewer: 'Thank you for listening!',
    canReview: 'You can still review the translated content below',
    reviewContent: 'Review content',
    cannotConnect: 'Cannot connect',
    needFirebase: 'This page needs Firebase to sync. Please ask the speaker to share the QR code generated from the configured app.',
    errorCopyUrl: 'URL is not ready to copy',
  }
};

function t(key) {
  return translations[state.uiLang][key] || key;
}

function switchLanguage(lang) {
  state.uiLang = lang;
  localStorage.setItem('uiLang', lang);
  updateUILanguage();
}

function updateUILanguage() {
  // Update all text elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT' && el.placeholder !== undefined) {
      el.placeholder = t(key);
    } else {
      el.innerHTML = t(key);
    }
  });
  
  // Update language toggle buttons
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.textContent = state.uiLang === 'vi' ? '🇬🇧 EN' : '🇻🇳 VI';
  });
  
  // Update dynamic content
  updateViewerDisplay(state.viewerCount);
  
  // Update mic label if present
  const micLabel = document.getElementById('mic-label');
  if (micLabel && state.isMicOn) {
    micLabel.textContent = t('listening');
  }
  
  // Update TTS label if present
  updateTTSLabel();
  
  // Update interim display if empty
  const interimDisplay = document.getElementById('interim-display');
  if (interimDisplay && !state.isMicOn && !state.isTranslating) {
    interimDisplay.innerHTML = '<em class="text-muted">' + t('recognizingText') + '</em>';
  }
  
  // Update viewer interim if present
  const viewerInterim = document.getElementById('viewer-interim');
  if (viewerInterim && viewerInterim.querySelector('.text-muted')) {
    viewerInterim.innerHTML = '<em class="text-muted">' + t('listeningViewer') + '</em>';
  }
}

function updateTTSLabel() {
  const ttsLabel = document.getElementById('tts-label');
  if (ttsLabel) {
    const statusText = state.isAutoTTS ? t('on') : t('off');
    ttsLabel.innerHTML = '<span data-i18n="autoRead">' + t('autoRead') + '</span>: <span id="tts-status-text">' + statusText + '</span>';
  }
}

// Bảng ánh xạ ngôn ngữ đích sang mã BCP-47 phù hợp cho SpeechSynthesis
const TTS_LANG_MAP = {
  'en': 'en-US',
  'en-US': 'en-US',
  'en-GB': 'en-GB',
  'vi': 'vi-VN',
  'vi-VN': 'vi-VN',
  'zh': 'zh-CN',
  'zh-CN': 'zh-CN',
  'ja': 'ja-JP',
  'ja-JP': 'ja-JP',
  'ko': 'ko-KR',
  'ko-KR': 'ko-KR',
  'fr': 'fr-FR',
  'fr-FR': 'fr-FR',
  'de': 'de-DE',
  'de-DE': 'de-DE',
  'es': 'es-ES',
  'es-ES': 'es-ES',
  'th': 'th-TH',
  'th-TH': 'th-TH',
  'pt': 'pt-BR',
  'pt-BR': 'pt-BR',
};

const LANG_NAMES = {
  'vi-VN': 'Tiếng Việt', 'en-US': 'English', 'en-GB': 'English',
  'zh-CN': '中文', 'ja-JP': '日本語', 'ko-KR': '한국어',
  'fr-FR': 'Français', 'de-DE': 'Deutsch', 'es-ES': 'Español', 'th-TH': 'ภาษาไทย',
  'vi': 'VI', 'en': 'EN', 'zh': 'ZH', 'ja': 'JA', 'ko': 'KO',
  'fr': 'FR', 'de': 'DE', 'es': 'ES', 'th': 'TH', 'pt': 'PT',
};


// =========================================================
// ROUTING — check URL for session viewer
// =========================================================
function init() {
  // Check browser compatibility
  checkBrowserCompatibility();
  
  // Load saved UI language
  const savedLang = localStorage.getItem('uiLang');
  if (savedLang) {
    state.uiLang = savedLang;
  }
  
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session');
  if (sessionId) {
    startViewerMode(sessionId);
  } else {
    showPage('setup-page');
  }
  
  updateUILanguage();
}

// Check browser compatibility and show warnings
function checkBrowserCompatibility() {
  const warnings = [];
  
  // Check Web Speech API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    warnings.push(state.uiLang === 'vi' 
      ? 'Trình duyệt không hỗ trợ nhận diện giọng nói. Vui lòng dùng Chrome hoặc Edge.'
      : 'Browser does not support speech recognition. Please use Chrome or Edge.');
  }
  
  // Check Speech Synthesis
  if (!window.speechSynthesis) {
    warnings.push(state.uiLang === 'vi'
      ? 'Trình duyệt không hỗ trợ đọc văn bản. Tính năng TTS sẽ không hoạt động.'
      : 'Browser does not support text-to-speech. TTS feature will not work.');
  }
  
  // Check Firebase
  if (typeof firebase === 'undefined') {
    console.warn('Firebase SDK not loaded');
  }
  
  // Check QRCode
  if (typeof QRCode === 'undefined') {
    console.warn('QRCode library not loaded');
  }
  
  // Log warnings
  if (warnings.length > 0) {
    console.warn('Browser compatibility issues:', warnings);
  }
}


// =========================================================
// AVATAR HANDLING
// =========================================================
function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    state.avatarDataUrl = e.target.result;
    state.avatarSrc = null;
    updateAvatarPreview(e.target.result);
  };
  reader.readAsDataURL(file);
}

function handleAvatarUrl(url) {
  if (!url) return;
  
  // Basic URL validation
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      console.warn('Invalid URL protocol');
      return;
    }
  } catch (e) {
    console.warn('Invalid URL format:', e);
    return;
  }
  
  state.avatarSrc = url;
  state.avatarDataUrl = null;
  updateAvatarPreview(url);
}

function updateAvatarPreview(src) {
  const el = document.getElementById('avatar-preview');
  el.textContent = '';
  const img = document.createElement('img');
  img.src = src;
  img.onerror = () => { el.textContent = '🧑‍💼'; };
  el.appendChild(img);
}

function renderAvatar(el, src, fallback = '🧑‍💼') {
  el.textContent = '';
  if (src) {
    const img = document.createElement('img');
    img.src = src;
    img.onerror = () => { el.textContent = fallback; };
    el.appendChild(img);
  } else {
    el.textContent = fallback;
  }
}

// =========================================================
// PROCEED TO LOBBY
// =========================================================
function proceedToLobby() {
  const name = document.getElementById('speaker-name').value.trim();
  if (!name) {
    showError('setup-error', t('errorEnterName'));
    return;
  }
  
  // Validate name length
  if (name.length > 100) {
    showError('setup-error', state.uiLang === 'vi' ? 'Tên quá dài (tối đa 100 ký tự)' : 'Name too long (max 100 characters)');
    return;
  }

  state.speakerName = name;
  state.sourceLang = document.getElementById('source-lang').value;
  state.targetLang = document.getElementById('target-lang').value;

  hideError('setup-error');
  state.sessionId = generateSessionId();

  // Chạy luôn vào lobby vì QR và Firebase tạm thời chỉ là demo UI
  buildLobby();
  showPage('lobby-page');
  initFirebaseForSpeaker();
  warmUpSpeechAPI();
}

function generateSessionId() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(36).padStart(2, '0')).join('').substring(0, 8).toUpperCase();
}


function updateViewerDisplay(count) {
  const lobbyEl = document.getElementById('viewer-count-lobby');
  const footerEl = document.getElementById('footer-viewers');
  if (lobbyEl) lobbyEl.textContent = count + ' ' + t('viewersCount');
  if (footerEl) footerEl.textContent = count + ' ' + t('viewers');
  
  // Cập nhật số người xem tối đa
  if (count > state.maxViewerCount) {
    state.maxViewerCount = count;
  }
}

// =========================================================
// BUILD LOBBY
// =========================================================
function buildLobby() {
  const lobbyName = document.getElementById('lobby-name');
  const lobbyLangs = document.getElementById('lobby-langs');
  const lobbyAvatar = document.getElementById('lobby-avatar');
  const sessionIdDisplay = document.getElementById('session-id-display');
  const sessionUrlDisplay = document.getElementById('session-url-display');
  const qrContainer = document.getElementById('qr-container');
  const copyBtn = document.getElementById('copy-url-btn');
  
  if (!lobbyName || !lobbyLangs || !lobbyAvatar || !sessionIdDisplay || !sessionUrlDisplay || !qrContainer) {
    console.error('Missing lobby elements');
    return;
  }
  
  lobbyName.textContent = state.speakerName;

  const srcName = LANG_NAMES[state.sourceLang] || state.sourceLang;
  const tgtName = LANG_NAMES[state.targetLang] || state.targetLang;
  lobbyLangs.textContent = `${srcName} → ${tgtName}`;

  const avatarSrc = state.avatarSrc || state.avatarDataUrl;
  renderAvatar(lobbyAvatar, avatarSrc);

  const sessionId = state.sessionId;
  sessionIdDisplay.textContent = sessionId;

  // URL ngắn gọn - Firebase config đã được hardcode trong script.js, không cần nhúng vào URL
  const viewerUrl = window.location.origin + window.location.pathname + '?session=' + sessionId;
  
  // Store URL in state for copy function
  state.viewerUrl = viewerUrl;
  
  // Update URL display - remove data-i18n to prevent override
  sessionUrlDisplay.removeAttribute('data-i18n');
  sessionUrlDisplay.textContent = viewerUrl;
  sessionUrlDisplay.style.cursor = 'pointer';
  sessionUrlDisplay.title = 'Click to copy';
  sessionUrlDisplay.onclick = copySessionUrl;
  
  // Show copy button
  if (copyBtn) {
    copyBtn.style.display = 'block';
  }

  // Generate QR - Clear old QR first
  qrContainer.innerHTML = '';
  
  // Check if QRCode library is available
  if (typeof QRCode === 'undefined') {
    console.error('QRCode library not loaded');
    qrContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--red);">QR Code library not loaded</div>';
    return;
  }
  
  try {
    new QRCode(qrContainer, {
      text: viewerUrl,
      width: 200,
      height: 200,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.L,
    });
  } catch (e) {
    console.error('QR Code generation error:', e);
    qrContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--red);">QR Code Error</div>';
  }
}

function copySessionUrl() {
  const url = state.viewerUrl || document.getElementById('session-url-display')?.textContent;
  
  if (!url || url === 'Đang tạo...' || url === 'Creating...') {
    alert(t('errorCopyUrl') || 'URL chưa sẵn sàng');
    return;
  }
  
  // Try modern clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showCopySuccess();
    }).catch(err => {
      console.error('Clipboard API failed:', err);
      fallbackCopyText(url);
    });
  } else {
    fallbackCopyText(url);
  }
}

function fallbackCopyText(text) {
  // Fallback for older browsers
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    showCopySuccess();
  } catch (err) {
    console.error('Fallback copy failed:', err);
    alert(t('errorCopyUrl') || 'Không thể copy. Vui lòng copy thủ công.');
  }
  
  document.body.removeChild(textarea);
}

function showCopySuccess() {
  const copyBtn = document.getElementById('copy-url-btn');
  const urlDisplay = document.getElementById('session-url-display');
  
  if (copyBtn) {
    copyBtn.classList.add('copied');
    copyBtn.textContent = '✓';
    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyBtn.textContent = '📋';
    }, 2000);
  }
  
  // Show temporary success message
  if (urlDisplay) {
    const originalText = urlDisplay.textContent;
    urlDisplay.textContent = state.uiLang === 'vi' ? '✓ Đã copy!' : '✓ Copied!';
    urlDisplay.style.color = 'var(--green)';
    setTimeout(() => {
      urlDisplay.textContent = originalText;
      urlDisplay.style.color = 'var(--text2)';
    }, 2000);
  }
}

function goBack() {
  // Stop mic nếu đang bật
  if (state.isMicOn) {
    stopMic();
  }
  
  // Stop TTS
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  
  // Clear all timers
  if (state.silenceTimer) {
    clearTimeout(state.silenceTimer);
    state.silenceTimer = null;
  }
  if (state.firebaseUpdateTimer) {
    clearTimeout(state.firebaseUpdateTimer);
    state.firebaseUpdateTimer = null;
  }
  
  // Cleanup Firebase listeners properly
  if (state.sessionRef) {
    if (state.viewerCountListener) {
      state.sessionRef.child('viewerCount').off('value', state.viewerCountListener);
      state.viewerCountListener = null;
    }
    state.sessionRef.off();
    state.sessionRef.remove().catch(e => console.warn('Firebase cleanup error:', e));
    state.sessionRef = null;
  }
  
  // Reset state
  state.isPresenting = false;
  state.isTranslating = false;
  state.translationLog = [];
  state.viewerCount = 0;
  state.maxViewerCount = 0;
  state.sessionStartTime = null;
  state.sessionEndTime = null;
  
  showPage('setup-page');
}

function initFirebaseForSpeaker() {
  if (!state.firebaseConfig || !state.firebaseConfig.apiKey) {
    console.warn('Firebase config not found');
    return;
  }
  
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(state.firebaseConfig);
    }
    state.db = firebase.database();
    state.sessionRef = state.db.ref('sessions/' + state.sessionId);
    
    state.sessionRef.set({
      speakerName: state.speakerName,
      avatarSrc: state.avatarSrc || state.avatarDataUrl || null,
      sourceLang: state.sourceLang,
      targetLang: state.targetLang,
      status: 'waiting',
      viewerCount: 0,
      translations: null,
      interim: '',
      updatedAt: Date.now(),
    }).catch(e => {
      console.error('Firebase set error:', e);
    });
    
    // Cleanup previous listener if exists
    if (state.viewerCountListener) {
      state.sessionRef.child('viewerCount').off('value', state.viewerCountListener);
    }
    
    // Theo dõi số người xem
    state.viewerCountListener = snap => {
      const count = snap.val() || 0;
      state.viewerCount = count;
      updateViewerDisplay(count);
    };
    state.sessionRef.child('viewerCount').on('value', state.viewerCountListener);
    
    // Xóa session khi đóng trang
    const cleanup = () => {
      if (state.sessionRef) {
        if (state.viewerCountListener) {
          state.sessionRef.child('viewerCount').off('value', state.viewerCountListener);
          state.viewerCountListener = null;
        }
        state.sessionRef.off();
        state.sessionRef.remove().catch(e => console.warn('Firebase cleanup error:', e));
        state.sessionRef = null;
      }
    };
    
    // Remove old listener before adding new one
    window.removeEventListener('beforeunload', window.speakerCleanup);
    window.addEventListener('beforeunload', cleanup);
    
    // Store cleanup for manual use
    window.speakerCleanup = cleanup;
  } catch (e) {
    console.error('Firebase init error:', e);
  }
}


// =========================================================
// START PRESENTATION
// =========================================================
function startPresentation() {
  state.isPresenting = true;
  state.translationLog = [];
  state.isTranslating = false;
  state.sessionStartTime = Date.now();
  state.maxViewerCount = state.viewerCount;

  // Update Firebase
  if (state.sessionRef) {
    try {
      state.sessionRef.update({ status: 'presenting', translations: null, interim: '' });
    } catch (e) {
      console.warn('Firebase update error:', e);
    }
  }

  // Build present page
  const avatarSrc = state.avatarSrc || state.avatarDataUrl;
  const presentAvatar = document.getElementById('present-avatar');
  const presentName = document.getElementById('present-name');
  const presentSrcLang = document.getElementById('present-src-lang');
  const presentTgtLang = document.getElementById('present-tgt-lang');
  const footerSession = document.getElementById('footer-session');
  const translationScroll = document.getElementById('translation-scroll');
  const interimDisplay = document.getElementById('interim-display');
  const statusChip = document.getElementById('status-chip');
  
  if (presentAvatar) renderAvatar(presentAvatar, avatarSrc);
  if (presentName) presentName.textContent = state.speakerName;

  const srcShort = state.sourceLang.split('-')[0].toUpperCase();
  const tgtShort = state.targetLang.toUpperCase();
  if (presentSrcLang) presentSrcLang.textContent = srcShort;
  if (presentTgtLang) presentTgtLang.textContent = tgtShort;
  if (footerSession) footerSession.textContent = 'SESSION: ' + state.sessionId;
  
  updateViewerDisplay(state.viewerCount);

  // Xóa nội dung trình chiếu cũ
  if (translationScroll) translationScroll.innerHTML = '';
  if (interimDisplay) interimDisplay.innerHTML = '<em class="text-muted">' + t('recognizingText') + '</em>';
  if (statusChip) {
    statusChip.className = 'status-chip idle';
    statusChip.textContent = t('waiting');
  }

  showPage('present-page');
  const presentPage = document.getElementById('present-page');
  if (presentPage) presentPage.style.display = 'flex';
  
  // Update UI language
  updateUILanguage();

  // Try fullscreen
  const el = document.getElementById('present-page');
  if (el) {
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => { });
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  }
}

function stopPresentation() {
  state.isPresenting = false;
  state.sessionEndTime = Date.now();
  
  // Stop mic và cleanup
  stopMic();
  
  // Stop TTS
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  
  // Update Firebase
  if (state.sessionRef) {
    try {
      state.sessionRef.update({ status: 'ended' });
    } catch (e) {
      console.warn('Firebase update error:', e);
    }
  }
  
  // Exit fullscreen
  if (document.exitFullscreen) {
    document.exitFullscreen().catch(() => { });
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
  
  // Hiển thị màn hình thống kê cho diễn giả
  showSpeakerStats();
}

// Khởi động Web Speech API trước để trình duyệt thiết lập kết nối với server nhận diện,
// tránh độ trễ cold-start khi diễn giả bấm bắt đầu thu âm lần đầu trong session.
function warmUpSpeechAPI() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;
  try {
    const warmup = new SpeechRecognition();
    warmup.lang = state.sourceLang || 'vi-VN';
    warmup.interimResults = false;
    warmup.continuous = false;
    warmup.maxAlternatives = 1;
    warmup.onresult = () => { warmup.stop(); };
    warmup.onerror = () => { warmup.stop(); };
    warmup.onend = () => { };
    warmup.start();
    // Tắt sau 800ms — đủ để thiết lập kết nối mà không ảnh hưởng UX
    setTimeout(() => {
      try { warmup.stop(); } catch (e) { }
    }, 800);
  } catch (e) { }
}

// =========================================================
// SPEECH RECOGNITION
// =========================================================
function toggleMic() {
  if (state.isMicOn) {
    stopMic();
  } else {
    startMic();
  }
}

function startMic() {
  // Dọn dẹp đối tượng SpeechRecognition cũ trước khi tạo mới để tránh memory leak và giữ sạch event listeners
  if (state.recognition) {
    try {
      state.recognition.onstart = null;
      state.recognition.onresult = null;
      state.recognition.onerror = null;
      state.recognition.onend = null;
      state.recognition.stop();
    } catch (e) {
      console.warn('Cleanup recognition error:', e);
    }
    state.recognition = null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Trình duyệt không hỗ trợ Web Speech API. Vui lòng dùng Chrome hoặc Edge.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = state.sourceLang;
  recognition.interimResults = true;
  recognition.continuous = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    state.isTranslating = false;
  };

  recognition.onresult = (event) => {
    if (state.isTranslating) return;

    let interim = '';
    let finalText = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalText += transcript + ' '; // Thêm khoảng trắng để tránh dính chữ
      } else {
        interim += transcript;
      }
    }

    if (interim) {
      const interimDisplay = document.getElementById('interim-display');
      if (interimDisplay) {
        interimDisplay.textContent = interim;
      }
      
      // Debounce Firebase updates to reduce network calls
      if (state.sessionRef) {
        if (state.firebaseUpdateTimer) {
          clearTimeout(state.firebaseUpdateTimer);
        }
        state.firebaseUpdateTimer = setTimeout(() => {
          if (state.sessionRef) {
            state.sessionRef.update({ interim }).catch(e => {
              console.warn('Firebase interim update error:', e);
            });
          }
        }, 200); // Update Firebase max once per 200ms
      }

      // Tự động dịch sau khoảng lặng ngừng nói - Clear timer cũ trước
      if (state.silenceTimer) {
        clearTimeout(state.silenceTimer);
      }
      state.silenceTimer = setTimeout(() => {
        if (state.isMicOn && !state.isTranslating && interim.trim()) {
          triggerAutoTranslation(interim);
        }
      }, 1500);
    }

    if (finalText.trim()) {
      if (state.silenceTimer) {
        clearTimeout(state.silenceTimer);
        state.silenceTimer = null;
      }
      if (state.firebaseUpdateTimer) {
        clearTimeout(state.firebaseUpdateTimer);
        state.firebaseUpdateTimer = null;
      }
      triggerAutoTranslation(finalText);
    }
  };

  recognition.onerror = (e) => {
    console.warn('Speech error:', e.error);
    if (e.error === 'not-allowed') {
      alert('Microphone bị từ chối. Vui lòng cho phép quyền mic trong trình duyệt.');
      stopMic();
    }
    // Không tự động tắt mic nếu gặp lỗi mạng (network) hoặc không nhận diện được giọng nói (no-speech)
    // Sự kiện onend sẽ tự động khởi động lại
  };

  recognition.onend = () => {
    // Nếu đang dịch/TTS, không restart ngay — speakTranslation.onend sẽ tự gọi startMic()
    if (state.isTranslating) return;
    // Tự động khởi động lại (Continuous listen)
    if (state.isMicOn) {
      setTimeout(() => {
        if (state.isMicOn && !state.isTranslating) {
          try {
            startMic();
          } catch (err) {
            console.warn('Auto-restart error:', err);
          }
        }
      }, 200);
    }
  };

  try {
    recognition.start();
    state.recognition = recognition;
    state.isMicOn = true;

    const micBtn = document.getElementById('mic-btn');
    const micLabel = document.getElementById('mic-label');
    
    if (micBtn) {
      micBtn.classList.add('active');
      micBtn.textContent = '🔴';
      micBtn.setAttribute('aria-pressed', 'true');
      micBtn.setAttribute('aria-label', t('turnOffMic'));
    }
    
    if (micLabel) {
      micLabel.textContent = t('listening');
    }
    
    setStatus('listening', t('listeningStatus'));
  } catch (err) {
    console.error('Lỗi khi khởi động mic:', err);
    alert('Có lỗi khi khởi động microphone. Vui lòng tải lại trang.');
  }
}

function stopMic() {
  if (state.silenceTimer) {
    clearTimeout(state.silenceTimer);
    state.silenceTimer = null;
  }
  if (state.firebaseUpdateTimer) {
    clearTimeout(state.firebaseUpdateTimer);
    state.firebaseUpdateTimer = null;
  }
  state.isTranslating = false;
  
  if (state.recognition) {
    try {
      state.recognition.onstart = null;
      state.recognition.onresult = null;
      state.recognition.onerror = null;
      state.recognition.onend = null;
      state.recognition.stop();
    } catch (e) {
      console.warn('Error stopping recognition:', e);
    }
    state.recognition = null;
  }
  
  state.isMicOn = false;
  
  const micBtn = document.getElementById('mic-btn');
  const micLabel = document.getElementById('mic-label');
  const interimDisplay = document.getElementById('interim-display');
  
  if (micBtn) {
    micBtn.classList.remove('active');
    micBtn.textContent = '🎙️';
    micBtn.setAttribute('aria-pressed', 'false');
    micBtn.setAttribute('aria-label', t('turnOnMic'));
  }
  
  if (micLabel) {
    micLabel.textContent = t('clickToEnableMic');
  }
  
  setStatus('idle', t('waiting'));
  
  if (interimDisplay) {
    interimDisplay.innerHTML = '<em class="text-muted">' + t('recognizingText') + '</em>';
  }
  
  // Clear Firebase interim
  if (state.sessionRef) {
    try {
      state.sessionRef.update({ interim: '' }).catch(e => {
        console.warn('Firebase interim clear error:', e);
      });
    } catch (e) {
      console.warn('Firebase interim clear error:', e);
    }
  }
}

async function triggerAutoTranslation(text) {
  if (!text || !text.trim() || state.isTranslating) return;

  // Đánh dấu đang xử lý để chặn các lệnh dịch trùng lặp
  state.isTranslating = true;
  clearTimeout(state.silenceTimer);
  state.silenceTimer = null;

  // Dừng nhận diện để làm sạch buffer cho câu nói tiếp theo
  // onend sẽ không restart vì isTranslating = true
  if (state.isMicOn && state.recognition) {
    try {
      state.recognition.stop();
    } catch (err) {
      console.warn('Lỗi khi tạm dừng mic để restart:', err);
    }
  }

  // Cập nhật giao diện sang trạng thái đang dịch
  const interimDisplay = document.getElementById('interim-display');
  if (interimDisplay) {
    interimDisplay.innerHTML = '<em class="text-muted">' + t('translatingText') + '</em>';
  }
  
  setStatus('translating', t('translating'));
  
  if (state.sessionRef) {
    try {
      await state.sessionRef.update({ interim: '' });
    } catch (e) {
      console.warn('Firebase update error:', e);
    }
  }

  // Thực hiện dịch thuật; mic sẽ restart sau khi TTS đọc xong
  try {
    await translateText(text.trim());
  } catch (error) {
    console.error('Translation error:', error);
    // Reset state on error
    state.isTranslating = false;
    if (state.isMicOn) {
      startMic();
    }
  }
}

function setStatus(type, text) {
  const chip = document.getElementById('status-chip');
  if (chip) {
    chip.className = 'status-chip ' + type;
    chip.textContent = text;
  }
}

async function translateText(originalText) {
  try {
    const translatedText = await fallbackGoogleTranslate(originalText);
    
    const entry = {
      original: originalText,
      translated: translatedText,
      srcLang: state.sourceLang.split('-')[0].toUpperCase(),
      tgtLang: state.targetLang.toUpperCase(),
      timestamp: Date.now(),
    };

    state.translationLog.push(entry);
    appendTranslationEntry(entry);
    setStatus('listening', t('listeningStatus'));

    // Tự động đọc bản dịch
    speakTranslation(translatedText, state.targetLang);

    // Push to Firebase
    if (state.sessionRef) {
      try {
        await state.sessionRef.child('translations').push(entry);
      } catch (e) {
        console.warn('Firebase push error:', e);
      }
    }

    // Auto-scroll
    const scroll = document.getElementById('translation-scroll');
    if (scroll) {
      setTimeout(() => { scroll.scrollTop = scroll.scrollHeight; }, 100);
    }
  } catch (error) {
    console.error('Translation error:', error);
    // Reset state and restart mic on error
    state.isTranslating = false;
    if (state.isMicOn) {
      startMic();
    }
    throw error;
  }
}

// =========================================================
// TEXT-TO-SPEECH (TTS) — Đọc bản dịch tự động
// =========================================================
function toggleTTS() {
  state.isAutoTTS = !state.isAutoTTS;
  const btn = document.getElementById('tts-btn');
  if (state.isAutoTTS) {
    btn.classList.add('active');
    btn.textContent = '🔊';
    btn.setAttribute('aria-pressed', 'true');
    btn.setAttribute('aria-label', t('turnOffAutoRead'));
  } else {
    btn.classList.remove('active');
    btn.textContent = '🔇';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', t('turnOnAutoRead'));
    window.speechSynthesis.cancel();
  }
  updateTTSLabel();
}

// Tính delay restart mic dựa trên số ký tự text đã đọc
// Text ngắn cần ít thời gian chờ, text dài cần nhiều hơn để tránh mic thu âm TTS
function calcMicRestartDelay(charCount) {
  const MIN_DELAY = 50;   // ms — text rất ngắn (≤30 ký tự)
  const MAX_DELAY = 800;   // ms — text dài (≥200 ký tự)
  const MIN_CHARS = 10;
  const MAX_CHARS = 200;

  if (charCount <= MIN_CHARS) return MIN_DELAY;
  if (charCount >= MAX_CHARS) return MAX_DELAY;

  // Nội suy tuyến tính giữa MIN_DELAY và MAX_DELAY
  const ratio = (charCount - MIN_CHARS) / (MAX_CHARS - MIN_CHARS);
  return Math.round(MIN_DELAY + ratio * (MAX_DELAY - MIN_DELAY));
}

function speakTranslation(text, langCode) {
  if (!state.isAutoTTS || !text) {
    // Nếu TTS tắt, reset ngay để mic bắt đầu lại
    if (state.isMicOn) {
      state.isTranslating = false;
      startMic();
    }
    return;
  }
  if (text.startsWith('[')) {
    // Bỏ qua thông báo lỗi, reset mic ngay
    if (state.isMicOn) {
      state.isTranslating = false;
      startMic();
    }
    return;
  }

  const ttsLang = TTS_LANG_MAP[langCode] || TTS_LANG_MAP[langCode.split('-')[0]] || langCode;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = ttsLang;
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  // Tính delay restart mic dựa trên độ dài text:
  // Text ngắn (≤30 ký tự) → 200ms, text dài (≥200 ký tự) → 800ms
  const micRestartDelay = calcMicRestartDelay(text.length);

  // Thử chọn voice tốt nhất cho ngôn ngữ đích
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = ttsLang.split('-')[0].toLowerCase();
  const bestVoice = voices.find(v => v.lang === ttsLang)
    || voices.find(v => v.lang.toLowerCase().startsWith(langPrefix))
    || null;
  if (bestVoice) utterance.voice = bestVoice;

  // Sau khi TTS đọc xong, reset cờ và khởi động lại mic
  utterance.onend = () => {
    if (state.isMicOn) {
      state.isTranslating = false;
      // Delay động để buffer audio bị xóa, tránh mic thu lại âm thanh TTS vừa phát
      setTimeout(() => { if (state.isMicOn) startMic(); }, micRestartDelay);
    }
  };

  // Phòng trường hợp TTS bị lỗi hoặc bị huỷ
  utterance.onerror = () => {
    if (state.isMicOn) {
      state.isTranslating = false;
      setTimeout(() => { if (state.isMicOn) startMic(); }, micRestartDelay);
    }
  };

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

// Preload voices (một số trình duyệt cần sự kiện này)
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

// =========================================================
// TRANSLATION
// =========================================================
// Hàm dự phòng dùng Google Translate API miễn phí không cần proxy
async function fallbackGoogleTranslate(textToTranslate) {
  try {
    // Validate input
    if (!textToTranslate || !textToTranslate.trim()) {
      return '[Empty text]';
    }
    
    // Limit text length to prevent API abuse
    const maxLength = 5000;
    if (textToTranslate.length > maxLength) {
      textToTranslate = textToTranslate.substring(0, maxLength);
    }
    
    const sourceLang = state.sourceLang.split('-')[0];
    const targetLang = state.targetLang.split('-')[0];
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(textToTranslate)}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Translation API error:', response.status);
      return state.uiLang === 'vi' ? '[Lỗi kết nối dịch thuật]' : '[Translation connection error]';
    }

    const data = await response.json();
    let translatedText = "";
    if (data && data[0] && Array.isArray(data[0])) {
      data[0].forEach(part => {
        if (part && part[0]) translatedText += part[0];
      });
    }
    
    return translatedText.trim() || (state.uiLang === 'vi' ? '[Lỗi dịch]' : '[Translation error]');
  } catch (error) {
    console.error("Google Translate Fallback Error:", error);
    return state.uiLang === 'vi' ? '[Lỗi kết nối dịch thuật]' : '[Translation connection error]';
  }
}

function appendTranslationEntry(entry) {
  const scroll = document.getElementById('translation-scroll');
  if (!scroll) return;
  
  const div = document.createElement('div');
  div.className = 'translation-entry';
  div.innerHTML = `
    <div class="entry-original">
      <div class="lang-tag">${escapeHtml(entry.srcLang)} · ${t('original')}</div>
      ${escapeHtml(entry.original)}
    </div>
    <div class="entry-translated">
      <div class="lang-tag">${escapeHtml(entry.tgtLang)} · ${t('translation')}</div>
      ${escapeHtml(entry.translated)}
    </div>
  `;
  scroll.appendChild(div);
}

// =========================================================
// VIEWER MODE
// =========================================================
function startViewerMode(sessionId) {
  showPage('viewer-page');
  document.getElementById('viewer-speaker-name').textContent = 'Session: ' + sessionId;
  
  // Update UI language for viewer
  updateUILanguage();

  const tryFb = () => {
    if (typeof firebase === 'undefined') {
      // SDK chưa tải xong, thử lại sau
      setTimeout(tryFb, 300);
      return;
    }
    try {
      // Dùng firebaseConfig có sẵn trong script (không cần URL param)
      if (!firebase.apps.length) {
        firebase.initializeApp(state.firebaseConfig);
      }
      listenToSession(firebase.database(), sessionId);
    } catch (e) {
      console.error('Firebase viewer init error:', e);
      showViewerOfflineMessage();
    }
  };

  setTimeout(tryFb, 500);
}

function showViewerOfflineMessage() {
  const waiting = document.getElementById('viewer-waiting');
  waiting.innerHTML = `
    <div class="waiting-icon">📵</div>
    <div class="waiting-title">${t('cannotConnect')}</div>
    <div class="waiting-sub">${t('needFirebase')}</div>
  `;
}

function listenToSession(db, sessionId) {
  const sessionRef = db.ref('sessions/' + sessionId);

  // Register as viewer
  sessionRef.child('viewerCount').transaction(count => (count || 0) + 1).catch(e => {
    console.warn('Failed to register viewer:', e);
  });
  
  // Cleanup function
  const cleanup = () => {
    sessionRef.child('viewerCount').transaction(count => Math.max((count || 0) - 1, 0)).catch(e => {
      console.warn('Failed to unregister viewer:', e);
    });
    sessionRef.off(); // Unsubscribe all listeners
  };
  
  // Remove old listener before adding new one
  if (window.viewerCleanup) {
    window.removeEventListener('beforeunload', window.viewerCleanup);
  }
  
  // Register cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
  
  // Store cleanup function for manual cleanup if needed
  window.viewerCleanup = cleanup;

  // Listen to session data
  sessionRef.on('value', snap => {
    const data = snap.val();
    if (!data) {
      showViewerOfflineMessage();
      return;
    }

    // Update speaker info
    const speakerNameEl = document.getElementById('viewer-speaker-name');
    if (speakerNameEl) {
      speakerNameEl.textContent = data.speakerName || t('connecting');
    }
    
    if (data.avatarSrc) {
      const avatarEl = document.getElementById('viewer-avatar');
      if (avatarEl) {
        renderAvatar(avatarEl, data.avatarSrc);
      }
    }

    // Status
    const statusDot = document.getElementById('viewer-status-dot');
    const statusText = document.getElementById('viewer-status-text');
    const interimEl = document.getElementById('viewer-interim');
    
    if (!statusDot || !statusText || !interimEl) return;
    
    if (data.status === 'presenting') {
      statusDot.style.background = 'var(--green)';
      statusText.textContent = t('broadcasting');
      const waitingEl = document.getElementById('viewer-waiting');
      if (waitingEl) waitingEl.style.display = 'none';
      interimEl.style.display = 'block';
    } else if (data.status === 'ended') {
      statusDot.style.background = 'var(--red)';
      statusText.textContent = t('sessionEnded');
      interimEl.style.display = 'none';
      showViewerEndedMessage();
    } else {
      // waiting status
      interimEl.style.display = 'block';
    }

    // Interim
    if (data.interim && data.status === 'presenting') {
      interimEl.textContent = data.interim;
    } else if (data.status === 'presenting') {
      interimEl.innerHTML = '<em class="text-muted">' + t('listeningViewer') + '</em>';
    }
  });

  // Listen to translations
  let loadedKeys = new Set();
  
  // Load existing translations first
  sessionRef.child('translations').once('value', snap => {
    const data = snap.val();
    if (data) {
      Object.keys(data).forEach(key => {
        loadedKeys.add(key);
        appendViewerEntry(data[key]);
      });
    }
    
    // Then listen for new translations only
    sessionRef.child('translations').on('child_added', snap => {
      const key = snap.key;
      if (!loadedKeys.has(key)) {
        loadedKeys.add(key);
        const entry = snap.val();
        appendViewerEntry(entry);
      }
    });
  });
}

function appendViewerEntry(entry) {
  const waiting = document.getElementById('viewer-waiting');
  if (waiting) waiting.style.display = 'none';

  const scroll = document.getElementById('viewer-scroll');
  if (!scroll) return;
  
  const div = document.createElement('div');
  div.className = 'viewer-entry';
  div.innerHTML = `
    <div class="viewer-original">${escapeHtml(entry.original)}</div>
    <div class="viewer-translated">${escapeHtml(entry.translated)}</div>
  `;
  scroll.appendChild(div);
  setTimeout(() => { 
    if (scroll) scroll.scrollTop = scroll.scrollHeight; 
  }, 100);
}

function showViewerEndedMessage() {
  const popup = document.getElementById('viewer-ended-popup');
  if (popup) {
    popup.style.display = 'flex';
  }
}

function closeViewerEndedPopup() {
  const popup = document.getElementById('viewer-ended-popup');
  if (popup) {
    popup.style.display = 'none';
  }
}

// =========================================================
// UTILS
// =========================================================
function showPage(id) {
  ['setup-page', 'lobby-page', 'present-page', 'viewer-page', 'stats-page'].forEach(p => {
    const el = document.getElementById(p);
    if (el) el.style.display = 'none';
  });
  const target = document.getElementById(id);
  if (target) {
    target.style.display = 'flex';
  }
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.add('show'); }
}

function hideError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}

function escapeHtml(text) {
  return (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// =========================================================
// SPEAKER STATISTICS PAGE
// =========================================================
function showSpeakerStats() {
  showPage('stats-page');
  
  // Tính toán thống kê
  const duration = state.sessionEndTime - state.sessionStartTime;
  const hours = Math.floor(duration / 3600000);
  const minutes = Math.floor((duration % 3600000) / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  
  let durationText = '';
  if (state.uiLang === 'vi') {
    if (hours > 0) durationText += hours + ' giờ ';
    if (minutes > 0) durationText += minutes + ' phút ';
    durationText += seconds + ' giây';
  } else {
    if (hours > 0) durationText += hours + ' hour' + (hours > 1 ? 's' : '') + ' ';
    if (minutes > 0) durationText += minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ';
    durationText += seconds + ' second' + (seconds !== 1 ? 's' : '');
  }
  
  const translationCount = state.translationLog.length;
  const maxViewers = state.maxViewerCount;
  
  // Cập nhật nội dung
  document.getElementById('stats-speaker-name').textContent = state.speakerName;
  document.getElementById('stats-session-id').textContent = state.sessionId;
  document.getElementById('stats-duration').textContent = durationText;
  document.getElementById('stats-translations').textContent = translationCount;
  document.getElementById('stats-max-viewers').textContent = maxViewers;
  
  const avatarSrc = state.avatarSrc || state.avatarDataUrl;
  renderAvatar(document.getElementById('stats-avatar'), avatarSrc);
  
  // Update language toggle
  updateUILanguage();
  
  // Warm-up lại để session tiếp theo không bị delay
  warmUpSpeechAPI();
}

function backToLobby() {
  // Stop mic nếu đang bật
  if (state.isMicOn) {
    stopMic();
  }
  
  // Stop TTS nếu đang chạy
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  
  // Xóa session cũ trên Firebase với proper cleanup
  if (state.sessionRef) {
    if (state.viewerCountListener) {
      state.sessionRef.child('viewerCount').off('value', state.viewerCountListener);
      state.viewerCountListener = null;
    }
    state.sessionRef.off(); // Unsubscribe all listeners
    state.sessionRef.remove().catch(e => console.warn('Firebase cleanup error:', e));
    state.sessionRef = null;
  }
  
  // Reset state
  state.translationLog = [];
  state.maxViewerCount = 0;
  state.viewerCount = 0;
  state.sessionStartTime = null;
  state.sessionEndTime = null;
  state.isPresenting = false;
  state.isTranslating = false;
  
  // Clear timers
  if (state.silenceTimer) {
    clearTimeout(state.silenceTimer);
    state.silenceTimer = null;
  }
  
  // Tạo session ID mới
  state.sessionId = generateSessionId();
  
  // Rebuild lobby với session mới
  buildLobby();
  showPage('lobby-page');
  
  // Update UI language
  updateUILanguage();
  
  // Khởi tạo Firebase với session mới
  initFirebaseForSpeaker();
  
  // Warm-up lại để session tiếp theo không bị delay
  warmUpSpeechAPI();
}



// =========================================================
// BOOT
// =========================================================
window.addEventListener('DOMContentLoaded', init);
