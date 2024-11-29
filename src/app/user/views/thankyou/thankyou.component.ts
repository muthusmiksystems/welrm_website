// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss']
})
export class ThankyouComponent implements OnInit {
  response:any = [];

  @ViewChild('invoice') invoiceElement!: ElementRef;

  constructor(private router: Router) { 
    if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation()?.extras.state) {
      this.response = this.router.getCurrentNavigation()?.extras.state;
    }
  }

  ngOnInit(): void {
  }

  downloadPdf()
  {
      // const doc = new jsPDF();
      // autoTable(doc, { html: '#my-table' })
      // doc.save('table.pdf')


      html2canvas(this.invoiceElement.nativeElement, { scale: 3 }).then((canvas) => {
        const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
        const fileWidth = 200;
        const generatedImageHeight = (canvas.height * fileWidth) / canvas.width;
        let PDF = new jsPDF('p', 'mm', 'a4',);
        PDF.addImage(imageGeneratedFromTemplate, 'PNG', 0, 5, fileWidth, generatedImageHeight,);
        PDF.html(this.invoiceElement.nativeElement.innerHTML)
        PDF.save('invoice'+this.response.data.data.id+'.pdf');
      });
    

  }
}
