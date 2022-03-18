import { NgModule } from "@angular/core";

import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../app-material.module';
import { AppRoutingModule } from '../app-routing.module';
import { CommonModule } from "@angular/common";

import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { SanitizeHtmlPipe } from './post-list/sanitizehtml-pipe';


@NgModule({

  declarations: [ PostCreateComponent ,
                  PostListComponent ,
                  SanitizeHtmlPipe      ],

  imports: [ ReactiveFormsModule,
             AngularMaterialModule,
             AppRoutingModule,
             CommonModule           ]

})

export class PostModule {}
