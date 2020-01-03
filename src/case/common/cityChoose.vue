<template>
  <div class="lj_select">
      <div class="city_content city_content_zx" style="display: block;" v-if="areaShow != false">
          <div class="select_tab ">
              <a href="javascript:;" class="first" :class="{current:areaShow == 'oOne'}" @click='showPart("oOne")' v-if="showProvince">省份</a>
              <a href="javascript:;" :class="{current:areaShow == 'oTwo'}" @click='showPart("oTwo")' v-if="showCountry">城市</a>
              <a href="javascript:;" :class="{current:areaShow == 'oThree'}" @click='showPart("oThree")' v-if="showCity">县区</a>
              <a href="javascript:;" :class="{current:areaShow == 'oFour'}" @click='showPart("oFour")'>街道</a>
              <a href="javascript:;" :class="{current:areaShow == 'oFive'}" @click='showPart("oFive")'>社区</a>
          </div>
          <div class="area_list" style="display: block;" v-if="areaShow == 'oOne'">
              <ul class="items oOne">
                  <!-- <li v-for="item in area1List" :value="item.areaCode"><a href="javascript:;" class="current">{{item.areaName}}</a></li> -->
                  <li v-for="item in area1List" :value="item.areaCode" @click='area1Fun(item.areaCode, item.areaName)'><a href="javascript:;" :class="{current:area1== item.areaCode}">{{item.areaName}}</a></li>
              </ul>
          </div>
          <div class="area_list" style="display: block;" v-if="areaShow == 'oTwo'">
              <ul class="items oTwo">
                  <li v-for="item in area2List" :value="item.areaCode" @click='area2Fun(item.areaCode, item.areaName)'><a href="javascript:;" :class="{current:area2== item.areaCode}">{{item.areaName}}</a></li>
              </ul>
          </div>
          <div class="area_list" style="display: block;" v-if="areaShow == 'oThree'">
              <ul class="items oThree">
                  <li v-for="item in area3List" :value="item.areaCode" @click='area3Fun(item.areaCode, item.areaName)'><a href="javascript:;" :class="{current:area3== item.areaCode}">{{item.areaName}}</a></li>
              </ul>
          </div>
          <div class="area_list" style="display: block;" v-if="areaShow == 'oFour'">
              <ul class="items oFour">
                  <li v-for="item in area4List" :value="item.areaCode" @click='area4Fun(item.areaCode, item.areaName)'><a href="javascript:;" :class="{current:area4== item.areaCode}">{{item.areaName}}</a></li>
              </ul>
          </div>
          <div class="area_list" style="display: block;" v-if="areaShow == 'oFive'">
              <ul class="items oFive">
                  <li v-for="item in area5List" :value="item.areaCode" @click='area5Fun(item.areaCode, item.areaName)'><a href="javascript:;" :class="{current:area5== item.areaCode}">{{item.areaName}}</a></li>
              </ul>
          </div>
          <!-- <div class="" style="width:100%; clear:both; text-align: center; margin-top: 10px; margin-bottom: 10px;">
              <Button type="primary" @click="ok">确定</Button>
              <Button @click="cancel" style="margin-left:8px;">取消</Button>           
          </div> -->
      </div>
  </div>
</template>

