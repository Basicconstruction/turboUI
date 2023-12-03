import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisionBannerComponent } from './vision-banner.component';

describe('VisionBannerComponent', () => {
  let component: VisionBannerComponent;
  let fixture: ComponentFixture<VisionBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisionBannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisionBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
