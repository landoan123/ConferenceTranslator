// =========================================================
// STATE
// =========================================================
const state = {
  speakerName: '',
  avatarSrc: null,
  avatarDataUrl: null,
  sourceLang: 'vi-VN',
  targetLang: 'en',
  translateApiKey: '67f3eb20-d04b-4021-8cb9-355538ad67a9:fx',
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
  
  // Update language toggle button
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.textContent = state.uiLang === 'vi' ? '🇬🇧 EN' : '🇻🇳 VI';
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
  document.getElementById('lobby-name').textContent = state.speakerName;

  const srcName = LANG_NAMES[state.sourceLang] || state.sourceLang;
  const tgtName = LANG_NAMES[state.targetLang] || state.targetLang;
  document.getElementById('lobby-langs').textContent = `${srcName} → ${tgtName}`;

  const avatarSrc = state.avatarSrc || state.avatarDataUrl;
  renderAvatar(document.getElementById('lobby-avatar'), avatarSrc);

  const sessionId = state.sessionId;
  document.getElementById('session-id-display').textContent = sessionId;

  // URL ngắn gọn - Firebase config đã được hardcode trong script.js, không cần nhúng vào URL
  const viewerUrl = window.location.origin + window.location.pathname
    + '?session=' + sessionId;
  document.getElementById('session-url-display').textContent = viewerUrl;

  // Generate QR
  const qrContainer = document.getElementById('qr-container');
  qrContainer.innerHTML = '';
  new QRCode(qrContainer, {
    text: viewerUrl,
    width: 200,
    height: 200,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.L,
  });
}

function goBack() {
  if (state.sessionRef) {
    state.sessionRef.remove();
    state.sessionRef = null;
  }
  showPage('setup-page');
}

// Khởi tạo Firebase và tạo session cho diễn giả
function initFirebaseForSpeaker() {
  if (!state.firebaseConfig || !state.firebaseConfig.apiKey) return;
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
    });
    // Theo dõi số người xem
    state.sessionRef.child('viewerCount').on('value', snap => {
      const count = snap.val() || 0;
      state.viewerCount = count;
      updateViewerDisplay(count);
    });
    // Xóa session khi đóng trang
    window.addEventListener('beforeunload', () => {
      if (state.sessionRef) state.sessionRef.remove();
    });
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
    state.sessionRef.update({ status: 'presenting', translations: null, interim: '' });
  }

  // Build present page
  const avatarSrc = state.avatarSrc || state.avatarDataUrl;
  renderAvatar(document.getElementById('present-avatar'), avatarSrc);
  document.getElementById('present-name').textContent = state.speakerName;

  const srcShort = state.sourceLang.split('-')[0].toUpperCase();
  const tgtShort = state.targetLang.toUpperCase();
  document.getElementById('present-src-lang').textContent = srcShort;
  document.getElementById('present-tgt-lang').textContent = tgtShort;
  document.getElementById('footer-session').textContent = 'SESSION: ' + state.sessionId;
  updateViewerDisplay(state.viewerCount);

  // Xóa nội dung trình chiếu cũ
  document.getElementById('translation-scroll').innerHTML = '';
  document.getElementById('interim-display').innerHTML = '<em class="text-muted">Văn bản đang nhận diện sẽ hiển thị tại đây...</em>';
  const chip = document.getElementById('status-chip');
  chip.className = 'status-chip idle';
  chip.textContent = '⏸ Đang chờ';

  showPage('present-page');
  document.getElementById('present-page').style.display = 'flex';

  // Try fullscreen
  const el = document.getElementById('present-page');
  if (el.requestFullscreen) el.requestFullscreen().catch(() => { });
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
}

