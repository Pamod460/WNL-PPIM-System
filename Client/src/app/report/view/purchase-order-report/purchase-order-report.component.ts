import {Component, OnInit} from '@angular/core';
declare var google: any;
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-purchase-order-report',
  templateUrl: './purchase-order-report.component.html',
  styleUrls: ['./purchase-order-report.component.css']
})
export class PurchaseOrderReportComponent implements OnInit {





  constructor() {}

  ngOnInit(): void {
    this.loadGoogleCharts();
  }

  loadGoogleCharts() {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.onload = () => {
      google.charts.load('current', { packages: ['corechart'] });
      google.charts.setOnLoadCallback(() => this.drawAllCharts());
    };
    document.body.appendChild(script);
  }

  drawAllCharts() {
    this.drawMonthlyOrderCost();
    this.drawApprovalStatus();
    this.drawTopPapers();
    this.drawTopMaterials();
    this.drawSupplierSpending();
    this.drawOrderVolumeComparison();
  }

  drawMonthlyOrderCost() {
    const data = google.visualization.arrayToDataTable([
      ['Month', 'Paper Orders', 'Material Orders'],
      ['Jan', 120000, 75000],
      ['Feb', 85000, 96000],
      ['Mar', 145000, 118000],
    ]);

    const options = {
      title: 'Monthly Purchase Order Cost (LKR)',
      vAxis: { title: 'LKR' },
      hAxis: { title: 'Month' },
      seriesType: 'bars',
      series: { 1: { type: 'line' } }
    };

    const chart = new google.visualization.ComboChart(document.getElementById('monthly_order_cost'));
    chart.draw(data, options);
  }

  drawApprovalStatus() {
    const data = google.visualization.arrayToDataTable([
      ['Status', 'Count'],
      ['Approved Both', 5],
      ['Only Accountant Approved', 1],
      ['Pending', 2]
    ]);

    const options = {
      title: 'Approval Status Distribution (Paper + Material Orders)'
    };

    const chart = new google.visualization.PieChart(document.getElementById('approval_status'));
    chart.draw(data, options);
  }

  drawTopPapers() {
    const data = google.visualization.arrayToDataTable([
      ['Paper Type', 'Quantity'],
      ['Newsprint (45 GSM)', 1000],
      ['Glossart Paper (60 GSM)', 800]
    ]);

    const options = {
      title: 'Top Ordered Papers by Quantity'
    };

    const chart = new google.visualization.BarChart(document.getElementById('top_papers'));
    chart.draw(data, options);
  }

  drawTopMaterials() {
    const data = google.visualization.arrayToDataTable([
      ['Material', 'Quantity'],
      ['Black Ink', 600],
      ['Cyan Ink', 500],
      ['Magenta Ink', 400],
      ['Yellow Ink', 450]
    ]);

    const options = {
      title: 'Top Ordered Materials by Quantity'
    };

    const chart = new google.visualization.ColumnChart(document.getElementById('top_materials'));
    chart.draw(data, options);
  }

  drawSupplierSpending() {
    const data = google.visualization.arrayToDataTable([
      ['Supplier', 'Total Spend (LKR)'],
      ['PrintCorp Ltd.', 150000],
      ['InkMasters', 130000],
      ['PaperPro', 168000],
      ['Supreme Suppliers', 94000]
    ]);

    const options = {
      title: 'Supplier-wise Spending'
    };

    const chart = new google.visualization.PieChart(document.getElementById('supplier_spending'));
    chart.draw(data, options);
  }

  drawOrderVolumeComparison() {
    const data = google.visualization.arrayToDataTable([
      ['Month', 'Paper Orders', 'Material Orders'],
      ['Jan', 2, 1],
      ['Feb', 1, 1],
      ['Mar', 2, 1]
    ]);

    const options = {
      title: 'Order Volume Comparison (Paper vs Material)',
      bars: 'vertical',
      vAxis: { title: 'Number of Orders' },
      hAxis: { title: 'Month' }
    };

    const chart = new google.visualization.ColumnChart(document.getElementById('order_volume'));
    chart.draw(data, options);
  }

  downloadPDF() {
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) return;

    html2canvas(dashboard, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save('purchase-order-dashboard.pdf');
    });
}}
