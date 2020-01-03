<!-- 百度地图 -->
<template>
  <!-- <div class="layout-content"> -->
  <div class="map-box">
    <Form  :label-width="80"> 
      <Row :gutter="16">
        <Col span="10">
          <FormItem  label="地址：">
            <Input v-model="searchAddress" placeholder="请输入详细地址"  icon="search"  @on-click="addressLocationFun(searchAddress,'')"></Input>
          </FormItem>
        </Col>
      </Row>
      <!-- <Row>
        <Col span="24">
          <FormItem>
            <Button type="primary" @click="handleSearch">查询</Button>
            <Button type="ghost" @click="handleReset" style="margin-left: 8px;">重置</Button>
          </FormItem>
        </Col>
      </Row> -->
    </Form>
    <div id="allmap" style="width:100%; height:500px;"></div>

  </div>
</template>

<script>

export default{
  data(){
    return{
      searchAddress:'',  //百度地图查询地址
    }
  },
  created(){
    //查询当前登录CGA系统的用户信息 
    if(document.getElementById("mapId") == null){
      axios.post("/cgaSysLoginInfo/findInfoById.do")
      .then(data => {
        //加载百度地图js  
        if(data.obj.akKey == ''){
          return false;
        }  
        var script = document.createElement("script");  
        script.src = "http://api.map.baidu.com/api?v=2.0&ak="+ data.obj.akKey +"&callback=initialize";
        script.id = "mapId";
        document.body.appendChild(script); 
      });
    }    
  },
  methods: {
      //*************************start 百度地图**************************************//
    //项目地址
    addressLocationFun0(caseAreaCode,caseAddress){      
      // 百度地图API功能
      var map = new BMap.Map("allmap");    // 创建Map实例
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
      map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
      var local = new BMap.LocalSearch(map,{
        renderOptions:{map: map}
      });
      local.search(caseAreaCode+caseAddress);
    },
    addressLocationFun(caseAreaCode,caseAddress){
      this.searchAddress = caseAreaCode+caseAddress;
      let _this = this;
      // 百度地图API功能
      var map = new BMap.Map("allmap");    // 创建Map实例
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
      map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
      // 创建地址解析器实例
      var myGeo = new BMap.Geocoder();
      // 将地址解析结果显示在地图上,并调整地图视野
      myGeo.getPoint(caseAreaCode+caseAddress, function(point){
        if (point) {
          map.centerAndZoom(point, 16);
          map.addOverlay(new BMap.Marker(point));
        }else{
          _this.$Message.error('您填写的地址没有解析到结果');
          //alert("您选择地址没有解析到结果!");
        }
      });
    },
    //*************************end 百度地图**************************************//
  }
}
</script>

<style lang="scss" scoped>
  .map-box{
    .ivu-form-item{
      margin-bottom: 5px;
    }
  }
</style>