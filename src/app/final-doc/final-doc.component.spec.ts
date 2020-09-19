import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalDocComponent } from './final-doc.component';

describe('FinalDocComponent', () => {
  let component: FinalDocComponent;
  let fixture: ComponentFixture<FinalDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
