export class PaymentFormDto {
  firstName: string | undefined;
  lastName: string | undefined;
  street: string | undefined;
  city: string | undefined;
  state: string | undefined;
  zip: string | undefined;
  orderNumber: string | undefined;
  amount: bigint | undefined;
  token: string | undefined;
}
