<template>
  <div class="layout-content">
    <Row>
      <Col span="24">
        <h3 class="guide-title">{{this.$route.query.projectName}}</h3>
      </Col>
    </Row>
    <Row>
      <Col span="10" offset="0">
        <div style="padding:10px 2px; border:dashed 1px #ccc; margin-top:15px;">
          <problem-view :treedata="problemTreeData" :ugids="useableTreeId" :vm="vm"></problem-view>
        </div>       
      </Col>
      <Col span="13" offset="1" class="explain">
        <Row class="margin-bottom-20">
          <Col span="24">
            <problemTable-view></problemTable-view>
          </Col>
        </Row>
        <Row class="margin-bottom-20">
          <Col span="24">
            <projectFoundationPage-view></projectFoundationPage-view>
          </Col>
        </Row>        
      </Col>
    </Row>
    <Row class="center">
      <Col span="24">
        <Button type="primary" v-on:click="nextStep()">下一步</Button>
        <router-link to="../window/index" style="margin-left:8px;"><Button>返回</Button></router-link>
      </Col>
    </Row>

    <!--loading框 Modal Templates-->
    <div class="dhx_modal_cover" v-if='loadingModal'></div>
    <div dhxbox="1" class="dhx_modal_loading" v-if='loadingModal'></div>
    <!--End loading框 Modal Templates--> 
  </div>
</template>

<script>
//事项分类树
import problem from './problemTree.vue';
import problemTable from './commonProblemTable.vue';
import projectFoundationPage from './cgaProjectFoundationTable.vue';
export default {
  components: {
    'problem-view': problem,
    'problemTable-view':problemTable,
    'projectFoundationPage-view':projectFoundationPage
  },
  data(){
    return {
      loadingModal: false, //loading框
      //左侧向导问题树
      problemTreeData: [],    
      //可用的树节点id
      useableTreeId:['-1'],
      //传递this，外层实例
      vm: {}
    }
  },
  created(){
  	this.vm = this; 
  	let _this = this;
    //获取左侧向导问题树
    this.getProblemTree();
    //从第二页返回上一步到此页面时
    this.useableTreeId=this.$route.query.usableGids || [];
  },
  methods:{
    //获取左侧事项分类树数据
    getProblemTree(){
      axios.post("/cgaCaseRegist/queryCgaProjectGuideTreeList.do",{projectNo:this.$route.query.projectNo})
      .then(data=>{
        if(!data.success){
          //返回错误状态                    
          return false;
        }
        this.problemTreeData = data.obj || []; 
      });
    },
    nextStep(){
      this.loadingModal = true;
    	//获取所有已选的节点id
    	var arr=document.getElementsByClassName("gname");
    	var result=[];
    	for(var i=0;i<arr.length;i++){
  		  if(arr[i].checked){
  				this.useableTreeId.push(arr[i].getAttribute('oid'));
  				result.push(arr[i].getAttribute('oid'));
  			}
    	}
    	//根据已勾选的所有节点，查询出其所有父节点，并装入useableTreeId中
    	axios.post("/cgaProjectGuide/queryParentInfoByGid.do",{guideIds:result.join()})
	      .then(data=>{
	        if(!data.success){
            this.loadingModal = false;
	          //返回错误状态                    
	          return false;
	        }
	        var data1=data.obj || []; 
	        this.useableTreeId =[]; //先清空，再装入所有新的勾选节点信息
	        for(var i=0;i<data1.length;i++){
	        	this.useableTreeId.push(data1[i].guideId);
	        }
	        //拿着勾选的数据和原来的树数据，去比对判断勾选
	    	var treedata=this.problemTreeData;
	    	var uData=this.useableTreeId || [];
	    	// if(!this.checkSelected(treedata,uData)){
        //   this.loadingModal = false;
	    	// 	this.$Message.error('供勾选的答案，请至少勾选一个!');
	    	// 	return;
	    	// }else{
        //   this.loadingModal = false;
	    	// 	this.$router.push({path:'./choose', query:{usableGids:this.useableTreeId,guideIds:result.join(),projectNo:this.$route.query.projectNo,projectId:this.$route.query.projectId,projectName:this.$route.query.projectName}})
	    	// }	
        this.loadingModal = false;
	    	this.$router.push({path:'./choose', query:{usableGids:this.useableTreeId,guideIds:result.join(),projectNo:this.$route.query.projectNo,projectId:this.$route.query.projectId,projectName:this.$route.query.projectName}})
	    });  
    },
    checkSelected(treedata,checkedNodes){
  		//思路:逐层遍历树，若当前层，所有节点均为 无 类型，则通过；
  		//否则，判断当前层所有节点中是否至少勾选了一个，
  		//若勾选至少一个，则通过，并取出其含有的子节点集进行当前方法的递归调用；
  		//否则不通过；
  		//验证必勾选的节点，是否勾选，并给予提示
  		
  		var typeCount=0;//类型计数
  		for(var i=0;i<treedata.length;i++){
  			var aaa=treedata[i].guideType;
  			if(aaa==1 || aaa==2){
  				typeCount++;
  				break;
  			}
  		}
  		if(typeCount==0){//全部都为 无 类型的节点
  			for(var i=0;i<treedata.length;i++){
  				var childrenList=treedata[i].childrenList  || [];
  				if((childrenList!=undefined || childrenList!="") && childrenList.length>0){
  					//说明有子节点,递归调用此方法
  					if(!this.checkSelected(childrenList,checkedNodes)){
  						return false;
  					}
  				}
  			}
  		}else{//含有单选或多选类型的节点
  			var k;
  			for(k=0;k<treedata.length;k++){
  				//要判断至少选中了一个，若是，则跳出循环
  				if(checkedNodes.indexOf(treedata[k].id)!=-1){
  					break;
  				}
  			}
  			if(k==treedata.length){
  				return false;
  			}
  			for(var i=0;i<treedata.length;i++){
  				//对于勾选的当前节点做处理
  				if(checkedNodes.indexOf(treedata[i].id)!=-1){
  					//对勾选的节点，判断是否有子节点，如果有子节点，则递归调用此方法即可
  					var childrenList=treedata[i].childrenList || [];
  					if((childrenList!=undefined || childrenList!="") && childrenList.length>0){
  						//说明有子节点,递归调用此方法
  						if(!this.checkSelected(childrenList,checkedNodes)){
  							return false;
  						}
  					}
  				}
  			}
  		}
  		return true;
  	}
  }
}
</script>

<style lang="scss">
  .guide-title{
    padding-bottom: 15px;
    margin-bottom: 40px;
    text-align: center;
    border-bottom: 1px solid #dddee1;
  }
  .explain{
    h5{
      height: 30px;
      line-height: 30px;
      padding: 0 15px;
      background: #5cadff;  
      color: #fff;  
      &>i{
        margin-right: 5px;
      }
    }
    .list{
      padding: 6px 15px;
      margin-bottom: 5px;
      border: 1px solid #dddee1;
      border-top: none;
      li{
        height: 28px;
        line-height: 28px;
      }
    }
  }
</style>