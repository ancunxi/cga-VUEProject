export default{
  path: '/case',
  component: resolve => require(['../case/main.vue'], resolve),   
  //默认跳转
  redirect: '/case/register/window/index', 
  children: [
    {
      path: 'common/review',
      component: resolve => require(['../case/common/review.vue'], resolve), 
    },
    {
      path: 'common/interaction',
      component: resolve => require(['../case/common/interaction.vue'], resolve), 
    },
    {
      path: 'common/problem',
      component: resolve => require(['../case/common/problem.vue'], resolve), 
    },
    {
      path: 'common/guide',
      component: resolve => require(['../case/common/guide.vue'], resolve), 
    },
    //办理登记——窗口登记模块下的打印页面
    {
      path: 'register/print',
      component: resolve => require(['../case/register/print.vue'], resolve), 
    },
    //办理登记——窗口登记
    {
      path: 'register/window/index',
      component: resolve => require(['../case/register/window/index.vue'], resolve), 
    },
    {
      path: 'register/window/detail/index',
      component: resolve => require(['../case/register/window/detail/index.vue'], resolve), 
    },                       
    {
      path: 'register/window/detail/application/sample',
      component: resolve => require(['../case/register/window/detail/application/sample.vue'], resolve), 
    }, 
    {
      path: 'register/window/detail/application/view',
      component: resolve => require(['../case/register/window/detail/application/view.vue'], resolve), 
    }, 
    {
      path: 'register/window/detail/application/add',
      component: resolve => require(['../case/register/window/detail/application/add.vue'], resolve), 
    },
    // {
    //   path: 'register/window/detail/special/index',
    //   component: resolve => require(['../case/register/window/detail/special/index.vue'], resolve), 
    // },      
    {
      path: 'register/window/detail/related/index',
      component: resolve => require(['../case/register/window/detail/related/index.vue'], resolve), 
    },    
    {
      path: 'register/window/download/index',
      component: resolve => require(['../case/register/window/download/index.vue'], resolve), 
    }, 
    //办理登记——办件向导
    {
      path: 'register/guide/index',
      component: resolve => require(['../case/register/guide/index.vue'], resolve), 
    }, 
    {
      path: 'register/guide/choose',
      component: resolve => require(['../case/register/guide/choose.vue'], resolve), 
    }, 
    {
      path: 'register/guide/lack',
      component: resolve => require(['../case/register/guide/lack.vue'], resolve), 
    },  

    //办理登记——暂予登记处理   
    {
      path: 'register/temporarily/index',
      component: resolve => require(['../case/register/temporarily/index.vue'], resolve), 
    },
    {
      path: 'register/temporarily/detail/index',
      component: resolve => require(['../case/register/temporarily/detail/index.vue'], resolve), 
    }, 
    
    //办理登记——补正件处理    
    {
      path: 'register/correction/index',
      component: resolve => require(['../case/register/correction/index.vue'], resolve), 
    },
    {
      path: 'register/correction/detail/index',
      //页面与暂予登记完全相同  借用暂予登记页面
      component: resolve => require(['../case/register/temporarily/detail/index.vue'], resolve), 
    },
    
    //办理登记——网上办理处理            
    {
      path: 'register/handle/index',
      component: resolve => require(['../case/register/handle/index.vue'], resolve), 
    },
    {
      path: 'register/handle/detail/index',
      component: resolve => require(['../case/register/handle/detail/index.vue'], resolve), 
    },
    {
      path: 'register/handle/detail/logview',
      component: resolve => require(['../case/common/view/logview.vue'], resolve), 
    },
    {
      path: 'register/handle/detail/application/sample',
      component: resolve => require(['../case/register/handle/detail/application/sample.vue'], resolve), 
    },
    {
      path: 'register/handle/detail/application/view',
      component: resolve => require(['../case/register/handle/detail/application/view.vue'], resolve), 
    },  
    {
      path: 'register/handle/detail/application/viewExamine',
      component: resolve => require(['../case/register/handle/detail/application/viewExamine.vue'], resolve), 
    },    
    //办理登记——网上预审处理                
    {
      path: 'register/pretreatment/index',
      component: resolve => require(['../case/register/pretreatment/index.vue'], resolve), 
    },
    {
      path: 'register/pretreatment/index2',
      component: resolve => require(['../case/register/pretreatment/index2.vue'], resolve), 
    },
    {
      path: 'register/pretreatment/detail/index',
      component: resolve => require(['../case/register/pretreatment/detail/index.vue'], resolve), 
    },    
    {
      path: 'register/pretreatment/detail/indexPretrial',
      component: resolve => require(['../case/register/pretreatment/detail/indexPretrial.vue'], resolve), 
    },  
    {
      path: 'register/pretreatment/detail/application/view',
      component: resolve => require(['../case/register/pretreatment/detail/application/view.vue'], resolve), 
    }, 
    {
      path: 'register/pretreatment/detail/application/viewExamine',
      component: resolve => require(['../case/register/pretreatment/detail/application/viewExamine.vue'], resolve), 
    },
    {
      path: 'register/pretreatment/detail/logview',
      component: resolve => require(['../case/common/view/logview.vue'], resolve), 
    },
    {
      path: 'register/pretreatment/detail/application/sample',
      component: resolve => require(['../case/register/pretreatment/detail/application/sample.vue'], resolve), 
    },
    //资料中心——资料补录                
    {
      path: 'data/complement/index',
      component: resolve => require(['../case/data/complement/index.vue'], resolve), 
    },
    {
      path: 'data/complement/detail/index',
      component: resolve => require(['../case/data/complement/detail/index.vue'], resolve), 
    },
    {
      path: 'data/complement/detail/application/sample',
      component: resolve => require(['../case/data/complement/detail/application/sample.vue'], resolve), 
    },
    {
      path: 'data/complement/detail/application/add',
      component: resolve => require(['../case/data/complement/detail/application/add.vue'], resolve), 
    },
    {
      path: 'data/complement/detail/application/view',
      component: resolve => require(['../case/data/complement/detail/application/view.vue'], resolve), 
    },
    {
      path: 'data/complement/detail/special/index',
      component: resolve => require(['../case/data/complement/detail/special/index.vue'], resolve), 
    },
    //资料中心——资料袋出件              
    {
      path: 'data/send/index',
      component: resolve => require(['../case/data/send/index.vue'], resolve), 
    },
     {
      path: 'data/send/add',
      component: resolve => require(['../case/data/send/add.vue'], resolve), 
    },
    //资料中心——资料袋签收               
    {
      path: 'data/receive/index',
      component: resolve => require(['../case/data/receive/index.vue'], resolve), 
    },
    //资料中心——资料袋查询                
    {
      path: 'data/inquire/index',
      component: resolve => require(['../case/data/inquire/index.vue'], resolve), 
    },        

    //业务流程——工作待办（主流程和辅助流程）               
    {
      path: 'process/wait/index',
      component: resolve => require(['../case/process/wait/index.vue'], resolve), 
    },
    {
      path: 'process/wait/detail/index',
      component: resolve => require(['../case/process/wait/detail/index.vue'], resolve), 
    }, 
    {
      path: 'process/wait/detail/logreview',
      component: resolve => require(['../case/process/wait/detail/logreview.vue'], resolve), 
    }, 
    {
      path: 'process/wait/detail/print',
      component: resolve => require(['../case/process/wait/detail/print.vue'], resolve), 
    },               
    {
      path: 'process/wait/detail/application/sample',
      component: resolve => require(['../case/process/wait/detail/application/sample.vue'], resolve), 
    }, 
    {
      path: 'process/wait/detail/application/view',
      component: resolve => require(['../case/process/wait/detail/application/view.vue'], resolve), 
    }, 
    {
      path: 'process/wait/detail/application/add',
      component: resolve => require(['../case/process/wait/detail/application/add.vue'], resolve), 
    }, 
    {
      path: 'process/wait/detail/special/index',
      component: resolve => require(['../case/process/wait/detail/special/index.vue'], resolve), 
    }, 

    //业务流程——办件缴费
    {
      path: 'process/payment/index',
      component: resolve => require(['../case/process/payment/index.vue'], resolve), 
    },
    {
      path: 'process/payment/detail/index',
      component: resolve => require(['../case/process/payment/detail/index.vue'], resolve), 
    },

    //业务流程——证照上传
    {
      path: 'process/upload/index',
      component: resolve => require(['../case/process/upload/index.vue'], resolve), 
    },
    {
      path: 'process/upload/detail/index',
      component: resolve => require(['../case/process/upload/detail/index.vue'], resolve), 
    },
    {
      path: 'process/upload/detail/form',
      component: resolve => require(['../case/process/upload/detail/form.vue'], resolve), 
    },
    //业务流程——证照打印
    {
      path: 'process/print/index',
      component: resolve => require(['../case/process/print/index.vue'], resolve), 
    },
    {
      path: 'process/print/form',
      component: resolve => require(['../case/process/print/form.vue'], resolve), 
    },

    //办理登记——办件证照签收               
    {
      path: 'process/licensesend/index2',
      //代发证
      component: resolve => require(['../case/process/licensesend/index.vue'], resolve), 
    },
    {
      path: 'process/licensesend/index',
      //已发证
      component: resolve => require(['../case/process/licensesend/index2.vue'], resolve), 
    },
    {
      path: 'process/licensesend/receive',
      component: resolve => require(['../case/process/licensesend/receive.vue'], resolve), 
    },
    {
      path: 'process/licensesend/send',
      component: resolve => require(['../case/process/licensesend/send.vue'], resolve), 
    },
    {
      path: 'process/licensesend/print',
      component: resolve => require(['../case/process/licensesend/print.vue'], resolve), 
    },
    {
      path: 'process/licensesend/info/index',
      component: resolve => require(['../case/office/mine/detail/index.vue'], resolve),  
    },

    //业务流程——办件修改
    {
      path: 'process/modifycase/index',
      component: resolve => require(['../case/process/modifycase/index.vue'], resolve), 
    },
    {
      path: 'process/modifycase/detail/index',
      component: resolve => require(['../case/process/modifycase/detail/index.vue'], resolve), 
    },

    //业务流程——行政收费
    {
      path: 'process/administrativecharge/index',
      component: resolve => require(['../case/process/administrativecharge/index.vue'], resolve), 
    },
    {
      path: 'process/administrativecharge/detail/index',
      component: resolve => require(['../case/process/administrativecharge/detail/index.vue'], resolve), 
    },
    {
      path: 'process/administrativecharge/detail/print',
      component: resolve => require(['../case/process/administrativecharge/detail/print.vue'], resolve), 
    }, 

    //业务流程——补正通知
    {
      path: 'process/supplementnotice/index',
      component: resolve => require(['../case/process/supplementnotice/index.vue'], resolve), 
    },
    //办件查询——我的办件
    {
      path: 'office/mine/index',
      component: resolve => require(['../case/office/mine/index.vue'], resolve), 
    },
    {
      path: 'office/mine/detail/index',
      component: resolve => require(['../case/office/mine/detail/index.vue'], resolve), 
    }, 
    {
      path: 'office/mine/detail/logview',
      //component: resolve => require(['../case/office/mine/detail/logview.vue'], resolve),
      component: resolve => require(['../case/common/view/logview.vue'], resolve),  
    }, 
    {
      path: 'office/mine/detail/application/view',
      component: resolve => require(['../case/office/mine/detail/application/view.vue'], resolve), 
    }, 
    {
      path: 'office/mine/detail/special/index',
      component: resolve => require(['../case/office/mine/detail/special/index.vue'], resolve), 
    },
    {
      path: 'office/mine/detail/application/add',
      component: resolve => require(['../case/office/mine/detail/application/add.vue'], resolve), 
    },
    {
      path: 'office/mine/detail/application/sample',
      component: resolve => require(['../case/office/mine/detail/application/sample.vue'], resolve), 
    },
    {
      path: 'office/mine/detail/application/view',
      component: resolve => require(['../case/office/mine/detail/application/view.vue'], resolve), 
    },              
    //办件查询——机关办件    
    {
      path: 'office/organs/index',
      component: resolve => require(['../case/office/organs/index.vue'], resolve), 
    },
    {
      path: 'office/organs/detail/index',
      component: resolve => require(['../case/office/mine/detail/index.vue'], resolve), 
    }, 
    {
      path: 'office/organs/detail/logview',
      component: resolve => require(['../case/office/mine/detail/logview.vue'], resolve), 
    },
    {
      path: 'office/organs/detail/application/sample',
      component: resolve => require(['../case/office/mine/detail/application/sample.vue'], resolve), 
    },
    {
      path: 'office/organs/detail/application/add',
      component: resolve => require(['../case/office/mine/detail/application/add.vue'], resolve), 
    }, 
    {
      path: 'office/organs/detail/application/view',
      component: resolve => require(['../case/office/mine/detail/application/view.vue'], resolve), 
    }, 
    {
      path: 'office/organs/detail/special/index',
      component: resolve => require(['../case/office/mine/detail/special/index.vue'], resolve), 
    },
    //办件查询——实施机关办件    
    {
      path: 'office/implementorgans/index',
      component: resolve => require(['../case/office/implementorgans/index.vue'], resolve), 
    },
    {
      path: 'office/implementorgans/detail/index',
      component: resolve => require(['../case/office/mine/detail/index.vue'], resolve), 
    }, 
    {
      path: 'office/implementorgans/detail/logview',
      component: resolve => require(['../case/office/mine/detail/logview.vue'], resolve), 
    },
    {
      path: 'office/implementorgans/detail/application/sample',
      component: resolve => require(['../case/office/mine/detail/application/sample.vue'], resolve), 
    },
    {
      path: 'office/implementorgans/detail/application/add',
      component: resolve => require(['../case/office/mine/detail/application/add.vue'], resolve), 
    }, 
    {
      path: 'office/implementorgans/detail/application/view',
      component: resolve => require(['../case/office/mine/detail/application/view.vue'], resolve), 
    }, 
    {
      path: 'office/implementorgans/detail/special/index',
      component: resolve => require(['../case/office/mine/detail/special/index.vue'], resolve), 
    },
    // {
    //   path: 'office/implementorgans/info/index',
    //   component: resolve => require(['../case/office/mine/detail/index.vue'], resolve),  
    // },
    //办件查询——审批文书   
    {
      path: 'office/instrument/index',
      component: resolve => require(['../case/office/instrument/index.vue'], resolve), 
    },
    {
      path: 'office/instrument/form',
      component: resolve => require(['../case/office/instrument/form.vue'], resolve), 
    },
    //办件查询——收费信息    
    {
      path: 'office/charge/index',
      component: resolve => require(['../case/office/charge/index.vue'], resolve), 
    },
    {
      path: 'office/charge/detail/index',
      component: resolve => require(['../case/office/charge/detail/index.vue'], resolve), 
    },
    //办件事项信息
    {
      path: 'office/projectcase/index',
      component: resolve => require(['../case/office/projectcase/index.vue'], resolve), 
    },
      {
      path: 'office/projectcase/detail/index',
      component: resolve => require(['../case/office/projectcase/detail/index.vue'], resolve), 
    },
//--------------------------------------------------------
    {
      path: 'office/projectcase/detail/logview',
      component: resolve => require(['../case/office/projectcase/detail/logview.vue'], resolve), 
    },
    {
      path: 'office/projectcase/detail/application/sample',
      component: resolve => require(['../case/office/projectcase/detail/application/sample.vue'], resolve), 
    },
    {
      path: 'office/projectcase/detail/application/add',
      component: resolve => require(['../case/office/projectcase/detail/application/add.vue'], resolve), 
    }, 
    {
      path: 'office/projectcase/detail/application/view',
      component: resolve => require(['../case/office/projectcase/detail/application/view.vue'], resolve), 
    }, 
    {
      path: 'office/projectcase/detail/special/index',
      component: resolve => require(['../case/office/projectcase/detail/special/index.vue'], resolve), 
    },
	
	//---------------------------------------------------------------
    //办件统计——办件量统计
    {
      path: 'count/amount/index',
      component: resolve => require(['../case/count/amount/index.vue'], resolve), 
    },
     {
      path: 'count/windows/index',
      component: resolve => require(['../case/count/windows/index.vue'], resolve), 
    },
    //办件统计——办件时间分布统计
    {
      path: 'count/time/index',
      component: resolve => require(['../case/count/time/index.vue'], resolve), 
    },
    //办件统计——办事效率统计
    {
      path: 'count/efficiency/index',
      component: resolve => require(['../case/count/efficiency/index.vue'], resolve), 
    },
	//办件统计——办件事项部门分类统计
    {
      path: 'count/projetDept/index',
      component: resolve => require(['../case/count/projetDept/index.vue'], resolve), 
    },
	//办件统计——办件人员分类统计
    {
      path: 'count/acceptUser/index',
      component: resolve => require(['../case/count/acceptUser/index.vue'], resolve), 
    },
    //办件统计——收费统计
    {
      path: 'count/charge/index',
      component: resolve => require(['../case/count/charge/index.vue'], resolve), 
    },    

    //配置管理——事项配置
    {
      path: 'configuration/matter/index',
      component: resolve => require(['../case/configuration/matter/index.vue'], resolve), 
    }, 
    {
      path: 'configuration/matter/register',
      component: resolve => require(['../case/configuration/matter/register.vue'], resolve), 
    }, 
    {
      path: 'configuration/matter/flow',
      component: resolve => require(['../case/configuration/matter/flow.vue'], resolve), 
    }, 
    {
      path: 'configuration/matter/pay',
      component: resolve => require(['../case/configuration/matter/pay.vue'], resolve), 
    }, 
    {
      path: 'configuration/matter/add',
      component: resolve => require(['../case/configuration/matter/add.vue'], resolve), 
    }, 
    {
      path: 'configuration/matter/payedit',
      component: resolve => require(['../case/configuration/matter/payedit.vue'], resolve), 
    }, 
    //配置管理——帮办配置    
    {
      path: 'configuration/help/index',
      component: resolve => require(['../case/configuration/help/index.vue'], resolve), 
    },
    {
      path: 'configuration/help/add',
      component: resolve => require(['../case/configuration/help/add.vue'], resolve), 
    },    
    //配置管理——辅助流程配置    
    {
      path: 'configuration/auxiliary/index',
      component: resolve => require(['../case/configuration/auxiliary/index.vue'], resolve), 
    },  
    {
      path: 'configuration/auxiliary/deploy',
      component: resolve => require(['../case/configuration/auxiliary/deploy.vue'], resolve), 
    },  
     {
      path: 'configuration/auxiliary/edit',
      component: resolve => require(['../case/configuration/auxiliary/edit.vue'], resolve), 
    },  
    {
      path: 'configuration/auxiliary/add',
      component: resolve => require(['../case/configuration/auxiliary/add.vue'], resolve), 
    }, 
    //配置管理——受理事项配置    
    {
      path: 'configuration/accept/index',
      component: resolve => require(['../case/configuration/accept/index.vue'], resolve), 
    },      
    {
      path: 'configuration/accept/add',
      component: resolve => require(['../case/configuration/accept/add.vue'], resolve), 
    },
      {
      path: 'configuration/accept/personProjects',
      component: resolve => require(['../case/configuration/accept/personProjects.vue'], resolve), 
    },
	//消息通知
	{
	  path: 'message/message',
	  component: resolve => require(['../case/message/message.vue'], resolve), 		
	},
	{
	  path: 'message/index',
	  component: resolve => require(['../case/message/index.vue'], resolve), 		
	}	
  ]
}