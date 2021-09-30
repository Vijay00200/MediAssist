import { Component, OnInit } from '@angular/core';
import { menu } from 'src/app/custom-types';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
})
export class NavMenuComponent implements OnInit {
  appNav: menu[];
  constructor(private auth: AuthService) {
    this.appNav = [
      { menuLabel: 'Search', menuIcon: 'search', routerLink: ['search'] },
      { menuLabel: 'Add Remedy', menuIcon: 'add_task', routerLink: ['remedy'] },
    ];
  }
  ngOnInit(): void {}

  viewMenuButton() {
    return !this.auth.isTokenExpired();
  }

  logOut() {
    this.auth.logOut();
  }
}
