import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DynamicScriptLoaderService} from "./dynamic-script-loader.service";

declare var Square : any; //magic to allow us to access the SquarePaymentForm lib

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'squareup-angular-test';

  constructor(private dsls: DynamicScriptLoaderService) {}

  card: any; //this is our payment form object

  async ngOnInit() {
    await this.dsls.loadScript('square-sandbox');
    const APPLICATION_ID = "sandbox-sq0idb-Nw4BN7SVby0XW9QnlUnpuQ";
    const LOCATION_ID = "LEQZ2MYEDGRJT";

    const payments = Square.payments(APPLICATION_ID, LOCATION_ID);
    this.card = await payments.card();
    await this.card.attach('#card-container');
  }

  async requestCardNonce(event: any) {
    event.preventDefault();
    try {
      //@ts-ignore
      const result = await this.card.tokenize();

      if (result.status === 'OK') {
        console.log(`Payment token is ${result.token}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  ngAfterViewInit() {

  }
}