<script>
require('../../assets/js/jquery.min.js');
export default{
  data(){
    return{
      areaShow:false,
      area1:"",
      area2:"",
      area3:"",
      area4:"",
      area5:"",
      area1Name:"",
      area2Name:"",
      area3Name:"",
      area4Name:"",
      area5Name:"",
      area1List:[],
      area2List:[],
      area3List:[],
      area4List:[],
      area5List:[],

      areaName:"",  
      areaCode:"",  

    //   parentCode:"420106001000",
      showProvince:true,
      showCountry:true,
      showCity:true,
    }
  },
  props:["parentCode"],
  mounted(){
      $(".lj_select, .areaInput").click((event)=>{
        event.stopPropagation();
      })
      $("body").click(()=>{
        if(this.areaShow != false){
          this.areaShow = false;
        }
      })    
      
  },
  methods:{
    loadAreaList(){
        this.area1 = '';
        this.area2 = '';
        this.area3 = '';
        this.area4 = '';
        this.area5 = '';
        this.area1Name = '';
        this.area2Name = '';
        this.area3Name = '';
        this.area4Name = '';
        this.area5Name = '';
        this.area1List=[];
        this.area2List=[];
        this.area3List=[];
        this.area4List=[];
        this.area5List=[];

      
        axios.post("/sysCgaAreaCode/queryList.do", {areaLevel:'1'})
        .then(data=>{
          if(data.success == true && data.status == 200){
            this.area1List = data.obj || [];
            this.areaShow = 'oOne';
          }
          //过滤掉 省份，城市等
          if(this.parentCode){
              let provinceCodeArr=[];
              provinceCodeArr=data.obj.map(function(item){
                  return item.areaCode
              })
            //   console.log(provinceCodeArr)
              if(provinceCodeArr.indexOf("this.parentCode")==-1){
                  this.showProvince=false;
                  this.areaShow = 'oTwo';
  
                  let provinceId="";
                  for(let i=0;i<provinceCodeArr.length;i++){
                      if(provinceCodeArr[i].substring(0,2)==this.parentCode.substring(0,2)){
                          provinceId=provinceCodeArr[i]
                      }
                  }
                //   console.log(provinceId)
                  axios.post("/sysCgaAreaCode/queryList.do", {parentId:provinceId})
                  .then(data=>{
                      let countryCodeArr=[];
                      countryCodeArr=data.obj.map(function(item){
                          return item.areaCode
                      })
                    //   console.log(countryCodeArr)
                      for(let j=0;j<countryCodeArr.length;j++){
                          if(countryCodeArr[j].indexOf(this.parentCode)==0){
                              this.area2List.push(data.obj[j])
                          }
                      }
                      //去掉城市
                    //   console.log(this.area2List.length)
                      if(this.area2List.length<=0){
                          this.showCountry=false;
                          this.areaShow = 'oThree';
                          let countryId="";
                          for(let m=0;m<countryCodeArr.length;m++){
                                if(countryCodeArr[m].substring(0,4)==this.parentCode.substring(0,4)){
                                    countryId=countryCodeArr[m]
                                }
                            }
                            // console.log(countryId)
                            axios.post("/sysCgaAreaCode/queryList.do", {parentId:countryId})
                            .then(data=>{
                                let cityCodeArr=[];
                                cityCodeArr=data.obj.map(function(item){
                                    return item.areaCode
                                })
                                // console.log(cityCodeArr)
                                for(let k=0;k<cityCodeArr.length;k++){
                                    if(cityCodeArr[k].indexOf(this.parentCode)==0){
                                        this.area3List.push(data.obj[k])
                                    }
                                }
                                //去掉县区
                                if(this.area3List.length<=0){
                                    this.showCity=false;
                                    this.areaShow = 'oFour';
                                    let cityId="";
                                    for(let n=0;n<cityCodeArr.length;n++){
                                        if(cityCodeArr[n].substring(0,6)==this.parentCode.substring(0,6)){
                                            cityId=cityCodeArr[n]
                                        }
                                    }
                                    // console.log(cityId)
                                    axios.post("/sysCgaAreaCode/queryList.do", {parentId:cityId})
                                    .then(data=>{
                                        let streetCodeArr=[];
                                        streetCodeArr=data.obj.map(function(item){
                                            return item.areaCode
                                        })
                                        // console.log(streetCodeArr)
                                        for(let t=0;t<streetCodeArr.length;t++){
                                            if(streetCodeArr[t].indexOf(this.parentCode)==0){
                                                this.area4List.push(data.obj[t])
                                            }
                                        }
                                    })
                                }
                            })
                      }
                  })
              }
          }
        });
    },
    showPart(name){
        //TAB页激活项
        this.areaShow = name;
    },
    area1Fun(code, name){
        this.area2 = '';
        this.area3 = '';
        this.area4 = '';
        this.area5 = '';
        this.area2Name = '';
        this.area3Name = '';
        this.area4Name = '';
        this.area5Name = '';
        this.area2List=[];
        this.area3List=[];
        this.area4List=[];
        this.area5List=[];
        if(code == ""){
            return false;    
        }
        this.area1 = code;
        this.area1Name = name;
        this.childrenAreaList('area2List',code);
        this.areaShow = 'oTwo';
    },
    area2Fun(code, name){
        this.area3 = '';
        this.area4 = '';
        this.area5 = '';
        this.area3Name = '';
        this.area4Name = '';
        this.area5Name = '';
        this.area3List=[];
        this.area4List=[];
        this.area5List=[];
        if(code == ""){
            return false;    
        }
        this.area2 = code;
        this.area2Name = name;
        this.childrenAreaList('area3List',code);
        this.areaShow = 'oThree';
    },
    area3Fun(code, name){
        this.area4 = '';
        this.area5 = '';
        this.area4Name = '';
        this.area5Name = '';
        this.area4List=[];
        this.area5List=[];
        if(code == ""){
            return false;    
        }
        this.area3 = code;
        this.area3Name = name;
        this.childrenAreaList('area4List',code);
        this.areaShow = 'oFour';
    },
    area4Fun(code, name){
        this.area5 = '';
        this.area5Name = '';
        this.area5List=[];
        if(code == ""){
            return false;    
        }
        this.area4 = code;
        this.area4Name = name;
        this.childrenAreaList('area5List',code);
        this.areaShow = 'oFive';
    },
    area5Fun(code, name){
        if(code == ""){
            return false;    
        }
        this.area5 = code;
        this.area5Name = name;
        this.areaCode = code;
        this.ok();
    },
    
    childrenAreaList(area,code){
        if(code=="" || code == undefined){
            return false;
        }
        this.areaCode = code;
        this.ok();
        axios.post("/sysCgaAreaCode/queryList.do", {parentId:code})
        .then(data=>{
            switch(area){
                case 'area2List':
                  this.area2List = data.obj || [];
                  break;
                case 'area3List':
                  this.area3List = data.obj || [];
                  break;
                case 'area4List':
                  this.area4List = data.obj || [];
                  break;
                case 'area5List':
                  this.area5List = data.obj || [];
                  break;
                default : console.log(JSON.stringify(data.obj))
            }
        });
    },
    ok(){
        this.areaName = this.area1Name+this.area2Name+this.area3Name+this.area4Name+this.area5Name;
      
        //this.$emit('cityChildFun', this.areaName);
        this.$emit('cityChildFun', this.areaCode, this.areaName);

    },
    cancel(){
        this.areaShow = false;
    },

  }
}
</script>

