document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation Scroll Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });
  }

  // 3. Hero Section Live Sync Console (Typewriter Simulator)
  const consoleBody = document.getElementById('live-console-body');
  if (consoleBody) {
    const consoleLogs = [
      { text: 'systemctl start libertystack-sync.service', type: 'command' },
      { text: '[SYSTEM] Initializing synchronization pipeline...', type: 'info' },
      { text: '[SHOPIFY] Connecting to store API (v2026.04)...', type: 'info' },
      { text: '[SHOPIFY] Webhook handshake successful: orders/create', type: 'success' },
      { text: '[POSTGRES] DB Pool connected. Active connections: 4/20', type: 'info' },
      { text: '[REDIS] Cache warmed. 412 inventory SKUs cached.', type: 'info' },
      { text: '[FASTAPI] Server listening on port 8000 (production)', type: 'info' },
      { text: '[READY] Listening for commerce webhook events...', type: 'success' },
      { text: 'curl -X POST "https://api.libertystack.co.in/v1/webhook" -H "X-Shopify-Topic: orders/create"', type: 'command' },
      { text: '[WEBHOOK] Received payload for Order #4928-WS', type: 'info' },
      { text: '[ASYNC] Dispatching task: sync_order_inventory (ID: t_8a9c)', type: 'info' },
      { text: '[TASK] Queue: celery.orders | Target: Postgres | Status: RUNNING', type: 'info' },
      { text: '[POSTGRES] Order #4928-WS written to db (0.012s)', type: 'success' },
      { text: '[SHOPIFY] Inventory updated for SKU "LVT-STK-BLK" (-1 qty)', type: 'success' },
      { text: '[ERP] Synchronized invoice data to ERP system', type: 'success' },
      { text: '[SLACK] Alert dispatched: Order #4928-WS ($340.00)', type: 'success' },
      { text: '[SYNC] Task t_8a9c completed in 1.42s. Status: OK', type: 'success' }
    ];

    let logIndex = 0;

    function appendConsoleLine() {
      const log = consoleLogs[logIndex];
      const lineDiv = document.createElement('div');
      lineDiv.className = 'console-line';

      if (log.type === 'command') {
        lineDiv.innerHTML = `<span class="console-prompt">$</span><span class="console-text">${log.text}</span>`;
      } else if (log.type === 'success') {
        lineDiv.innerHTML = `<span class="console-prompt">></span><span class="console-text highlight">${log.text}</span>`;
      } else if (log.text.includes('orders/create') || log.text.includes('Webhook')) {
        lineDiv.innerHTML = `<span class="console-prompt">></span><span class="console-text blue">${log.text}</span>`;
      } else {
        lineDiv.innerHTML = `<span class="console-prompt">></span><span class="console-text">${log.text}</span>`;
      }

      consoleBody.appendChild(lineDiv);
      consoleBody.scrollTop = consoleBody.scrollHeight;

      logIndex++;
      if (logIndex >= consoleLogs.length) {
        // Clear and restart loop
        setTimeout(() => {
          consoleBody.innerHTML = '';
          logIndex = 0;
          appendConsoleLine();
        }, 8000);
      } else {
        const nextDelay = log.type === 'command' ? 1800 : Math.random() * 800 + 400;
        setTimeout(appendConsoleLine, nextDelay);
      }
    }

    // Start Console Output
    setTimeout(appendConsoleLine, 1000);
  }

  // 4. Automation Playground Interactive Logic
  const startAutomationBtn = document.getElementById('start-automation-btn');
  const nodes = document.querySelectorAll('.playground-node');
  const statusDot = document.querySelector('.status-dot');
  const statusText = document.getElementById('playground-status-text');
  const playgroundLogs = document.getElementById('playground-logs-body');
  const pulse = document.querySelector('.playground-pulse');

  if (startAutomationBtn && nodes.length > 0) {
    let isRunning = false;

    const pipelineSteps = [
      {
        nodeId: 'node-trigger',
        status: 'Triggering Webhook',
        log: 'Shopify event received: order_created (payload size: 4.8kb)',
        delay: 1500
      },
      {
        nodeId: 'node-inventory',
        status: 'Updating Inventory',
        log: 'Shopify stock adjusted for SKU: LS-LITE (qty: -1)',
        delay: 1500
      },
      {
        nodeId: 'node-slack',
        status: 'Dispatching Slack Alert',
        log: 'Slack Webhook post successful -> #sales-feed',
        delay: 1200
      },
      {
        nodeId: 'node-erp',
        status: 'Syncing ERP Ledger',
        log: 'Invoice #1092 generated in ERP. Financial ledger balanced.',
        delay: 1500
      }
    ];

    function addPlaygroundLog(message) {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const logDiv = document.createElement('div');
      logDiv.className = 'playground-log-entry';
      logDiv.innerHTML = `<span class="playground-log-timestamp">[${timeStr}]</span><span>${message}</span>`;
      playgroundLogs.appendChild(logDiv);
      playgroundLogs.scrollTop = playgroundLogs.scrollHeight;
    }

    startAutomationBtn.addEventListener('click', () => {
      if (isRunning) return;
      isRunning = true;
      startAutomationBtn.disabled = true;
      startAutomationBtn.style.opacity = '0.5';
      startAutomationBtn.textContent = 'Running Pipeline...';

      // Reset nodes
      nodes.forEach(n => {
        n.classList.remove('active', 'completed');
      });
      playgroundLogs.innerHTML = '';

      // Update status
      statusDot.className = 'status-dot running';
      statusText.textContent = 'Pipeline Active';
      addPlaygroundLog('System started. Listening to orders pipeline.');

      let stepIndex = 0;

      function executeStep() {
        if (stepIndex >= pipelineSteps.length) {
          // Finished
          statusDot.className = 'status-dot done';
          statusText.textContent = 'Finished';
          addPlaygroundLog('Pipeline executed successfully. All tasks completed.');
          pulse.style.opacity = '0';
          pulse.classList.remove('running');
          
          startAutomationBtn.disabled = false;
          startAutomationBtn.style.opacity = '1';
          startAutomationBtn.textContent = 'Trigger Automation';
          isRunning = false;
          return;
        }

        const step = pipelineSteps[stepIndex];
        const currentNode = document.getElementById(step.nodeId);
        
        // Mark previous completed
        if (stepIndex > 0) {
          const prevNode = document.getElementById(pipelineSteps[stepIndex - 1].nodeId);
          prevNode.classList.remove('active');
          prevNode.classList.add('completed');
        }

        currentNode.classList.add('active');
        statusText.textContent = step.status;
        addPlaygroundLog(step.log);

        // Position pulse between nodes (if not last node)
        if (stepIndex < pipelineSteps.length - 1) {
          pulse.style.opacity = '1';
          pulse.classList.add('running');
          
          // Basic flow lines visual effect adjustments (represented simply by running pulse animation)
          const sourceNodeRect = currentNode.getBoundingClientRect();
          const targetNodeRect = document.getElementById(pipelineSteps[stepIndex + 1].nodeId).getBoundingClientRect();
          // The pulse spans between nodes
        } else {
          pulse.style.opacity = '0';
          pulse.classList.remove('running');
        }

        stepIndex++;
        setTimeout(executeStep, step.delay);
      }

      executeStep();
    });
  }

  // 5. Tech Stack Explorer Interactive Logic
  const techCards = document.querySelectorAll('.tech-card');
  const detailsPanel = document.querySelector('.tech-details-panel');

  if (techCards.length > 0 && detailsPanel) {
    const techData = {
      python: {
        name: 'Python',
        icon: '🐍',
        desc: 'Python acts as the engine for all our database reporting, automated reconciliation scripts, scheduled background operations, and task worker managers. Its reliability and vast ecosystem ensure robust backend execution.',
        usecase: 'Order reconciliation systems and heavy data analysis pipelines.'
      },
      shopify: {
        name: 'Shopify Liquid / Storefront API',
        icon: '🛍️',
        desc: 'We build custom, lightning-fast Shopify themes using Shopify liquid, and develop completely headless storefronts using the GraphQL Storefront API to provide a world-class customer experience.',
        usecase: 'Custom checkout customization, unique product customizers, and speedy e-commerce interfaces.'
      },
      fastapi: {
        name: 'FastAPI',
        icon: '⚡',
        desc: 'FastAPI is our go-to framework for building high-performance, asynchronous REST & GraphQL APIs. It automatically generates interactive OpenAPI documentation and helps us connect store interfaces with backends seamlessly.',
        usecase: 'Private Shopify App backends and microservice integrations.'
      },
      postgresql: {
        name: 'PostgreSQL',
        icon: '🐘',
        desc: 'PostgreSQL is our primary choice for relational databases. It safely stores complex order ledgers, catalog mappings, and system transaction histories with full ACID compliance under high concurrency.',
        usecase: 'Commerce transaction ledgers and custom inventory management DBs.'
      },
      redis: {
        name: 'Redis',
        icon: '🔴',
        desc: 'Redis serves as our caching tier and message broker. It enables sub-millisecond page requests, buffers high-frequency webhook events, and manages Celery background queues.',
        usecase: 'Webhook processing buffer queues and session state management.'
      },
      docker: {
        name: 'Docker',
        icon: '🐳',
        desc: 'We package every backend system and API database inside Docker containers. This ensures perfect development-to-production environment parity and simplified local replication.',
        usecase: 'Repeatable application containerization and scaling pipelines.'
      },
      aws: {
        name: 'AWS Cloud Hosting',
        icon: '☁️',
        desc: 'AWS hosts our production APIs, databases, and microservices. We build reliable, auto-scaling architectures using ECS, RDS, and CloudFront to handle high-traffic sales events without breakages.',
        usecase: 'Fault-tolerant multi-zone cloud infrastructure deployment.'
      },
      graphql: {
        name: 'GraphQL API',
        icon: '🕸️',
        desc: 'We leverage GraphQL to query complex Shopify product catalogs, customer data graphs, and store resources with maximum speed, requesting only the exact fields required.',
        usecase: 'Headless storefront data loading and efficient third-party syncing.'
      }
    };

    techCards.forEach(card => {
      card.addEventListener('click', () => {
        // Toggle active class
        techCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        // Retrieve data
        const techId = card.getAttribute('data-tech');
        const data = techData[techId];

        if (data) {
          // Update details panel
          detailsPanel.innerHTML = `
            <div class="tech-details-header">
              <div class="tech-details-icon">${data.icon}</div>
              <h4 class="tech-details-title">${data.name}</h4>
            </div>
            <p class="tech-details-description">${data.desc}</p>
            <div class="tech-details-usecase">
              <h5>Primary Application</h5>
              <p>${data.usecase}</p>
            </div>
          `;
        }
      });
    });
  }

  // 6. Case Studies Interactive Filtering (work.html)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length > 0 && portfolioItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle button active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          const categories = item.getAttribute('data-category').split(' ');
          if (filterValue === 'all' || categories.includes(filterValue)) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // 7. Step-by-Step Contact Form (contact.html)
  const contactForm = document.getElementById('project-intake-form');
  const formStages = document.querySelectorAll('.contact-form-stage');
  const stepIndicators = document.querySelectorAll('.step-indicator-bar');
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  const budgetSlider = document.getElementById('project-budget');
  const budgetValue = document.getElementById('budget-value');
  const selectorOptions = document.querySelectorAll('.selector-option');
  const selectedServiceInput = document.getElementById('selected-service');

  if (contactForm && formStages.length > 0) {
    let currentStageIndex = 0;

    // Budget slider updater
    if (budgetSlider && budgetValue) {
      budgetSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        if (val === 5000) {
          budgetValue.textContent = '$5,000+';
        } else if (val === 25000) {
          budgetValue.textContent = '$25,000+';
        } else {
          budgetValue.textContent = `$${val.toLocaleString()}`;
        }
      });
    }

    // Grid selector click handler
    selectorOptions.forEach(option => {
      option.addEventListener('click', () => {
        selectorOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        if (selectedServiceInput) {
          selectedServiceInput.value = option.getAttribute('data-value');
        }
      });
    });

    function updateFormStage() {
      // Toggle stages
      formStages.forEach((stage, idx) => {
        if (idx === currentStageIndex) {
          stage.classList.add('active');
        } else {
          stage.classList.remove('active');
        }
      });

      // Update indicators
      stepIndicators.forEach((ind, idx) => {
        if (idx <= currentStageIndex) {
          ind.classList.add('active');
        } else {
          ind.classList.remove('active');
        }
      });

      // Update buttons
      if (currentStageIndex === 0) {
        prevBtn.style.display = 'none';
      } else {
        prevBtn.style.display = 'inline-flex';
      }

      if (currentStageIndex === formStages.length - 1) {
        nextBtn.textContent = 'Submit Proposal';
        nextBtn.classList.remove('btn-secondary');
        nextBtn.classList.add('btn-primary');
      } else {
        nextBtn.textContent = 'Continue →';
        nextBtn.classList.remove('btn-primary');
        nextBtn.classList.add('btn-secondary');
      }
    }

    // Initialize state
    updateFormStage();

    nextBtn.addEventListener('click', (e) => {
      if (currentStageIndex < formStages.length - 1) {
        // Validate current stage simple validation
        const currentStage = formStages[currentStageIndex];
        const inputs = currentStage.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
          if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ef4444';
            input.addEventListener('input', () => {
              input.style.borderColor = '';
            }, { once: true });
          }
        });

        if (!isValid) return;

        currentStageIndex++;
        updateFormStage();
      } else {
        // Submit button reached - intercept
        e.preventDefault();

        // Animate submission
        nextBtn.disabled = true;
        nextBtn.textContent = 'Sending...';

        setTimeout(() => {
          // Render success state
          const panel = document.querySelector('.contact-form-panel');
          panel.innerHTML = `
            <div class="form-success-state">
              <div class="success-icon">✓</div>
              <h3>Proposal Received!</h3>
              <p style="color: var(--text-muted); margin-bottom: 24px;">Thank you for reaching out. We will review your systems requirements and contact you within 24 hours to schedule a deep dive.</p>
              <a href="index.html" class="btn btn-primary">Return Home</a>
            </div>
          `;
        }, 1500);
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentStageIndex > 0) {
        currentStageIndex--;
        updateFormStage();
      }
    });
  }

  // ==========================================================================
  // INTERACTIVE DOTS CANVAS BACKGROUND (Apple x Stripe Particle System)
  // ==========================================================================
  const hero = document.querySelector('.hero');
  if (hero) {
    const canvas = document.createElement('canvas');
    canvas.id = 'dots-canvas';
    hero.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let width = canvas.width = hero.offsetWidth;
    let height = canvas.height = hero.offsetHeight;
    
    window.addEventListener('resize', () => {
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    });
    
    // Google Antigravity & Stripe Vibrant Mesh Inspired Colors
    const colors = [
      'rgba(0, 210, 255, 0.45)',  /* Laser Cyan */
      'rgba(99, 91, 255, 0.5)',   /* Stripe Purple */
      'rgba(255, 91, 153, 0.45)', /* Radiant Pink */
      'rgba(255, 159, 10, 0.45)', /* Apple Orange */
      'rgba(0, 102, 204, 0.45)'   /* Apple Blue */
    ];
    
    const particles = [];
    const particleCount = 140;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.008 + 0.004,
        amplitude: Math.random() * 25 + 10,
        baseY: Math.random() * height
      });
    }
    
    let mouse = { x: null, y: null, radius: 95 };
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    
    hero.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
    
    function animate() {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        p.angle += p.speed;
        p.x += p.vx;
        // Gravity wave motion
        p.y = p.baseY + Math.sin(p.angle) * p.amplitude;
        
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        
        // Mouse push-back/Drift away effect
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle) * force * 2.5;
            p.y += Math.sin(angle) * force * 2.5;
            p.baseY += Math.sin(angle) * force * 1.5;
          }
        }
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Soft network connection lines between nearby dots (Stripe mesh effect)
        particles.forEach(p2 => {
          if (p === p2) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.04 * (1 - dist / 60)})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ==========================================================================
  // INBUILT AI CHATBOT WIDGET (Dynamic injection and responses)
  // ==========================================================================
  const chatWidget = document.createElement('div');
  chatWidget.className = 'chat-widget';
  chatWidget.innerHTML = `
    <button class="chat-launcher" id="chat-launcher" aria-label="Open AI Assistant">💬</button>
    <div class="chat-window" id="chat-window">
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-bot-avatar">🤖</div>
          <div class="chat-bot-meta">
            <h4>LibertyStack AI</h4>
            <div class="chat-bot-status">Online</div>
          </div>
        </div>
        <button class="chat-close-btn" id="chat-close-btn" aria-label="Close Chat">✕</button>
      </div>
      <div class="chat-body" id="chat-body">
        <div class="chat-message bot">
          Hi! I'm the LibertyStack Assistant. Ask me anything about our pricing, team, timeline parameters, or contract negotiations!
          <div class="chat-message-time">Just now</div>
        </div>
      </div>
      <div class="chat-bot-typing" id="chat-bot-typing">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
      <div class="chat-chips">
        <span class="chat-chip" data-question="pricing">What is your pricing?</span>
        <span class="chat-chip" data-question="team">Who is on the team?</span>
        <span class="chat-chip" data-question="contract">How long do projects take?</span>
        <span class="chat-chip" data-question="negotiation">Can we negotiate terms?</span>
      </div>
      <div class="chat-input-area">
        <input type="text" class="chat-input" id="chat-input" placeholder="Type your question..." aria-label="Message text field">
        <button class="chat-send-btn" id="chat-send-btn">Send</button>
      </div>
    </div>
  `;
  document.body.appendChild(chatWidget);

  const chatLauncher = document.getElementById('chat-launcher');
  const chatWindow = document.getElementById('chat-window');
  const chatCloseBtn = document.getElementById('chat-close-btn');
  const chatBody = document.getElementById('chat-body');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const typingIndicator = document.getElementById('chat-bot-typing');
  const chatChips = document.querySelectorAll('.chat-chip');

  // Toggle chat window visibility
  chatLauncher.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
      chatInput.focus();
    }
  });

  chatCloseBtn.addEventListener('click', () => {
    chatWindow.classList.remove('active');
  });

  // Scroll body helper
  function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Pre-programmed AI Knowledge Base
  const aiResponses = {
    pricing: "Our custom Shopify storefront redesigns start at $5,000. Custom python database automations start at $4,000, and backend APIs or custom ERP integrations start at $3,500. We always map the scope of work first to provide a clear, transparent fixed-price estimate.",
    team: "LibertyStack Solutions is led by Ishant Kumar Sharma, Technical Lead & Systems Architect, who is based in Hazaribagh, Jharkhand, India. We collaborate remotely with a network of skilled developers to build high-performance e-commerce integrations.",
    contract: "Typical development and automation projects take between 4 to 8 weeks. Every project has transparent milestones: Discovery & Scoping, Database Architecture Mapping, Sandbox Sandbox testing, and Deployment to Shopify/AWS.",
    negotiation: "Yes, we are very open to negotiating contract parameters! Standard terms are 50% deposit and 50% upon deployment, but we are happy to divide payments across specific project milestones or adjust the feature scope to fit your budget limits.",
    hello: "Hello! How can I help you today? Feel free to ask about our pricing, team profile, contract timelines, or payment negotiation options!",
    fallback: "I'm not sure I fully understood. Could you ask specifically about our pricing, the engineering team, project schedules, payment negotiations, or development stack? You can also email us directly at hello@libertystack.co.in."
  };

  function simulateBotResponse(queryKey) {
    typingIndicator.style.display = 'flex';
    scrollToBottom();

    setTimeout(() => {
      typingIndicator.style.display = 'none';
      
      const messageDiv = document.createElement('div');
      messageDiv.className = 'chat-message bot';
      
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const responseText = aiResponses[queryKey] || aiResponses.fallback;
      
      messageDiv.innerHTML = `
        ${responseText}
        <div class="chat-message-time">${time}</div>
      `;
      
      chatBody.appendChild(messageDiv);
      scrollToBottom();
    }, 1200);
  }

  function handleUserMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Append User Message
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'chat-message user';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    userMsgDiv.innerHTML = `
      ${text}
      <div class="chat-message-time" style="color: rgba(255,255,255,0.6);">${time}</div>
    `;
    chatBody.appendChild(userMsgDiv);
    chatInput.value = '';
    scrollToBottom();

    // Parse keywords for smart matching
    const query = text.toLowerCase();
    let matchedKey = '';

    if (query.includes('price') || query.includes('cost') || query.includes('charge') || query.includes('fee') || query.includes('how much')) {
      matchedKey = 'pricing';
    } else if (query.includes('team') || query.includes('who') || query.includes('ishant') || query.includes('founder') || query.includes('people')) {
      matchedKey = 'team';
    } else if (query.includes('contract') || query.includes('time') || query.includes('duration') || query.includes('how long') || query.includes('schedule')) {
      matchedKey = 'contract';
    } else if (query.includes('negotiat') || query.includes('budget') || query.includes('terms') || query.includes('discount')) {
      matchedKey = 'negotiation';
    } else if (query.includes('hi') || query.includes('hello') || query.includes('hey') || query.includes('greetings')) {
      matchedKey = 'hello';
    }

    simulateBotResponse(matchedKey);
  }

  chatSendBtn.addEventListener('click', handleUserMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleUserMessage();
    }
  });

  // Handle Quick Chip Clicks
  chatChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const question = chip.getAttribute('data-question');
      
      // Append User message representing the chip click
      const userMsgDiv = document.createElement('div');
      userMsgDiv.className = 'chat-message user';
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      userMsgDiv.innerHTML = `
        ${chip.textContent}
        <div class="chat-message-time" style="color: rgba(255,255,255,0.6);">${time}</div>
      `;
      chatBody.appendChild(userMsgDiv);
      scrollToBottom();

      simulateBotResponse(question);
    });
  });
});

