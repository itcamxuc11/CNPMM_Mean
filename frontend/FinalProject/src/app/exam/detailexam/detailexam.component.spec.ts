import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailexamComponent } from './detailexam.component';

describe('DetailexamComponent', () => {
  let component: DetailexamComponent;
  let fixture: ComponentFixture<DetailexamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailexamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailexamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
