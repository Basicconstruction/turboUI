import { Component } from '@angular/core';
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {NzPopconfirmDirective} from "ng-zorro-antd/popconfirm";
import {NzMessageService} from "ng-zorro-antd/message";
import {KeyExhibitComponent} from "./key-exhibit/key-exhibit.component";
import {SupplierKey} from "../../../admin_anythings/models/keys";
import {KeyCallService} from "../../../admin_anythings/services";
import {admin_routes} from "../../../admin_anythings/routes";

@Component({
  selector: 'app-keys',
  standalone: true,
  imports: [
    NzSkeletonComponent,
    RouterLink,
    NzPopconfirmDirective,
    KeyExhibitComponent
  ],
  templateUrl: './keys.component.html',
  styleUrl: './keys.component.css'
})
export class KeysComponent {
  keys: SupplierKey[] | undefined;
  constructor(private call: KeyCallService, private message: NzMessageService,
              private route: ActivatedRoute) {

  }
  modelId: number | undefined;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const modelId = params['modelId'];
      if(modelId!==this.modelId){
        this.modelId = modelId;
        this.fetchKeys(false,this.modelId);
      }else{
        this.fetchKeys(false);
      }
    });
  }
  refresh(){
    this.fetchKeys(true,this.modelId)
  }

  fetchKeys(refresh: boolean = false, roleId: number | undefined=undefined){
    this.call.getKeysWithModel(roleId).subscribe({
      next: keys=>{
        this.keys = keys;
        if(refresh){
          this.message.success("刷新成功");
        }
      },
      error: err => {
        this.message.error("获取账户信息失败")
      }
    });
  }

  protected readonly admin_routes = admin_routes;
}