function stopPresentation() {
  state.isPresenting = false;
  state.sessionEndTime = Date.now();
  stopMic();
  if (state.sessionRef) state.sessionRef.update({ status: 'ended' });
  if (document.exitFullscreen) document.exitFullscreen().catch(() => { });
  
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
    } catch (e) { }
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
      document.getElementById('interim-display').textContent = interim;
      if (state.sessionRef) state.sessionRef.update({ interim });
      // Viewer interim
      const vInterim = document.getElementById('viewer-interim');
      if (vInterim) vInterim.textContent = interim;

      // Tự động dịch sau khoảng lặng ngừng nói
      clearTimeout(state.silenceTimer);
      state.silenceTimer = setTimeout(() => {
        if (state.isMicOn && interim.trim()) {
          triggerAutoTranslation(interim);
        }
      }, 1500);
    }

    if (finalText.trim()) {
      clearTimeout(state.silenceTimer);
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
    micBtn.classList.add('active');
    micBtn.textContent = '🔴';
    micBtn.setAttribute('aria-pressed', 'true');
    micBtn.setAttribute('aria-label', 'Tắt mic');
    document.getElementById('mic-label').textContent = 'Đang nghe... (nhấn để tắt)';
    setStatus('listening', '● Đang nghe');
  } catch (err) {
    console.error('Lỗi khi khởi động mic:', err);
    alert('Có lỗi khi khởi động microphone. Vui lòng tải lại trang.');
  }
}

function stopMic() {
  clearTimeout(state.silenceTimer);
  state.isTranslating = false;
  if (state.recognition) {
    state.recognition.onend = null;
    state.recognition.stop();
    state.recognition = null;
  }
  state.isMicOn = false;
  const micBtn = document.getElementById('mic-btn');
  micBtn.classList.remove('active');
  micBtn.textContent = '🎙️';
  micBtn.setAttribute('aria-pressed', 'false');
  micBtn.setAttribute('aria-label', 'Bật mic');
  document.getElementById('mic-label').textContent = 'Nhấn để bật mic';
  setStatus('idle', '⏸ Đang chờ');
  document.getElementById('interim-display').innerHTML = '<em class="text-muted">Văn bản đang nhận diện sẽ hiển thị tại đây...</em>';
}

async function triggerAutoTranslation(text) {
  if (!text || !text.trim() || state.isTranslating) return;

  // Đánh dấu đang xử lý để chặn các lệnh dịch trùng lặp
  state.isTranslating = true;
  clearTimeout(state.silenceTimer);

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
  document.getElementById('interim-display').innerHTML = '<em class="text-muted">Đang dịch...</em>';
  setStatus('translating', '⟳ Đang dịch...');
  if (state.sessionRef) state.sessionRef.update({ interim: '' });

  // Thực hiện dịch thuật; mic sẽ restart sau khi TTS đọc xong
  await translateText(text.trim());
}

function setStatus(type, text) {
  const chip = document.getElementById('status-chip');
  chip.className = 'status-chip ' + type;
  chip.textContent = text;
}

