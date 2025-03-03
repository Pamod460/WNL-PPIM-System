import { Component } from '@angular/core';
interface Skill {
  name: string;
  level: number;
}

interface Social {
  platform: string;
  icon: string;
  link: string;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profile = {
    name: 'Alex Rodriguez',
    title: 'Full Stack Developer',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Passionate developer creating innovative web solutions with a focus on clean, efficient code.',
    location: 'San Francisco, CA',
    email: 'alex.rodriguez@example.com'
  };

  skills: Skill[] = [
    { name: 'Angular', level: 90 },
    { name: 'TypeScript', level: 85 },
    { name: 'Node.js', level: 75 },
    { name: 'React', level: 65 }
  ];

  socialLinks: Social[] = [
    {
      platform: 'LinkedIn',
      icon: 'linkedin',
      link: 'https://linkedin.com/in/alexrodriguez'
    },
    {
      platform: 'GitHub',
      icon: 'github',
      link: 'https://github.com/alexrodriguez'
    },
    {
      platform: 'Twitter',
      icon: 'twitter',
      link: 'https://twitter.com/alexrodriguez'
    }
  ];
}
