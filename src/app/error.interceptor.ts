
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { ErrorComponent } from './error/error.component';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog : MatDialog) {};

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
               .pipe( catchError( (httpError: HttpErrorResponse) => {
                         console.log("ErrorInterceptor: HTTP error catched...");
                         console.log(httpError); // DEBUG
                         // alert('Status: ' + httpError.status + ' , Message: ' + httpError.error.message );

                         const dialogConfig = new MatDialogConfig();
                         dialogConfig.disableClose = false;
                         dialogConfig.autoFocus = true;
                         if (httpError.status === 0) {
                          dialogConfig.data = { status: '503' , error_message:  httpError.statusText }; // Service Unavailable
                         } else {
                          dialogConfig.data = { status: httpError.status , error_message: httpError.error.message };
                         }
                         // dialogConfig.position = { 'top': '0', left: '0' };
                         // dialogConfig.width = "40em";
                         // dialogConfig.height = "20em";
                         this.dialog.open(ErrorComponent, dialogConfig);
                         return throwError(httpError);
                 }) );
  } // intercept

}
