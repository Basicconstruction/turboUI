import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TtsBannerComponent } from './tts-banner.component';

describe('TtsBannerComponent', () => {
  let component: TtsBannerComponent;
  let fixture: ComponentFixture<TtsBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TtsBannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TtsBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
