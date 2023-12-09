import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DallBannerComponent } from './dall-banner.component';

describe('DallBannerComponent', () => {
  let component: DallBannerComponent;
  let fixture: ComponentFixture<DallBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DallBannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DallBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
