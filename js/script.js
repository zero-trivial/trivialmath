/* 1. Data Storage */

const notesList = [
  { 
    category: "Real Analysis", 
    title: "Real Analysis Basics", 
    desc: "Limits, continuity, and differentiation explained clearly.", 
    file: "notes_pdf/analysis_real.pdf",
    dateAdded: "2025-08-20",
    spotlight: true 
  },
  { 
    category: "Programming & Tools", 
    title: "LaTeX for Math Students", 
    desc: "A primer on typesetting beautiful mathematics.", 
    file: "notes_pdf/latex_guide.pdf",
    dateAdded: "2025-08-21", 
    spotlight: true 
  },
  { 
    category: "Abstract Algebra", 
    title: "Group Theory Fundamentals", 
    desc: "Exploring axioms, subgroups, and homomorphisms.", 
    file: "notes_pdf/group_theory.pdf",
    dateAdded: "2025-07-15",
    spotlight: true 
  },
  { 
    category: "Programming & Tools", 
    title: "NumPy Cheatsheet", 
    desc: "Essential Python matrix operations and tools.", 
    file: "notes_pdf/numpy.pdf",
    dateAdded: "2025-06-30",
    spotlight: true 
  },
  { 
    category: "Programming & Tools", 
    title: "Pandas Cheatsheet", 
    desc: "Essential Python matrix operations and tools.", 
    file: "notes_pdf/numpy.pdf",
    dateAdded: "2025-06-30",
    spotlight: true 
  },
  { 
    category: "Numerical Methods", 
    title: "Root-Finding Algorithms", 
    desc: "Methods like Bisection, Newton-Raphson, and Secant.", 
    file: "notes_pdf/root_finding.pdf",
    dateAdded: "2025-08-18",
    spotlight: false 
  },
  { 
    category: "Real Analysis", 
    title: "Metric Spaces", 
    desc: "An introduction to distance functions and topology.", 
    file: "notes_pdf/metric_spaces.pdf",
    dateAdded: "2025-05-10",
    spotlight: true 
  },
  { 
    category: "Abstract Algebra", 
    title: "Introduction to Rings", 
    desc: "A guide to ring theory and its core concepts.", 
    file: "notes_pdf/ring_theory.pdf",
    dateAdded: "2025-04-22",
    spotlight: false 
  },
  { 
    category: "Linear Algebra", 
    title: "Introduction to Rings", 
    desc: "A guide to ring theory and its core concepts.", 
    file: "notes_pdf/ring_theory.pdf",
    dateAdded: "2025-04-22",
    spotlight: false 
  }
];

/* 2. Initialization */ 

document.addEventListener('DOMContentLoaded', () => {
  // Global features present on all pages
  initMobileMenu();
  initActiveNavHighlight();
  
  // Homepage-specific features
  if (document.body.id === 'home-page') {
    displaySpotlightNotes();
    displayLatestNotes();
  }
  
  // Notes page features
  if (document.getElementById('allNotesContainer')) {
    displayNotesByCategory(); 
    initCategoryCollapse();
    initCategorizedSearchFilter();
  }
});


/* 3. Core Site Features */


function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  if (!menuToggle) return;
  menuToggle.addEventListener('click', () => {
    const isNavOpen = document.body.classList.toggle('nav-open');
    menuToggle.textContent = isNavOpen ? '✕' : '☰';
    menuToggle.setAttribute('aria-label', isNavOpen ? 'Close menu' : 'Open menu');
  });
}

function initActiveNavHighlight() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}


/* 4. Page-Specific Logic   */


function createNoteCard(note) {
  return `
    <div class="note-card">
      <h3>${note.title}</h3>
      <p>${note.desc}</p>
      <div class="note-actions">
        <a href="${note.file}" class="button-secondary" download>Download</a>
        <button class="button-primary" onclick="previewPDF('${note.file}')">Preview</button>
      </div>
    </div>`;
}

// --- Homepage Functions ---

function displaySpotlightNotes() {
  const container = document.getElementById('spotlightNotesContainer');
  if (!container) return;
  const SPOTLIGHT_COUNT = 3;
  const allSpotlightNotes = notesList.filter(note => note.spotlight);
  const shuffledSpotlightNotes = allSpotlightNotes.sort(() => 0.5 - Math.random());
  const randomSpotlightSelection = shuffledSpotlightNotes.slice(0, SPOTLIGHT_COUNT);
  container.innerHTML = randomSpotlightSelection.map(createNoteCard).join('');
}

