<template>
  <Row class="margin-bottom-20">
    <Col span="24">
      <Table border :columns="Columns" :data="TableList"></Table>
      <Page :total="100" show-total show-elevator show-sizer></Page>
    </Col>
  </Row> 
</template>

<script>
export default {
  data () {
    return {
      Columns: [
        {
          title: '环节名称',
          key: 'linkName',
          width: '8%'
        },
        {
          title: '流程类型',
          key: 'processType',
          width: '10%'
        },
        {
          title: '流程名称',
          key: 'processName',
          width: '13%'
        },
        {
          title: '流程层级',
          key: 'processLevel',
          width: '5%'
        },
        {
          title: '指定处理人',
          key: 'specifyPerson',
          width: '6%'
        },                    
        {
          title: '实际处理人',
          key: 'raelPerson',
          width: '6%'
        },
        {
          title: '所属机关',
          key: 'organ',
          width: '9%'
        },
        {
          title: '开始时间',
          key: 'startTime',
          width: '9%'
        },
        {
          title: '结束时间',
          key: 'endTime',
          width: '9%'
        },
        {
          title: '处理结果',
          key: 'result',
          width: '7%'
        },
        {
          title: '处理意见',
          key: 'opinion',
          width: '8%'
        },                    
        {
          title: '操作',
          key: 'action',
          width: '10%',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$router.push({path:'./application/view'});
                    }
                  }
              }, '查看附件(1)')
            ]);
          } 
        }       
      ],
      TableList: [
        {
          linkName: '审核',
          processType: '缴费辅助流程',
          processName: '不动产登记',
          processLevel: '2',
          specifyPerson: '李娜',
          raelPerson: '李娜',
          organ: '六角亭街政务服务大厅',
          startTime: '2017-10-13 15:06:48',
          endTime: '2017-10-13 15:06:48',
          result: '否决',
          opinion: '不同意'          
        },
        {
          linkName: '审核',
          processType: '缴费辅助流程',
          processName: '不动产登记',
          processLevel: '2',
          specifyPerson: '李娜',
          raelPerson: '李娜',
          organ: '六角亭街政务服务大厅',
          startTime: '2017-10-13 15:06:48',
          endTime: '2017-10-13 15:06:48',
          result: '否决',
          opinion: '不同意'          
        },
        {
          linkName: '审核',
          processType: '缴费辅助流程',
          processName: '不动产登记',
          processLevel: '2',
          specifyPerson: '李娜',
          raelPerson: '李娜',
          organ: '六角亭街政务服务大厅',
          startTime: '2017-10-13 15:06:48',
          endTime: '2017-10-13 15:06:48',
          result: '否决',
          opinion: '不同意'          
        }                       
      ]
    }
  }
}
</script>
