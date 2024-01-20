import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzMessageService} from "ng-zorro-antd/message";
import {ActivatedRoute, Router} from "@angular/router";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {KeyCallService} from "../../../../admin_anythings/services";
import {Model, ModelFee} from "../../../../admin_anythings/models/keys";
import {admin_routes} from "../../../../admin_anythings/routes";

@Component({
  selector: 'app-key-create',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzTooltipDirective,
    NzInputNumberComponent,
    NzSkeletonComponent
  ],
  templateUrl: './key-create.component.html',
  styleUrl: './key-create.component.css'
})
export class KeyCreateComponent {
  constructor(
    private fb: NonNullableFormBuilder,
    private message: NzMessageService,
    private call: KeyCallService,
    private router: Router,
    private route: ActivatedRoute) {
  }
  goBack() {
    this.router.navigate([this.returnUrl]);
  }
  returnUrl: string | undefined;
  ngOnInit(){
    this.fetchModels();
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'];
    });
  }
  validateForm: FormGroup<{
    supplierKeyId: FormControl<number>,
    baseUrl: FormControl<string>,
    apiKey: FormControl<string>,
  }> = this.fb.group({
    supplierKeyId: [0, [Validators.required]],
    baseUrl: ['', [Validators.required]],
    apiKey: ['', [Validators.required]],
  });
  modelFees: ModelFee[] = [];
  allModels: Model[] | undefined;
  actionTip(modelId: number){
    return this.modelFees.find(r=>r.modelId===modelId)!==undefined?'移除':'添加';
  }
  active(modelId: number){
    return this.modelFees.find(r=>r.modelId===modelId)!==undefined;
  }
  fetchModels(refresh: boolean = false){
    this.call.getModelsWithKey().subscribe({
      next: models=>{
        this.allModels = models;
        if(refresh){
          this.message.success("刷新成功");
        }
      },
      error:() => {
        this.message.error("获取模型信息失败")
      }
    })
  }
  submitForm() {
    if (this.validateForm.valid) {
      const value = this.validateForm.value;
      this.call.addKey(
        {
          supplierKeyId: value.supplierKeyId!,
          baseUrl: value.baseUrl!,
          apiKey: value.apiKey!,
          modelFees: this.modelFees
        })
        .subscribe({
          next: () =>{
            this.message.success('创建密钥成功');
            this.router.navigate(admin_routes.keys);
          },
          error: (err: any) => {
            this.message.error(err.error);
          }
        })
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  action(model: Model) {
    if(this.active(model.modelId!)){
      this.modelFees = this.modelFees.filter(r=>r.modelId!==model.modelId);
    }else{
      const modelFee: ModelFee = {
        modelId : model.modelId,
        model: model,
        fee: 1
      };
      this.modelFees.push(modelFee);
    }
  }
}
