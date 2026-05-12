class BookOfAnswers {
  constructor() {
    this.elements = {
      book3d: document.getElementById('book-3d'),
      bookLeft: document.querySelector('.book-left'),
      bookRight: document.querySelector('.book-right'),
      coverSymbol: document.getElementById('cover-symbol'),
      actions: document.getElementById('actions'),
      btnRefresh: document.getElementById('btn-refresh'),
      btnShare: document.getElementById('btn-share'),
      btnHistory: document.getElementById('btn-history'),
      historyModal: document.getElementById('history-modal'),
      modalClose: document.getElementById('modal-close'),
      historyList: document.getElementById('history-list'),
      shareModal: document.getElementById('share-modal'),
      shareClose: document.getElementById('share-close'),
      shareCanvas: document.getElementById('share-canvas'),
      btnSaveImage: document.getElementById('btn-save-image'),
      btnCopyLink: document.getElementById('btn-copy-link'),
      questionInput: document.getElementById('question-input'),
      answerInitial: document.getElementById('answer-initial'),
      answerText: document.getElementById('answer-text'),
      answerExplanation: document.getElementById('answer-explanation'),
      answerSection: document.getElementById('answer-section'),
      progressBar: document.querySelector('.progress-bar'),
      progressRing: document.getElementById('hold-progress-ring')
    };

    this.isOpen = false;
    this.isHolding = false;
    this.holdTimer = null;
    this.holdProgress = 0;
    this.history = this.loadHistory();
    this.currentAnswer = null;
    this.isAwake = false;
    this.isOpening = false;
    this.openingRedIntensity = 0;
    this.revealProgress = 0;
    this.time = 0;
    this.inputValue = '';

    this.bgCanvas = document.getElementById('bg-canvas');
    this.bgCtx = this.bgCanvas.getContext('2d');
    this.lightBeamCanvas = document.getElementById('light-beam-canvas');
    this.lightBeamCtx = this.lightBeamCanvas.getContext('2d');
    this.starDustCanvas = document.getElementById('star-dust-canvas');
    this.starDustCtx = this.starDustCanvas.getContext('2d');
    this.coverCanvas = document.getElementById('cover-canvas');
    this.coverCtx = this.coverCanvas.getContext('2d');
    this.pageCanvas = document.getElementById('page-canvas');
    this.pageCtx = this.pageCanvas.getContext('2d');
    this.headerCanvas = document.getElementById('header-canvas');
    this.headerCtx = this.headerCanvas.getContext('2d');
    this.inputCanvas = document.getElementById('input-canvas');
    this.inputCtx = this.inputCanvas.getContext('2d');

    this.starDustParticles = [];
    this.goldLeafParticles = [];
    this.lightBeamRays = [];
    this.redGlowBlobs = [];

    this.init();
  }

  init() {
    this.setupCanvases();
    this.initParticles();
    this.initLightBeams();
    this.initRedGlowBlobs();
    this.bindEvents();
    this.animate();
    window.addEventListener('resize', () => this.resizeCanvases());
  }

  setupCanvases() {
    const canvases = [this.bgCanvas, this.lightBeamCanvas, this.starDustCanvas, this.coverCanvas, this.pageCanvas, this.headerCanvas, this.inputCanvas];
    canvases.forEach(canvas => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    });

    const dpr = window.devicePixelRatio || 1;
    [this.bgCtx, this.lightBeamCtx, this.starDustCtx, this.coverCtx, this.pageCtx, this.headerCtx, this.inputCtx].forEach(ctx => {
      ctx.scale(dpr, dpr);
    });
  }

  resizeCanvases() {
    this.setupCanvases();
    this.initParticles();
  }

  initParticles() {
    this.starDustParticles = [];
    this.goldLeafParticles = [];
    
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < 100; i++) {
      this.starDustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.8 + Math.random() * 2,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -0.1 - Math.random() * 0.3,
        opacity: 0.4 + Math.random() * 0.5,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.015 + Math.random() * 0.03,
        color: Math.random() > 0.5 ? '#FFE696' : '#FFD36B'
      });
    }

    for (let i = 0; i < 60; i++) {
      this.goldLeafParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1.5 + Math.random() * 3,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: -0.05 - Math.random() * 0.15,
        opacity: 0.5 + Math.random() * 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.01 + Math.random() * 0.02
      });
    }
  }

  initLightBeams() {
    this.lightBeamRays = [];
    for (let i = 0; i < 15; i++) {
      this.lightBeamRays.push({
        angle: (i / 15) * Math.PI * 2,
        intensity: 0.15 + Math.random() * 0.25,
        length: 80 + Math.random() * 180,
        width: 6 + Math.random() * 12,
        speed: 0.003 + Math.random() * 0.008,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  initRedGlowBlobs() {
    this.redGlowBlobs = [];
    const width = window.innerWidth;
    const height = window.innerHeight;
    for (let i = 0; i < 3; i++) {
      this.redGlowBlobs.push({
        x: width * (0.2 + Math.random() * 0.6),
        y: height * (0.2 + Math.random() * 0.6),
        sizeX: width * (0.6 + Math.random() * 0.3),
        sizeY: height * (0.5 + Math.random() * 0.25),
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.001 + Math.random() * 0.0015,
        driftSpeed: 0.00005 + Math.random() * 0.00008,
        baseIntensity: 0.15 + Math.random() * 0.1
      });
    }
  }

  bindEvents() {
    this.elements.questionInput.addEventListener('input', () => {
      this.isAwake = this.elements.questionInput.value.trim().length > 0;
      this.inputValue = this.elements.questionInput.value;
    });

    this.elements.coverSymbol.addEventListener('mousedown', () => this.startHold());
    this.elements.coverSymbol.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.startHold();
    });

    document.addEventListener('mouseup', () => this.stopHold());
    document.addEventListener('touchend', () => this.stopHold());

    this.elements.btnRefresh.addEventListener('click', () => this.resetBook());
    this.elements.btnShare.addEventListener('click', () => this.openShareModal());
    this.elements.btnHistory.addEventListener('click', () => this.openHistoryModal());
    this.elements.modalClose.addEventListener('click', () => this.closeHistoryModal());
    this.elements.shareClose.addEventListener('click', () => this.closeShareModal());
    this.elements.btnSaveImage.addEventListener('click', () => this.saveShareImage());
    this.elements.btnCopyLink.addEventListener('click', () => this.copyShareLink());
  }

  startHold() {
    if (this.isOpen) return;
    if (!this.elements.questionInput.value.trim()) {
      this.shakeInput();
      return;
    }

    this.isOpening = true;
    this.openingRedIntensity = 0.2;
    this.elements.coverSymbol.classList.add('holding');
    this.elements.progressRing.classList.add('active');

    this.holdTimer = setInterval(() => {
      this.holdProgress += 0.016;
      this.openingRedIntensity = 0.2 + this.holdProgress * 0.3;

      const scale = 1.08 + Math.sin(this.holdProgress * 28) * 0.08;
      gsap.to('.symbol-icon', {
        scale: scale,
        duration: 0.05
      });

      const glowScale = 1 + this.holdProgress * 0.6;
      const glowOpacity = 0.6 + this.holdProgress * 0.4;
      gsap.to('.symbol-glow', {
        scale: glowScale,
        opacity: glowOpacity,
        duration: 0.05
      });

      if (this.elements.progressBar) {
        const offset = 352 - (352 * this.holdProgress);
        this.elements.progressBar.style.strokeDashoffset = Math.max(0, offset);
      }

      if (this.holdProgress >= 1) {
        this.completeOpen();
      }
    }, 16);
  }

  stopHold() {
    if (this.holdTimer) {
      clearInterval(this.holdTimer);
      this.holdTimer = null;
    }

    this.isOpening = false;
    this.openingRedIntensity = 0;
    this.elements.coverSymbol.classList.remove('holding');
    this.elements.progressRing.classList.remove('active');

    gsap.to('.symbol-icon', { scale: 1, duration: 0.35 });
    gsap.to('.symbol-glow', { opacity: 0.6, scale: 1, duration: 0.35 });

    if (this.elements.progressBar) {
      this.elements.progressBar.style.strokeDashoffset = 352;
    }

    this.holdProgress = 0;
  }

  completeOpen() {
    this.stopHold();
    this.isOpen = true;

    this.revealProgress = 0;
    gsap.to(this, {
      revealProgress: 1,
      duration: 1.8,
      ease: "power2.out"
    });

    gsap.to(this, {
      openingRedIntensity: 1,
      duration: 0.8,
      ease: "power2.out"
    });

    const answer = getRandomAnswer();
    this.currentAnswer = {
      question: this.elements.questionInput.value,
      answer: answer.text,
      explanation: answer.explanation,
      timestamp: Date.now()
    };

    this.saveToHistory(this.currentAnswer);

    this.elements.answerInitial.textContent = answer.text.charAt(0);
    this.elements.answerText.textContent = answer.text.slice(1);
    this.elements.answerExplanation.textContent = answer.explanation;

    this.elements.answerInitial.style.opacity = '0';
    this.elements.answerText.style.opacity = '0';
    this.elements.answerExplanation.style.opacity = '0';

    this.elements.book3d.classList.add('open');

    setTimeout(() => {
      gsap.to(this.elements.answerInitial, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      });
    }, 300);

    setTimeout(() => {
      gsap.to(this.elements.answerText, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      });
    }, 600);

    setTimeout(() => {
      gsap.to(this.elements.answerExplanation, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      });
    }, 900);

    setTimeout(() => {
      this.elements.actions.classList.add('visible');
    }, 1500);
  }

  resetBook() {
    this.elements.actions.classList.remove('visible');

    setTimeout(() => {
      this.elements.book3d.classList.remove('open');

      setTimeout(() => {
        this.elements.answerInitial.textContent = '';
        this.elements.answerText.textContent = '';
        this.elements.answerExplanation.textContent = '';
        this.elements.questionInput.value = '';
        this.inputValue = '';
        this.isOpen = false;
        this.isOpening = false;
        this.openingRedIntensity = 0;
        this.revealProgress = 0;
        this.isAwake = false;
      }, 400);
    }, 300);
  }

  shakeInput() {
    gsap.fromTo(this.elements.questionInput,
      { x: -8 },
      {
        x: 8,
        duration: 0.08,
        repeat: 5,
        yoyo: true,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(this.elements.questionInput, { x: 0 });
        }
      }
    );
  }

  openHistoryModal() {
    this.renderHistoryList();
    this.elements.historyModal.classList.add('visible');
  }

  closeHistoryModal() {
    this.elements.historyModal.classList.remove('visible');
  }

  async openShareModal() {
    this.elements.shareModal.classList.add('visible');
    await this.renderShareCard();
  }

  closeShareModal() {
    this.elements.shareModal.classList.remove('visible');
  }

  renderHistoryList() {
    if (this.history.length === 0) {
      this.elements.historyList.innerHTML = '<div class="empty-history">暂未获得任何答案</div>';
      return;
    }

    this.elements.historyList.innerHTML = this.history.slice().reverse().map(item => {
      const date = new Date(item.timestamp);
      const dateStr = `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      return `
        <div class="history-item">
          <div class="history-question">${item.question}</div>
          <div class="history-answer">${item.answer}</div>
          <div class="history-date">${dateStr}</div>
        </div>
      `;
    }).join('');
  }

  async renderShareCard() {
    if (!this.currentAnswer) return;

    // 等待字体加载
    await this.ensureFontsLoaded();

    const canvas = this.elements.shareCanvas;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = 1080 * dpr;
    canvas.height = 1900 * dpr;
    canvas.style.width = '100%';
    ctx.scale(dpr, dpr);

    // 背景
    const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1900);
    bgGradient.addColorStop(0, '#1a0a0a');
    bgGradient.addColorStop(0.5, '#0f0505');
    bgGradient.addColorStop(1, '#050202');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1900);

    // 中心光晕
    const glowGradient = ctx.createRadialGradient(540, 500, 0, 540, 500, 600);
    glowGradient.addColorStop(0, 'rgba(255, 230, 150, 0.12)');
    glowGradient.addColorStop(0.5, 'rgba(255, 211, 107, 0.06)');
    glowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, 1080, 1900);

    // 边框
    ctx.strokeStyle = 'rgba(255, 230, 150, 0.35)';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, 960, 1780);

    // 内边框
    ctx.strokeStyle = 'rgba(255, 230, 150, 0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(90, 90, 900, 1720);

    // 顶部标题装饰
    this.drawDecorativeLine(ctx, 540, 140, 300);

    // 标题 - 使用更安全的字体
    ctx.fillStyle = '#FFE696';
    ctx.font = 'bold 72px "Noto Serif SC", "Songti SC", "Source Han Serif SC", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    this.drawTextWithShadow(ctx, '答案之书', 540, 160, 'rgba(255, 230, 150, 0.4)', 0, 4, 20);

    // 副标题
    ctx.fillStyle = 'rgba(255, 230, 150, 0.5)';
    ctx.font = '32px "Cinzel", "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('THE BOOK OF ANSWERS', 540, 260);

    // 装饰线条
    this.drawDividerLine(ctx, 150, 340, 930);

    // 问题区域
    ctx.fillStyle = 'rgba(255, 250, 240, 0.8)';
    ctx.font = '40px "Noto Serif SC", "Songti SC", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    const questionText = '「' + this.currentAnswer.question + '」';
    const questionLines = this.splitIntoLines(ctx, questionText, 750);
    let currentY = 400;
    for (let i = 0; i < questionLines.length; i++) {
      ctx.fillText(questionLines[i], 540, currentY);
      currentY += 64;
    }

    // 分隔线
    this.drawDividerLine(ctx, 150, currentY + 50, 930);

    // 答案首字母 - 更大更醒目
    const initialY = currentY + 120;
    ctx.fillStyle = '#FFE696';
    ctx.font = 'bold 300px "Playfair Display SC", "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    this.drawTextWithShadow(ctx, this.currentAnswer.answer.charAt(0), 540, initialY, 'rgba(255, 230, 150, 0.3)', 0, 6, 30);

    // 答案内容 - 再次增加与首字母的间距
    const answerStartY = initialY + 340;
    ctx.fillStyle = '#FFFAF0';
    ctx.font = '68px "Noto Serif SC", "Songti SC", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    const answerText = this.currentAnswer.answer.slice(1);
    const answerLines = this.splitIntoLines(ctx, answerText, 750);
    currentY = answerStartY;
    for (let i = 0; i < answerLines.length; i++) {
      ctx.fillText(answerLines[i], 540, currentY);
      currentY += 96;
    }

    // 分隔线
    this.drawDividerLine(ctx, 150, currentY + 60, 930);

    // 解释文字 - 再次增加与答案的间距
    const explanationY = currentY + 200;
    ctx.fillStyle = 'rgba(255, 230, 150, 0.55)';
    ctx.font = '40px "Noto Serif SC", "Songti SC", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    const explanationLines = this.splitIntoLines(ctx, this.currentAnswer.explanation, 750);
    currentY = explanationY;
    for (let i = 0; i < explanationLines.length; i++) {
      ctx.fillText(explanationLines[i], 540, currentY);
      currentY += 60;
    }

    // 底部装饰
    this.drawDecorativeLine(ctx, 540, 1720, 280);
    
    ctx.fillStyle = '#FFE696';
    ctx.font = '56px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✧', 540, 1760);
  }

  ensureFontsLoaded() {
    return new Promise((resolve) => {
      if (!document.fonts || !document.fonts.ready) {
        // 不支持字体加载API，直接resolve
        setTimeout(resolve, 500);
        return;
      }
      
      document.fonts.ready.then(() => {
        // 额外等待一点时间确保字体完全加载
        setTimeout(resolve, 300);
      });
    });
  }

  drawTextWithShadow(ctx, text, x, y, shadowColor, offsetX, offsetY, blur) {
    ctx.save();
    ctx.shadowColor = shadowColor;
    ctx.shadowOffsetX = offsetX;
    ctx.shadowOffsetY = offsetY;
    ctx.shadowBlur = blur;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  drawDividerLine(ctx, x1, y, x2) {
    const gradient = ctx.createLinearGradient(x1, y, x2, y);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.3, 'rgba(255, 230, 150, 0.35)');
    gradient.addColorStop(0.5, 'rgba(255, 230, 150, 0.6)');
    gradient.addColorStop(0.7, 'rgba(255, 230, 150, 0.35)');
    gradient.addColorStop(1, 'transparent');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }

  drawDecorativeLine(ctx, centerX, y, length) {
    const halfLength = length / 2;
    const gradient = ctx.createLinearGradient(centerX - halfLength, y, centerX + halfLength, y);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.2, 'rgba(255, 230, 150, 0.4)');
    gradient.addColorStop(0.5, 'rgba(255, 230, 150, 0.7)');
    gradient.addColorStop(0.8, 'rgba(255, 230, 150, 0.4)');
    gradient.addColorStop(1, 'transparent');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - halfLength, y);
    ctx.lineTo(centerX + halfLength, y);
    ctx.stroke();
    
    // 中间符号
    ctx.fillStyle = 'rgba(255, 230, 150, 0.8)';
    ctx.font = '32px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦', centerX, y);
  }

  splitIntoLines(ctx, text, maxWidth) {
    const chars = text.split('');
    const lines = [];
    let currentLine = '';
    
    // 更保守的换行策略，提前换行
    const safeMaxWidth = maxWidth * 0.92;
    
    for (let i = 0; i < chars.length; i++) {
      const testLine = currentLine + chars[i];
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > safeMaxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = chars[i];
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine !== '') {
      lines.push(currentLine);
    }
    
    return lines;
  }

  saveShareImage() {
    const link = document.createElement('a');
    link.download = `答案之书_${Date.now()}.png`;
    link.href = this.elements.shareCanvas.toDataURL('image/png');
    link.click();
  }

  copyShareLink() {
    const text = `我在答案之书中找到了答案：「${this.currentAnswer.answer}」`;
    navigator.clipboard.writeText(text).then(() => {
      alert('已复制到剪贴板');
    }).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('已复制到剪贴板');
    });
  }

  saveToHistory(item) {
    this.history.push(item);
    if (this.history.length > 50) {
      this.history = this.history.slice(-50);
    }
    localStorage.setItem('bookOfAnswers_history', JSON.stringify(this.history));
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem('bookOfAnswers_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  animate() {
    this.time += 0.016;

    const width = window.innerWidth;
    const height = window.innerHeight;

    let intensity = 1;
    if (this.isAwake) intensity *= 1.2;
    if (this.isOpening) intensity *= (1 + this.holdProgress * 0.4);
    if (this.isOpen) intensity *= 1.5;

    [this.bgCtx, this.lightBeamCtx, this.starDustCtx, this.coverCtx, this.pageCtx].forEach(ctx => {
      ctx.clearRect(0, 0, width, height);
    });

    this.drawHeaderCanvas(intensity);
    this.drawInputCanvas(intensity);
    this.drawBackground(intensity);
    this.drawRedGlow(intensity);
    this.drawCoverCanvas(intensity);
    this.drawPageCanvas(intensity);
    this.drawLightBeams(intensity);
    this.drawStarDust(intensity);
    this.drawGoldLeaf(intensity);

    if (this.isOpen) {
      this.drawAnswerReveal(intensity);
    }

    this.drawGrain();

    requestAnimationFrame(() => this.animate());
  }

  drawHeaderCanvas(intensity) {
    const ctx = this.headerCtx;
    const canvas = this.headerCanvas;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const glowGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.6);
    glowGradient.addColorStop(0, `rgba(255, 230, 150, ${0.08 * intensity})`);
    glowGradient.addColorStop(0.5, `rgba(255, 211, 107, ${0.04 * intensity})`);
    glowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + this.time * 0.2;
      const dist = 45 + Math.sin(this.time * 0.5 + i) * 8;
      const x = width / 2 + Math.cos(angle) * dist;
      const y = height / 2 + Math.sin(angle) * dist;
      const size = 2 + Math.sin(this.time + i * 0.8) * 1;
      
      ctx.fillStyle = `rgba(255, 230, 150, ${0.2 + Math.sin(this.time * 0.8 + i) * 0.15})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    const titleGradient = ctx.createLinearGradient(width * 0.1, height / 2, width * 0.9, height / 2);
    titleGradient.addColorStop(0, '#FFD36B');
    titleGradient.addColorStop(0.3, '#FFE696');
    titleGradient.addColorStop(0.5, '#FFF5D6');
    titleGradient.addColorStop(0.7, '#FFE696');
    titleGradient.addColorStop(1, '#FFD36B');

    ctx.fillStyle = titleGradient;
    ctx.font = 'bold 36px "Noto Serif SC", "Playfair Display SC", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const mainTitle = '答案之书';
    const shadowOffset = 2 + Math.sin(this.time * 0.8) * 0.5;
    ctx.shadowColor = 'rgba(255, 230, 150, 0.6)';
    ctx.shadowBlur = 15 * intensity;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillText(mainTitle, width / 2, height / 2 - 8);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 230, 150, 0.5)';
    ctx.font = '12px "Cinzel", serif';
    ctx.fillText('BOOK OF ANSWERS', width / 2, height / 2 + 22);

    const decoGradient = ctx.createLinearGradient(0, height / 2, width, height / 2);
    decoGradient.addColorStop(0, 'transparent');
    decoGradient.addColorStop(0.3, 'rgba(255, 230, 150, 0.3)');
    decoGradient.addColorStop(0.5, 'rgba(255, 211, 107, 0.5)');
    decoGradient.addColorStop(0.7, 'rgba(255, 230, 150, 0.3)');
    decoGradient.addColorStop(1, 'transparent');
    
    ctx.strokeStyle = decoGradient;
    ctx.lineWidth = 1.5;
    
    ctx.beginPath();
    ctx.moveTo(width * 0.15, height / 2 - 35);
    ctx.lineTo(width * 0.35, height / 2 - 35);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(width * 0.65, height / 2 - 35);
    ctx.lineTo(width * 0.85, height / 2 - 35);
    ctx.stroke();

    const sparkleIntensity = 0.3 + Math.sin(this.time * 1.2) * 0.2;
    ctx.fillStyle = `rgba(255, 230, 150, ${sparkleIntensity})`;
    ctx.font = '14px serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦', width * 0.35 - 12, height / 2 - 35);
    ctx.fillText('✦', width * 0.65 + 12, height / 2 - 35);
  }

  drawInputCanvas(intensity) {
    const ctx = this.inputCtx;
    const canvas = this.inputCanvas;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    let glowIntensity = 0.3;
    if (this.isAwake) glowIntensity = 0.6;
    if (this.isOpening) glowIntensity = 0.5 + this.holdProgress * 0.3;

    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, 'rgba(15, 8, 8, 0.85)');
    bgGradient.addColorStop(0.5, 'rgba(25, 12, 12, 0.75)');
    bgGradient.addColorStop(1, 'rgba(15, 8, 8, 0.85)');
    ctx.fillStyle = bgGradient;
    
    const radius = 16;
    ctx.beginPath();
    ctx.roundRect(8, 8, width - 16, height - 16, radius);
    ctx.fill();

    const borderGradient = ctx.createLinearGradient(0, 0, width, height);
    borderGradient.addColorStop(0, `rgba(255, 230, 150, ${0.25 * glowIntensity})`);
    borderGradient.addColorStop(0.3, `rgba(255, 211, 107, ${0.35 * glowIntensity})`);
    borderGradient.addColorStop(0.5, `rgba(255, 230, 150, ${0.45 * glowIntensity})`);
    borderGradient.addColorStop(0.7, `rgba(255, 211, 107, ${0.35 * glowIntensity})`);
    borderGradient.addColorStop(1, `rgba(255, 230, 150, ${0.25 * glowIntensity})`);
    
    ctx.strokeStyle = borderGradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(8, 8, width - 16, height - 16, radius);
    ctx.stroke();

    const innerGlow = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.4);
    innerGlow.addColorStop(0, `rgba(255, 230, 150, ${0.08 * glowIntensity})`);
    innerGlow.addColorStop(0.5, `rgba(255, 211, 107, ${0.04 * glowIntensity})`);
    innerGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = innerGlow;
    ctx.beginPath();
    ctx.roundRect(8, 8, width - 16, height - 16, radius);
    ctx.fill();

    if (!this.inputValue || this.inputValue.trim() === '') {
      const placeholderGradient = ctx.createLinearGradient(0, height / 2, width, height / 2);
      placeholderGradient.addColorStop(0, 'rgba(255, 250, 240, 0.3)');
      placeholderGradient.addColorStop(0.5, 'rgba(255, 250, 240, 0.45)');
      placeholderGradient.addColorStop(1, 'rgba(255, 250, 240, 0.3)');
      
      ctx.fillStyle = placeholderGradient;
      ctx.font = '16px "Noto Serif SC", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('请输入你的问题...', width / 2, height / 2);
    }

    const cornerSymbols = ['❖', '❖'];
    const cornerPositions = [
      { x: 26, y: 22 },
      { x: width - 26, y: 22 }
    ];

    cornerPositions.forEach((pos, i) => {
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(this.time * 0.3 + i * Math.PI);
      ctx.fillStyle = `rgba(255, 230, 150, ${0.25 * glowIntensity})`;
      ctx.font = '12px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cornerSymbols[i], 0, 0);
      ctx.restore();
    });

    const bottomLine = ctx.createLinearGradient(width * 0.2, height - 6, width * 0.8, height - 6);
    bottomLine.addColorStop(0, 'transparent');
    bottomLine.addColorStop(0.3, `rgba(255, 230, 150, ${0.2 * glowIntensity})`);
    bottomLine.addColorStop(0.5, `rgba(255, 211, 107, ${0.35 * glowIntensity})`);
    bottomLine.addColorStop(0.7, `rgba(255, 230, 150, ${0.2 * glowIntensity})`);
    bottomLine.addColorStop(1, 'transparent');
    
    ctx.strokeStyle = bottomLine;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width * 0.2, height - 6);
    ctx.lineTo(width * 0.8, height - 6);
    ctx.stroke();

    if (this.isAwake && !this.isOpen) {
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 + this.time * 0.5;
        const dist = 18 + Math.sin(this.time * 0.8 + i) * 6;
        const x = width / 2 + Math.cos(angle) * dist;
        const y = height / 2 + Math.sin(angle) * dist;
        const size = 1.5 + Math.sin(this.time * 1.5 + i) * 0.8;
        const alpha = 0.2 + Math.sin(this.time * 2 + i) * 0.15;
        
        ctx.fillStyle = `rgba(255, 230, 150, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  drawBackground(intensity) {
    const ctx = this.bgCtx;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.8);
    bgGradient.addColorStop(0, '#0a0505');
    bgGradient.addColorStop(1, '#050202');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
  }

  drawRedGlow(intensity) {
    const ctx = this.bgCtx;
    const width = window.innerWidth;
    const height = window.innerHeight;

    let redIntensity = 1;
    if (this.isOpening) {
      redIntensity = this.openingRedIntensity;
    } else if (this.isAwake) {
      redIntensity = 0.2;
    }
    const currentIntensity = intensity * redIntensity;

    this.redGlowBlobs.forEach((blob) => {
      const x = blob.x + Math.sin(this.time * blob.driftSpeed + blob.phase) * 60;
      const y = blob.y + Math.cos(this.time * blob.driftSpeed * 0.7 + blob.phase) * 45;
      const pulse = 1 + Math.sin(this.time * blob.pulseSpeed + blob.phase) * 0.15;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, Math.max(blob.sizeX, blob.sizeY) * 0.5);
      gradient.addColorStop(0, `rgba(180, 30, 30, ${0.25 * blob.baseIntensity * currentIntensity * pulse})`);
      gradient.addColorStop(0.4, `rgba(120, 20, 20, ${0.1 * blob.baseIntensity * currentIntensity * pulse})`);
      gradient.addColorStop(0.7, `rgba(60, 10, 10, ${0.03 * blob.baseIntensity * currentIntensity * pulse})`);
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.ellipse(x, y, blob.sizeX * 0.5, blob.sizeY * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.globalCompositeOperation = 'screen';
      ctx.fill();
    });

    ctx.globalCompositeOperation = 'source-over';
  }

  drawCoverCanvas(intensity) {
    const ctx = this.coverCtx;
    const canvas = this.coverCanvas;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height));
    gradient.addColorStop(0, '#150a0a');
    gradient.addColorStop(0.5, '#0c0606');
    gradient.addColorStop(1, '#050202');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const borderGradient = ctx.createLinearGradient(0, 0, width, height);
    borderGradient.addColorStop(0, 'rgba(255, 230, 150, 0.35)');
    borderGradient.addColorStop(0.5, 'rgba(255, 211, 107, 0.15)');
    borderGradient.addColorStop(1, 'rgba(255, 230, 150, 0.35)');
    
    ctx.strokeStyle = borderGradient;
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, width - 16, height - 16);

    const innerBorderGradient = ctx.createLinearGradient(width, height, 0, 0);
    innerBorderGradient.addColorStop(0, 'rgba(255, 230, 150, 0.2)');
    innerBorderGradient.addColorStop(0.5, 'rgba(255, 211, 107, 0.08)');
    innerBorderGradient.addColorStop(1, 'rgba(255, 230, 150, 0.2)');
    
    ctx.strokeStyle = innerBorderGradient;
    ctx.lineWidth = 1;
    ctx.strokeRect(18, 18, width - 36, height - 36);

    const cornerSymbols = ['✦', '◇', '✧', '❖'];
    const cornerPositions = [
      { x: 35, y: 35 },
      { x: width - 35, y: 35 },
      { x: 35, y: height - 35 },
      { x: width - 35, y: height - 35 }
    ];

    cornerPositions.forEach((pos, i) => {
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(this.time * 0.2 + i * 0.5);
      ctx.fillStyle = `rgba(255, 230, 150, ${0.15 + intensity * 0.1})`;
      ctx.font = '20px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cornerSymbols[i], 0, 0);
      ctx.restore();
    });

    const coverGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.6);
    coverGradient.addColorStop(0, `rgba(255, 230, 150, ${0.08 * intensity})`);
    coverGradient.addColorStop(0.5, `rgba(255, 211, 107, ${0.04 * intensity})`);
    coverGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = coverGradient;
    ctx.fillRect(0, 0, width, height);
  }

  drawPageCanvas(intensity) {
    const ctx = this.pageCtx;
    const canvas = this.pageCanvas;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const pageGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height));
    pageGradient.addColorStop(0, '#1a0f0f');
    pageGradient.addColorStop(0.5, '#0f0808');
    pageGradient.addColorStop(1, '#050202');
    ctx.fillStyle = pageGradient;
    ctx.fillRect(0, 0, width, height);

    const borderGradient = ctx.createLinearGradient(0, 0, width, height);
    borderGradient.addColorStop(0, 'rgba(255, 230, 150, 0.25)');
    borderGradient.addColorStop(0.5, 'rgba(255, 211, 107, 0.1)');
    borderGradient.addColorStop(1, 'rgba(255, 230, 150, 0.25)');
    
    ctx.strokeStyle = borderGradient;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(5, 5, width - 10, height - 10);

    const centerGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7);
    centerGradient.addColorStop(0, `rgba(255, 230, 150, ${0.06 * intensity})`);
    centerGradient.addColorStop(0.5, `rgba(255, 211, 107, ${0.03 * intensity})`);
    centerGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = centerGradient;
    ctx.fillRect(0, 0, width, height);
  }

  drawLightBeams(intensity) {
    const ctx = this.lightBeamCtx;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height * 0.5;

    let beamIntensity = intensity * 0.35;
    if (this.isOpen) beamIntensity *= 1.8;
    if (this.isOpening) beamIntensity *= (1 + this.holdProgress * 0.5);

    const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 280);
    coreGradient.addColorStop(0, `rgba(255, 230, 150, ${0.25 * beamIntensity})`);
    coreGradient.addColorStop(0.4, `rgba(255, 211, 107, ${0.12 * beamIntensity})`);
    coreGradient.addColorStop(0.7, `rgba(255, 230, 150, ${0.03 * beamIntensity})`);
    coreGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGradient;
    ctx.fillRect(0, 0, width, height);

    this.lightBeamRays.forEach((ray) => {
      const rayLength = ray.length + Math.sin(this.time * ray.speed + ray.phase) * 40;
      const rayWidth = ray.width * (0.8 + Math.sin(this.time * ray.speed * 1.8 + ray.phase) * 0.2);

      const endX = centerX + Math.cos(ray.angle + this.time * ray.speed * 0.08) * rayLength;
      const endY = centerY + Math.sin(ray.angle + this.time * ray.speed * 0.08) * rayLength;

      const beamGradient = ctx.createLinearGradient(centerX, centerY, endX, endY);
      beamGradient.addColorStop(0, `rgba(255, 230, 150, ${ray.intensity * beamIntensity})`);
      beamGradient.addColorStop(0.5, `rgba(255, 211, 107, ${ray.intensity * 0.4 * beamIntensity})`);
      beamGradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.moveTo(centerX - rayWidth * 0.5, centerY);
      ctx.lineTo(endX - rayWidth * 0.2, endY);
      ctx.lineTo(endX + rayWidth * 0.2, endY);
      ctx.lineTo(centerX + rayWidth * 0.5, centerY);
      ctx.closePath();

      ctx.fillStyle = beamGradient;
      ctx.globalCompositeOperation = 'screen';
      ctx.fill();
    });

    ctx.globalCompositeOperation = 'source-over';
  }

  drawStarDust(intensity) {
    const ctx = this.starDustCtx;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height * 0.5;

    let particleIntensity = intensity;
    if (this.isOpen) particleIntensity *= 1.4;

    this.starDustParticles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < -10) particle.x = width + 10;
      if (particle.x > width + 10) particle.x = -10;
      if (particle.y < -10) particle.y = height + 10;
      if (particle.y > height + 10) particle.y = -10;

      const twinkle = 0.5 + Math.sin(this.time * particle.twinkleSpeed + particle.twinklePhase) * 0.5;
      const dx = particle.x - centerX;
      const dy = particle.y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const centerBrightness = Math.max(0, 1 - dist / 350);

      const glowGradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 4.5);
      glowGradient.addColorStop(0, `${particle.color === '#FFE696' ? 'rgba(255, 230, 150' : 'rgba(255, 211, 107'}, ${(0.25 + centerBrightness * 0.25) * particle.opacity * twinkle * particleIntensity})`);
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `${particle.color === '#FFE696' ? 'rgba(255, 250, 230' : 'rgba(255, 245, 210'}, ${particle.opacity * twinkle * particleIntensity})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawGoldLeaf(intensity) {
    const ctx = this.starDustCtx;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height * 0.5;

    let leafIntensity = intensity;
    if (this.isOpen) leafIntensity *= 1.6;

    this.goldLeafParticles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.rotation += particle.rotationSpeed;

      if (particle.x < -20) particle.x = width + 20;
      if (particle.x > width + 20) particle.x = -20;
      if (particle.y < -20) particle.y = height + 20;
      if (particle.y > height + 20) particle.y = -20;

      const twinkle = 0.55 + Math.sin(this.time * particle.twinkleSpeed + particle.twinklePhase) * 0.45;
      const dx = particle.x - centerX;
      const dy = particle.y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const centerAttraction = Math.max(0, 1 - dist / 300);

      particle.x -= dx * centerAttraction * 0.0008;
      particle.y -= dy * centerAttraction * 0.0008;

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);

      const goldGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size * 2.2);
      goldGradient.addColorStop(0, `rgba(255, 245, 210, ${0.4 * particle.opacity * twinkle * leafIntensity})`);
      goldGradient.addColorStop(0.35, `rgba(255, 230, 150, ${0.3 * particle.opacity * twinkle * leafIntensity})`);
      goldGradient.addColorStop(0.7, `rgba(212, 175, 55, ${0.15 * particle.opacity * twinkle * leafIntensity})`);
      goldGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = goldGradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, particle.size * 1.3, particle.size * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 250, 230, ${0.25 * particle.opacity * twinkle * leafIntensity})`;
      ctx.beginPath();
      ctx.ellipse(-particle.size * 0.2, -particle.size * 0.1, particle.size * 0.45, particle.size * 0.22, -0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  drawAnswerReveal(intensity) {
    const ctx = this.lightBeamCtx;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const revealIntensity = this.revealProgress * intensity;
    const centerX = width / 2;
    const centerY = height * 0.5;

    for (let i = 0; i < 5; i++) {
      const ringRadius = 120 + (i * 70) * this.revealProgress;
      const ringOpacity = (1 - i / 5) * 0.25 * revealIntensity;
      const ringThickness = 2.5 + (1 - this.revealProgress) * 4;

      const ringGradient = ctx.createRadialGradient(centerX, centerY, ringRadius - ringThickness, centerX, centerY, ringRadius);
      ringGradient.addColorStop(0, 'transparent');
      ringGradient.addColorStop(0.5, `rgba(255, 230, 150, ${ringOpacity})`);
      ringGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = ringGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.revealProgress < 0.55) {
      const flashIntensity = (1 - this.revealProgress * 1.8) * 0.35;
      const flashGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 220);
      flashGradient.addColorStop(0, `rgba(255, 240, 210, ${flashIntensity})`);
      flashGradient.addColorStop(0.5, `rgba(255, 230, 150, ${flashIntensity * 0.5})`);
      flashGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = flashGradient;
      ctx.fillRect(0, 0, width, height);
    }

    const particleCount = Math.floor(18 * (1 - this.revealProgress));
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 40 + Math.random() * 80;
      const dist = speed * this.revealProgress;
      const x = centerX + Math.cos(angle + this.time * 0.2) * dist;
      const y = centerY + Math.sin(angle + this.time * 0.2) * dist;
      const size = 1.5 + Math.random() * 2.5;
      const opacity = (1 - this.revealProgress) * 0.45;

      ctx.fillStyle = `rgba(255, 230, 150, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawGrain() {
    const ctx = this.bgCtx;
    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.globalAlpha = 0.02;
    for (let i = 0; i < 600; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
      ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
    }
    ctx.globalAlpha = 1;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new BookOfAnswers();
});
