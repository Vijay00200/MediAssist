import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ApiModule } from 'src/app/services/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authClient: ApiModule.AuthClient,
    private router: Router,
    private commonService: CommonService
  ) {
    this.form = this.fb.group({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  onLoginClick() {
    if (this.form.invalid) return;
    this.authClient.login(this.form.value as ApiModule.Login).subscribe(
      (response) => {
        response?.data.text().then((resp) => {
          const _resp = JSON.parse(resp);
          localStorage.setItem('jwt', _resp.token);
          this.router.navigate(['/']);
        });
      },
      (error) => {
        this.commonService.openSnackBar(
          'Unable to login, please try again',
          false
        );
        console.log(error);
        this.form.reset();
      }
    );
  }
}
