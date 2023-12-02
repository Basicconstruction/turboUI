import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticTtsComponent } from './static-tts.component';

describe('StaticTtsComponent', () => {
  let component: StaticTtsComponent;
  let fixture: ComponentFixture<StaticTtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaticTtsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaticTtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
