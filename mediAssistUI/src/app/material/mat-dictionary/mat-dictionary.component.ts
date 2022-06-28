import { FocusMonitor } from '@angular/cdk/a11y';
import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgControl,
  NgForm,
} from '@angular/forms';
import {
  ErrorStateMatcher,
  mixinDisabled,
  mixinErrorState,
  _Constructor,
  _AbstractConstructor,
  CanUpdateErrorState,
  CanDisable
} from '@angular/material/core';
declare type CanUpdateErrorStateCtor = _Constructor<CanUpdateErrorState> & _AbstractConstructor<CanUpdateErrorState>;
declare type CanDisableCtor = _Constructor<CanDisable> & _AbstractConstructor<CanDisable>;
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { option } from 'src/app/custom-types';

export interface FormFieldValue {
  value: option;
}

export class CustomErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl): boolean {
    return control.dirty && control.invalid;
  }
}

class SearchInputBase {
  constructor(
    public _parentFormGroup: FormGroupDirective,
    public _parentForm: NgForm,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public ngControl: NgControl
  ) {}
}

const _SearchInputMixiBase: CanUpdateErrorStateCtor & CanDisableCtor =
  mixinDisabled(mixinErrorState(SearchInputBase));

@Component({
  selector: 'app-mat-dictionary',
  templateUrl: './mat-dictionary.component.html',
  styleUrls: ['./mat-dictionary.component.css'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: MatDictionaryComponent,
    },
    {
      provide: ErrorStateMatcher,
      useClass: CustomErrorMatcher,
    },
  ],
})
export class MatDictionaryComponent
  extends _SearchInputMixiBase
  implements
    OnInit,
    OnDestroy,
    MatFormFieldControl<FormFieldValue>,
    ControlValueAccessor,
    DoCheck
{
  static nextId = 0;
  // itemCtrl: FormControl;
  form: FormGroup;
  filteredItems: Observable<any[]> | undefined;
  showAddButton: boolean = false;
  private formSubscription$: Subscription | undefined = new Subscription();

  private _options: option[] = [];

  get options(): option[] {
    return this._options;
  }

  @Input() set options(_options: option[]) {
    this._options = _options;
  }

  @Output() addedOption = new EventEmitter();

  constructor(
    private focusMonitor: FocusMonitor,
    @Optional() @Self() public ngControl: NgControl,
    private fb: FormBuilder,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    // this.itemCtrl = new FormControl();
    this.form = this.fb.group({
      itemCtrl: new FormControl(''),
    });

    this.filteredItems = this.form.get('itemCtrl')?.valueChanges.pipe(
      startWith(''),
      map((item) => (item ? this.filterItems(item) : this.options.slice()))
    );
  }
  // errorState: boolean;

  writeValue(obj: any): void {
    this.value = obj;
  }

  public onChangeFn!: (val: any) => {};

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  public onTouchedFn!: () => {};
  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if(isDisabled){
    this.form.disable();
    }else{
      this.form.enable();
    }
    this.stateChanges.next();
  }

  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.input);
    this.stateChanges.complete();
    if (this.formSubscription$) this.formSubscription$.unsubscribe();
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }
  // ngControl = null;
  errorState = false;

  filterItems(_item: string | option) {
    let _value = typeof _item === 'string' ? _item : _item?.value;
    let results = this.options.filter((item) => item.value.includes(_value));
    this.showAddButton = results.length === 0;
    return results;
  }

  ngOnInit(): void {
    this.focusMonitor.monitor(this.input).subscribe((focused) => {
      this.focused = !!focused;
      this.stateChanges.next();
    });
    this.formSubscription$ = this.form
      .get('itemCtrl')
      ?.valueChanges.subscribe((value) => this.onChangeFn(value));
  }

  @ViewChild(MatInput, { read: ElementRef, static: true })
  input!: ElementRef;

  @Input() set value(val: FormFieldValue) {
    this.form.controls['itemCtrl'].setValue(val);
    this.stateChanges.next();
  }

  get value() {
    return this.form.controls['itemCtrl'].value;
  }

  stateChanges = new Subject<void>();

  @HostBinding()
  id = `app-mat-dictionary-id-${MatDictionaryComponent.nextId++}`;

  @Input()
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  get placeholder() {
    return this._placeholder;
  }
  private _placeholder: string = '';

  // ngControl: NgControl | null;
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

  controlType = 'mat-dictionary';

  @HostBinding('attr.aria-describedby') describedBy = '';

  autofilled?: boolean | undefined;
  userAriaDescribedBy?: string | undefined;

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }
  onContainerClick(): void {
    this.focusMonitor.focusVia(this.input, 'program');
  }

  displayFn(item: option): string {
    return item?.value;
  }

  addOption() {
    if (this.disabled) return;
    let option = this.form.controls['itemCtrl'].value;
    if (!this.options.some((entry) => entry.key === option?.key)) {
      this.addedOption.emit(option);
      this.showAddButton = false;
    }
  }

  optionSelected(option: any) {
    if (this.disabled) return;
    this.stateChanges.next();
  }

  clearInput() {
    this.form.controls['itemCtrl'].setValue('');
  }
}
