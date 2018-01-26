import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MainviewComponent } from '../pages/mainview/mainview.component';
import {Routes, RouterModule} from "@angular/router";
import { ChartsModule } from 'ng2-charts';
import {FindAnomaliesComponent} from "../pages/find-anomalies/find-anomalies.component";
import { AboutComponent } from '../pages/about/about.component';
import { AccountSettingsComponent } from '../pages/account-settings/account-settings.component';
import { ChangePasswordComponent } from '../pages/change-password/change-password.component';

const appRoutes: Routes = [

  { path: 'mainview', component: MainviewComponent },
  { path: 'findAnomalies', component: FindAnomaliesComponent },
  { path: 'about', component: AboutComponent },
  { path: 'accountSettings', component: AccountSettingsComponent },
  { path: 'changePass', component: ChangePasswordComponent },
];
@NgModule({
  declarations: [
    AppComponent,
    MainviewComponent,
    FindAnomaliesComponent,
    AboutComponent,
    AccountSettingsComponent,
    ChangePasswordComponent,
  ],
  imports: [
    ChartsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(
        appRoutes,
        { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
