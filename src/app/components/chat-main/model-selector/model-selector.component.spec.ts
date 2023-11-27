import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelSelectorComponent } from './model-selector.component';

describe('ModelSelectorComponent', () => {
  let component: ModelSelectorComponent;
  let fixture: ComponentFixture<ModelSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModelSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
