import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TaskGeneratorComponent } from './task-generator/task-generator.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskGeneratorComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
