import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserPhotoComponent } from './edit-user-photo.component';

describe('EditUserPhotoComponent', () => {
  let component: EditUserPhotoComponent;
  let fixture: ComponentFixture<EditUserPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUserPhotoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
