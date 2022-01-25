import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'sanitizeHtml', pure: false })
export class SanitizeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(data : string): any {
     let htmlData = data.replace(/\n/g, '<br/>');
     return this.sanitizer.sanitize(SecurityContext.HTML, htmlData);
  }

}
