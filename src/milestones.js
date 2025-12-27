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

// Use import.meta.glob with wildcard pattern to safely handle missing private file
const privateModules = import.meta.glob('./milestones.private.*', { eager: true });
const privateModule = privateModules['./milestones.private.js'];

const milestones = privateModule?.default || defaultMilestones;

export default milestones;
