/***********************
 * GLOBAL STATE
 ***********************/
let allMessages = [];

/***********************
 * DEFAULT CONFIG
 ***********************/
const defaultConfig = {
  hero_name: 'Pavan Kumar',
  hero_role: 'Data Analyst',
  hero_cta: 'View My Work',
  about_description:
    'Passionate Data Analyst skilled in transforming raw data into actionable insights. I specialize in data visualization, statistical analysis, and business intelligence.',
  contact_title: 'Get In Touch'
};

/***********************
 * DATA SDK HANDLER
 ***********************/
const dataHandler = {
  onDataChanged(data) {
    allMessages = Array.isArray(data) ? data : [];
    console.log('Messages received:', allMessages.length);
  }
};

/***********************
 * INIT DATA SDK (SAFE)
 ***********************/
async function initDataSdk() {
  if (!window.dataSdk) {
    console.warn('Data SDK not available');
    return;
  }

  const result = await window.dataSdk.init(dataHandler);
  if (!result?.isOk) {
    console.error('Failed to initialize Data SDK');
  }
}

/***********************
 * CONFIG CHANGE HANDLER
 ***********************/
function onConfigChange(config = {}) {
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText('heroName', config.hero_name || defaultConfig.hero_name);
  setText('heroRole', config.hero_role || defaultConfig.hero_role);
  setText('heroCta', config.hero_cta || defaultConfig.hero_cta);
  setText(
    'aboutDescription',
    config.about_description || defaultConfig.about_description
  );
  setText(
    'contactTitle',
    config.contact_title || defaultConfig.contact_title
  );
}

/***********************
 * ELEMENT SDK INIT (SAFE)
 ***********************/
if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange,
    mapToCapabilities: () => ({
      recolorables: [],
      borderables: [],
      fontEditable: undefined,
      fontSizeable: undefined
    }),
    mapToEditPanelValues: (config = {}) =>
      new Map([
        ['hero_name', config.hero_name || defaultConfig.hero_name],
        ['hero_role', config.hero_role || defaultConfig.hero_role],
        ['hero_cta', config.hero_cta || defaultConfig.hero_cta],
        [
          'about_description',
          config.about_description || defaultConfig.about_description
        ],
        ['contact_title', config.contact_title || defaultConfig.contact_title]
      ])
  });
}

/***********************
 * DOM READY
 ***********************/
document.addEventListener('DOMContentLoaded', () => {
  initDataSdk();

  /***** HAMBURGER MENU *****/
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  /***** CONTACT FORM *****/
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const submitButton = document.getElementById('submitButton');
      const formMessage = document.getElementById('formMessage');

      if (!submitButton || !formMessage) return;

      if (allMessages.length >= 999) {
        formMessage.textContent = 'Message limit reached.';
        formMessage.className = 'form-message error';
        return;
      }

      const formData = {
        name: document.getElementById('name')?.value || '',
        email: document.getElementById('email')?.value || '',
        message: document.getElementById('message')?.value || '',
        timestamp: new Date().toISOString()
      };

      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      formMessage.style.display = 'none';

      try {
        if (!window.dataSdk) throw new Error('Data SDK missing');

        const result = await window.dataSdk.create(formData);
        if (!result?.isOk) throw new Error('Save failed');

        formMessage.textContent = 'Message sent successfully!';
        formMessage.className = 'form-message success';
        form.reset();
      } catch (err) {
        formMessage.textContent = 'Failed to send message.';
        formMessage.className = 'form-message error';
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
        formMessage.style.display = 'block';
      }
    });
  }

  /***** SCROLL ANIMATIONS *****/
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = '0.6s ease';
    observer.observe(section);
  });
});
