import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

interface ContactDetail {
  department: string;
  email: string;
  description: string;
  phone?: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('pieChart', { static: false }) pieChartRef!: ElementRef<HTMLCanvasElement>;

  // Dashboard stats - matching the image
  totalVehicles: number = 13;
  totalSuppliers: number = 25;
  totalAgents: number = 58;
  totalProducts: number = 124;

  // Current date and time
  currentDateTime: string = '';

  // Contact details for newspaper printing company
  contactDetails: ContactDetail[] = [
    {
      department: 'General Inquiries',
      email: 'info@wijeya.lk',
      description: 'General information about services or products',
      icon: 'fas fa-info-circle',
      color: '#4CAF50'
    },
    {
      department: 'Customer Support',
      email: 'support@wijeya.lk',
      description: 'Customer service requests and issues',
      icon: 'fas fa-headset',
      color: '#2196F3'
    },
    {
      department: 'Sales',
      email: 'sales@wijeya.lk',
      description: 'Pricing and quotations, Bulk orders, Sales inquiries',
      icon: 'fas fa-chart-line',
      color: '#FF9800'
    },
    {
      department: 'Contact',
      email: 'contact@wijeya.lk',
      description: 'General contact for various departments',
      phone: '0112248765',
      icon: 'fas fa-envelope',
      color: '#9C27B0'
    },
    {
      department: 'Admin',
      email: 'admin@wijeya.lk',
      description: 'Legal and compliance issues, Website or email administration issues',
      icon: 'fas fa-user-shield',
      color: '#607D8B'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  ngAfterViewInit(): void {
    this.drawPieChart();
  }

  updateDateTime(): void {
    const now = new Date();
    this.currentDateTime = now.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  getIconClass(iconType: string): string {
    return iconType;
  }

  onSeeMoreDetails(section: string): void {
    console.log(`See more details clicked for: ${section}`);
    // Implement navigation or modal logic here
  }

  private drawPieChart(): void {

    if (!this.pieChartRef?.nativeElement) return;

    const canvas = this.pieChartRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Data for the chart (65% above, 35% below)
    const abovePercent = 0.65;
    const belowPercent = 0.35;

    // Colors matching the image
    const greenColor = '#4CAF50';
    const yellowColor = '#FFC107';

    // Draw above reorder point (green) - starts from top
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, -Math.PI/2, -Math.PI/2 + (2 * Math.PI * abovePercent));
    ctx.closePath();
    ctx.fillStyle = greenColor;
    ctx.fill();

    // Draw below reorder point (yellow)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, -Math.PI/2 + (2 * Math.PI * abovePercent), -Math.PI/2 + (2 * Math.PI));
    ctx.closePath();
    ctx.fillStyle = yellowColor;
    ctx.fill();

    // Add white border
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0;
    ctx.stroke();
  }
}
