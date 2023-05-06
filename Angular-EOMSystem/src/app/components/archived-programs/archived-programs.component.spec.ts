import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedProgramsComponent } from './archived-programs.component';

describe('ArchivedProgramsComponent', () => {
  let component: ArchivedProgramsComponent;
  let fixture: ComponentFixture<ArchivedProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedProgramsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivedProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
