import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
// import { environment } from 'src/environments/environment';
import { ServicesService } from '../services/services.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;
  firstName: any;
  @ViewChild('mymodal', { static: false }) mymodal: TemplateRef<any>;
  fileContent: File;
  imageURL: any;
  itemId: any;
  signatureImage: any;
  initialFile: any;
  mainImage: any;
  userId: any;
  type: any;
  signslist: any;
  public imageBaseUrl = environment.imageBaseUrl
  initialList: any;
  changePasswordForm: FormGroup;

  constructor(private modalService: NgbModal, private services: ServicesService, private toastr: ToastrService,private fb:FormBuilder,private router:Router ) {
    this.changePasswordForm = this.fb.group({
      oldPassword:["",Validators.required],
      newPassword:["",Validators.required]
    })
   }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("userDetails"));
    this.userId = JSON.parse(localStorage.getItem('userDetails'))?._id;
    // this.firstName = this.user.FirstName;
    console.log("user----",this.user)
    if(!this.user){
      this.router.navigateByUrl('/login')
    }
    this.getsigns()
  }
  changePassword(){
    console.log("password",this.changePasswordForm.value)
    const formData ={
        "UserID" : this.userId,
        "OldPassword" : this.changePasswordForm.value.oldPassword,
        "NewPassword" : this.changePasswordForm.value.newPassword
      }
      console.log("obj",formData)
      this.services.changePassword(formData).subscribe(res=>{
        console.log("res",res)
        alert(res.Message)
        if(res.StatusCode === 200){
          this.router.navigateByUrl("/login");
          localStorage.clear();
        }    
      })
    

  }

  getsigns(){
   const formData= {
      "UserId" : this.userId
    }
    this.services.getsigns(formData).subscribe((res)=>{
      console.log("res",res)
      
      const array = res.data.filter((res)=>{return res.Type === '1'})
      console.log("array",array)
      this.signslist = array
      const array2 = res.data.filter((res)=>{return res.Type === '2'})
      this.initialList = array2

    })
  }

  defaultSign(p){
    const formdata ={
      "UserId"  : this.userId,
      "SignID" : p.SignID
    }
    this.services.setDefaultSigns(formdata).subscribe(res=>{
      console.log("setDefaultSigns",res)
      this.getsigns()
    })
  }

  sign(value) {
    this.type = value;
    this.modalService.open(this.mymodal);
  }

  onFileSelected(event) {
    console.log('onFileSelected--->', event);
    const file = (event.target as HTMLInputElement).files[0];
    this.fileContent = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  saveImage(data) {
    let self = this;
    var reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = function () {
      var base64data = reader.result;
      self.itemId = localStorage.getItem('itemId');
      if (self.itemId == 1) {
        // var xx = '.drag';
        // var yy = '.remove';
        // var aa = 'remove';
        self.signatureImage = data;
        console.log("drawSign1---",self.signatureImage);
        self.callSigns(self.signatureImage)
      } else {
        // var xx = '.idrag';
        // var yy = '.iremove';
        // var aa = 'iremove';
        self.initialFile = data;
        console.log("drawSign2---",self.initialFile);
        self.callSigns(self.initialFile)
      }
      // $(yy).remove();
      // $(xx).css({ 'background-color': 'transparent', padding: 0 });
      // $(xx).append(
      //   `<img class="${aa}" style="height: 100px;width: auto;" src="${base64data}">`
      // );
      self.modalService.dismissAll();
    };
  }

  uploadSignature() { 
    this.itemId = localStorage.getItem('itemId');
    console.log('uploadSignature--->', this.fileContent);
    const reader = new FileReader();
    reader.onload = () => {
      console.log('res--->', reader.result);
      this.mainImage = reader.result as string;

      /* append image here */

      if (this.itemId == 1) {
        // var xx = '.drag';
        // var yy = '.remove';
        // var aa = 'remove';
        this.signatureImage = this.fileContent;
        console.log("uploadSign1---",this.signatureImage);
        this.callSigns(this.signatureImage)
      } else {
        // var xx = '.idrag';
        // var yy = '.iremove';
        // var aa = 'iremove';
        
        this.initialFile = this.fileContent;
        console.log("uploadSign2---",this.initialFile);
        this.callSigns(this.initialFile)
      }
      // console.log('yy--->', yy);
      // console.log('xx--->', xx);
      // $(yy).remove();
      // $(xx).css({ 'background-color': 'transparent', padding: 0 });
      // $(xx).append(
      //   `<img class="${aa}" style="height: 100px;width: auto;" src="${this.mainImage}">`
      // );

      console.log(this.uploadedFiles);

      this.modalService.dismissAll();
    };
    reader.readAsDataURL(this.fileContent);
  }
  uploadedFiles(uploadedFiles: any) {
    throw new Error('Method not implemented.');
  }

  callSigns(signReference) {
   
    const formdata = new FormData;
    formdata.append("UserId",this.userId);
    formdata.append("Type",this.type);
    formdata.append("Sign",signReference)

    this.services.signs(formdata).subscribe((resp) => {
      this.getsigns()
      console.log("signs response",resp);
      // this.getsigns()
    })
  }


  handleSignDelete(type,item) {
    console.log("currentItem-",item);
    console.log("typeee",type)

    let id = item.SignID;
    this.services.deleteExistedSign(id).subscribe((resp)=> {
      console.log("delete response----",resp);
      if(resp.statusCode == 200) {
        this.getsigns();
        this.toastr.success(`${resp.message}`);
      }
    })
  }
  
}
