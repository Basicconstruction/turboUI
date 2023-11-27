import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogueComponent } from './dialogue.component';

describe('DialogueComponent', () => {
  let component: DialogueComponent;
  let fixture: ComponentFixture<DialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
