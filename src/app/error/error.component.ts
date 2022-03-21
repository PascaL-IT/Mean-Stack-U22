import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  templateUrl: './error.component.html'
})

export class ErrorComponent {

  // Dialog used to display an error message
  constructor(@Inject(MAT_DIALOG_DATA) public data: { status: string , error_message: string }) {};

}
