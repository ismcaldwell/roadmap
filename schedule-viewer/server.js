const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.static(__dirname));

// Provide the roadmap data
app.get('/api/roadmap', (req, res) => {
  const roadmapPath = path.join(__dirname, '..', 'ROADMAP.md');
  fs.readFile(roadmapPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read roadmap' });
    res.send(data);
  });
});

app.post('/api/update-status', (req, res) => {
  const { dayTitle, oldStatus, newStatus } = req.body;
  if (!dayTitle || !newStatus) return res.status(400).json({ error: 'Invalid input' });

  const roadmapPath = path.join(__dirname, '..', 'ROADMAP.md');
  
  try {
    let data = fs.readFileSync(roadmapPath, 'utf8');
    
    // Split into blocks that start with **Day
    const blocks = data.split(/(?=\*\*Day \d)/);
    
    let updated = false;
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].includes(dayTitle)) {
        if (oldStatus) {
          // Attempt to replace exact old status
          const targetStrRegex = new RegExp(`\\\`([^\\\`]*?${escapeRegExp(oldStatus)}[^\\\`]*?)\\\``, 'i');
          if (targetStrRegex.test(blocks[i])) {
            blocks[i] = blocks[i].replace(targetStrRegex, `\`${newStatus}\``);
            updated = true;
          }
        }
        
        // Fallback to replacing the very first backtick string in the block
        if (!updated) {
           blocks[i] = blocks[i].replace(/`(.*?)`/, `\`${newStatus}\``);
           updated = true;
        }
        break;
      }
    }

    if (updated) {
      fs.writeFileSync(roadmapPath, blocks.join(''), 'utf8');
      res.json({ success: true, message: 'Updated successfully' });
    } else {
      res.status(404).json({ error: 'Day block not found' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
