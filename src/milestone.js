// milestones.js
let milestones = [];

try {
  // Try to load private data
  milestones = require('./milestones.private.js').default;
} catch {
  // Fallback to placeholder data for public repo
  milestones = [
    {
      id: 1,
      position: 'left',
      date: 'Month Day, Year',
      title: 'Your First Memory',
      description: 'Your story goes here...',
      imageUrl: 'https://placehold.co/600x350/ff6b6b/ffffff?text=Memory+Photo'
    },
    {
      id: 2,
      position: 'right',
      date: 'Month Day, Year',
      title: 'Another Special Moment',
      description: 'Another story...',
      imageUrl: 'https://placehold.co/600x350/ee5a6f/ffffff?text=Memory+Photo'
    }
  ];
}

export default milestones;