<style lang="scss" scoped>
ul,ol {
    list-style: none outside none;
}

.lj_select {
    // position: relative;
    // float: left;
    position:absolute;
    left:0;
    top:33px;
    display: inline-block;
    a {
      color: #000;
      text-decoration: none;
    }
    a:visited {
      color: #000;
    }
}


.lj_select .area_list .items .current {
    color: red;
    font-weight: bold;
}

.lj_select .city_content {
    position: absolute;
    top: 32px;
    left: 0;
    z-index: 1000;
    display: none;
    width: 374px;
    border: solid 1px #ededed;
    border-top: none;
    background: #fff;
}

.lj_select .city_content.city_content_zx {
    top: 0px;
    left: 0px;
    border-top: solid 1px #ededed;
}

.lj_select .city_content .select_tab {
    height: 40px;
    overflow: hidden;
}

.lj_select .city_content .select_tab a {
    float: left;
    display: inline-block;
    width: 74px;
    height: 40px;
    border-bottom: solid 1px #ededed;
    border-left: solid 1px #ededed;
    background-color: #f9f9f9;
    text-align: center;
    line-height: 40px;
    _display: inline;
}

.lj_select .city_content .select_tab .first {
    width: 75px;
    border-left: none;
}

.lj_select .city_content .select_tab .current {
    height: 41px;
    border-bottom: 0;
    background-color: #fff;
}

.lj_select .city_content .area_list dt {
    float: left;
    padding: 0 5px;
    width: 25px;
    text-align: right;
    font-weight: 700;
    line-height: 21px;
}

.lj_select .city_content .area_list a {
    display: inline-block;
    margin: 0 0 6px 0;
    padding: 0 10px;
    color: #4D4D4D;
    white-space: nowrap;
    line-height: 21px;
    font-size: 14px;
}

.lj_select .city_content .area_list .items {
    float: left;
    padding: 0;
    /*width: 569px;*/
    line-height: normal;
}

.lj_select .city_content .area_list {
    float: left;
    display: none;
    margin: 10px;
    background: #fff;
    text-align: left;
}

.lj_select .city_content .area_list li {
    float: left;
    padding: 0 8px;
    height: 24px;
    white-space: nowrap;
    line-height: 24px;
}

.lj_select .city_content .area_list a:hover {
    color: red;
}

</style>