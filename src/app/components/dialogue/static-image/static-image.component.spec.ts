import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticImageComponent } from './static-image.component';

describe('StaticImageComponent', () => {
  let component: StaticImageComponent;
  let fixture: ComponentFixture<StaticImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaticImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaticImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
