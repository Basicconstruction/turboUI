import { Component } from '@angular/core';
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {RouterLink} from "@angular/router";
import {NzModalComponent, NzModalContentDirective, NzModalModule} from "ng-zorro-antd/modal";
import {NewRoleComponent} from "../../accounts/roles/new-role/new-role.component";
import {NzPopconfirmDirective} from "ng-zorro-antd/popconfirm";
import {EditRoleComponent} from "../../accounts/roles/edit-role/edit-role.component";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzMessageService} from "ng-zorro-antd/message";
import {EditModelComponent} from "./edit-model/edit-model.component";
import {NewModelComponent} from "./new-model/new-model.component";
import {KeyCallService} from "../../../admin_anythings/services";
import {Model} from "../../../admin_anythings/models/keys";

@Component({
  selector: 'app-models',
  standalone: true,
  imports: [
    NzSkeletonComponent,
    RouterLink,
    NzModalComponent,
    NzModalContentDirective,
    NewRoleComponent,
    NzModalModule,
    NzPopconfirmDirective,
    EditRoleComponent,
    NzTooltipDirective,
    EditModelComponent,
    NewModelComponent
  ],
  templateUrl: './models.component.html',
  styleUrl: './models.component.css'
})
export class ModelsComponent {
  models: Model[] | undefined;
  constructor(private message: NzMessageService, private call: KeyCallService) {
  }
  newModelVisible : boolean = false;
  refresh() {
    this.fetchModels(true);
  }
  ngOnInit(){
    this.fetchModels();
  }
  delete(roleId: number) {
    this.call.deleteModel(roleId)
      .subscribe({
        next: msg=>{
          this.message.success("删除成功");
          this.fetchModels(true);
        },
        error: (err:any)=>{
          this.message.error("删除错误");
        }
      })
  }
  fetchModels(refresh: boolean = false){
    this.call.getModelsWithKey().subscribe({
      next: models=>{
        this.models = models;
        if(refresh){
          this.message.success("刷新成功");
        }
      },
      error:(err: any) => {
        this.message.error("获取账户信息失败")
      }
    })
  }

  tackleClose($event: boolean) {
    if($event){
      this.newModelVisible = false;
      this.fetchModels(true);
    }
  }
  editModelVisible: boolean = false;
  editModel: Model | undefined;
  tackleEditClose($event: boolean) {
    if($event){
      this.editModelVisible = false;
      this.fetchModels(true);
    }
  }

  editAModel(model: Model) {
    this.editModel = model;
    this.editModelVisible = true;
  }
}
