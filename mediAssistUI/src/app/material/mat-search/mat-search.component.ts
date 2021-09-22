import { FocusMonitor } from '@angular/cdk/a11y';
import {
  ElementRef,
  HostBinding,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { option, optionSet } from 'src/app/custom-types';

export interface FormFieldValue {
  scope: number;
  query: option;
}

@Component({
  selector: 'app-mat-search',
  templateUrl: './mat-search.component.html',
  styleUrls: ['./mat-search.component.css'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: MatSearchComponent,
    },
  ],
})
export class MatSearchComponent
  implements
    OnInit,
    OnDestroy,
    MatFormFieldControl<FormFieldValue>,
    ControlValueAccessor
{
  static nextId = 0;

  form: FormGroup;

  @Input() searchByOptions: option[] = [];

  @Input() optionSets: optionSet[] = [];

  filteredItems: Observable<option[] | undefined>;

  private formSubscription$: Subscription | undefined = new Subscription();

  constructor(
    private fb: FormBuilder,
    private focusMonitor: FocusMonitor,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    this.form = this.fb.group({
      scope: new FormControl(''),
      query: new FormControl(''),
    });

    this.filteredItems = this.form.controls['query']?.valueChanges.pipe(
      startWith(''),
      map((item) => (item ? this.filterItems(item) : this.getOption()))
    );

    // this.form.valueChanges.subscribe(console.log);
  }

  getOption(): option[] | undefined {
    let currentOption = this.optionSets.filter(
      (option) => option.optionSetKey === +this.form.controls['scope'].value
    );

    if (currentOption) {
      return currentOption[0]?.optionSetValue?.slice();
    }
    return undefined;
  }

  filterItems(_item: string | option) {
    let _value = typeof _item === 'string' ? _item : _item?.value;
    let options = this.getOption();
    let results = options?.filter((item) => item.value.includes(_value));
    return results;
  }

  @ViewChild(MatInput, { read: ElementRef, static: true })
  input!: ElementRef;

  @Input() set value(value: FormFieldValue) {
    this.form.patchValue(value);
    this.stateChanges.next();
  }
  get value() {
    return this.form.value;
  }

  stateChanges = new Subject<void>();

  @HostBinding()
  id = `app-mat-search-${MatSearchComponent.nextId++}`;

  @Input()
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  get placeholder() {
    return this._placeholder;
  }
  private _placeholder: string = '';

  focused: boolean = false;

  get empty(): boolean {
    return !this.value;
  }

  @HostBinding('class.floated')
  get shouldLabelFloat(): boolean {
    return true;
  }

  @Input()
  required: boolean = false;

  @Input()
  disabled: boolean = false;

  errorState: boolean = false;

  controlType = 'mat-search';
  autofilled?: boolean | undefined;
  userAriaDescribedBy?: string | undefined;

  @HostBinding('attr.aria-describedby') describedBy = '';

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }
  onContainerClick(): void {
    this.focusMonitor.focusVia(this.input, 'program');
  }

  writeValue(obj: FormFieldValue): void {
    this.value = obj;
  }

  public onChangeFn!: (val: FormFieldValue) => {};

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  public onTouchedFn!: () => {};
  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.input);
    this.stateChanges.complete();
  }

  ngOnInit(): void {
    this.form.controls['scope'].setValue(this.searchByOptions[0]?.key);

    this.focusMonitor.monitor(this.input).subscribe((focused) => {
      this.focused = !!focused;
      this.stateChanges.next();
    });

    this.formSubscription$ = this.form.valueChanges.subscribe((value) => {
      if (this.onChangeFn) this.onChangeFn(value);
    });
  }

  clearInput() {
    this.form.controls['query'].setValue('');
  }

  displayFn(item: option): string {
    return item?.value;
  }

  optionSelected(option: any) {
    if (this.disabled) return;
    this.stateChanges.next();
  }
}
