import { MatCardModule } from '@angular/material/card'; 
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table'; 

import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'; 
import { HttpClientModule } from '@angular/common/http';
import { CapitalizePipe } from './capitalize.pipe';

@NgModule({
 declarations: [
   AppComponent,
   CapitalizePipe
 ],
 imports: [
   BrowserModule, HttpClientModule,
   AppRoutingModule,
   MatCardModule, MatTableModule, MatPaginatorModule, MatIconModule, CommonModule,
   ReactiveFormsModule, MatButtonModule, MatInputModule, 
   MatFormFieldModule, MatSelectModule, MatChipsModule, MatAutocompleteModule,
   MatRippleModule, FormsModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, BrowserAnimationsModule
 ],
 providers: [],
 bootstrap: [AppComponent]
})
export class AppModule { 
  
}