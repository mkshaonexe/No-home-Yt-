// Track current state
let minimalModeActive = false;
let observer;

function activateMinimalMode() {
  if (minimalModeActive) return;
  minimalModeActive = true;
  
  // Create minimal container
  const container = document.createElement('div');
  container.id = 'yt-minimal-container';
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    flex-direction: column;
    gap: 20px;
  `;

  // Add YouTube logo
  const logo = document.createElement('div');
  logo.innerHTML = `
    <svg width="90" height="20" viewBox="0 0 90 20">
      <path fill="#FF0000" d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5701 5.35042 27.9727 3.12324Z"/>
      <path fill="white" d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z"/>
    </svg>
  `;
  container.appendChild(logo);

  // Create search form
  const form = document.createElement('form');
  form.action = '/results';
  form.method = 'GET';
  form.style.cssText = `
    width: 100%;
    max-width: 600px;
    display: flex;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    border-radius: 40px;
    overflow: hidden;
  `;

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'search_query';
  input.placeholder = 'Search YouTube';
  input.autofocus = true;
  input.style.cssText = `
    flex: 1;
    padding: 12px 20px;
    border: none;
    font-size: 16px;
    outline: none;
  `;

  const button = document.createElement('button');
  button.type = 'submit';
  button.innerHTML = '🔍';
  button.style.cssText = `
    background: #f8f8f8;
    border: none;
    padding: 0 15px;
    cursor: pointer;
  `;

  // Assemble elements
  form.appendChild(input);
  form.appendChild(button);
  container.appendChild(form);
  document.body.appendChild(container);

  // Hide YouTube's content
  document.documentElement.style.overflow = 'hidden';
  const appContainer = document.querySelector('ytd-app, #content');
  if (appContainer) {
    appContainer.style.display = 'none';
    appContainer.setAttribute('data-original-display', appContainer.style.display);
  }
}

function deactivateMinimalMode() {
  if (!minimalModeActive) return;
  minimalModeActive = false;
  
  const container = document.getElementById('yt-minimal-container');
  if (container) container.remove();

  document.documentElement.style.overflow = '';
  const appContainer = document.querySelector('ytd-app, #content');
  if (appContainer) {
    appContainer.style.display = appContainer.getAttribute('data-original-display') || '';
  }
}

function checkPageState() {
  const isHomepage = window.location.pathname === '/' || 
                     window.location.pathname === '' ||
                     window.location.href === 'https://www.youtube.com/' ||
                     window.location.href === 'https://www.youtube.com';

  if (isHomepage) {
    activateMinimalMode();
  } else {
    deactivateMinimalMode();
  }
}

// Initial setup
checkPageState();

// Observe URL changes
observer = new MutationObserver(() => {
  checkPageState();
});

observer.observe(document, {
  childList: true,
  subtree: true
});

// Handle back/forward navigation
window.addEventListener('popstate', checkPageState);

// Periodic check as fallback
setInterval(checkPageState, 1000);