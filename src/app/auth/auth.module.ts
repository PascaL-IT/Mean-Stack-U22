import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../app-material.module';
import { AuthRoutingModule } from '../auth/AuthRoutingModule';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';


@NgModule({
  declarations: [
    LoginComponent, SignupComponent
  ],
  imports: [
    FormsModule, CommonModule, AngularMaterialModule,
    AuthRoutingModule
  ]
})

export class AuthModule { }
