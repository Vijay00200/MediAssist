import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { noop } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  onLoginClick() {
    if (this.form.invalid) return;
    this.authService.loginUsingCredentials(this.form.value).subscribe(
      noop,
      (error) => this.handleloginError(error),
      () => this.router.navigate(['/'])
    );
  }

  handleloginError(error: any) {
    this.commonService.openSnackBar('Unable to login, please try again', false);
    console.log(error);
    this.form.reset();
  }
}
