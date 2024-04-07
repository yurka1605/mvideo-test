import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CoreComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: CoreComponent}
    ]),
  ],
})
export class CoreModule { }
