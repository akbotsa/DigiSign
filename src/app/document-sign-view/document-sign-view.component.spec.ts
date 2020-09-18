import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSignViewComponent } from './document-sign-view.component';

describe('DocumentSignViewComponent', () => {
  let component: DocumentSignViewComponent;
  let fixture: ComponentFixture<DocumentSignViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentSignViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentSignViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
