import {
  ApplicationRef,
  Component,
  Injector,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import * as _ from 'lodash';

import {RestService, WebSocketService} from '../../../../services/';
import {
  FieldConfig
} from '../../../common/entity/entity-form/models/field-config.interface';
import { DialogService } from 'app/services/dialog.service';
import { Formconfiguration } from 'app/pages/common/entity/entity-form/entity-form.component';
import { AppLoaderService } from '../../../../services/app-loader/app-loader.service';
import { T } from '../../../../translate-marker';

@Component({
  selector : 'app-volumeunlock-form',
  template : `<entity-form [conf]="this"></entity-form>`
})
export class VolumeCreatekeyFormComponent implements Formconfiguration {

  saveSubmitText = T("Create");

  resource_name = 'storage/volume';
  route_success: string[] = [ 'storage', 'pools'];
  isNew = false;
  isEntity = true;
  entityData = {
    name: "",
    passphrase: "",
    passphrase2: ""
  };
  
  fieldConfig: FieldConfig[] = [
    {
      type : 'input',
      name : 'name',
      isHidden: true
    },{
      type : 'input',
      name : 'passphrase',
      label: T("passphrase"),
      placeholder: T('Passphrase'),
      tooltip: T('Geli Passphrase')
    },{
      type : 'input',
      name : 'passphrase2',
      label : T('Passphrase2'),
      placeholder: T('Passphrase2 must match above'),
      tooltip: T('Geli Passphrase must match above')
    }
  ];

  resourceTransformIncomingRestData(data:any): any {
    return data;
  };


  constructor(
      protected router: Router,
      protected route: ActivatedRoute,
      protected rest: RestService,
      protected ws: WebSocketService,
      protected _injector: Injector,
      protected _appRef: ApplicationRef,
      protected dialogService: DialogService,
      protected loader: AppLoaderService
  ) {

  }

  afterInit(entityForm: any) {
  
  }

  customSubmit(value) {
    this.loader.open();
    console.log("VALUE", value);
    return this.rest.post(this.resource_name + "/" + value.name + "/keypassphrase/", { body: JSON.stringify({passphrase: value.passphrase, passphrase2: value.passphrase2}) }).subscribe((restPostResp) => {
      console.log("restPostResp", restPostResp);
      this.loader.close();
      this.dialogService.Info(T("Create Pool Key"), T("Successfully added key to pool ") + value.name);

      this.router.navigate(new Array('/').concat(
        this.route_success));
    }, (res) => {
      this.loader.close();
      this.dialogService.errorReport(T("Error adding key to pool"), res.message, res.stack);
    });
  }
  
}
