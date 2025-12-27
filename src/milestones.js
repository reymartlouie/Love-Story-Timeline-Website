// Default placeholder milestones for demo/public deployment
const defaultMilestones = [
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

// Load private milestones if available (file is gitignored)
// Vite plugin returns null when file doesn't exist
import privateData from './milestones.private.js';

const milestones = privateData || defaultMilestones;

export default milestones;