function displayLatestNotes() {
  const container = document.getElementById('latestNotesContainer');
  if (!container) return;
  const sortedNotes = [...notesList].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  const latestNotes = sortedNotes.slice(0, 3);
  container.innerHTML = latestNotes.map(createNoteCard).join('');
}

// --- Notes Page Functions ---

function displayNotesByCategory() {
  const container = document.getElementById('allNotesContainer');
  if (!container) return;
  const notesByCategory = notesList.reduce((acc, note) => {
    if (!acc[note.category]) acc[note.category] = [];
    acc[note.category].push(note);
    return acc;
  }, {});

  let allCategoriesHtml = '';
  
  for (const category in notesByCategory) {
    allCategoriesHtml += `
      <section class="category-section">
        <div class="category-header" role="button" tabindex="0" aria-expanded="false">
          <div class="category-header-title">
            <h2 class="category-title">${category}</h2>
            <span class="note-count-badge">${notesByCategory[category].length} Notes</span>
          </div>
          <span class="toggle-icon">+</span>
        </div>
        <div class="collapsible-content">
          <div class="note-grid">
            ${notesByCategory[category].map(createNoteCard).join('')}
          </div>
        </div>
      </section>`;
  }
  container.innerHTML = allCategoriesHtml;
}

function initCategoryCollapse() {
  const allSections = document.querySelectorAll('.category-section');
  allSections.forEach(section => {
    const header = section.querySelector('.category-header');
    const toggleAction = () => {
      const isCurrentlyExpanded = section.classList.contains('expanded');
      allSections.forEach(s => {
        s.classList.remove('expanded');
        s.querySelector('.category-header').setAttribute('aria-expanded', 'false');
        s.querySelector('.toggle-icon').textContent = '+';
      });
      if (!isCurrentlyExpanded) {
        section.classList.add('expanded');
        header.setAttribute('aria-expanded', 'true');
        header.querySelector('.toggle-icon').textContent = '–';
      }
    };
    header.addEventListener('click', toggleAction);
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAction();
      }
    });
  });

  
  if (allSections.length > 0) {
    const firstHeader = allSections[0].querySelector('.category-header');
    if (firstHeader) {
      firstHeader.click();
    }
  }
}

function initCategorizedSearchFilter() {
  const searchInput = document.getElementById('searchInput');
  const noResultsMessage = document.getElementById('noResultsMessage');
  if (!searchInput || !noResultsMessage) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    let totalVisibleNotes = 0;

    document.querySelectorAll('.category-section').forEach(section => {
      let visibleNotesInSection = 0;
      section.querySelectorAll('.note-card').forEach(card => {
        const cardText = card.innerText.toLowerCase();
        const isMatch = cardText.includes(query);
        card.style.display = isMatch ? '' : 'none';
        if (isMatch) {
          visibleNotesInSection++;
        }
      });
      
      totalVisibleNotes += visibleNotesInSection;
      const header = section.querySelector('.category-header');
      const icon = section.querySelector('.toggle-icon');

      if (visibleNotesInSection > 0) {
        section.style.display = '';
        
        if (!section.classList.contains('expanded')) {
          section.classList.add('expanded');
          header.setAttribute('aria-expanded', 'true');
          icon.textContent = '–';
        }
      } else {
        section.style.display = 'none';
      }

      if (query === '') {
        section.style.display = '';
        section.classList.remove('expanded');
        header.setAttribute('aria-expanded', 'false');
        icon.textContent = '+';
      }
    });

    //
    if (totalVisibleNotes === 0 && query !== '') {
      noResultsMessage.textContent = `No results found for "${query}"`;
      noResultsMessage.style.display = 'block';
    } else {
      noResultsMessage.style.display = 'none';
    }
    
    
    if(query === ''){
        const firstHeader = document.querySelector('.category-section .category-header');
        if(firstHeader && !firstHeader.parentElement.classList.contains('expanded')){
            firstHeader.click();
        }
    }
  });
}

/* 5. PDF Modal Controls  */

const pdfModal = document.getElementById('pdfModal');
const pdfViewer = document.getElementById('pdfViewer');

function previewPDF(filePath) {
  if (!pdfModal || !pdfViewer) return;
  pdfViewer.src = filePath;
  pdfModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!pdfModal || !pdfViewer) return;
  pdfModal.classList.remove('open');
  pdfViewer.src = '';
  document.body.style.overflow = '';
}

window.addEventListener('click', (e) => {
  if (e.target === pdfModal) closeModal();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && pdfModal?.classList.contains('open')) closeModal();
});
