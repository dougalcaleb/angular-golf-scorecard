import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {InitCardComponent} from "./components/init-card/init-card.component";
import {HeaderComponent} from "./components/header/header.component";
import {LoadPageComponent} from "./components/load-page/load-page.component";
import {ScorecardPageComponent} from "./components/scorecard-page/scorecard-page.component";
import {ScorecardComponent} from "./components/scorecard/scorecard.component";
import {SidebarComponent} from "./components/sidebar/sidebar.component";

@NgModule({
	declarations: [AppComponent, InitCardComponent, HeaderComponent, LoadPageComponent, ScorecardPageComponent, ScorecardComponent, SidebarComponent],
	imports: [BrowserModule, AppRoutingModule, FormsModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
