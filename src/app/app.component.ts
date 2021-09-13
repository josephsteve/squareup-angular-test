import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DynamicScriptLoaderService} from "./dynamic-script-loader.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {PaymentFormDto} from "./square.model";
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";

declare var Square : any; //magic to allow us to access the SquarePaymentForm lib

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'squareup-angular-test';
  paymentForm: FormGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
    street: [''],
    city: [''],
    state: [''],
    zip: [''],
    orderNumber: [''],
    amount: [0]
  });

  constructor(private dsls: DynamicScriptLoaderService, private fb: FormBuilder, private http: HttpClient) {}

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
      console.log('paymentForm', '=>', this.paymentForm.value);

      this.payNow({
        firstName: this.paymentForm.value.firstName,
        lastName: this.paymentForm.value.lastName,
        street: this.paymentForm.value.street,
        city: this.paymentForm.value.city,
        state: this.paymentForm.value.state,
        zip: this.paymentForm.value.zip,
        orderNumber: this.paymentForm.value.orderNumber,
        amount: this.paymentForm.value.amount * 100,
        token: result.token
      }).subscribe(resp => console.log(resp));

      if (result.status === 'OK') {
        console.log(`Payment token is ${result.token}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  ngAfterViewInit() {

  }

  payNow(paymentData: PaymentFormDto): Observable<any> {
    return this.http.post('http://localhost:3000/square/paynow', paymentData, { headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }) });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
