import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent implements OnInit {
  loading: boolean = false;
  constructor(private commonService: CommonService) {
    this.commonService.isLoading.subscribe((val) => {
      this.loading = val;
    });
  }

  ngOnInit(): void {}
}
