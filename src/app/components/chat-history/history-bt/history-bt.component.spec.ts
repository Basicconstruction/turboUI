import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryBtComponent } from './history-bt.component';

describe('HistoryBtComponent', () => {
  let component: HistoryBtComponent;
  let fixture: ComponentFixture<HistoryBtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoryBtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryBtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
