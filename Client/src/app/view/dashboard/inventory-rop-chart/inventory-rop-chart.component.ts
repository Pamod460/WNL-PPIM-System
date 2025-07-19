import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Chart, ChartConfiguration, ChartType, registerables} from 'chart.js';
import {InventoryItem} from "../../../entity/InventoryItem";

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-inventory-rop-chart',
  templateUrl: './inventory-rop-chart.component.html',
  styleUrls: ['./inventory-rop-chart.component.css']
})
export class InventoryRopChartComponent implements OnInit, OnChanges {
  @ViewChild('inventoryChart', {static: true}) inventoryChart!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;
  @Input() inventoryData: InventoryItem[] = [];
  @Input() chartTitle: string = 'Inventory ROP Chart';

  criticalItems: InventoryItem[] = [];
  warningItems: InventoryItem[] = [];
  normalItems: InventoryItem[] = [];

  constructor() {
    // No initialization here; wait for ngOnInit or OnChanges
  }

  ngOnInit() {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inventoryData'] && !changes['inventoryData'].firstChange) {
      this.updateChart();
    }
  }

  private updateChart() {
    this.categorizeItems();
    this.createChart();
    this.startBlinkingAnimation();
  }

  private categorizeItems() {
    this.criticalItems = this.inventoryData.filter(item =>
      item.quantity < item.rop
    );

    this.warningItems = this.inventoryData.filter(item =>
      item.quantity >= item.rop && item.quantity <= 1.1 * item.rop
    );

    this.normalItems = this.inventoryData.filter(item =>
      item.quantity > 1.1 * item.rop
    );
  }

  private createChart() {
    const ctx = this.inventoryChart.nativeElement.getContext('2d');

    if (!ctx) return;

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    // Prepare data for the pie chart
    const data = [
      this.criticalItems.length,
      this.warningItems.length,
      this.normalItems.length
    ];
    const labels = ['Critical (Below ROP)', 'Warning (Near ROP)', 'Normal (Above ROP)'];
    const backgroundColors = ['#ff4444', '#ff9800', '#4CAF50'];

    const config: ChartConfiguration = {
      type: 'pie' as ChartType,
      data: {
        labels: labels,
        datasets: [{
          label: this.chartTitle,
          data: data,
          backgroundColor: backgroundColors,
          borderColor: ['#ffffff', '#ffffff', '#ffffff'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: this.chartTitle,
            font: {size: 18, weight: 'bold'},
            padding: 20
          },
          legend: {
            display: true,
            position: 'top',
            labels: {usePointStyle: true, padding: 20, font: {size: 12}}
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw as number;
                const total = data.reduce((sum, val) => sum + val, 0);
                const percentage = total ? ((value / total) * 100).toFixed(1) : '0.0';
                return `${label}: ${value} items (${percentage}%)`;
              }
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#2196F3',
            borderWidth: 1
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private startBlinkingAnimation() {
    if (this.criticalItems.length > 0) {
      let isRed = true;
      setInterval(() => {
        if (this.chart) {
          const newColor = isRed ? '#ff9999' : '#ff4444';
          this.chart.data.datasets[0].backgroundColor = [
            newColor,
            // @ts-ignore

            this.chart.data.datasets[0].backgroundColor[1],
            // @ts-ignore

            this.chart.data.datasets[0].backgroundColor[2]
          ];
          this.chart.update();
          isRed = !isRed;
        }
      }, 500); // Blink every 500ms
    }
  }
}
