import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoaRenewComponent } from './moa-renew.component';

describe('MoaRenewComponent', () => {
  let component: MoaRenewComponent;
  let fixture: ComponentFixture<MoaRenewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoaRenewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoaRenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
