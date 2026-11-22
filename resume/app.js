const layoutStatus = document.querySelector('#layout-status');
const languageSwitch = document.querySelector('.language-switch');
const languageButtons = [...languageSwitch.querySelectorAll('button')];
const languageInk = languageSwitch.querySelector('.language-ink');
const downloadLink = document.querySelector('.save-pdf');
const paperPreview = matchMedia('screen and (min-width: 851px)');
const motionPreference = matchMedia('(prefers-reduced-motion: no-preference)');
let activeDocument = document.querySelector('.resume-document:not([hidden])');
let activeButton = languageSwitch.querySelector('[aria-pressed="true"]');
let inkAnimation;

function checkLayout() {
  const pages = [...activeDocument.querySelectorAll('.page')];
  const oversized = paperPreview.matches && pages.some(page => {
    const { width, height } = page.getBoundingClientRect();
    return height > width * 297 / 210 + 1;
  });

  layoutStatus.textContent = oversized ? 'The content exceeds the A4 preview. Check the PDF pagination before submitting.' : '';
}

function positionLanguageInk(button, animate = false) {
  const shouldAnimate = animate && motionPreference.matches;
  const previous = shouldAnimate ? languageInk.getBoundingClientRect() : null;
  const previousRadius = shouldAnimate ? getComputedStyle(languageInk).borderRadius : '';
  const previousColorPosition = shouldAnimate ? getComputedStyle(languageInk).backgroundPosition : '';
  inkAnimation?.cancel();
  languageInk.style.insetInlineStart = `${button.offsetLeft + 2}px`;
  languageInk.style.width = `${button.offsetWidth - 4}px`;
  if (!previous?.width) return;

  const destination = languageInk.getBoundingClientRect();
  const distance = previous.left - destination.left;
  const widthRatio = previous.width / destination.width;
  const forwards = distance < 0;
  const pooledEdge = forwards ? '7px 45% 32% 9px / 12px 52% 45% 9px' : '45% 7px 9px 32% / 52% 12px 9px 45%';
  inkAnimation = languageInk.animate([
    { transform: `translateX(${distance}px) scaleX(${widthRatio})`, borderRadius: previousRadius, backgroundPosition: previousColorPosition },
    {
      transform: `translateX(${distance * .44}px) scaleX(${(1 + widthRatio) / 2 + .14})`,
      borderRadius: pooledEdge,
      backgroundPosition: forwards ? '100% 28%' : '0% 68%',
      offset: .38
    },
    { transform: 'none', borderRadius: '7px', backgroundPosition: '50% 50%' }
  ], { duration: 420, easing: 'cubic-bezier(.24, .72, .26, 1)' });
}

function selectLanguage(button) {
  const selectedDocument = document.getElementById(button.getAttribute('aria-controls'));
  if (selectedDocument === activeDocument) return;

  activeDocument.hidden = true;
  selectedDocument.hidden = false;
  activeDocument = selectedDocument;
  activeButton = button;
  document.documentElement.lang = selectedDocument.lang;
  downloadLink.href = selectedDocument.dataset.pdf;
  downloadLink.download = selectedDocument.dataset.pdf;
  for (const option of languageButtons) {
    option.setAttribute('aria-pressed', String(option === button));
  }
  positionLanguageInk(button, true);
  checkLayout();
}

for (const button of languageButtons) {
  button.addEventListener('click', () => selectLanguage(button));
}
languageSwitch.hidden = false;
positionLanguageInk(activeButton);

const observer = new ResizeObserver(checkLayout);
document.querySelectorAll('.page').forEach(page => observer.observe(page));
paperPreview.addEventListener('change', checkLayout);

const languageSize = new ResizeObserver(() => positionLanguageInk(activeButton));
languageButtons.forEach(button => languageSize.observe(button));
motionPreference.addEventListener('change', () => positionLanguageInk(activeButton));
