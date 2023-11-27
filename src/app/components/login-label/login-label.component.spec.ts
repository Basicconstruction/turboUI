import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginLabelComponent } from './login-label.component';

describe('LoginLabelComponent', () => {
  let component: LoginLabelComponent;
  let fixture: ComponentFixture<LoginLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginLabelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
