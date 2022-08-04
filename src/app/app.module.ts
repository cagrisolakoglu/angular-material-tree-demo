import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { UbysComponentModule } from './components/ubys-component.module';
import { TreeDemoComponent } from './pages/tree-demo/tree-demo.component';
import { AppComponent } from './shared/app.component';


@NgModule({
  declarations: [
    AppComponent,
    TreeDemoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    UbysComponentModule
  ],
  exports: [TreeDemoComponent],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
