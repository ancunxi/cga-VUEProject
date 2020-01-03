<template>
  <div class="layout-content">
    <Row>
      <Col span="12" push="1">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130">          
          <Row>
            <Col span="24">
              <FormItem label="材料名称：" prop="materialName">
                <Input v-model="formValidate.materialName" placeholder="请输入材料名称"></Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="材料说明：">
                <Input v-model="formValidate.materialDesc" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入材料说明"></Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="上传材料：">
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                  <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
                </Upload>
                <Button type="ghost" icon="monitor">高拍仪</Button>
              </FormItem> 
              <FormItem label="上传材料：">
                <a href="javascript:;"><img src="../../../../../assets/img/icon_file_doc.png"></a>
                <p>申请报表</p> 
                <div>
                  <Button type="primary" size="small" class="preview">预览</Button>
                  <Button type="error" size="small" @click="delConfirm" class="delete">删除</Button>
                </div>
              </FormItem>               
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <router-link to="../index" style="margin-left:8px;"><Button>取消</Button></router-link>
              </FormItem>
            </Col>
          </Row>  
        </Form>                                        
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formValidate: {
        materialName: '',
        materialDesc: ''
      },
      ruleValidate: {
        materialName: [
          { required: true, message: '材料名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('提交成功!');
        } else {
          this.$Message.error('表单验证失败!');
        }
      })
    },
    delConfirm () {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定删除吗？</p>',
        okText: '删除',
        onOk: () => {
          this.$Message.info('点击了确定');
        },
        onCancel: () => {
          this.$Message.info('点击了取消');
        }
      });
    }
  }
}
</script>

<style lang="scss">
  .ivu-upload{
    display: inline-block;
    margin-right: 8px;
  }
</style>
