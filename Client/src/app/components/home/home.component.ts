import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { TradeService } from 'src/app/services/trade.service';
import { Trade, Langulge } from 'src/app/config/enums';
import { StaticDate } from 'src/app/config/ststic.data';
import { CustomValidators } from 'src/app/config/custom.validation';
import { ITrade } from 'src/app/models/trade';
import { IPaging } from 'src/app/models/paging';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  tradeFrom: FormGroup;
  tradeList: IPaging = { page: 1, size: 10 } as IPaging;
  searchTrade = new FormControl(0);
  searchLevel = new FormControl(0);
  pagesize = new FormControl(10);
  syllabusFile: File = null;
  planFile: File = null;
  trades = Trade;
  tradeKeys = [];
  levels: any[] = StaticDate.levelList();
  levelList: any[] = [];
  languageList = StaticDate.languageList();
  modalTitle = 'Created Trade';
  buttonText = { value: 0, text: 'save' };
  message = '';
  config: any = {};

  constructor(private fb: FormBuilder, private tradeService: TradeService) {
  }

  ngOnInit() {
    this.tradeFrom = this.fb.group({
      id: [0],
      tradeId: ['', Validators.required],
      level: ['', Validators.required],
      syllabusName: ['', Validators.required],
      devOffer: ['', Validators.required],
      manager: ['', Validators.required],
      activeDate: ['', Validators.required],
      langs: this.fb.array(
        this.languageList.map(e => new FormControl(e.isChecked)),
        CustomValidators.multipleCheckboxRequireOne
      ),
      languages: []
    });
    this.tradeKeys = Object.keys(Trade).filter(Number);
    this.loadTrade(1);
  }

  loadTrade(page: number) {
    this.tradeService.getTrades(page, this.pagesize.value, this.searchTrade.value, this.searchLevel.value)
      .subscribe(s => {
        this.tradeList = s as IPaging;
        this.config = {
          itemsPerPage: this.pagesize.value,
          currentPage: page,
          totalItems: this.tradeList.totalPage
        };
      }
      );
  }

  pageChanged(event) {
    this.loadTrade(event);
  }

  search() {
    this.loadTrade(1);
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  onSubmit() {
    const data = this.tradeFrom.value as ITrade;
    const obj: ITrade = {
      id: data.id || 0, tradeId: data.tradeId, level: data.level,
      language: JSON.stringify(this.languageList.filter(s => s.isChecked).map(r => r.value)),
      syllabusName: data.syllabusName, devOffer: data.devOffer, manager: data.manager,
      activeDate: data.activeDate
    } as ITrade;
    const formData = new FormData();
    if (this.buttonText.value) {
      if (this.syllabusFile.size) {
        formData.append('syllabussfile', this.syllabusFile, this.syllabusFile.name);
      } else {
        obj.syllbusFileName = this.syllabusFile.name;
      }
      if (this.planFile.size) {
        formData.append('planfile', this.planFile, this.planFile.name);
      } else {
        obj.planFileName = this.planFile.name;
      }

      formData.append('model', JSON.stringify(obj));
      this.tradeService.update(formData).subscribe((res: ITrade) => {
        this.syllabusFile = null;
        this.planFile = null;
        this.clearFormArray(this.tradeFrom.get('langs') as FormArray);
        this.tradeFrom.reset();
        this.message = 'update success!';
        const index = this.tradeList.data.findIndex(s => s.id === res.id);
        this.tradeList.data[index] = res;
      });

    } else {
      formData.append('model', JSON.stringify(obj));
      formData.append('syllabussfile', this.syllabusFile, this.syllabusFile.name);
      formData.append('planfile', this.planFile, this.planFile.name);
      this.tradeService.add(formData).subscribe((res: ITrade) => {
        this.message = 'save success!';
        this.syllabusFile = null;
        this.planFile = null;
        this.clearFormArray(this.tradeFrom.get('langs') as FormArray);
        this.tradeFrom.reset();
        this.tradeList.data.unshift(res);
        if (this.tradeList.data > this.pagesize.value) {
          this.tradeList.data.pop();
        }
      });
    }


  }

  clearData() {
    this.message = '';
    this.buttonText = { value: 0, text: 'save' };
    this.modalTitle = 'Created Trade';
  }
  checkedAdd(e: any) {
    this.languageList.find(s => s.value === e.target.value).isChecked = true;
  }
  tradeChange(value: any) {
    this.levelList = this.levels.filter(s => s.tradeId === Number(value.target.value));
  }

  searchtradeChange(value: any) {
    this.searchLevel = new FormControl(0);
    this.levelList = this.levels.filter(s => s.tradeId === Number(value.target.value));
  }

  fileSullbusAdd(fileInput: any) {
    const file = fileInput.target.files[0] as File;
    this.syllabusFile = file;
  }

  filePlanAdd(fileInput: any) {
    const file = fileInput.target.files[0] as File;
    this.planFile = file;
  }

  add() {
    this.clearData();
    // this.clearFormArray(this.tradeFrom.get('langs') as FormArray);
    this.tradeFrom.reset();
  }
  edit(trade: ITrade) {
    this.clearData();
    this.buttonText = { value: 1, text: 'update' };
    this.modalTitle = 'Update Trade';
    this.clearFormArray(this.tradeFrom.get('langs') as FormArray);
    this.tradeFrom.reset();
    this.levelList = this.levels.filter(s => s.tradeId === trade.tradeId);
    this.tradeFrom.patchValue(trade);
    this.syllabusFile = new File([], trade.planFileName);
    this.planFile = new File([], trade.planFileName);
    this.tradeFrom.get('activeDate').setValue(trade.activeDate.toString().split('T')[0]);
    const lans: any[] = JSON.parse(trade.language);
    this.languageList = this.languageList.map(e => {
      if (!lans.find(r => r === e.value)) { return e; }
      e.isChecked = true;
      return e;
    });
    this.languageList.map(e => {
      const linesFormArray = this.tradeFrom.get('langs') as FormArray;
      linesFormArray.push(new FormControl(e.isChecked));
    });
  }

  download(filename: string) {
    this.tradeService.fileDownload(filename).subscribe((res: any) => {
      const a = document.createElement('a');
      const file = new Blob([res], { type: 'application/octet-stream' });
      a.href = URL.createObjectURL(file);
      a.download = filename;
      a.click();
    });
  }
  getLanguages(): any[] {
    return [
      { isChecked: false, value: 'EN', name: 'English' },
      { isChecked: false, value: 'BA', name: 'Bangla' },
      { isChecked: false, value: 'TA', name: 'Tanil' },
      { isChecked: false, value: 'CH', name: 'Chainese' },
      { isChecked: false, value: 'KO', name: 'Korean' }
    ];
  }
}

