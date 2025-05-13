import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaCreditosComponent } from './consulta-creditos.component';

describe('ConsultaCreditosComponent', () => {
  let component: ConsultaCreditosComponent;
  let fixture: ComponentFixture<ConsultaCreditosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaCreditosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaCreditosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
