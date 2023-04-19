import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPartnerComponent } from './add-partner.component';

describe('AddPartnerComponent', () => {
  let component: AddPartnerComponent;
  let fixture: ComponentFixture<AddPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPartnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
