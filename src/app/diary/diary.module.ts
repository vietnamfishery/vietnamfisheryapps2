import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiaryRoutingModule } from './diary-routing.module';
import { DiaryComponent, CalendarDialogComponent } from './diary.component';
import { DiaryService } from './diary.service';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MatToolbarModule, MatIconModule, MatCardModule, MatInputModule, MatButtonModule, MatDialogModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTableModule,
    FlexLayoutModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    DiaryRoutingModule
  ],
  declarations: [
    DiaryComponent,
    CalendarDialogComponent
  ],
  bootstrap: [
    DiaryComponent
  ],
  entryComponents: [
    DiaryComponent,
    CalendarDialogComponent
  ],
  providers: [
    DiaryService
  ]
})
export class DiaryModule { }