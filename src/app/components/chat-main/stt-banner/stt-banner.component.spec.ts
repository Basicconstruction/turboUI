import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SttBannerComponent } from './stt-banner.component';

describe('SttBannerComponent', () => {
  let component: SttBannerComponent;
  let fixture: ComponentFixture<SttBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SttBannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SttBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
