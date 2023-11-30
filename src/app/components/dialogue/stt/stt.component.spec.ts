import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SttComponent } from './stt.component';

describe('SttComponent', () => {
  let component: SttComponent;
  let fixture: ComponentFixture<SttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SttComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
