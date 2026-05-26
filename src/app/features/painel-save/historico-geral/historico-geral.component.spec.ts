import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoGeralComponent } from './historico-geral.component';

describe('HistoricoGeralComponent', () => {
  let component: HistoricoGeralComponent;
  let fixture: ComponentFixture<HistoricoGeralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricoGeralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
