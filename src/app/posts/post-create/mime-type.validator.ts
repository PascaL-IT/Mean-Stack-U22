import { AbstractControl } from "@angular/forms";
import { Observable, Observer } from "rxjs";

export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any } | null> | Observable<{ [key: string]: any } | null> => {

  if (! (control.value instanceof File)) {
    return new Observable();
  }

  const file = control.value as File;
  const fileReader = new FileReader();

  const frObserver = new Observable( (observer: Observer<{ [key: string]: any } | null> ) => {

    fileReader.addEventListener('loadend', () => {

        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
        // console.log("DEBUG: mimeType - arr=" + arr);

        let header = "";
        let isValid = false;

        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        // console.log("DEBUG: mimeType - file header=" + header);

        switch (header) {
          case "89504e47": isValid = true;
                           break;
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8": isValid = true;
                           break;
          default: isValid = false; // Or you can use the blob.type as fallback
                   break;
        }

        if (isValid) {
          observer.next(null);

        } else {
          observer.next({ invalidMimeType: true });
        }

        observer.complete();

    }); // addEventListener

    fileReader.readAsArrayBuffer(file);
  });

  return frObserver;
};
