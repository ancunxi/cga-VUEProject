<template>
  <div class="lj_select">
      <div class="city_content city_content_zx" style="display: block;" v-if="areaShow != false">
          <div class="select_tab ">
              <a href="javascript:;" class="first" :class="{current:areaShow == 'oOne'}" @click='showPart("oOne")'>街道级部门</a>
              <a href="javascript:;" :class="{current:areaShow == 'oTwo'}" @click='showPart("oTwo")'>业务部门</a>
          </div>
          <div class="area_list" style="display: block;" v-if="areaShow == 'oOne'">
              <ul class="items oOne">
                  <li v-for="item in dept1List" :value="item.deptId" @click='deptFun(item.deptId, item.simplyName)'>
                  	<a href="javascript:;">{{item.simplyName}}</a>
                  </li>
              </ul>
          </div>
          <div class="area_list" style="display: block;" v-if="areaShow == 'oTwo'">
              <ul class="items oTwo">
                  <li v-for="item in dept2List" :value="item.deptId" @click='deptFun(item.deptId, item.simplyName)'>
                  	<a href="javascript:;">{{item.simplyName}}</a>
                  </li>
              </ul>
          </div>
      </div>
  </div>
</template>

<script>
require('../../assets/js/jquery.min.js');
export default{
  data(){
    return{
      areaShow:false,
      streetDeptList:[],
      dept1List:[],
      dept2List:[]
    }
  },
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
  	loadDeptList(){
        this.streetDeptList=[];
        this.dept1List=[];
        this.dept2List=[];
        axios.post("/cgaCaseRegist/queryDeptListByRange.do", {acceptingRange:'4'})
        .then(data=>{
          if(data.success == true && data.status == 200){
            this.streetDeptList = data.obj || [];
            this.dept1List = this.streetDeptList.filter(item=>item.acceptingRange === '4') || [];
            this.dept2List = this.streetDeptList.filter(item=>item.isBus === '1') || [];
            this.areaShow = 'oOne';
          }
        });
    },
    showPart(name){
        //TAB页激活项
        this.areaShow = name;
    },
    deptFun(deptId, name){
       this.$emit('streetDeptChildFun', deptId, name);
       this.cancel();
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
    width: 412px;
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