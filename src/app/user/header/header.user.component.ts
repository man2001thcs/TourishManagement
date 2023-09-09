import { User } from './../../model/user';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/utility/user_service/user.service';

@Component({
  selector: 'app-user-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderUserComponent {
  searchFormGroup!: FormGroup;

  constructor(private dialog: MatDialog, private userService: UserService) {}
  id = 0;

  ngOnInit(): void {
    this.id = Number(localStorage.getItem('id')) ?? 0;
    console.log(localStorage.getItem('id'));
  }

  formSubmit(): void {}
}