// =========================================================
// TEXT-TO-SPEECH (TTS) — Đọc bản dịch tự động
// =========================================================
function toggleTTS() {
  state.isAutoTTS = !state.isAutoTTS;
  const btn = document.getElementById('tts-btn');
  const label = document.getElementById('tts-label');
  if (state.isAutoTTS) {
    btn.classList.add('active');
    btn.textContent = '🔊';
    btn.setAttribute('aria-pressed', 'true');
    btn.setAttribute('aria-label', 'Tắt tự động đọc');
    label.textContent = 'Tự động đọc: BẬT';
  } else {
    btn.classList.remove('active');
    btn.textContent = '🔇';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'Bật tự động đọc');
    label.textContent = 'Tự động đọc: TẮT';
    window.speechSynthesis.cancel();
  }
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
      // Delay 600ms để buffer audio bị xóa, tránh mic thu lại âm thanh TTS vừa phát
      setTimeout(() => { if (state.isMicOn) startMic(); }, 600);
    }
  };

  // Phòng trường hợp TTS bị lỗi hoặc bị huỷ
  utterance.onerror = () => {
    if (state.isMicOn) {
      state.isTranslating = false;
      setTimeout(() => { if (state.isMicOn) startMic(); }, 600);
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
async function translateText(originalText) {
  // Ưu tiên Google Translate trực tiếp (không cần proxy, nhanh hơn)
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
  setStatus('listening', '● Đang nghe');

  // Tự động đọc bản dịch
  speakTranslation(translatedText, state.targetLang);

  // Push to Firebase
  if (state.sessionRef) {
    state.sessionRef.child('translations').push(entry);
  }

  // Auto-scroll
  const scroll = document.getElementById('translation-scroll');
  setTimeout(() => { scroll.scrollTop = scroll.scrollHeight; }, 100);
}

// Hàm dự phòng dùng Google Translate API miễn phí không cần proxy
async function fallbackGoogleTranslate(textToTranslate) {
  try {
    const sourceLang = state.sourceLang.split('-')[0];
    const targetLang = state.targetLang.split('-')[0];
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(textToTranslate)}`;

    const response = await fetch(apiUrl);
    if (!response.ok) return '[Lỗi kết nối dịch thuật]';

    const data = await response.json();
    let translatedText = "";
    if (data && data[0]) {
      data[0].forEach(part => {
        if (part[0]) translatedText += part[0];
      });
    }
    return translatedText || '[Lỗi dịch]';
  } catch (error) {
    console.error("Google Translate Fallback Error:", error);
    return '[Lỗi kết nối dịch thuật]';
  }
}

function appendTranslationEntry(entry) {
  const scroll = document.getElementById('translation-scroll');
  const div = document.createElement('div');
  div.className = 'translation-entry';
  div.innerHTML = `
    <div class="entry-original">
      <div class="lang-tag">${entry.srcLang} · Nguyên bản</div>
      ${escapeHtml(entry.original)}
    </div>
    <div class="entry-translated">
      <div class="lang-tag">${entry.tgtLang} · Bản dịch</div>
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
  sessionRef.child('viewerCount').transaction(count => (count || 0) + 1);
  window.addEventListener('beforeunload', () => {
    sessionRef.child('viewerCount').transaction(count => Math.max((count || 0) - 1, 0));
  });

  // Listen to session data
  sessionRef.on('value', snap => {
    const data = snap.val();
    if (!data) {
      showViewerOfflineMessage();
      return;
    }

    // Update speaker info
    document.getElementById('viewer-speaker-name').textContent = data.speakerName || 'Diễn Giả';
    if (data.avatarSrc) {
      renderAvatar(document.getElementById('viewer-avatar'), data.avatarSrc);
    }

    // Status
    const statusDot = document.getElementById('viewer-status-dot');
    const statusText = document.getElementById('viewer-status-text');
    const interimEl = document.getElementById('viewer-interim');
    
    if (data.status === 'presenting') {
      statusDot.style.background = 'var(--green)';
      statusText.textContent = 'Đang phát sóng';
      document.getElementById('viewer-waiting').style.display = 'none';
      interimEl.style.display = 'block';
    } else if (data.status === 'ended') {
      statusDot.style.background = 'var(--red)';
      statusText.textContent = 'Phiên đã kết thúc';
      interimEl.style.display = 'none'; // Ẩn dòng "Đang lắng nghe" khi kết thúc
      showViewerEndedMessage();
    } else {
      // waiting status
      interimEl.style.display = 'block';
    }

    // Interim
    if (data.interim && data.status === 'presenting') {
      interimEl.textContent = data.interim;
    } else if (data.status === 'presenting') {
      interimEl.innerHTML = '<em class="text-muted">Đang lắng nghe...</em>';
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
  const div = document.createElement('div');
  div.className = 'viewer-entry';
  div.innerHTML = `
    <div class="viewer-original">${escapeHtml(entry.original)}</div>
    <div class="viewer-translated">${escapeHtml(entry.translated)}</div>
  `;
  scroll.appendChild(div);
  setTimeout(() => { scroll.scrollTop = scroll.scrollHeight; }, 100);
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
    target.style.display = id === 'present-page' ? 'flex' : 'flex';
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
  // Xóa session cũ trên Firebase
  if (state.sessionRef) {
    state.sessionRef.remove();
    state.sessionRef = null;
  }
  
  // Reset state
  state.translationLog = [];
  state.maxViewerCount = 0;
  state.viewerCount = 0;
  state.sessionStartTime = null;
  state.sessionEndTime = null;
  
  // Tạo session ID mới
  state.sessionId = generateSessionId();
  
  // Rebuild lobby với session mới
  buildLobby();
  showPage('lobby-page');
  
  // Khởi tạo Firebase với session mới
  initFirebaseForSpeaker();
  
  // Warm-up lại để session tiếp theo không bị delay
  warmUpSpeechAPI();
}



// =========================================================
// BOOT
// =========================================================
window.addEventListener('DOMContentLoaded', init);