import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaLigasComponent } from './lista-ligas.component';

describe('ListaLigasComponent', () => {
  let component: ListaLigasComponent;
  let fixture: ComponentFixture<ListaLigasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaLigasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaLigasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
