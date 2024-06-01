import { 
  Component, Input, Output, forwardRef, OnInit, 
  AfterViewChecked, OnChanges, EventEmitter, ViewChild,
  ViewChildren, QueryList, Renderer2, ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDateFormats } from '@angular/material/core';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { enUS } from 'date-fns/esm/locale';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { fromEvent, Subscription } from 'rxjs';
// import { ReCaptcha2Component } from 'ngx-captcha';
import {
  isSameDay, isBefore, isAfter, differenceInMinutes,
  subMinutes, format, startOfDay, parse, parseISO
} from 'date-fns';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
// import { NGXLogger } from 'ngx-logger';
import {
  DefaultMatCalendarRangeStrategy,
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY
} from "@angular/material/datepicker";

// import { UsersService } from '../../../../services';
// import { User } from '../../models';
// import { FormOptionsGroup } from '../../models';

declare var hljs: any;

@Component({
  selector: 'app-scheduler-date',
  templateUrl: './scheduler-date.component.html',
  styleUrls: [ './scheduler-date.component.sass' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SchedulerDateComponent),
      multi: true
    },
  ]
})
export class SchedulerDateComponent implements ControlValueAccessor {

  @Input() caption = '';
  @Input() standalone: boolean = true;
  @Input() right: boolean = false;
  @Input() disabled: boolean = false;

  _value?: any;
  date?: Date;
  allDay: boolean = false;
  editing: boolean = false;
  past: boolean = false;

  constructor() {}

  // Value accessors
  get value() {
    return this._value;
  }
  set value(val: any) {
    this._value = JSON.parse(JSON.stringify(val)) as typeof val;
    this.setDate(this._value);
    this.onChange(this._value);
  }

  // Implementation of ControlValueAccessor
  writeValue(value: any) {
    this._value = value;
    this.setDate(this._value);
  }

  onChange: any = () => {};
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  onTouch: any = () => {};
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  setDate(value: any) {
    if (value?.date && value?.time) {
      this.date = parseISO(value.date+'T'+value.time+'Z');
    }
    else if (value?.date) {
      this.date = parseISO(value.date+'T00:00:00Z');
    }
  }

}

export const MAT_DATE_FNS_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'yyyy-MM-dd',
  },
  display: {
    dateInput: 'yyyy-MM-dd',
    monthYearLabel: 'LLL uuuu',
    dateA11yLabel: 'PP',
    monthYearA11yLabel: 'LLLL uuuu',
  },
};

@Component({
  selector: 'app-input',
  templateUrl: './form-control.component.html',
  styleUrls: [ './form-control.component.sass' ],
  animations: [
    trigger('showHide', [
      state('show', style({ 'width': 'auto', 'max-height': 'auto', 'opacity': '1' })),
      state('hide', style({ 'width': 'auto', 'max-height': '0px', 'opacity': '0', 'margin': '0', 'padding': '0' })),
      transition('show => hide', [ animate('0.1s') ]),
      transition('hide => show', [ animate('0.2s') ]),
    ]),
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormControlComponent),
      multi: true
    },
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DefaultMatCalendarRangeStrategy
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: enUS
    },
    { 
      provide: MAT_DATE_FORMATS, 
      useValue: MAT_DATE_FNS_FORMATS
    },
    {
      provide: DateAdapter<any>,
      useClass: DateFnsAdapter,
      deps: [MAT_DATE_LOCALE]
    }
  ]
})
export class FormControlComponent implements OnInit, OnChanges, AfterViewChecked, ControlValueAccessor {

  @ViewChild('scheduler') scheduler: any;
  @ViewChild('nowmarker') nowMarker: any;
  @ViewChild('circleprogress') circleProgress: any;
  @ViewChild('progressslider') progressSlider: any;

  @ViewChild('toggleField') toggleField: any;
  @ViewChild('sliderField') sliderField: any;
  @ViewChild('selectField') selectField!: MatSelect;
  @ViewChildren(MatOption) selectOptions!: QueryList<MatOption>;
  @ViewChildren(MatButtonToggle) togglesField!: QueryList<MatButtonToggle>;
  @ViewChild('checkboxField') checkboxField: any;
  @ViewChildren(MatCheckbox) checkboxesField!: QueryList<MatCheckbox>;
  @ViewChild('userField') userField: any;
  @ViewChild('badgesField') badgesField: any;
  @ViewChild('dateField') dateField: any;
  @ViewChild('datetimeField') datetimeField: any;
  @ViewChild('dateRangeField') dateRangeField: any;

