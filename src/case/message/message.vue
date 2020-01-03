<template>
	<div class="layout-content">
		<Row class="panel">
			<Col span="24">
			  <Row :gutter="16">
				<Col span="24"><div style="float:left;"><strong>标&nbsp; &nbsp;题：</strong></div><div style="overflow:hidden;">{{messageData.messageTitle}}</div></Col>        
			  </Row>
			  <Row :gutter="16">
				<Col span="24"><strong>发送人：</strong>{{messageData.messageAuthorName}}</Col>
			  </Row>
			  <Row :gutter="16">
				<Col span="24"><strong>时&nbsp; &nbsp;间：</strong>{{messageData.sendDate}}</Col>
			  </Row>
			  <Row :gutter="16">
				<Col span="24"><strong>内&nbsp; &nbsp;容：</strong></Col>
			  </Row>
			  <Row :gutter="16">
				<Col span="24">&nbsp; &nbsp; &nbsp; &nbsp;{{messageData.messageContent}}</Col>
			  </Row>
			</Col>					
		 </Row>
		<Row>
			<Col span="10">&nbsp;</Col>
			<Col span="7"><Button style="margin-left:8px;text-align:center" @click="gobacks">返回</Button></Col>
			<Col span="7">&nbsp;</Col>
		</Row>
	</div>	
</template>

<script>
require('../../assets/js/jquery.min.js');
export default{
  data () {
    return {
	  messageData: [],     //我的未读消息详情
	  messageState:'1'
    }
  },
  created(){
    
	//获取未读信息详情
	axios.post("/cgaSorMessage/findInfoById.do", {id: this.$route.query.messageId})
	.then(data => {
		this.messageData = data.obj;
	});
    //修改该未读信息状态为已读
    axios.post("/cgaSorMessage/updateMessageState.do", {messageId: this.$route.query.messageId,messageState:this.messageState})
	.then(data => {
		//this.messageData = data.obj;
	});
  },
  mounted(){
       
  },
  methods:{
	gobacks(){
  		this.$router.push({path: '/case/message/index'})
  	},
  }
} 
</script>
