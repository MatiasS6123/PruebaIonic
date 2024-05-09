import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotaPageRoutingModule } from './nota-routing.module';

import { NotaPage } from './nota.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NotaPage]
})
export class NotaPageModule {}
