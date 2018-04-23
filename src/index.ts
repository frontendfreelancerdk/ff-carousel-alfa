import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from "./carousel.component";
import { ClonePipe } from "./clone.pipe";


export * from './carousel.component';
export * from './clone.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CarouselComponent,
    ClonePipe
  ],
  exports: [
      CarouselComponent
  ]
})
export class CarouselModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CarouselModule,
      providers: []
    };
  }
}
