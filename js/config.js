/* =========================================================================
   AjayOS — everything you'd want to edit lives in this file.
   Anything marked `placeholder: true` shows a small "Placeholder" tag on
   the site so it's easy to spot what still needs real content.
   ========================================================================= */
window.SITE = {
  name: 'Ajay Patel',
  firstName: 'Ajay',
  role: 'Software Engineer',
  employer: 'Apple',
  location: 'Brooklyn, NY',
  coords: { lat: 40.6782, lon: -73.9442 }, // used for the live Weather app/widget
  photo: 'images/ajay.jpg',

  bio: [
    "I'm a software engineer living in Brooklyn, NY. I graduated from the University of Virginia in 2019.",
    'I work at Apple on large-scale distributed systems and data services.',
    "In my free time I ride my bike and doom-scroll on Twitter. I'm also trying to swim more and start building AI slop."
  ],
  now: ['Riding around Brooklyn', 'Trying to swim more', 'Building AI slop'],

  // Leave a link empty ('') and the app shows a "coming soon" screen instead of linking out.
  links: {
    github: 'https://github.com/ajayppatel',
    linkedin: 'https://linkedin.com/in/ajaypateluva',
    instagram: '',
    twitter: '',
    music: '',   // e.g. a Spotify / Apple Music profile
    resume: ''   // e.g. 'files/resume.pdf'
  },

  /* Contact
     - email: split into pieces so the full address never appears in the page
       source. Example: ['hello', 'example', 'com'] -> hello@example.com
       Leave as [] to hide the address and only use the Messages form.
     - formEndpoint: a form service URL (Formspree, Web3Forms, Getform...).
       Messages typed on the site are POSTed here. Empty = demo mode. */
  email: [],
  formEndpoint: '',

  photos: [
    { src: 'images/ajay.jpg', caption: 'Me' },
    { placeholder: true, caption: 'Bike ride' },
    { placeholder: true, caption: 'Brooklyn' },
    { placeholder: true, caption: 'Charlottesville' },
    { placeholder: true, caption: 'Pool day' },
    { placeholder: true, caption: 'Trip' },
    { placeholder: true, caption: 'Food' },
    { placeholder: true, caption: 'Friends' },
    { placeholder: true, caption: 'Sunset' }
  ],

  // x / y are percentages on the stylised map (0–100)
  places: [
    { name: 'Brooklyn', note: 'Home', x: 66, y: 34 },
    { name: 'Charlottesville', note: "UVA, class of '19", x: 30, y: 78 }
  ],

  calendar: [
    { time: 'Morning', what: 'Ride before work' },
    { time: 'Day', what: 'Distributed systems at Apple' },
    { time: 'Evening', what: 'Open for coffee' }
  ],

  rides: {
    placeholder: true,
    stats: [
      ['This year', '— mi'],
      ['Longest ride', '— mi'],
      ['Favorite loop', 'Prospect Park'],
      ['Bike', '—']
    ]
  },

  projects: [
    { name: 'This website', blurb: 'A personal site that pretends to be a phone.', url: 'https://github.com/ajayppatel/ajayppatel.github.io' },
    { name: 'AI side project', blurb: 'Something I built with an LLM.', placeholder: true },
    { name: 'Another project', blurb: 'Short description goes here.', placeholder: true }
  ],

  books: [
    { title: 'Currently reading', author: 'Title and author', placeholder: true },
    { title: 'Favorite book', author: 'Title and author', placeholder: true },
    { title: 'Recommend to everyone', author: 'Title and author', placeholder: true }
  ],

  music: [
    { title: 'On repeat', artist: 'Song and artist', placeholder: true },
    { title: 'Riding playlist', artist: 'Song and artist', placeholder: true },
    { title: 'All-time favorite', artist: 'Song and artist', placeholder: true }
  ]
};