  @Input() type: string = '';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() errors: string = '';
  @Input() errorStateMatcher: any;
  @Input() options?: Array<any>;
  @Input() multiple: boolean = false;
  @Input() nomargin: boolean = false;
  @Input() invisible: boolean = false;
  @Input() disabled: boolean = false;
  @Input() confirmed: boolean = false;
  @Input() natural: boolean = false;
  @Input() asString: boolean = false;
  @Input() inlineLabel: boolean = true;
  @Input() horizontal: boolean = false;
  @Input() timeSelector: boolean = true;
  @Input() hours24: boolean = false;
  // @Input() allDay: boolean = false;
  @Input() allDaySelector: boolean = true;
  @Input() searchString: string = '';
  @Input() columns: Array<any> = ['name'];
  @Input() min?: number;                                                // Number Plus Minus
  @Input() max?: number;                                                // Number Plus Minus
  @Input() step?: number;                                            // Number Plus Minus
  @Input() schedulerProgress: boolean = true;
  @Output() allDayChange: EventEmitter<any> = new EventEmitter();
  @Output() searchStringChange: EventEmitter<any> = new EventEmitter();
  @Output() valueChangeEvent: EventEmitter<any> = new EventEmitter();

  fieldTypes: Array<string> = [
    'badges',
    'btn-toggle',
    'checkbox',
    'checkboxes',
    'date',
    'daterange',
    'datetime',
    'datetimerange',
    'error',
    'editable-text',
    'inline-search',
    'number',
    'number-plus-minus',
    'password',
    'radio',
    'scheduler',
    'select',
    'dropdown',
    'slider',
    'text',
    'time',
    'timerange',
    'toggle',
    'toggles',
    'user',
    'validated-input',
    'captcha'
  ];

  allDay: boolean = false;
  checkboxesSelected: any = new Array();
  hasFocus: boolean = false;
  userSearchStr: string = '';
  userSearchRes?: Array<any>;
  mouseover: boolean = false;
  isOpen: boolean = true;

  pm: boolean = false;
  hour?: number;
  minute?: number;
  from: any;
  until: any;
  datetimeTime: any;    // Datetime
  searchStringBackup: string = '';

  scheduleEdit: boolean = false;
  schedulerWidth: number = 0;
  schedulerProgressLeft: number = 0;
  schedulerProgressLeftBefore?: number;
  schedulerProgressResizeOrigin: number = 0;
  schedulerMouseUpSubscription?: Subscription;
  schedulerMouseMoveSubscription?: Subscription;

  // Dropdown
  selectedOption: any = {};

  // Date
  dateFieldValue?: any;

  // Time
  timePrev: any = {'hr': 0, 'mn': 0};

  // Date & Time - Single
  dateDate: Date = new Date();
  dateTime?: string = '00:00:00';

  // Date Time Range
  datetimerangeLocal: any;
  datetimerangeAllDay: boolean = false;
  datetimerangeSameDay: boolean = true;
  datetimerangeFrom: any;
  datetimerangeUntil: any;
  datetimerangeTimeRange: any;

