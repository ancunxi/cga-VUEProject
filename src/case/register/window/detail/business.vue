<template>
    <div>
        <RadioGroup v-model="businessId" size="large">
            <Form>
                <FormItem>
                    <Radio label="1">
                        <span>
                            业务一
                        </span>
                    </Radio>
                    <p>
                        业务说明 : 企业在“e窗通”完成执照、公章及发票申领的操作，且市场监管和税务部门已审核通过的情况.
                        正常情况下，领取营业执照/公章/税控设备/发票需等待约20分钟。
                    </p>
                </FormItem>
                <FormItem>
                    <Radio label="2">
                        <span>
                            业务二
                        </span>
                    </Radio>
                    <p>
                        业务说明 : 企业通过“e窗通”平台完成执照和公章领取，但未办理新办企业一日领票业务，后又通过电子税务局申请发票的情况。
                        正常情况下，领发票和税控设备需等待约20分钟。
                    </p>
                </FormItem>
                <FormItem>
                    <Radio label="3">
                        <span>
                            业务三
                        </span>
                    </Radio>
                    <p>
                        业务说明 : 企业在“e窗通”仅完成执照、公章申领的操作，且市场监管部门已审核通过,企业现场领取执照/公章,并同时申领发票(未通过电子税务局申请发票)
                        正常情况下，从提交申请材料审核合格至可以领取营业执照/公章/税控设备/发票需等待约50分钟 。
                    </p>
                </FormItem>
                <FormItem>
                    <Radio label="4">
                        <span>
                            业务四
                        </span>
                    </Radio>
                    <p>
                        业务说明 : 企业在“e窗通”仅完成执照、公章申领的操作，且市场监管部门已审核通过,企业现场领取执照/公章,并同时申领发票(未通过电子税务局申请发票)
                        正常情况下，从提交申请材料审核合格至可以领取营业执照/公章/税控设备/发票需等待约50分钟 。
                    </p>
                </FormItem>
                <FormItem label="电话号码" :label-width="80">
                    <Input v-model="telephoneNumber" placeholder="请输入电话号码" style="width:30%;"></Input>
                </FormItem>
            </Form>
        </RadioGroup>
        <div style="text-align:center;">
            <Button type="primary" @click="handle">提交</Button>
        </div> 
    </div> 
</template>
<script>
export default {
  data(){  
      return {
          businessId:"",
          telephoneNumber:"",
      }
  },
  methods:{
      handle(){
        axios.post("/cgaCaseRegist/sendMsgToAndroid.do", {businessId:this.businessId,userId:this.$store.state.userinfo.userId,telephoneNumber:this.telephoneNumber})
        .then(data => {
            if(data.status == '200' && data.success == true) {
                this.$Modal.success({
                    title: "提示",
                    content: "已推送成功！"
                });
            }else{
                this.$Modal.success({
                    title: "提示",
                    content: data.msg
                });
            }
        })
      }
  }
}
</script>
<style scoped>
    span{
        font-size: 17px;
    }
    p{
        font-size: 15px;
        background-color: #f2f2f2;
        padding: 0 20px;
    }
</style>


