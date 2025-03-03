import {Component, OnInit} from '@angular/core';
import {Chart, registerables} from "chart.js";
interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  status: 'Low Stock' | 'In Stock' | 'Out of Stock';
  lastUpdated: Date;
}

interface StockAlert {
  itemName: string;
  currentStock: number;
  minimumThreshold: number;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Register Chart.js
  constructor() {
    Chart.register(...registerables);
  }

  // Dashboard Statistics
  totalItems = 0;
  lowStockItems = 0;
  outOfStockItems = 0;
  totalInventoryValue = 0;

  // Inventory Data
  inventoryItems: InventoryItem[] = [
    {
      id: 1,
      name: 'Laptop',
      category: 'Electronics',
      quantity: 15,
      status: 'Low Stock',
      lastUpdated: new Date('2024-02-15')
    },
    {
      id: 2,
      name: 'Smartphone',
      category: 'Electronics',
      quantity: 50,
      status: 'In Stock',
      lastUpdated: new Date('2024-02-20')
    },
    {
      id: 3,
      name: 'Tablet',
      category: 'Electronics',
      quantity: 0,
      status: 'Out of Stock',
      lastUpdated: new Date('2024-01-10')
    }
  ];

  stockAlerts: StockAlert[] = [];

  ngOnInit() {
    this.calculateDashboardStats();
    this.generateStockAlerts();
    this.createInventoryCharts();
  }

  calculateDashboardStats() {
    this.totalItems = this.inventoryItems.length;
    this.lowStockItems = this.inventoryItems.filter(item => item.status === 'Low Stock').length;
    this.outOfStockItems = this.inventoryItems.filter(item => item.status === 'Out of Stock').length;

    // Simulated total inventory value calculation
    this.totalInventoryValue = this.inventoryItems.reduce((total, item) => {
      // Simulated price per item
      const prices: { [key: string]: number } = {
        'Laptop': 1000,
        'Smartphone': 500,
        'Tablet': 300
      };
      return total + (item.quantity * (prices[item.name] || 0));
    }, 0);
  }

  generateStockAlerts() {
    this.stockAlerts = this.inventoryItems
      .filter(item => item.quantity < 20)
      .map(item => ({
        itemName: item.name,
        currentStock: item.quantity,
        minimumThreshold: 20
      }));
  }

  createInventoryCharts() {
    // Inventory Status Chart
    const ctx = document.getElementById('inventoryStatusChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['In Stock', 'Low Stock', 'Out of Stock'],
        datasets: [{
          data: [
            this.inventoryItems.filter(item => item.status === 'In Stock').length,
            this.inventoryItems.filter(item => item.status === 'Low Stock').length,
            this.inventoryItems.filter(item => item.status === 'Out of Stock').length
          ],
          backgroundColor: ['#28a745', '#ffc107', '#dc3545']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Inventory Status Overview'
          }
        }
      }
    });

    // Category Distribution Chart
    const categoryCtx = document.getElementById('categoryDistributionChart') as HTMLCanvasElement;
    const categoryData = this.getCategoryDistribution();
    new Chart(categoryCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(categoryData),
        datasets: [{
          label: 'Items per Category',
          data: Object.values(categoryData),
          backgroundColor: '#007bff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Item Distribution by Category'
          }
        }
      }
    });
  }

  getCategoryDistribution(): { [key: string]: number } {
    return this.inventoryItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }}