  constructor(
    //private usersService: UsersService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}


  // ControlValueAccessor Implementation

  _onChange: any = () => {};
  _onTouch: any = () => {};
  _value: any;

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  set value(val: any) {
    this._value = JSON.parse(JSON.stringify(val)) as typeof val;    // Force 2-Way Binding for arrays and objects (Dirty?)
    this._onChange(this._value);
    this._onTouch(this._value);
  }
  get value() {
    return this._value;
  }

  writeValue(value: any) {

    this._value = value;

    switch (this.type) {

      case 'editable-text':
        this.editedText = value;
        break;

      case 'toggle':
        if (!this.toggleField) break;
        this.toggleField.checked = value;
        break;

      case 'slider':
        if (!this.sliderField) break;
        this.sliderField.value = value;
        break;

      case 'toggles':
        if (!this.togglesField) break;
        for (let toggle of this.togglesField.toArray()) {
          toggle.checked = (value === toggle.value);
        }
        break;

      case 'checkbox':
        if (!this.checkboxField) break;
        this.checkboxField.checked = value;
        break;

      case 'checkboxes':
        if (!this.checkboxesField || value === undefined) break;
        let values = value;
        if (this.asString) values = values.split(',');
        this.checkboxesSelected = values;
        for (let cb of this.checkboxesField.toArray()) {
          cb.checked = values.includes(cb.value);
        }
        break;

      case 'user':
        if (!this.userField) break;
        this.renderer.setProperty(this.userField.nativeElement, 'value', value);
        break;

      case 'badges':
        if (!this.badgesField) break;
        // TO BE IMPLEMENTED
        break;

      case 'dropdown':
        this.selectedOption = this.options?.find(o => o.id == value);
        break;

      case 'time':
        if (!this._value) break;
        this.hour = +this._value.substring(0,2);
        this.minute = +this._value.substring(3,5);
        if (!this.hours24) {
          this.pm = this.hour >= 12;
          this.hour -= this.pm ? 12 : 0;
        }
        this.timePrev.hr = this.hour;
        this.timePrev.mn = this.minute;
        break;

      case 'timerange':
        let defaultTime = '00:00:00';
        if (!this._value) this._value = {'from': defaultTime, 'until': defaultTime};
        if (!this._value.from) this._value.from = defaultTime;
        if (!this._value.until) this._value.until = defaultTime;
        break;

      case 'date':
        if (!this.dateField || !value) break;
        this.dateFieldValue = parse(value, 'yyyy-MM-dd', new Date());
        break;

      case 'datetime':
        if (!this._value) this._value = {'date': undefined, 'time': undefined};
        this.datetimeSetValue(this._value.date, this._value.time, false, true);
        break;

      case 'datetimerange':
        let today = (new Date()).toISOString().substring(0, 10);
        let defaultValue = {'date': today, 'time': undefined}
        if (!this._value) this._value = {'from': defaultValue, 'until': defaultValue};
        if (!this._value.from) this._value.from = defaultValue;
        if (!this._value.until) this._value.until = defaultValue;

        // All Day
        this.datetimerangeAllDay = false;
        if (!this._value.from.time || !this._value.until.time) {
          this.datetimerangeAllDay = true;
          this._value.from.time = undefined;
          this._value.until.time = undefined;
        }

        // Same Day
        if (this.datetimerangeAllDay) {
          this.datetimerangeSameDay = (this._value.from.date == this._value.until.date);
        }
        else {
          this.datetimerangeSameDay = isSameDay(this.datetimerangeFrom, this.datetimerangeUntil);
        }

        // Set the datetime components values
        this.datetimerangeFrom = this._value.from;
        this.datetimerangeUntil = this._value.until;

        // Set the timerange value
        if (!this.datetimerangeAllDay) {
          let dateFrom = parseISO(this.datetimerangeFrom.date+'T'+this.datetimerangeFrom.time+'.000Z');
          let dateUntil = parseISO(this.datetimerangeUntil.date+'T'+this.datetimerangeUntil.time+'.000Z');
          this.datetimerangeTimeRange = {
            'from': format(subMinutes(dateFrom, dateFrom.getTimezoneOffset()), 'HH:mm:ss'),
            'until': format(subMinutes(dateUntil, dateUntil.getTimezoneOffset()), 'HH:mm:ss')
          };
        }
        else {
          this.datetimerangeTimeRange = {'from': undefined, 'until': undefined};
        }

        break;

      case 'daterange':
        if (!this.dateRangeField || !value?.start) break;
        if (this.dateRangeField) {
          this.dateRangeField.startAt = value;
          this.dateRangeField.selected = value;
          this.dateRangeField.ngAfterContentInit();
        }
        break;

      case 'scheduler':
        if (!this.value || !this.value?.from || !this.value?.until || !this.value?.progress) {
          let now = new Date();
          this._value = {
            'from': {'date': undefined, 'time': undefined},
            'until': {'date': undefined, 'time': undefined},
            'progress': 0
          };
        }
        if (value?.from && value?.until && typeof value?.progress === 'number') {
          this._value = value;
        }
        break;

    }

  }


  // OnInit Implementation

  ngOnInit(): void {

    // default labels
    if (!this.label) {
      switch (this.type) {
        case 'date':                this.label = 'Date';
                                    break;
        case 'time':                break;
        case 'datetime':            break;
        case 'daterange':           break;
        case 'number-plus-minus':   break;
        case 'toggles':             break;
        case 'checkboxes':          break;
        case 'scheduler':           break;
        case 'text':                break;
        case 'number':              break;
        case 'datetimerange':       break;
        default:                    this.label = 'No Label';
      }
    }

    if (!this.step) {
      switch (this.type) {
        case 'time':        this.step = 10;
                            break;
        case 'timerange':   this.step = 10;
                            break;
        default:            this.step = 1;
      }
    }

    if (this.type == 'dropdown') this.isOpen = false;

  }

  ngOnChanges(): void {
    switch (this.type) {
      case 'time':
        if (this.hours24 && this.hour) {
          if (this.pm && this.hour!=12) this.hour += 12;
          if (!this.pm && this.hour==12) this.hour = 0;
        }
        if (!this.hours24 && this.hour) {
          this.pm = (this.hour >= 12);
          if (this.hour > 12) this.hour = this.hour - 12;
        }
        this.updateTimeValue();
        break;
      case 'datetime':
        let time = this.allDay ? undefined : this.value?.time;
        this.datetimeSetValue(this.value?.date, time, false, true);
        break;
    }
  }


  // Helpers

  getLocalTzStr() {
    let tzo = -(new Date()).getTimezoneOffset();
    let dif = (tzo >= 0) ? '+' : '-';
    let pad = (num: number) => (num < 10 ? '0' : '') + num;
    return dif + pad(Math.floor(Math.abs(tzo) / 60)) + ':' + pad(Math.abs(tzo) % 60);
  }


  // Field - Editable Text

  editedText: string = '';
  editedTextBackup: string = '';
  keySubscription?: Subscription;

  editableTextConfirm() {
    if (this.editedText != '') {
      this.confirmed = true;
      this.value = this.editedText;
    }
  }

  editableTextInputEvent(event: any): void {
    if (event.type == 'focus') {
      this.editedTextBackup = this.editedText;
      this.keySubscription = fromEvent<KeyboardEvent>(document, 'keydown').subscribe(e => {
        switch (e.code) {
          case 'Escape':  this.editedText = this.editedTextBackup;
                          event.target.blur();
                          break;
          case 'Enter':   this.value = this.editedText;
                          event.target.blur();
                          break;
        }
      });
    }
    else if (event.type == 'blur') {
      this.keySubscription?.unsubscribe();
    }
  }

  setFocusOnInput(event: any) {
    event.target.parentNode.children[0].focus();
  }

  // Field - Inline search

  inlineSearchTrigger(searchString: string) {
    this.searchStringChange.emit(searchString);
  }

  inlineSearchSelect(option: any) {
    this.searchStringBackup = this.searchString;
    this.searchString = option[this.columns.find(o => o.main).property];
    this.value = option.id;
  }

  inlineSearchClear() {
    if (this.value) {
      this.value = undefined;
      this.searchString = this.searchStringBackup;
      this.searchStringChange.emit(this.searchString);
    }
    else {
      this.searchString = '';
      this.options = undefined;
    }
  }


  // Field - Validated Input

  validatedInputText: string = '';

  validatedInputConfirm() {
    if (this.validatedInputText != '') {
      this.confirmed = true;
      this.value = this.validatedInputText;
    }
  }

  validatedInputClear(): void {
    this.validatedInputText = '';
    this.value = '';
    this.confirmed = false;
  }


  // Field - Number Plus/minus

  numberArrowClick(up: boolean) {

    // Value Event
    if (up && this.value == this.max) {
      this.valueChangeEvent.emit({'event': 'max'});
      return;
    }
    if (!up && this.value == this.min) {
      this.valueChangeEvent.emit({'event': 'min'});
      return;
    }

    // Value Update
    let step = this.step==undefined ? 1 : this.step;
    let val = this.value + (up ? 1 : -1) * step;
    if (val%step) val = up ? val-(val%step) : val+step-((val+step)%step);
    if (this.min !== undefined) val = Math.max(val, this.min);
    if (this.max !== undefined) val = Math.min(val, this.max);
    this.value = val;

  }


  // Field - Checkbox (only handles multiple choice - see radio for single)

  checkboxEvent(event: any) {

    let value = event.source.value;
    let checked = event.checked;

    if (checked && !this.checkboxesSelected.includes(value)) {
      this.checkboxesSelected.push(value);
    }
    else if (!checked && this.checkboxesSelected.includes(value)) {
      this.checkboxesSelected.splice(this.checkboxesSelected.indexOf(value), 1);
    }

    if (this.asString) {
      var str = '';
      for (let value of this.checkboxesSelected) str = str + (str.length?',':'') + value
      this.value = str;
    }
    else {
      this.value = this.checkboxesSelected;
    }

  }


  // Field - User

  userEvent(type: any, event: any) {
    switch(type){
      case 'blur':
        this.hasFocus = false;
        break;
      case 'focus':
        this.hasFocus = true;
        break;
      case 'search':
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let searchStringIsEmail = re.test(String(this.userSearchStr).toLowerCase());
        if (this.userSearchStr.length > 2) {
          //this.usersService.search(this.userSearchStr).subscribe(res => this.userSearchRes = res);
        }
        else {
          this.userSearchRes = undefined;
        }
        break;
      case 'select':
        this.mouseover = false;
        this.value = event;
        this.userSearchStr = event.first_name+' '+event.last_name;
        break;
    }
  }


  // Field - Badges

  badgeOpenClose(mouseover: any) {
    this.isOpen = !this.value || mouseover;
  }


  // Field - Dropdown

  dropdownSetValue(option: any) {
    this.selectedOption = option;
    this.value = option.id;
    this.isOpen = false;
  }
  

  // Field - Date

  updateDateValue() {
    let tzo = (new Date()).getTimezoneOffset();
    let utc = subMinutes(this.dateFieldValue, tzo);
    this.value = utc.toISOString().substring(0, 10);
  }


  // Field - Time

  updateTimeValue() {

    // Return if one of the values if empty
    if (this.hour == undefined || this.minute == undefined) return;

    // Edge Case: Minutes=60
    if (this.minute == 60) {
      this.minute = 0;
      this.hour += 1;
    }

    // Edges Cases: Hours
    if (this.hours24) {
      if (this.hour==24) this.hour = 0;
    }
    else {
      if (this.hour==13 && this.pm) this.hour = 1;
      if (this.hour>=12 && !this.pm && this.minute > 0 ) this.hour = 0;
      if (this.hour==0  && (this.pm || !this.pm && this.minute==0)) this.hour = 12;
    }

    // Edges Cases: AM/PM
    if (!this.hours24) {
      if (this.timePrev.hr==12 && this.hour==11 || this.timePrev.hr==11 && this.hour==12) this.pm = !this.pm;
    }

    // Cap the values within the valid range
    this.minute = Math.min(59, Math.max(0, this.minute));
    this.hour = Math.min(this.hours24 ? 23 : 12, Math.max(0, this.hour));

    // Update the component value
    let hour = this.hour;
    if (!this.hours24 && this.pm && this.hour < 12) hour += 12;
    if (!this.hours24 && !this.pm && this.hour==12 && this.minute==0) hour = 0;
    this.value = (''+hour).padStart(2, '0')+':'+(''+this.minute).padStart(2, '0')+':00';

    // Detect Day Change
    if (this.hours24) {
      if (this.hour==23 && this.timePrev.hr==0) {
        this.valueChangeEvent.emit({'event': 'day-down'});
      }
      if (this.hour==0 && this.timePrev.hr==23) {
        this.valueChangeEvent.emit({'event': 'day-up'});
      }
    }
    else {
      if (this.pm && this.hour==11 && (this.timePrev.hr==0 || this.timePrev.hr==12)) {
        this.valueChangeEvent.emit({'event': 'day-down'});
      }
      if (!this.pm && (this.hour==0 || this.hour==12) && this.timePrev.hr==11) {
        this.valueChangeEvent.emit({'event': 'day-up'});
      }
    }

    // Save previous values
    this.timePrev = {'hr': this.hour, 'mn': this.minute};

  }

  timeChangeEventHandler(which: string, event: any) {

    if (which=='min' && event.event=='min') {
      let step = this.step==undefined ? 1 : this.step;
      if (this.hour == undefined) this.hour = 0;
      this.hour -= 1;
      this.minute = 60 - step;
      if (!this.hours24) {
        if (this.hour==0  && this.pm) this.hour = 12;
      }
      if (this.hour < 0) this.hour = this.hours24 ? 23 : 12;
    }

    if (which=='hour' && event.event=='max') {
      this.hour = this.hours24 ? 0 : 1;
    }

    if (which=='hour' && event.event=='min') {
      if (this.hour == undefined) {
        this.hour = 0;
      }
      else {
        if (this.hours24) {
          this.hour = 23;
        }
        else {
          this.pm = true;
          this.hour = 11;
        }
      }
    }

    this.updateTimeValue();

  }

  timeAmPmToggle() {
    this.pm = !this.pm;
    this.updateTimeValue();
  }


  // Field - Time Range

  timeRangeChange() {
    let getHrMn = (s: string) => ({'hr': +s.substring(0,2), 'mn': +s.substring(3,5)});
    let f = getHrMn(this._value.from);
    let u = getHrMn(this._value.until);
    if (u.hr < f.hr) {
      u.hr = f.hr;
      u.mn = f.mn;
    }
    if (u.hr == f.hr && u.mn < f.mn) u.mn = f.mn;
    let formatTime = (t: any) => ((t.hr<10?'0':'')+t.hr+':'+(t.mn<10?'0':'')+t.mn+':00');
    this.value = {'from': formatTime(f), 'until': formatTime(u)};
  }


  // Field - Datetime

  datetimeSetValue(date: Date|string, time?: string, local?: boolean, initial?: boolean) {

    // Convert Date to String (if needed)
    if (date instanceof Date) date = format(date, 'yyyy-MM-dd');

    // Parse the datetime value (From either UTC / Local inputs)
    let dtLocal = parse(date, 'yyyy-MM-dd', new Date());
    if (time) {
      dtLocal = parseISO(date+'T'+time+'.000Z');
      if (local) { // DATE UTC / TIME OFFSET
        let tzo = -(new Date()).getTimezoneOffset();
        let dif = (tzo >= 0) ? '+' : '-';
        let pad = (num: number) => (num < 10 ? '0' : '') + num;
        let tzStr = dif + pad(Math.floor(Math.abs(tzo) / 60)) + ':' + pad(Math.abs(tzo) % 60);
        dtLocal = parseISO(date+'T'+time+tzStr);
      }
    }

    // Update the UI components (Local Time Zone)
    this.allDay = time==undefined || time=='';
    this.dateDate = dtLocal;
    this.dateTime = time ? format(dtLocal, 'HH:mm:ss') : undefined;
    if (this.datetimeField) {     // Reconfigure the datetime field
      this.datetimeField.startAt = this.dateDate;
      this.datetimeField.selected = this.dateDate;
      this.datetimeField.ngAfterContentInit();
    }

    // Update the value (UTC Time Zone)
    if (initial) return;
    this.value = {
      'date': time ? dtLocal.toISOString().substring(0, 10) : format(dtLocal, 'yyyy-MM-dd'),
      'time': time ? dtLocal.toISOString().substring(11, 19) : undefined
    };

  }

  onDateTimeAllDayChange(allDay: any) {
    let time = allDay ? undefined : format(startOfDay(this.dateDate), 'HH:mm:ss');
    this.datetimeSetValue(this.dateDate, time, true);
  }


  // Field - Date Range

  onDateRangeChange(date: Date): void {
    if ( this.value && this.value.start && date > this.value.start && !this.value.end) {
      this.value = new DateRange(this.value.start, date);
    }
    else {
      this.value = new DateRange(date, null);
    }
  }


  // Field - Date Time Range

  datetimerangeOnChange(which: string, value: any) {

    let from = undefined;
    let until = undefined;

    switch (which) {

      case 'from':
        this._value.from = value;
        this._value.until.date = this._value.from.date;
        break;

      case 'until':
        this._value.until = value;
        break;

      case 'timerange':
        let currentFrom = parseISO(this._value.from.date+'T'+this._value.from.time+'Z');
        let currentUntil = parseISO(this._value.until.date+'T'+this._value.until.time+'Z');
        let fromLocal = parse(value.from, 'HH:mm:ss', currentFrom);
        let untilLocal = parse(value.until, 'HH:mm:ss', currentUntil);
        this._value = {
          'from': {
            'date': fromLocal.toISOString().substring(0, 10),
            'time': fromLocal.toISOString().substring(11, 19)
          },
          'until': {
            'date': untilLocal.toISOString().substring(0, 10),
            'time': untilLocal.toISOString().substring(11, 19)
          }
        };
        break;

      case 'all_day':
        if (value) {
          from = parseISO(this._value.from.date+'T'+this._value.from.time+'Z');
          until = parseISO(this._value.until.date+'T'+this._value.until.time+'Z');
          this._value = {
            'from': {
              'date': subMinutes(from, from.getTimezoneOffset()).toISOString().substring(0, 10),
              'time': undefined
            },
            'until': {
              'date': subMinutes(until, until.getTimezoneOffset()).toISOString().substring(0, 10),
              'time': undefined
            }
          };
        }
        else {
          let tzStr = this.getLocalTzStr();
          from = parseISO(this._value.from.date+'T00:00:00'+tzStr);
          until = parseISO(this._value.until.date+'T00:00:00'+tzStr);
          this._value = {
            'from': {
              'date': from.toISOString().substring(0, 10),
              'time': from.toISOString().substring(11, 19)
            },
            'until': {
              'date': until.toISOString().substring(0, 10),
              'time': until.toISOString().substring(11, 19)
            }
          };
        }
        this.datetimerangeTimeRange = {'from': '00:00:00', 'until': '00:00:00'};
        this.datetimerangeFrom = this._value.from;
        this.datetimerangeUntil = this._value.until;
        break;

      case 'same_day':
        if (value) {
          this._value.until.date = this._value.from.date;
          from = parseISO(this._value.from.date+'T'+this._value.from.time+'Z');
          until = parseISO(this._value.until.date+'T'+this._value.until.time+'Z');
          this.datetimerangeTimeRange = {
            'from': subMinutes(from, from.getTimezoneOffset()).toISOString().substring(11, 19),
            'until': subMinutes(until, until.getTimezoneOffset()).toISOString().substring(11, 19)
          };
        }
        break;

    }
    this.value = this._value;
  }


  // Field - Scheduler

  ngAfterViewChecked() {
    if (this.scheduler) {
      this.schedulerWidth = this.scheduler.nativeElement.clientWidth;
      this.schedulerProgressLeft = 25 + (this.value?.progress / 100) * (this.schedulerWidth - 136);

      // Position Progress & Now markers
      if(this.circleProgress && this.progressSlider) {
        this.circleProgress.nativeElement.style.left = (this.schedulerProgressLeft+35)+'px';
        this.progressSlider.nativeElement.style.left = this.schedulerProgressLeft+'px';
        this.positionNowMarker();
      }
    }
  }

  schedulerMouseDownEvent(event: any) {

    if (this.disabled) return;

    this.schedulerProgressLeftBefore = this.schedulerProgressLeft;
    this.schedulerProgressResizeOrigin = event.clientX;

    this.schedulerMouseUpSubscription = fromEvent(window, 'mouseup').subscribe((res: any) => {
      this.schedulerProgressLeftBefore = undefined;
      this.schedulerMouseUpSubscription?.unsubscribe();
      this.schedulerMouseMoveSubscription?.unsubscribe();
      this.value = this.value;
    });

    this.schedulerMouseMoveSubscription = fromEvent(window, 'mousemove').subscribe((res: any) => {
      this.schedulerProgressLeft = this.schedulerProgressLeftBefore + res.clientX - this.schedulerProgressResizeOrigin;
      this._value.progress = Math.min(100, Math.max(0, Math.ceil(100 * (this.schedulerProgressLeft - 25) / (this.schedulerWidth - 136))));
      if (this.schedulerProgressLeft < 25) this.schedulerProgressLeft = 25;
      if (this.schedulerProgressLeft > this.schedulerWidth - 111) this.schedulerProgressLeft = this.schedulerWidth - 111;
    });

  }

  schedulerAllDayChanged(allDay: any) {
    //this.logger.info('FormControlComponent::schedulerAllDayChanged', allDay);
    this.allDayChange.emit(allDay);
  }

  ngOnDestroy() {
    if (this.schedulerMouseUpSubscription) this.schedulerMouseUpSubscription.unsubscribe();
    if (this.schedulerMouseMoveSubscription) this.schedulerMouseMoveSubscription.unsubscribe();
  }

  parse = (v: any) => {
    if (v.date && !v.time) return parseISO(v.date+'T00:00:00Z');
    if (v.time) return parseISO(v.date+'T'+v.time+'Z');
    return undefined;
  };

  schedulerDateChanged(which: string, val: any) {
    //this.logger.info('FormControlComponent::schedulerDateChanged', which, val);
    switch (which) {
      case 'from':      this._value.from = val;
                        break;
      case 'until':     this._value.until = val;
                        break;
      case 'default' :  break;
    }

    // Parse to Date
    let from = this.parse(this.value.from);
    let until = this.parse(this.value.until);

    // Set the unset date
    if (from && !until) this._value.until = this.value.from;
    if (until && !from) this._value.from = this.value.until;

    // Make sure start is before end
    if (from && until) {
      if (isAfter(from, until)) {
        if (which==='from') this.value.until = this.value.from;
        if (which==='end') this.value.from = this.value.until;
      }
    }

    // Update the value
    this.value = this.value;
  }

  positionNowMarker() {
    if (!this.value) return;
    let left = 0;
    let now = new Date();
    let from = this.parse(this.value.from);
    let until = this.parse(this.value.until);
    if (from && until) {
      if (isBefore(now, from)) {
        left = 0;
      }
      else if (isAfter(now, until)) {
        left = this.schedulerWidth - 44;
      }
      else {
        let diffTotal = differenceInMinutes(until, from);
        let diffNow = differenceInMinutes(now, from);
        left = 64 + (this.schedulerWidth - 168) * diffNow / diffTotal;
      }
    }
    this.nowMarker.nativeElement.style.left = left + 'px';
  }


  // Field - Captcha
  // public captchaIsLoaded = false;
  // public captchaSuccess = false;
  // public captchaIsExpired = false;
  // @ViewChild('captchaElem', { static: false }) captchaElem!: ReCaptcha2Component;

  handleCaptchaSuccess(captchaResponse: string): void {
    // this.captchaSuccess = true;
    // this.value = captchaResponse;
    // this.captchaIsExpired = false;
    // this.cdr.detectChanges();
  }

  // getCurrentResponse(): void {
  //   const currentResponse = this.captchaElem.getCurrentResponse();
  //   if (!currentResponse) {
  //     alert('There is no current response - have you submitted captcha?');
  //   } else {
  //     alert(currentResponse);
  //   }
  // }

  // getResponse(): void {
  //   const response = this.captchaElem.getResponse();
  //   if (!response) {
  //     alert('There is no response - have you submitted captcha?');
  //   } else {
  //     alert(response);
  //   }
  // }

  // reload(): void {
  //   this.captchaElem.reloadCaptcha();
  // }

  // getCaptchaId(): void {
  //   alert(this.captchaElem.getCaptchaId());
  // }

  // reset(): void {
  //   this.captchaElem.resetCaptcha();
  // }

  // private highlight(): void {
  //   const highlightBlocks = document.getElementsByTagName('code');
  //   for (let i = 0; i < highlightBlocks.length; i++) {
  //     const block = highlightBlocks[i];
  //     hljs.highlightBlock(block);
  //   }
  // }

}
