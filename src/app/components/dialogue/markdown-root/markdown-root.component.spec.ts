import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownRootComponent } from './markdown-root.component';

describe('MarkdownRootComponent', () => {
  let component: MarkdownRootComponent;
  let fixture: ComponentFixture<MarkdownRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarkdownRootComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarkdownRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
