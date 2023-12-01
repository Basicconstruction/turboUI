import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticRequestComponent } from './static-request.component';

describe('StaticRequestComponent', () => {
  let component: StaticRequestComponent;
  let fixture: ComponentFixture<StaticRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaticRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaticRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
