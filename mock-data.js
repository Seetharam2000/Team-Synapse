// Mock datasets for the Alumverse demo
const MOCK = {
  alumni: [
    { id: 'a1', name: 'Aarav Menon', gender: 'Male', batch: 2016, company: 'Google', position: 'SWE', location: 'Bengaluru', skills: ['React', 'Node', 'GCP'] },
    { id: 'a2', name: 'Diya Sharma', gender: 'Female', batch: 2018, company: 'Microsoft', position: 'PM', location: 'Hyderabad', skills: ['Product', 'Azure', 'Agile'] },
    { id: 'a3', name: 'Karthik Iyer', gender: 'Male', batch: 2015, company: 'Amazon', position: 'SDE-II', location: 'Chennai', skills: ['Java', 'AWS', 'System Design'] },
    { id: 'a4', name: 'Meera Nair', gender: 'Female', batch: 2019, company: 'Adobe', position: 'Researcher', location: 'Noida', skills: ['ML', 'CV', 'Python'] },
    { id: 'a5', name: 'Rohit Gupta', gender: 'Male', batch: 2017, company: 'Flipkart', position: 'Data Scientist', location: 'Bengaluru', skills: ['Python', 'NLP', 'Data'] },
    { id: 'a6', name: 'Priya Singh', gender: 'Female', batch: 2020, company: 'Meta', position: 'Software Engineer', location: 'Mumbai', skills: ['React', 'GraphQL', 'Mobile'] },
    { id: 'a7', name: 'Rajesh Kumar', gender: 'Male', batch: 2014, company: 'Apple', position: 'Senior Engineer', location: 'Cupertino', skills: ['iOS', 'Swift', 'Machine Learning'] },
    { id: 'a8', name: 'Ananya Patel', gender: 'Female', batch: 2021, company: 'Netflix', position: 'Data Engineer', location: 'Los Gatos', skills: ['Python', 'Spark', 'Big Data'] },
    { id: 'a9', name: 'Vikram Joshi', gender: 'Male', batch: 2013, company: 'Tesla', position: 'Autopilot Engineer', location: 'Palo Alto', skills: ['C++', 'Computer Vision', 'AI'] },
    { id: 'a10', name: 'Sneha Reddy', gender: 'Female', batch: 2022, company: 'Uber', position: 'Product Manager', location: 'San Francisco', skills: ['Product Strategy', 'Analytics', 'Leadership'] },
    { id: 'a11', name: 'Arjun Desai', gender: 'Male', batch: 2018, company: 'Airbnb', position: 'Full Stack Developer', location: 'Seattle', skills: ['React', 'Node.js', 'AWS'] },
    { id: 'a12', name: 'Kavya Iyer', gender: 'Female', batch: 2019, company: 'Spotify', position: 'ML Engineer', location: 'Stockholm', skills: ['Python', 'TensorFlow', 'Recommendation Systems'] },
    { id: 'a13', name: 'Rohan Sharma', gender: 'Male', batch: 2016, company: 'Shopify', position: 'Backend Engineer', location: 'Ottawa', skills: ['Ruby', 'Rails', 'Microservices'] },
    { id: 'a14', name: 'Divya Nair', gender: 'Female', batch: 2020, company: 'Stripe', position: 'Security Engineer', location: 'Dublin', skills: ['Security', 'Cryptography', 'Go'] },
    { id: 'a15', name: 'Suresh Kumar', gender: 'Male', batch: 2017, company: 'Zoom', position: 'Video Engineer', location: 'San Jose', skills: ['WebRTC', 'C++', 'Real-time Systems'] },
  ],
  students: [
    { id: 's1', name: 'Neha Verma', email: 'neha@srmist.edu.in', branch: 'CSE', batch: 2024, cgpa: 9.1, projects: ['FoodLens', 'ChatBot'], internships: ['Zoho'], certifications: ['AWS CCP'], achievements: ['SIH Finalist'], skills: ['JavaScript', 'Python', 'React'], interests: ['AI', 'Web Development'], linkedin: 'https://linkedin.com/in/nehaverma', github: 'https://github.com/nehaverma' },
    { id: 's2', name: 'Arjun Kumar', email: 'arjun@srmist.edu.in', branch: 'ECE', batch: 2024, cgpa: 8.7, projects: ['SmartGrid IoT'], internships: ['Qualcomm'], certifications: ['CCNA'], achievements: ['Hackathon Winner'] },
    { id: 's3', name: 'Ishita Rao', email: 'ishita@srmist.edu.in', branch: 'CSE', batch: 2024, cgpa: 9.4, projects: ['VisionAid'], internships: ['TCS'], certifications: ['GCP ACE'], achievements: ['Dean List'] },
    { id: 's4', name: 'Rahul Singh', email: 'rahul@srmist.edu.in', branch: 'IT', batch: 2025, cgpa: 8.9, projects: ['Blockchain App', 'AI Chatbot'], internships: ['Infosys'], certifications: ['Azure Fundamentals'], achievements: ['Tech Fest Winner'] },
    { id: 's5', name: 'Priya Patel', email: 'priya@srmist.edu.in', branch: 'CSE', batch: 2025, cgpa: 9.2, projects: ['Mobile App', 'Web Platform'], internships: ['Wipro'], certifications: ['Google Cloud'], achievements: ['Research Paper Published'] },
    { id: 's6', name: 'Vikram Joshi', email: 'vikram@srmist.edu.in', branch: 'ECE', batch: 2023, cgpa: 8.5, projects: ['IoT System', 'Embedded Project'], internships: ['Intel'], certifications: ['Embedded Systems'], achievements: ['Innovation Award'] },
    { id: 's7', name: 'Ananya Gupta', email: 'ananya@srmist.edu.in', branch: 'CSE', batch: 2023, cgpa: 9.0, projects: ['Machine Learning Model', 'Data Analysis'], internships: ['IBM'], certifications: ['Data Science'], achievements: ['Scholarship Recipient'] },
    { id: 's8', name: 'Karthik Reddy', email: 'karthik@srmist.edu.in', branch: 'IT', batch: 2022, cgpa: 8.8, projects: ['Cloud Application', 'DevOps Pipeline'], internships: ['Accenture'], certifications: ['Docker', 'Kubernetes'], achievements: ['Placement Success'] },
  ],
  events: [
    { id: 'e1', title: 'Tech Talk: Scaling Systems', date: '2025-10-10', target: 'Backend, Cloud', by: 'CSI Committee' },
    { id: 'e2', title: 'Alumni Mentorship Day', date: '2025-11-05', target: 'All branches', by: 'Student Council' },
  ],
  pitches: [
    { id: 'p1', title: 'EcoCart', desc: 'Sustainable commerce plugin that nudges eco-friendly choices.', type: 'Startup', by: 'Neha Verma' },
    { id: 'p2', title: 'MedVision', desc: 'Computer vision aiding diabetic retinopathy screening.', type: 'Research', by: 'Ishita Rao' },
  ],
  levels: [
    { level: 1, name: 'Explorer', unlocks: ['Basic directory view'] },
    { level: 2, name: 'Follower', unlocks: ['Follow alumni'] },
    { level: 3, name: 'Connector', unlocks: ['Connect & message alumni'] },
    { level: 4, name: 'Achiever', unlocks: ['Request LORs', 'Mentorship'] },
    { level: 5, name: 'Leader', unlocks: ['Showcased to alumni', 'Referrals & funding eligible'] },
  ],
};


