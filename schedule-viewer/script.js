document.addEventListener('DOMContentLoaded', () => {
  fetchRoadmap();
});

let roadmapDataCache = [];

async function fetchRoadmap() {
  try {
    let response = await fetch('/api/roadmap');
    let isStatic = false;
    
    if (!response.ok) {
      // Fallback for static hosting (e.g. GitHub Pages)
      console.log("Local API unavailable, attempting to fetch static ROADMAP.md...");
      response = await fetch('../ROADMAP.md');
      isStatic = true;
      if (!response.ok) {
        throw new Error(`Static fetch failed! status: ${response.status}`);
      }
    }
    
    const text = await response.text();
    window.isStaticEnvironment = isStatic;
    parseAndRender(text);
  } catch (error) {
    console.error("Failed to fetch roadmap:", error);
    document.getElementById('loader').style.display = 'none';
    document.getElementById('error-overlay').style.display = 'flex';
  }
}

function parseAndRender(markdown) {
  const sectionMatch = markdown.match(/## 3\. Live execution list.*?\n([\s\S]*?)## 4\./);
  if (!sectionMatch) {
    document.getElementById('loader').textContent = "Could not find 'Live execution list' section in ROADMAP.md.";
    return;
  }
  
  const content = sectionMatch[1];
  const blocks = content.split(/(?=\*\*Day \d)/);
  const daysData = [];

  blocks.forEach(block => {
    if (!block.trim().startsWith('**Day')) return;
    
    const dayData = {
      title: '',
      dayNumber: '',
      lanes: [],
      status: 'pending',
      rawStatus: '',
      meta: '',
      tasks: []
    };

    const titleMatch = block.match(/\*\*(Day \d.*?)\*\*/);
    if (titleMatch) {
      const fullTitle = titleMatch[1];
      const dashIndex = fullTitle.indexOf('—');
      if (dashIndex !== -1) {
        dayData.dayNumber = fullTitle.substring(0, dashIndex).trim();
        dayData.title = fullTitle.substring(dashIndex + 1).trim();
      } else {
        dayData.dayNumber = fullTitle;
        dayData.title = fullTitle;
      }
    }

    const tasksSplit = block.split(/\n\s*- /);
    const headerPart = tasksSplit[0];
    
    for(let i=1; i<tasksSplit.length; i++) {
      let taskText = tasksSplit[i].replace(/\n/g, ' ').trim();
      taskText = taskText.replace(/\*\*/g, '');
      dayData.tasks.push(taskText);
    }

    const headerRemainder = headerPart.replace(titleMatch ? titleMatch[0] : '', '');
    const headerTokens = headerRemainder.split('·').map(s => s.trim()).filter(s => s);
    
    headerTokens.forEach(token => {
      const statusMatch = token.match(/`(.*?)`/);
      if (statusMatch) {
        const rawStatus = statusMatch[1].toLowerCase();
        dayData.rawStatus = statusMatch[1];
        
        if (rawStatus.includes('done') || rawStatus.includes('cleared')) dayData.status = 'done';
        else if (rawStatus.includes('blocked')) dayData.status = 'blocked';
        else if (rawStatus.includes('deferred')) dayData.status = 'deferred';
        else dayData.status = 'pending';
        
        dayData.meta = token.replace(/`(.*?)`/, '').trim().replace(/^\(|\)$/g, '').trim();
      } else {
        if (token.length > 0) {
          dayData.lanes.push(token);
        }
      }
    });
    
    daysData.push(dayData);
  });

  roadmapDataCache = daysData;
  renderTimeline(daysData);
}

function cycleStatus(currentStatus) {
  const statuses = ['pending', 'done', 'blocked', 'deferred'];
  const idx = statuses.indexOf(currentStatus);
  return statuses[(idx + 1) % statuses.length];
}

async function handleStatusClick(dayIndex) {
  if (window.isStaticEnvironment) {
    alert("You are viewing the live read-only schedule. To change a status, please run the application locally or edit the ROADMAP.md file directly.");
    return;
  }

  const day = roadmapDataCache[dayIndex];
  const newStatus = cycleStatus(day.status);
  
  // Optimistic UI update
  const oldStatus = day.status;
  const oldRaw = day.rawStatus;
  
  day.status = newStatus;
  day.rawStatus = newStatus; // We will just write 'done', 'pending' etc to the file
  renderTimeline(roadmapDataCache); // Re-render to show changes
  
  try {
    const response = await fetch('/api/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dayTitle: `${day.dayNumber} — ${day.title}`,
        oldStatus: oldRaw,
        newStatus: newStatus
      })
    });
    
    if (!response.ok) {
      throw new Error('Server returned ' + response.status);
    }
  } catch (err) {
    console.error("Failed to update status on server:", err);
    // Revert on error
    day.status = oldStatus;
    day.rawStatus = oldRaw;
    renderTimeline(roadmapDataCache);
    alert("Failed to save status to ROADMAP.md");
  }
}

function renderTimeline(daysData) {
  const container = document.getElementById('timeline-container');
  container.innerHTML = ''; 

  daysData.forEach((day, index) => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.setAttribute('data-status', day.status);
    
    // For fast re-renders, remove animation delay so it doesn't stagger every click
    item.style.animation = 'none';
    item.style.opacity = '1';
    item.style.transform = 'translateY(0)';

    const dot = document.createElement('div');
    dot.className = 'timeline-dot';
    item.appendChild(dot);

    const card = document.createElement('div');
    card.className = 'timeline-card';

    const header = document.createElement('div');
    header.className = 'card-header';

    const titleWrap = document.createElement('div');
    titleWrap.className = 'day-title';
    titleWrap.innerHTML = `<span class="day-number">${day.dayNumber}</span> ${day.title}`;
    
    const badgesWrap = document.createElement('div');
    badgesWrap.className = 'badges';
    
    const statusBadge = document.createElement('span');
    statusBadge.className = `badge badge-status-${day.status} clickable-badge`;
    statusBadge.textContent = day.status;
    statusBadge.title = "Click to change status";
    statusBadge.onclick = () => handleStatusClick(index);
    
    badgesWrap.appendChild(statusBadge);

    day.lanes.forEach(lane => {
      const laneBadge = document.createElement('span');
      laneBadge.className = 'badge badge-lane';
      laneBadge.textContent = lane;
      badgesWrap.appendChild(laneBadge);
    });

    header.appendChild(titleWrap);
    header.appendChild(badgesWrap);
    card.appendChild(header);

    if (day.meta) {
      const metaInfo = document.createElement('div');
      metaInfo.className = 'meta-info';
      metaInfo.textContent = day.meta;
      card.appendChild(metaInfo);
    }

    if (day.tasks.length > 0) {
      const ul = document.createElement('ul');
      ul.className = 'task-list';
      day.tasks.forEach(task => {
        const li = document.createElement('li');
        let highlightedTask = task.replace(/^(Gate:|Blocked-by:|Acceptance:|Why:|Parallel:)/i, '<strong>$1</strong>');
        li.innerHTML = highlightedTask;
        ul.appendChild(li);
      });
      card.appendChild(ul);
    }

    item.appendChild(card);
    container.appendChild(item);
  });
}
