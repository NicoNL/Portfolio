
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.navbar a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      // Add active class to clicked link
      this.classList.add('active');
    });
  });
});

// Function to create an experience card
function createExperienceCard(experience) {
  const card = document.createElement('div');
  card.className = 'experience-card';
  
  const skillsHTML = experience.skills.map(skill => 
    `<span class="skill-tag">${skill}</span>`
  ).join('');

  card.innerHTML = `
    <div class="card-image">
      <img src="${experience.image}" alt="${experience.company} Project">
    </div>
    <div class="card-content">
      <h3>${experience.title}</h3>
      <h4>${experience.company}</h4>
      <p class="date">${experience.date}</p>
      <p class="description">${experience.description}</p>
      <div class="skills">
        ${skillsHTML}
      </div>
      <a href="${experience.projectUrl}" class="project-button" target="_blank" rel="noopener noreferrer">Open project website</a>
    </div>
  `;
  
  return card;
}

// Function to load experiences
async function loadExperiences() {
  try {
    const response = await fetch('content/experiences.json');
    const data = await response.json();
    const carousel = document.getElementById('experiences-carousel');
    
    if (!carousel) {
      console.error('Experiences carousel element not found');
      return;
    }
    
    data.experiences.forEach(experience => {
      const card = createExperienceCard(experience);
      carousel.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading experiences:', error);
  }
}

// Function to create a project card
function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'experience-card';
  
  console.log('Creating card for project:', project.title);
  console.log('Project data:', project);
  
  const skillsHTML = project.skills.map(skill => 
    `<span class="skill-tag">${skill}</span>`
  ).join('');

  // Create media container
  let mediaHTML = '';
  if (project.video) {
    console.log('Creating video element for:', project.title);
    mediaHTML = `
      <div class="video-container">
        <video class="card-video" poster="${project.thumbnail}" loop muted playsinline controls>
          <source src="${project.video}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <button class="fullscreen-button" aria-label="Enter fullscreen">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        </button>
      </div>`;
  } else {
    mediaHTML = `<img src="${project.image}" alt="${project.title} Project">`;
  }

  card.innerHTML = `
    <div class="card-image">
      ${mediaHTML}
    </div>
    <div class="card-content">
      <h3>${project.title}</h3>
      <p class="description">${project.description}</p>
      <div class="skills">
        ${skillsHTML}
      </div>
      <a href="${project.projectUrl}" class="project-button" target="_blank" rel="noopener noreferrer">View Project</a>
    </div>
  `;

  // Add hover event listeners for video playback
  if (project.video) {
    const video = card.querySelector('.card-video');
    const fullscreenButton = card.querySelector('.fullscreen-button');
    console.log('Video element found:', video);

    // Hover functionality
    card.addEventListener('mouseenter', () => {
      console.log('Mouse enter - attempting to play video');
      try {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Video playback started successfully');
          }).catch(error => {
            console.error('Video playback failed:', error);
          });
        }
      } catch (error) {
        console.error('Error playing video:', error);
      }
    });

    card.addEventListener('mouseleave', () => {
      console.log('Mouse leave - pausing video');
      try {
        if (!document.fullscreenElement) {
          video.pause();
          video.currentTime = 0;
        }
      } catch (error) {
        console.error('Error pausing video:', error);
      }
    });

    // Fullscreen functionality
    fullscreenButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card click event
      if (!document.fullscreenElement) {
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
          video.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    });

    // Handle fullscreen change
    video.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        video.controls = true;
      } else {
        video.controls = false;
      }
    });

    video.addEventListener('loadeddata', () => {
      console.log('Video loaded successfully');
    });

    video.addEventListener('error', (e) => {
      console.error('Video loading error:', e);
    });
  }
  
  return card;
}

// Function to load projects
async function loadProjects() {
  try {
    console.log('Loading projects...');
    const response = await fetch('content/projects.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const carousel = document.getElementById('projects-carousel');
    
    if (!carousel) {
      console.error('Projects carousel element not found');
      return;
    }
    
    console.log('Projects data:', data);
    data.projects.forEach(project => {
      const card = createProjectCard(project);
      carousel.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

// Load everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded, initializing...');
  loadExperiences();
  loadProjects();
});

// Function to handle email form submission
function sendEmail(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  
  // Create email body with formatted content
  const emailBody = `Name: ${name}%0D%0A%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
  
  // Create mailto link with pre-filled data
  const mailtoLink = `mailto:nicolasninoloz@gmail.com?subject=Portfolio Contact Form - ${name}&body=${emailBody}`;
  
  // Open default email client
  window.location.href = mailtoLink;
  
  // Reset form
  document.getElementById('contactForm').reset();
  
  return false;
}