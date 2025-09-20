// Simple SPA state and UI logic
(function () {
  const STATE_KEY = 'alumverse_state_v1';

  const defaultState = {
    user: null, // { role, email, level, follows:[], connections:[] }
    meetingRequests: [
      {
        id: 'm1',
        from: 'neha@srmist.edu.in',
        to: 'a1',
        topic: 'Career Guidance Session',
        purpose: 'Seeking advice on software engineering career path',
        time: '2024-03-20T14:00:00',
        status: 'Pending'
      },
      {
        id: 'm2',
        from: 'arjun@srmist.edu.in',
        to: 'a2',
        topic: 'Product Management Discussion',
        purpose: 'Want to learn about PM role and responsibilities',
        time: '2024-03-22T16:30:00',
        status: 'Accepted'
      }
    ],
    pitches: [...MOCK.pitches],
    events: [...MOCK.events],
    feedPosts: [], // { id, title, content, category, author, timestamp }
    projectRequests: [], // { id, student, alumni, project, status }
  };

  const loadState = () => {
    try { return JSON.parse(localStorage.getItem(STATE_KEY)) || structuredClone(defaultState); }
    catch { return structuredClone(defaultState); }
  };
  const saveState = (s) => localStorage.setItem(STATE_KEY, JSON.stringify(s));

  let state = loadState();

  // Elements
  const viewLogin = document.getElementById('view-login');
  const viewApp = document.getElementById('view-app');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const userRoleEl = document.getElementById('user-role');
  const roleChips = document.querySelectorAll('.role-switch .chip');

  // Tabs
  const tabsNav = document.querySelectorAll('.tabs .tab');
  const tabViews = {
    directory: document.getElementById('tab-directory'),
    profiles: document.getElementById('tab-profiles'),
    meetings: document.getElementById('tab-meetings'),
    collab: document.getElementById('tab-collab'),
    levels: document.getElementById('tab-levels'),
    events: document.getElementById('tab-events'),
    feed: document.getElementById('tab-feed'),
    monitoring: document.getElementById('tab-monitoring'),
    analytics: document.getElementById('tab-analytics'),
  };

  // Real Google Sign-In functionality
  let selectedRole = 'student'; // This will be set by role selection
  
  // Real Google Sign-In callback function
  function handleCredentialResponse(response) {
    try {
      // Decode the JWT token to get user information
      const responsePayload = decodeJwtResponse(response.credential);
      
      console.log('Google Sign-In Response:', responsePayload);
      
      // Extract user information from Google
      const googleUser = {
        email: responsePayload.email,
        name: responsePayload.name,
        picture: responsePayload.picture,
        googleId: responsePayload.sub,
        emailVerified: responsePayload.email_verified,
        role: selectedRole // Use the selected role from the form
      };
      
      // Validate email for the selected role
      if (!validateEmailForRole(googleUser.email, selectedRole)) {
        let errorMessage = '';
        switch(selectedRole) {
          case 'alumni':
            errorMessage = 'Only shreya@gmail.com and lakshmi@gmail.com are allowed for Alumni';
            break;
          case 'committee':
            errorMessage = 'Only QWIK@gmail.com is allowed for Committee';
            break;
          case 'faculty':
            errorMessage = 'Only logesh@srmist.edu.in is allowed for Faculty';
            break;
          default:
            errorMessage = 'Invalid email for this role';
        }
        toast(errorMessage, 'error');
        return;
      }
      
      // Set user data in state
      state.user = {
        role: selectedRole,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        googleId: googleUser.googleId,
        emailVerified: googleUser.emailVerified,
        level: selectedRole === 'student' ? 3 : 5,
        follows: [],
        connections: [],
        authMethod: 'google',
        loginTime: new Date().toISOString()
      };
      
      // Save state and render app
      saveState(state);
      renderApp();
      
      // Show success message
      toast(`Welcome ${googleUser.name}! Successfully signed in with Google`);
      
      // Optional: Send user data to your server for validation/storage
      // sendUserDataToServer(googleUser);
      
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      toast('Google Sign-In failed. Please try again.', 'error');
    }
  }
  
  // Helper function to decode JWT token
  function decodeJwtResponse(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('JWT Decode Error:', error);
      throw new Error('Failed to decode Google token');
    }
  }
  
  // Initialize Google Sign-In when page loads
  function initializeGoogleSignIn() {
    if (typeof google !== 'undefined' && google.accounts) {
      // Check if we have a real client ID
      const clientId = '916167801744-fl2gc6cpeu9tsreh2n3tha6bqbc0uij7.apps.googleusercontent.com';
      
      if (clientId === 'YOUR_CLIENT_ID_HERE') {
        console.warn('⚠️ Google Sign-In not configured. Please set up your Client ID.');
        console.log('📖 Follow the guide in FIX_400_ERROR.md to set up Google Sign-In');
        
        // Hide the Google Sign-In button until configured
        const googleSigninSection = document.querySelector('.google-signin-section');
        if (googleSigninSection) {
          googleSigninSection.innerHTML = `
            <div class="divider">
              <span>or</span>
            </div>
            <div style="text-align: center; padding: 16px; background: rgba(255,255,255,0.1); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.3);">
              <p style="color: #e5e7eb; margin: 0 0 8px 0; font-size: 14px;">🔧 Google Sign-In Setup Required</p>
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">Follow FIX_400_ERROR.md to configure</p>
            </div>
          `;
        }
        return;
      }
      
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });
      
      console.log('✅ Google Sign-In initialized successfully');
    } else {
      console.error('❌ Google Sign-In API not loaded');
    }
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Google API to load
    setTimeout(initializeGoogleSignIn, 1000);
  });

  // NFC Login Simulation
  const nfcLoginBtn = document.getElementById('nfc-login-btn');
  const nfcTapArea = document.getElementById('nfc-tap-area');

  // Mock NFC ID cards data
  const nfcCards = {
    'student': {
      id: 'SRM2024001',
      name: 'Alex Kumar',
      email: 'alex.kumar@srmist.edu.in',
      role: 'student',
      batch: '2024',
      branch: 'CSE',
      pin: '1234'
    },
    'alumni': {
      id: 'SRM2018001',
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      role: 'alumni',
      batch: '2018',
      branch: 'ECE',
      pin: '5678'
    },
    'committee': {
      id: 'SRM2020001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@srmist.edu.in',
      role: 'committee',
      batch: '2020',
      branch: 'ME',
      pin: '9999'
    },
    'faculty': {
      id: 'SRM2021001',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@srmist.edu.in',
      role: 'faculty',
      department: 'Computer Science',
      pin: '2024'
    }
  };

  // NFC Login function
  function simulateNFCLogin() {
    console.log('NFC Login started - Tap area found:', !!nfcTapArea);
    
    // Show scanning animation
    nfcTapArea.classList.add('scanning');
    
    // Disable button during scanning
    nfcLoginBtn.disabled = true;
    nfcLoginBtn.innerHTML = `
      <span class="btn-icon">📡</span>
      Scanning...
    `;

    // Simulate scanning delay
    setTimeout(() => {
      // Remove scanning animation
      nfcTapArea.classList.remove('scanning');
      
      // Show role selection for NFC
      showNFCRoleSelection();
    }, 2000);
  }

  // Show role selection for NFC login
  function showNFCRoleSelection() {
    const roleModal = document.createElement('div');
    roleModal.className = 'modal-overlay';
    roleModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>🔍 NFC Card Detected</h3>
          <p>Select your role to continue</p>
        </div>
        <div class="modal-body">
          <div class="role-selection">
            <button class="role-btn" data-role="student">
              <span class="role-icon">🎓</span>
              <span class="role-name">Student</span>
              <span class="role-desc">SRM Student</span>
            </button>
            <button class="role-btn" data-role="alumni">
              <span class="role-icon">👨‍🎓</span>
              <span class="role-name">Alumni</span>
              <span class="role-desc">SRM Graduate</span>
            </button>
            <button class="role-btn" data-role="committee">
              <span class="role-icon">👥</span>
              <span class="role-name">Committee</span>
              <span class="role-desc">Event Committee</span>
            </button>
            <button class="role-btn" data-role="faculty">
              <span class="role-icon">👨‍🏫</span>
              <span class="role-name">Faculty</span>
              <span class="role-desc">SRM Faculty</span>
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(roleModal);
    
    // Add event listeners to role buttons
    roleModal.querySelectorAll('.role-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedRole = btn.dataset.role;
        roleModal.remove();
        startTwoStepVerification(selectedRole);
      });
    });
  }

  // 2-Step Verification Process
  function startTwoStepVerification(role) {
    const cardData = nfcCards[role];
    
    const verificationModal = document.createElement('div');
    verificationModal.className = 'modal-overlay';
    verificationModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>🔐 2-Step Verification</h3>
          <p>Complete verification to access your account</p>
        </div>
        <div class="modal-body">
          <div class="verification-steps">
            <div class="step-item completed">
              <div class="step-icon">✅</div>
              <div class="step-content">
                <h4>NFC Card Verified</h4>
                <p>Card ID: ${cardData.id}</p>
                <p>Name: ${cardData.name}</p>
              </div>
            </div>
            
            <div class="step-item active">
              <div class="step-icon">🔑</div>
              <div class="step-content">
                <h4>Biometric Verification</h4>
                <p>Place your finger on the sensor</p>
                <div class="biometric-sensor">
                  <div class="sensor-light"></div>
                  <div class="sensor-text">Touch Here</div>
                </div>
              </div>
            </div>
            
            <div class="step-item pending">
              <div class="step-icon">⏳</div>
              <div class="step-content">
                <h4>PIN Verification</h4>
                <p>Enter your 4-digit PIN: <strong>${cardData.pin}</strong></p>
                <div class="pin-input">
                  <input type="password" maxlength="4" placeholder="••••" class="pin-field" id="pin-input">
                </div>
                <div class="pin-hint">Demo PIN: ${cardData.pin}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" id="complete-login-btn" onclick="completeVerification('${role}')">Complete Login</button>
          <button class="btn btn-ghost" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(verificationModal);
    
    // Simulate biometric verification
    setTimeout(() => {
      const biometricStep = verificationModal.querySelector('.step-item.active');
      biometricStep.classList.remove('active');
      biometricStep.classList.add('completed');
      biometricStep.querySelector('.step-icon').textContent = '✅';
      
      const pinStep = verificationModal.querySelector('.step-item.pending');
      pinStep.classList.remove('pending');
      pinStep.classList.add('active');
      
      // Add PIN validation
      const pinInput = document.getElementById('pin-input');
      const completeBtn = document.getElementById('complete-login-btn');
      
      if (pinInput && completeBtn) {
        pinInput.addEventListener('input', function() {
          const enteredPin = this.value;
          const isValidPin = enteredPin === cardData.pin;
          
          if (isValidPin) {
            this.style.borderColor = '#10b981';
            this.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            completeBtn.disabled = false;
            completeBtn.style.opacity = '1';
            completeBtn.style.cursor = 'pointer';
          } else {
            this.style.borderColor = '#ef4444';
            this.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            completeBtn.disabled = true;
            completeBtn.style.opacity = '0.5';
            completeBtn.style.cursor = 'not-allowed';
          }
        });
        
        // Initially disable the button
        completeBtn.disabled = true;
        completeBtn.style.opacity = '0.5';
        completeBtn.style.cursor = 'not-allowed';
      }
    }, 3000);
  }

  // Complete verification and login
  function completeVerification(role) {
    console.log('Complete verification called for role:', role);
    const cardData = nfcCards[role];
    console.log('Card data:', cardData);
    
    // Set user data
    state.user = {
      role: role,
      email: cardData.email,
      name: cardData.name,
      level: role === 'student' ? 3 : 5,
      follows: [],
      connections: [],
      authMethod: 'nfc',
      nfcId: cardData.id
    };
    
    console.log('User state set:', state.user);
    
    // Save state and render app
    saveState(state);
    console.log('State saved, calling renderApp...');
    renderApp();
    console.log('renderApp completed');
    
    // Show success message
    toast(`Welcome ${cardData.name}! NFC login successful`, 'success');
    
    // Remove any open modals
    const modals = document.querySelectorAll('.modal-overlay');
    console.log('Found modals to remove:', modals.length);
    modals.forEach(modal => {
      console.log('Removing modal:', modal);
      modal.remove();
    });
    
    // Reset NFC button
    nfcLoginBtn.disabled = false;
    nfcLoginBtn.innerHTML = `
      <span class="btn-icon">📱</span>
      Simulate NFC Tap
    `;
    
    console.log('NFC login process completed');
  }

  // Add event listener for NFC login button
  nfcLoginBtn.addEventListener('click', simulateNFCLogin);

  // Login flow
  roleChips.forEach(ch => ch.addEventListener('click', () => {
    roleChips.forEach(x => x.classList.remove('chip-active'));
    ch.classList.add('chip-active');
    selectedRole = ch.dataset.role;
  }));

  // Role-specific email validation
  function validateEmailForRole(email, role) {
    const emailLower = email.toLowerCase();
    
    switch(role) {
      case 'student':
        // Any email works for students
        return true;
      
      case 'alumni':
        // Only specific emails work for alumni
        return emailLower === 'shreya@gmail.com' || emailLower === 'lakshmi@gmail.com';
      
      case 'committee':
        // Only QWIK@gmail.com works for committee
        return emailLower === 'qwik@gmail.com';
      
      case 'faculty':
        // Only logesh@srmist.edu.in works for faculty
        return emailLower === 'logesh@srmist.edu.in';
      
      default:
        return false;
    }
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!email) {
      toast('Please enter an email address', 'error');
      return;
    }
    
    if (!password) {
      toast('Please enter a password', 'error');
      return;
    }
    
    // Validate email for the selected role
    if (!validateEmailForRole(email, selectedRole)) {
      let errorMessage = '';
      switch(selectedRole) {
        case 'alumni':
          errorMessage = 'Only shreya@gmail.com and lakshmi@gmail.com are allowed for Alumni';
          break;
        case 'committee':
          errorMessage = 'Only QWIK@gmail.com is allowed for Committee';
          break;
        case 'faculty':
          errorMessage = 'Only logesh@srmist.edu.in is allowed for Faculty';
          break;
        default:
          errorMessage = 'Invalid email for this role';
      }
      toast(errorMessage, 'error');
      return;
    }
    
    // Login successful
    state.user = { 
      role: selectedRole, 
      email, 
      level: selectedRole === 'student' ? 3 : 5, 
      follows: [], 
      connections: [],
      authMethod: 'email'
    };
    saveState(state);
    renderApp();
    toast(`Welcome ${email}! Successfully logged in as ${selectedRole}`);
  });

  logoutBtn.addEventListener('click', () => {
    if (confirm('Do you want to exit?')) {
      state = structuredClone(defaultState);
      saveState(state);
      renderApp();
    }
  });

  function renderApp() {
    console.log('renderApp called, state.user:', state.user);
    const isAuthed = !!state.user;
    console.log('isAuthed:', isAuthed);
    
    viewLogin.classList.toggle('hidden', isAuthed);
    viewApp.classList.toggle('hidden', !isAuthed);
    console.log('Login view hidden:', viewLogin.classList.contains('hidden'));
    console.log('App view hidden:', viewApp.classList.contains('hidden'));
    
    if (!isAuthed) {
      console.log('Not authenticated, returning early');
      return;
    }

    console.log('User authenticated, proceeding with app rendering...');

    // Role badge
    userRoleEl.textContent = `${capitalize(state.user.role)} · L${state.user.level}`;
    
    // Show user name and picture if available (from Google Sign-In)
    if (state.user.name && state.user.picture) {
      const userInfo = document.createElement('div');
      userInfo.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-right: 12px;';
      userInfo.innerHTML = `
        <img src="${state.user.picture}" alt="${state.user.name}" style="width: 24px; height: 24px; border-radius: 50%;">
        <span style="font-size: 14px; color: #e5e7eb;">${state.user.name}</span>
      `;
      userRoleEl.parentNode.insertBefore(userInfo, userRoleEl);
    }

    // Role-based visibility
    document.querySelectorAll('.committee-only').forEach(el => el.classList.toggle('hidden', state.user.role !== 'committee'));
    document.querySelectorAll('.alumni-only').forEach(el => el.classList.toggle('hidden', state.user.role !== 'alumni'));
    document.querySelectorAll('.faculty-only').forEach(el => el.classList.toggle('hidden', state.user.role !== 'faculty'));
    document.querySelectorAll('.student-only').forEach(el => el.classList.toggle('hidden', state.user.role !== 'student'));
    document.querySelectorAll('.alumni-hidden').forEach(el => el.classList.toggle('hidden', state.user.role === 'alumni'));
    document.querySelectorAll('.committee-hidden').forEach(el => el.classList.toggle('hidden', state.user.role === 'committee'));
    
    // Add role class to body for CSS targeting
    document.body.className = document.body.className.replace(/role-\w+/g, '');
    document.body.classList.add(`role-${state.user.role}`);

    // Set initial tab based on role
    let initialTab = (location.hash.replace('#', '') || 'directory');
    if (state.user.role === 'faculty') {
      initialTab = 'monitoring';
    } else if (state.user.role === 'alumni') {
      initialTab = 'profiles'; // Alumni don't have directory, so start with profiles
    } else if (state.user.role === 'committee') {
      initialTab = 'events'; // Committee starts with events
    }
    activateTab(initialTab);
    renderDirectory();
    renderProfiles();
    renderMeetings();
    renderCollab();
    renderLevels();
    renderEvents();
    renderFeed();
    renderMonitoring();
    renderAnalytics();
  }

  // Tab activation
  tabsNav.forEach(btn => btn.addEventListener('click', () => {
    activateTab(btn.dataset.tab);
  }));
  window.addEventListener('hashchange', () => {
    const tab = location.hash.replace('#', '');
    if (tab && tabViews[tab]) activateTab(tab);
  });

  function activateTab(tab) {
    Object.entries(tabViews).forEach(([key, el]) => el.classList.toggle('hidden', key !== tab));
    tabsNav.forEach(b => b.classList.toggle('tab-active', b.dataset.tab === tab));
    location.hash = tab;
  }

  // Directory
  const dirSearch = document.getElementById('dir-search');
  const dirBatch = document.getElementById('dir-batch');
  const dirLocation = document.getElementById('dir-location');
  const dirGender = document.getElementById('dir-gender');
  const dirResults = document.getElementById('dir-results');

  function renderDirectory() {
    // Update header and filters based on user role
    const cardHeader = document.querySelector('#tab-directory .card-header');
    const filtersContainer = document.querySelector('#tab-directory .filters');
    
    if (state.user.role === 'alumni') {
      cardHeader.innerHTML = `
        <h2>SRM Events & Functions</h2>
        <p>Discover upcoming events, workshops, and programs happening at SRM IST.</p>
      `;
      // Hide filters for alumni
      filtersContainer.style.display = 'none';
    } else {
      cardHeader.innerHTML = `
        <h2>Smart Alumni Directory</h2>
        <p>Search alumni by skills, company, batch, position, location, or gender.</p>
      `;
      // Show filters for students
      filtersContainer.style.display = 'grid';
      // Populate filters
      fillSelect(dirBatch, ['', ...new Set(MOCK.alumni.map(a => String(a.batch)))], 'Batch');
      fillSelect(dirLocation, ['', ...new Set(MOCK.alumni.map(a => a.location))], 'Location');
    }

    const apply = () => {
      if (state.user.role === 'alumni') {
        // For alumni, show SRM events directly without filtering
        const srmEvents = [
          {
            id: 'e1',
            title: 'SRM Tech Fest 2024',
            date: '2024-03-15',
            description: 'Annual technology festival showcasing innovation and creativity',
            type: 'Tech Festival',
            location: 'SRM IST Campus'
          },
          {
            id: 'e2', 
            title: 'Alumni Meet 2024',
            date: '2024-04-20',
            description: 'Annual alumni reunion and networking event',
            type: 'Networking',
            location: 'SRM IST Campus'
          },
          {
            id: 'e3',
            title: 'Career Guidance Workshop',
            date: '2024-05-10',
            description: 'Workshop on career planning and industry insights',
            type: 'Workshop',
            location: 'Online'
          },
          {
            id: 'e4',
            title: 'Startup Incubation Program',
            date: '2024-06-01',
            description: 'Supporting student entrepreneurs with mentorship and funding',
            type: 'Program',
            location: 'SRM Innovation Center'
          },
          {
            id: 'e5',
            title: 'Research Symposium',
            date: '2024-07-15',
            description: 'Showcasing cutting-edge research and academic achievements',
            type: 'Academic',
            location: 'SRM IST Campus'
          }
        ];

        dirResults.innerHTML = srmEvents.map(event => `
          <div class="event-card">
            <h4>${event.title}</h4>
            <div class="meta">${event.type} · ${event.date} · ${event.location}</div>
            <p>${event.description}</p>
            <div style="display:flex; gap:8px; margin-top:8px;">
              <button class="btn btn-primary" data-act="register" data-id="${event.id}">Register</button>
              <button class="btn btn-ghost" data-act="details" data-id="${event.id}">More Details</button>
            </div>
          </div>
        `).join('');
      } else {
        // For students, use filters to show alumni directory
        const q = dirSearch.value.trim().toLowerCase();
        const b = dirBatch.value;
        const l = dirLocation.value;
        const g = dirGender.value;
        const isStudent = state.user.role === 'student';
        const canFollow = state.user.level >= 2;
        const canConnect = state.user.level >= 3;
        const canLor = state.user.level >= 4;

        // Students see alumni directory
        const list = MOCK.alumni.filter(a => (
          (!b || String(a.batch) === b) &&
          (!l || a.location === l) &&
          (!g || a.gender === g) &&
          (!q || [a.name, a.company, a.position, a.location, a.skills.join(' ')].join(' ').toLowerCase().includes(q))
        ));

        dirResults.innerHTML = list.map(a => `
          <div class="alumni-card">
            <h4>${a.name}</h4>
            <div class="meta">${a.position} · ${a.company} · Batch ${a.batch} · ${a.location}</div>
            <div style="margin:8px 0;">
              ${a.skills.map(s => `<span class="tag">${s}</span>`).join('')}
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              ${isStudent && canFollow ? `<button class="btn follow" data-act="follow" data-id="${a.id}">Follow</button>`:''}
              ${isStudent && canConnect ? `<button class="btn connect" data-act="connect" data-id="${a.id}">Connect</button>`:''}
              ${isStudent && canConnect ? `<button class="btn message" data-act="message" data-id="${a.id}">Message</button>`:''}
              ${isStudent && canLor ? `<button class="btn lor" data-act="lor" data-id="${a.id}">Request LOR</button>`:''}
              ${isStudent && canLor ? `<button class="btn mentor" data-act="mentor" data-id="${a.id}">Ask Mentorship</button>`:''}
            </div>
          </div>
        `).join('');
      }

      dirResults.querySelectorAll('button[data-act]').forEach(btn => {
        btn.addEventListener('click', () => handleDirectoryAction(btn.dataset.act, btn.dataset.id));
      });
    };

    [dirSearch, dirBatch, dirLocation, dirGender].forEach(el => {
      if (state.user.role !== 'alumni') {
        el.addEventListener('input', apply);
      }
    });
    apply();
  }

  function handleDirectoryAction(action, targetId) {
    if (state.user.role === 'student') {
      // Student actions on alumni
      const a = MOCK.alumni.find(x => x.id === targetId);
      if (!a) return;
      if (action === 'follow') {
        if (!state.user.follows.includes(targetId)) state.user.follows.push(targetId);
        toast(`Following ${a.name}`);
      }
      if (action === 'connect') {
        if (!state.user.connections.includes(targetId)) state.user.connections.push(targetId);
        toast(`Connection request sent to ${a.name}`);
      }
      if (action === 'message') {
        toast(`Opened message composer to ${a.name}`);
      }
      if (action === 'lor') {
        toast(`LOR request sent to ${a.name}`);
      }
      if (action === 'mentor') {
        toast(`Mentorship request sent to ${a.name}`);
      }
    } else if (state.user.role === 'alumni') {
      // Alumni actions on SRM events
      if (action === 'register') {
        toast(`Registration successful for event ${targetId}`);
      }
      if (action === 'details') {
        toast(`Opening detailed information for event ${targetId}`);
      }
    }
    saveState(state);
  }

  // Profiles
  const profilesList = document.getElementById('profiles-list');
  const profileEditForm = document.getElementById('profile-edit-form');
  
  function renderProfiles() {
    // Handle profile editing for students
    if (state.user.role === 'student') {
      profileEditForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateStudentProfile();
      }, { once: true });
      
      // Load current student data into form
      loadStudentProfileForm();
    }
    
    // Render profiles list with role-specific actions
    if (state.user.role === 'alumni') {
      // Alumni see student profiles with Connect/Ignore options
      profilesList.innerHTML = MOCK.students.map(s => `
        <div class="profile-card">
          <h4>${s.name} · ${s.branch}</h4>
          <div class="meta">CGPA ${s.cgpa} · Batch ${s.batch}</div>
          <div><strong>Projects:</strong> ${s.projects.join(', ')}</div>
          <div><strong>Internships:</strong> ${s.internships.join(', ')}</div>
          <div><strong>Certifications:</strong> ${s.certifications.join(', ')}</div>
          <div><strong>Achievements:</strong> ${s.achievements.join(', ')}</div>
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;">
            <button class="btn btn-primary" data-act="connect" data-id="${s.id}">Connect</button>
            <button class="btn btn-ghost" data-act="ignore" data-id="${s.id}">Ignore</button>
          </div>
        </div>
      `).join('');
    } else {
      // Students see profiles without action buttons
      profilesList.innerHTML = MOCK.students.map(s => `
        <div class="profile-card">
          <h4>${s.name} · ${s.branch}</h4>
          <div class="meta">CGPA ${s.cgpa} · Batch ${s.batch}</div>
          <div><strong>Projects:</strong> ${s.projects.join(', ')}</div>
          <div><strong>Internships:</strong> ${s.internships.join(', ')}</div>
          <div><strong>Certifications:</strong> ${s.certifications.join(', ')}</div>
          <div><strong>Achievements:</strong> ${s.achievements.join(', ')}</div>
        </div>
      `).join('');
    }
    
    // Add event listeners for profile actions
    profilesList.querySelectorAll('button[data-act]').forEach(btn => {
      btn.addEventListener('click', () => handleProfileAction(btn.dataset.act, btn.dataset.id));
    });
  }

  function loadStudentProfileForm() {
    // Find current student profile (simplified - using first student as example)
    const currentStudent = MOCK.students.find(s => s.email === state.user.email) || MOCK.students[0];
    
    document.getElementById('edit-cgpa').value = currentStudent.cgpa || '';
    document.getElementById('edit-branch').value = currentStudent.branch || '';
    document.getElementById('edit-batch').value = currentStudent.batch || '';
    document.getElementById('edit-projects').value = currentStudent.projects.join(', ') || '';
    document.getElementById('edit-internships').value = currentStudent.internships.join(', ') || '';
    document.getElementById('edit-certifications').value = currentStudent.certifications.join(', ') || '';
    document.getElementById('edit-achievements').value = currentStudent.achievements.join(', ') || '';
    document.getElementById('edit-skills').value = currentStudent.skills ? currentStudent.skills.join(', ') : '';
    document.getElementById('edit-interests').value = currentStudent.interests ? currentStudent.interests.join(', ') : '';
    document.getElementById('edit-linkedin').value = currentStudent.linkedin || '';
    document.getElementById('edit-github').value = currentStudent.github || '';
  }

  function updateStudentProfile() {
    const cgpa = parseFloat(document.getElementById('edit-cgpa').value);
    const branch = document.getElementById('edit-branch').value.trim();
    const batch = parseInt(document.getElementById('edit-batch').value);
    const projects = document.getElementById('edit-projects').value.split(',').map(p => p.trim()).filter(p => p);
    const internships = document.getElementById('edit-internships').value.split(',').map(i => i.trim()).filter(i => i);
    const certifications = document.getElementById('edit-certifications').value.split(',').map(c => c.trim()).filter(c => c);
    const achievements = document.getElementById('edit-achievements').value.split(',').map(a => a.trim()).filter(a => a);
    const skills = document.getElementById('edit-skills').value.split(',').map(s => s.trim()).filter(s => s);
    const interests = document.getElementById('edit-interests').value.split(',').map(i => i.trim()).filter(i => i);
    const linkedin = document.getElementById('edit-linkedin').value.trim();
    const github = document.getElementById('edit-github').value.trim();

    // Find and update student profile
    const studentIndex = MOCK.students.findIndex(s => s.email === state.user.email);
    if (studentIndex !== -1) {
      MOCK.students[studentIndex] = {
        ...MOCK.students[studentIndex],
        cgpa: cgpa || MOCK.students[studentIndex].cgpa,
        branch: branch || MOCK.students[studentIndex].branch,
        batch: batch || MOCK.students[studentIndex].batch,
        projects: projects.length > 0 ? projects : MOCK.students[studentIndex].projects,
        internships: internships.length > 0 ? internships : MOCK.students[studentIndex].internships,
        certifications: certifications.length > 0 ? certifications : MOCK.students[studentIndex].certifications,
        achievements: achievements.length > 0 ? achievements : MOCK.students[studentIndex].achievements,
        skills: skills.length > 0 ? skills : (MOCK.students[studentIndex].skills || []),
        interests: interests.length > 0 ? interests : (MOCK.students[studentIndex].interests || []),
        linkedin: linkedin || MOCK.students[studentIndex].linkedin || '',
        github: github || MOCK.students[studentIndex].github || '',
      };
    }

    toast('Profile updated successfully!');
    renderProfiles(); // Refresh the profiles list
  }

  function handleProfileAction(action, studentId) {
    if (state.user.role === 'alumni') {
      const student = MOCK.students.find(s => s.id === studentId);
      if (!student) return;
      
      if (action === 'connect') {
        // Add to alumni's connections
        if (!state.user.connections.includes(studentId)) {
          state.user.connections.push(studentId);
        }
        toast(`Connection request sent to ${student.name}`);
      } else if (action === 'ignore') {
        // Add to ignored list (could be stored in user state)
        if (!state.user.ignored) state.user.ignored = [];
        if (!state.user.ignored.includes(studentId)) {
          state.user.ignored.push(studentId);
        }
        toast(`Profile ignored`);
      }
      saveState(state);
    }
  }

  // Meetings
  const meetingForm = document.getElementById('meeting-form');
  const meetingAlumni = document.getElementById('meeting-alumni');
  const meetingRequests = document.getElementById('meeting-requests');
  const alumniInbox = document.getElementById('alumni-inbox');
  
  function renderMeetings() {
    // Only show form for students
    if (state.user.role === 'student') {
      fillSelect(meetingAlumni, MOCK.alumni.map(a => ({ value: a.id, label: `${a.name} · ${a.company}` })), 'Choose alumni');
      meetingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!state.user) return;
        const req = {
          id: `m${Date.now()}`,
          from: state.user.email,
          to: meetingAlumni.value,
          topic: document.getElementById('meeting-topic').value,
          purpose: document.getElementById('meeting-purpose').value,
          time: document.getElementById('meeting-time').value,
          status: 'Pending',
        };
        state.meetingRequests.unshift(req);
        saveState(state);
        renderMeetingsLists();
        meetingForm.reset();
        toast('Meeting request sent');
      }, { once: true });
    }
    renderMeetingsLists();
  }

  function renderMeetingsLists() {
    if (state.user.role === 'alumni') {
      // For alumni, show student meeting requests
      const studentRequests = state.meetingRequests.filter(r => r.from && r.from.includes('@srmist.edu.in'));
      alumniInbox.innerHTML = studentRequests.map(r => {
        const student = MOCK.students.find(s => s.email === r.from) || { name: r.from.split('@')[0], branch: 'Unknown', batch: 'Unknown' };
        return `
          <div class="meeting-card">
            <div><strong>${student.name}</strong> · ${student.branch} · Batch ${student.batch}</div>
            <div class="meta">${r.topic} · ${r.purpose} · ${formatDateTime(r.time)}</div>
            <div>Status: ${r.status}</div>
            <div style="display:flex; gap:8px; margin-top:8px;">
              <button class="btn btn-primary" data-see-profile="${r.id}" data-student="${student.name}">See Profile</button>
            </div>
          </div>
        `;
      }).join('');
      
      // Hide the regular meeting requests section for alumni
      meetingRequests.innerHTML = '<p>No outgoing meeting requests as alumni.</p>';
    } else {
      // For students, show their outgoing requests
      const my = state.meetingRequests.filter(r => r.from === state.user.email);
      meetingRequests.innerHTML = my.map(r => `
        <div class="meeting-card">
          <div><strong>${lookupAlumni(r.to).name}</strong> · ${r.topic}</div>
          <div class="meta">${r.purpose} · ${formatDateTime(r.time)}</div>
          <div>Status: ${r.status}</div>
        </div>
      `).join('');
      
      // Hide alumni inbox for students
      alumniInbox.innerHTML = '';
    }

    // Show project requests for alumni
    if (state.user.role === 'alumni') {
      const projectRequests = state.projectRequests.filter(pr => pr.alumni === state.user.email);
      if (projectRequests.length > 0) {
        alumniInbox.innerHTML += `
          <h4 style="margin-top: 20px; color: var(--accent);">Project Collaboration Requests</h4>
          ${projectRequests.map(pr => {
            const student = MOCK.students.find(s => s.id === pr.student);
            return `
              <div class="meeting-card">
                <div><strong>${student ? student.name : 'Unknown Student'}</strong> · ${pr.project}</div>
                <div class="meta">Status: ${pr.status}</div>
                <div style="display:flex; gap:8px; margin-top:8px;">
                  <button class="btn btn-primary" data-accept-project="${pr.id}">Accept</button>
                  <button class="btn btn-ghost" data-decline-project="${pr.id}">Decline</button>
                </div>
              </div>
            `;
          }).join('')}
        `;
      }
    }
    alumniInbox.querySelectorAll('[data-accept]').forEach(b => b.addEventListener('click', () => updateRequest(b.dataset.accept, 'Accepted')));
    alumniInbox.querySelectorAll('[data-decline]').forEach(b => b.addEventListener('click', () => updateRequest(b.dataset.decline, 'Declined')));
    alumniInbox.querySelectorAll('[data-accept-project]').forEach(b => b.addEventListener('click', () => updateProjectRequest(b.dataset.acceptProject, 'Accepted')));
    alumniInbox.querySelectorAll('[data-decline-project]').forEach(b => b.addEventListener('click', () => updateProjectRequest(b.dataset.declineProject, 'Declined')));
    alumniInbox.querySelectorAll('[data-see-profile]').forEach(b => b.addEventListener('click', () => showStudentProfile(b.dataset.seeProfile, b.dataset.student)));
  }

  function updateRequest(id, status) {
    const r = state.meetingRequests.find(x => x.id === id);
    if (r) { r.status = status; saveState(state); renderMeetingsLists(); }
  }

  function updateProjectRequest(id, status) {
    const pr = state.projectRequests.find(x => x.id === id);
    if (pr) { 
      pr.status = status; 
      saveState(state); 
      renderMeetingsLists();
      toast(`Project request ${status.toLowerCase()}`);
    }
  }

  function showStudentProfile(requestId, studentName) {
    const request = state.meetingRequests.find(r => r.id === requestId);
    const student = MOCK.students.find(s => s.name === studentName) || { 
      name: studentName, 
      branch: 'Unknown', 
      batch: 'Unknown', 
      cgpa: 'N/A',
      projects: ['No projects listed'],
      internships: ['No internships listed'],
      certifications: ['No certifications listed'],
      achievements: ['No achievements listed']
    };

    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(0,0,0,0.7); z-index: 1000; display: flex; 
      align-items: center; justify-content: center; padding: 20px;
    `;
    
    modal.innerHTML = `
      <div style="background: var(--surface); border-radius: 18px; padding: 24px; max-width: 500px; width: 100%; max-height: 80vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3>Student Profile</h3>
          <button id="close-modal" style="background: none; border: none; color: #fff; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        
        <div class="profile-card" style="margin-bottom: 16px;">
          <h4>${student.name} · ${student.branch}</h4>
          <div class="meta">CGPA ${student.cgpa} · Batch ${student.batch}</div>
          <div><strong>Projects:</strong> ${student.projects.join(', ')}</div>
          <div><strong>Internships:</strong> ${student.internships.join(', ')}</div>
          <div><strong>Certifications:</strong> ${student.certifications.join(', ')}</div>
          <div><strong>Achievements:</strong> ${student.achievements.join(', ')}</div>
        </div>
        
        <div style="margin-bottom: 16px;">
          <h4>Meeting Request Details</h4>
          <div class="meta">Topic: ${request.topic}</div>
          <div class="meta">Purpose: ${request.purpose}</div>
          <div class="meta">Time: ${formatDateTime(request.time)}</div>
        </div>
        
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button class="btn btn-primary" id="accept-meeting">Accept</button>
          <button class="btn btn-ghost" id="ignore-meeting">Ignore</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    document.getElementById('close-modal').addEventListener('click', () => modal.remove());
    document.getElementById('accept-meeting').addEventListener('click', () => {
      updateRequest(requestId, 'Accepted');
      modal.remove();
      toast(`Meeting request accepted from ${student.name}`);
    });
    document.getElementById('ignore-meeting').addEventListener('click', () => {
      updateRequest(requestId, 'Declined');
      modal.remove();
      toast(`Meeting request declined from ${student.name}`);
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  // Collab
  const pitchForm = document.getElementById('pitch-form');
  const collabFeed = document.getElementById('collab-feed');
  const collabRequests = document.getElementById('collab-requests');
  
  function renderCollab() {
    if (state.user.role === 'student') {
      // Students can create pitches
      pitchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const p = {
          id: `p${Date.now()}`,
          title: document.getElementById('pitch-title').value,
          desc: document.getElementById('pitch-desc').value,
          type: document.getElementById('pitch-type').value,
          by: state.user?.email || 'Anonymous',
        };
        state.pitches.unshift(p);
        saveState(state);
        renderCollabList();
        pitchForm.reset();
        toast('Published');
      }, { once: true });
    } else if (state.user.role === 'alumni') {
      // Alumni see collaboration requests from students
      renderCollabRequests();
    }
    renderCollabList();
  }
  
  function renderCollabRequests() {
    // Show collaboration requests from students to alumni
    const studentRequests = [
      {
        id: 'cr1',
        student: 'Neha Verma',
        studentEmail: 'neha@srmist.edu.in',
        title: 'AI-Powered Learning Platform',
        description: 'Looking for mentorship and technical guidance for developing an AI-powered personalized learning platform for students.',
        type: 'Startup',
        skills: ['Machine Learning', 'Web Development', 'UI/UX'],
        status: 'Pending'
      },
      {
        id: 'cr2',
        student: 'Arjun Kumar',
        studentEmail: 'arjun@srmist.edu.in',
        title: 'IoT Smart Agriculture System',
        description: 'Seeking collaboration on research project involving IoT sensors for smart agriculture monitoring.',
        type: 'Research',
        skills: ['IoT', 'Embedded Systems', 'Data Analysis'],
        status: 'Pending'
      }
    ];
    
    collabRequests.innerHTML = studentRequests.map(req => `
      <div class="pitch-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4>${req.title}</h4>
          <span class="tag">${req.type}</span>
        </div>
        <div class="meta">by ${req.student} · ${req.studentEmail}</div>
        <p>${req.description}</p>
        <div style="margin:8px 0;">
          <strong>Skills Needed:</strong> ${req.skills.map(s => `<span class="tag">${s}</span>`).join('')}
        </div>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <button class="btn btn-primary" data-accept-collab="${req.id}">Accept</button>
          <button class="btn btn-ghost" data-ignore-collab="${req.id}">Ignore</button>
        </div>
      </div>
    `).join('');
    
    // Add event listeners for collaboration actions
    collabRequests.querySelectorAll('[data-accept-collab]').forEach(btn => {
      btn.addEventListener('click', () => handleCollabAction(btn.dataset.acceptCollab, 'Accepted'));
    });
    collabRequests.querySelectorAll('[data-ignore-collab]').forEach(btn => {
      btn.addEventListener('click', () => handleCollabAction(btn.dataset.ignoreCollab, 'Ignored'));
    });
  }
  
  function handleCollabAction(requestId, action) {
    toast(`Collaboration request ${action.toLowerCase()}`);
    // In a real app, you'd update the request status here
  }
  
  function renderCollabList() {
    collabFeed.innerHTML = state.pitches.map(p => `
      <div class="pitch-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4>${p.title}</h4>
          <span class="tag">${p.type}</span>
        </div>
        <div class="meta">by ${p.by}</div>
        <p>${p.desc}</p>
        <div style="display:flex; gap:8px; margin-top:6px;">
          <button class="btn btn-ghost">Apply</button>
          <button class="btn btn-primary">Bookmark</button>
        </div>
      </div>
    `).join('');
  }

  // Events (Committee Dashboard)
  const eventForm = document.getElementById('event-form');
  const eventsList = document.getElementById('events-list');
  const committeeTabBtns = document.querySelectorAll('.committee-tab-btn');
  const committeeSections = document.querySelectorAll('.committee-section');
  
  function renderEvents() {
    // Committee tab navigation
    committeeTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.committeeTab;
        
        // Update button states
        committeeTabBtns.forEach(b => {
          b.classList.remove('btn-primary', 'active');
          b.classList.add('btn-ghost');
        });
        btn.classList.remove('btn-ghost');
        btn.classList.add('btn-primary', 'active');
        
        // Show/hide sections
        committeeSections.forEach(section => {
          section.classList.add('hidden');
        });
        document.getElementById(`committee-${targetTab}`).classList.remove('hidden');
        
        // Re-render committee members when that tab is selected
        if (targetTab === 'members') {
          renderCommitteeMembers();
        }
      });
    });
    
    // Event form submission
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (state.user.role !== 'committee') return toast('Only committees can create events');
      const ev = {
        id: `e${Date.now()}`,
        title: document.getElementById('event-title').value,
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        type: document.getElementById('event-type').value,
        description: document.getElementById('event-description').value,
        location: document.getElementById('event-location').value,
        capacity: parseInt(document.getElementById('event-capacity').value),
        registrations: 0,
        by: state.user.email,
      };
      state.events.unshift(ev);
      saveState(state);
      renderEventsList();
      eventForm.reset();
      toast('Event created successfully');
    }, { once: true });
    
    // Initialize committee dashboard
    renderCommitteeDashboard();
    renderEventsList();
  }
  
  function renderCommitteeDashboard() {
    // Update analytics
    document.getElementById('total-events').textContent = state.events.length;
    document.getElementById('alumni-participation').textContent = state.events.reduce((sum, e) => sum + (e.alumniParticipants || 0), 0);
    document.getElementById('funding-raised').textContent = `₹${state.events.reduce((sum, e) => sum + (e.funding || 0), 0).toLocaleString()}`;
    document.getElementById('student-registrations').textContent = state.events.reduce((sum, e) => sum + (e.registrations || 0), 0);
    
    // Render calendar
    renderEventCalendar();
    
    // Render alumni participation log
    renderAlumniParticipation();
    
    // Render scholarships
    renderScholarships();
    
    // Render announcements
    renderAnnouncements();
    
    // Render pending approvals
    renderPendingApprovals();
    
    // Render committee members
    renderCommitteeMembers();
  }
  
  function renderEventCalendar() {
    const calendarView = document.querySelector('.calendar-view');
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Generate calendar days (simplified version)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    
    // Clear existing calendar days
    const existingDays = calendarView.querySelectorAll('.calendar-day');
    existingDays.forEach(day => day.remove());
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day';
      emptyDay.style.cssText = 'padding: 8px; text-align: center; min-height: 40px;';
      calendarView.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      dayElement.style.cssText = 'padding: 8px; text-align: center; min-height: 40px; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px;';
      dayElement.textContent = day;
      
      // Check if there are events on this day
      const dayEvents = state.events.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate.getDate() === day && eventDate.getMonth() === currentMonth;
      });
      
      if (dayEvents.length > 0) {
        dayElement.style.backgroundColor = 'rgba(34, 197, 94, 0.3)';
        dayElement.title = dayEvents.map(e => e.title).join(', ');
      }
      
      calendarView.appendChild(dayElement);
    }
  }
  
  function renderAlumniParticipation() {
    const participationLog = document.getElementById('alumni-participation');
    const mockParticipation = [
      { alumni: 'Aarav Menon', event: 'Tech Talk 2024', type: 'Speaker', date: '2024-03-15' },
      { alumni: 'Diya Sharma', event: 'Mentorship Program', type: 'Mentor', date: '2024-03-20' },
      { alumni: 'Karthik Iyer', event: 'Hackathon 2024', type: 'Judge', date: '2024-03-25' }
    ];
    
    participationLog.innerHTML = mockParticipation.map(p => `
      <div class="event-card">
        <div><strong>${p.alumni}</strong> · ${p.event}</div>
        <div class="meta">${p.type} · ${formatDateTime(p.date)}</div>
      </div>
    `).join('');
  }
  
  function renderScholarships() {
    const scholarshipsList = document.getElementById('scholarships-list');
    const mockScholarships = [
      { title: 'Merit Scholarship 2024', amount: 50000, deadline: '2024-04-30', applications: 15 },
      { title: 'Research Grant', amount: 100000, deadline: '2024-05-15', applications: 8 }
    ];
    
    scholarshipsList.innerHTML = mockScholarships.map(s => `
      <div class="event-card">
        <div><strong>${s.title}</strong></div>
        <div class="meta">Amount: ₹${s.amount.toLocaleString()} · Deadline: ${formatDateTime(s.deadline)}</div>
        <div class="meta">Applications: ${s.applications}</div>
      </div>
    `).join('');
  }
  
  function renderAnnouncements() {
    const announcementsList = document.getElementById('announcements-list');
    const mockAnnouncements = [
      { title: 'Tech Fest 2024 Registration Open', target: 'All Students', date: '2024-03-10' },
      { title: 'Alumni Meet Invitation', target: 'All Alumni', date: '2024-03-08' }
    ];
    
    announcementsList.innerHTML = mockAnnouncements.map(a => `
      <div class="event-card">
        <div><strong>${a.title}</strong></div>
        <div class="meta">Target: ${a.target} · ${formatDateTime(a.date)}</div>
      </div>
    `).join('');
  }
  
  function renderPendingApprovals() {
    const pendingApprovals = document.getElementById('pending-approvals');
    const mockApprovals = [
      { type: 'Startup Showcase', student: 'Neha Verma', title: 'AI Learning Platform', date: '2024-03-12' },
      { type: 'Alumni Meeting', student: 'Arjun Kumar', alumni: 'Aarav Menon', date: '2024-03-14' }
    ];
    
    pendingApprovals.innerHTML = mockApprovals.map(a => `
      <div class="event-card">
        <div><strong>${a.type}</strong></div>
        <div class="meta">Student: ${a.student} · ${a.title || a.alumni} · ${formatDateTime(a.date)}</div>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <button class="btn btn-primary" onclick="handleApproval('${a.type}', 'approve')">Approve</button>
          <button class="btn btn-ghost" onclick="handleApproval('${a.type}', 'reject')">Reject</button>
        </div>
      </div>
    `).join('');
  }
  
  
  function handleApproval(type, action) {
    toast(`${type} ${action}d successfully`);
    renderPendingApprovals(); // Refresh the list
  }
  
  function renderCommitteeMembers() {
    const mainMembers = document.getElementById('main-members');
    const studentMembers = document.getElementById('student-members');
    
    // Check if elements exist
    if (!mainMembers || !studentMembers) {
      console.log('Committee member elements not found');
      return;
    }
    
    // Main Committee Members
    const mainCommitteeMembers = [
      { name: 'Dr. Seetharam', role: 'Secretary', email: 'seetharam@srmist.edu.in', department: 'Computer Science' },
      { name: 'Dr. Rajesh Kumar', role: 'Chairman', email: 'rajesh@srmist.edu.in', department: 'Electronics' },
      { name: 'Prof. Priya Singh', role: 'Treasurer', email: 'priya@srmist.edu.in', department: 'Mechanical' },
      { name: 'Dr. Amit Verma', role: 'Coordinator', email: 'amit@srmist.edu.in', department: 'Civil' }
    ];
    
    // Student Committee Members
    const studentCommitteeMembers = [
      { name: 'Neha Verma', role: 'Student Secretary', email: 'neha@srmist.edu.in', batch: '2024', branch: 'CSE' },
      { name: 'Arjun Kumar', role: 'Student Treasurer', email: 'arjun@srmist.edu.in', batch: '2024', branch: 'ECE' },
      { name: 'Priya Sharma', role: 'Student Coordinator', email: 'priya@srmist.edu.in', batch: '2025', branch: 'ME' },
      { name: 'Rahul Singh', role: 'Student Member', email: 'rahul@srmist.edu.in', batch: '2025', branch: 'CE' }
    ];
    
    mainMembers.innerHTML = mainCommitteeMembers.map(m => `
      <div class="event-card">
        <div><strong>${m.name}</strong> · ${m.role}</div>
        <div class="meta">${m.email} · ${m.department}</div>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <button class="btn btn-primary" onclick="editMember('${m.email}')">Edit</button>
          <button class="btn btn-ghost" onclick="viewMemberDetails('${m.email}')">View Details</button>
        </div>
      </div>
    `).join('');
    
    studentMembers.innerHTML = studentCommitteeMembers.map(s => `
      <div class="event-card">
        <div><strong>${s.name}</strong> · ${s.role}</div>
        <div class="meta">${s.email} · Batch ${s.batch} · ${s.branch}</div>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <button class="btn btn-primary" onclick="editStudentMember('${s.email}')">Edit</button>
          <button class="btn btn-ghost" onclick="viewStudentDetails('${s.email}')">View Details</button>
          <button class="btn btn-ghost" onclick="removeStudentMember('${s.email}')">Remove</button>
        </div>
      </div>
    `).join('');
    
    console.log('Committee members rendered successfully');
  }
  
  // Make functions globally available
  window.handleApproval = handleApproval;
  window.editMember = (email) => toast(`Edit member: ${email}`);
  window.viewMemberDetails = (email) => toast(`View details: ${email}`);
  window.editStudentMember = (email) => toast(`Edit student member: ${email}`);
  window.viewStudentDetails = (email) => toast(`View student details: ${email}`);
  window.removeStudentMember = (email) => toast(`Remove student member: ${email}`);
  function renderEventsList() {
    eventsList.innerHTML = state.events.map(e => `
      <div class="event-card">
        <h4>${e.title}</h4>
        <div class="meta">${e.date} · ${e.target}</div>
        <div class="meta">by ${e.by}</div>
      </div>
    `).join('');
  }

  // Alumni Feed
  const feedPostForm = document.getElementById('feed-post-form');
  const feedPosts = document.getElementById('feed-posts');
  function renderFeed() {
    feedPostForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (state.user.role !== 'alumni') return toast('Only alumni can post to feed');
      const post = {
        id: `f${Date.now()}`,
        title: document.getElementById('feed-title').value,
        content: document.getElementById('feed-content').value,
        category: document.getElementById('feed-category').value,
        author: state.user.email,
        timestamp: new Date().toISOString(),
      };
      state.feedPosts.unshift(post);
      saveState(state);
      renderFeedList();
      feedPostForm.reset();
      toast('Post published to feed');
    }, { once: true });
    renderFeedList();
  }

  function renderFeedList() {
    feedPosts.innerHTML = state.feedPosts.map(p => `
      <div class="feed-post-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4>${p.title}</h4>
          <span class="tag feed-category">${p.category}</span>
        </div>
        <div class="post-content">${p.content}</div>
        <div class="post-meta">by ${p.author} · ${formatDateTime(p.timestamp)}</div>
      </div>
    `).join('');
  }

  // Faculty Monitoring
  const monitorBatch = document.getElementById('monitor-batch');
  const monitorDepartment = document.getElementById('monitor-department');
  const monitorSearch = document.getElementById('monitor-search');
  const studentMonitoring = document.getElementById('student-monitoring');
  
  function renderMonitoring() {
    // Populate filters
    fillSelect(monitorBatch, ['', ...new Set(MOCK.students.map(s => String(s.batch)))], 'All Batches');
    fillSelect(monitorDepartment, ['', ...new Set(MOCK.students.map(s => s.branch))], 'All Departments');

    const apply = () => {
      const batch = monitorBatch.value;
      const dept = monitorDepartment.value;
      const search = monitorSearch.value.trim().toLowerCase();
      
      const filtered = MOCK.students.filter(s => (
        (!batch || String(s.batch) === batch) &&
        (!dept || s.branch === dept) &&
        (!search || s.name.toLowerCase().includes(search) || s.branch.toLowerCase().includes(search))
      ));

      studentMonitoring.innerHTML = filtered.map(s => {
        const engagement = Math.floor(Math.random() * 100);
        const projects = s.projects.length;
        const internships = s.internships.length;
        const achievements = s.achievements.length;
        
        return `
          <div class="student-monitor-card">
            <h4>${s.name} · ${s.branch}</h4>
            <div class="meta">Batch ${s.batch} · CGPA ${s.cgpa}</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${engagement}%"></div>
            </div>
            <div class="meta">Engagement: ${engagement}%</div>
            <div class="monitoring-stats">
              <div class="stat-item">
                <div class="stat-value">${projects}</div>
                <div class="stat-label">Projects</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${internships}</div>
                <div class="stat-label">Internships</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${achievements}</div>
                <div class="stat-label">Achievements</div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    };

    [monitorBatch, monitorDepartment, monitorSearch].forEach(el => el.addEventListener('input', apply));
    apply();
  }

  // Levels
  function renderLevels() {
    // This function handles the student level system
    // The HTML already contains the level cards with progress bars
    // We can add dynamic updates here if needed
    console.log('Levels section rendered for student');
  }

  // Student Quick Actions
  function requestMentorship() {
    toast('Opening mentorship request form...', 'success');
    // Could open a modal or redirect to meetings section
    activateTab('meetings');
  }

  function findInternships() {
    toast('Searching for internship opportunities...', 'success');
    // Could filter alumni by companies offering internships
    const dirSearch = document.getElementById('dir-search');
    if (dirSearch) {
      dirSearch.value = 'internship';
      dirSearch.dispatchEvent(new Event('input'));
    }
  }

  function connectAlumni() {
    toast('Opening alumni connection tools...', 'success');
    activateTab('profiles');
  }

  function exploreCareers() {
    toast('Exploring career paths...', 'success');
    // Could show career guidance or filter alumni by career paths
    const dirSearch = document.getElementById('dir-search');
    if (dirSearch) {
      dirSearch.value = 'career';
      dirSearch.dispatchEvent(new Event('input'));
    }
  }

  // Analytics
  const analytics = document.getElementById('analytics');
  function renderAnalytics() {
    const followers = state.user?.follows?.length || 0;
    const connections = state.user?.connections?.length || 0;
    const reqs = state.meetingRequests.length;
    const accepted = state.meetingRequests.filter(r => r.status === 'Accepted').length;
    const pitches = state.pitches.length;
    const events = state.events.length;
    const feedPosts = state.feedPosts.length;
    const projectReqs = state.projectRequests.length;

    const kpi = (label, value) => `
      <div class="kpi">
        <div class="value">${value}</div>
        <div class="label">${label}</div>
      </div>`;

    const metrics = [
      kpi('Followers', followers),
      kpi('Connections', connections),
      kpi('Meeting Requests', reqs),
      kpi('Accepted Meetings', accepted),
      kpi('Pitches Published', pitches),
      kpi('Events', events),
    ];

    // Add role-specific metrics
    if (state.user.role === 'alumni') {
      metrics.push(kpi('Feed Posts', feedPosts));
      metrics.push(kpi('Project Requests', projectReqs));
    }
    if (state.user.role === 'faculty') {
      metrics.push(kpi('Students Monitored', MOCK.students.length));
      metrics.push(kpi('Total Alumni', MOCK.alumni.length));
    }

    analytics.innerHTML = metrics.join('');
  }

  // Utils
  function fillSelect(selectEl, items, placeholder) {
    const current = selectEl.value;
    selectEl.innerHTML = '';
    const opts = Array.isArray(items) && typeof items[0] === 'object'
      ? items
      : (items || []).map(v => ({ value: v, label: v || placeholder }));
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = placeholder || 'Select';
    selectEl.appendChild(ph);
    opts.filter(o => o.value !== '').forEach(o => {
      const op = document.createElement('option');
      op.value = o.value;
      op.textContent = o.label;
      selectEl.appendChild(op);
    });
    if ([...selectEl.options].some(o => o.value === current)) selectEl.value = current;
  }
  function lookupAlumni(id) { return MOCK.alumni.find(a => a.id === id); }
  function formatDateTime(dt) { try { return new Date(dt).toLocaleString(); } catch { return dt; } }
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // Simple toast
  function toast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.position = 'fixed';
    t.style.bottom = '18px';
    t.style.right = '18px';
    t.style.background = 'rgba(0,0,0,0.7)';
    t.style.color = '#fff';
    t.style.padding = '10px 14px';
    t.style.borderRadius = '10px';
    t.style.zIndex = '20';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1600);
  }

  // Boot
  renderApp();
})();


