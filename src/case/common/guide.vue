<template>
  <div>
    <Row v-if='guideShow'>
      <Col span="18" id='floorBox'>
        <Form :label-width="150">
          <!-- 1 -->
          <Row v-if="hiddenConditionList.isShowFixedAssets == 0">
            <Col span="8">
              <FormItem label="是否固资事项：">
                  <i-switch disabled v-model="formItem.isFixedAssets" size="large">
                      <span slot="open">启用</span>
                      <span slot="close">关闭</span>
                  </i-switch>
              </FormItem>
            </Col>
          </Row>
          <Row class='guideFloor'>
            <Row v-if="hiddenConditionList.isShowWindowaccept == 0">
              <Col span="8">
                <FormItem label="现场申报：">
                    <i-switch disabled v-model="formItem.isWindowaccept" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
              </Col>
              <Col span="16" v-if="formItem.isWindowaccept == true">
                <FormItem label="地址：">
                  {{projectSummaryInfo.windowAcceptAddress}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isShowNet == 0">
              <Col span="8">
                <FormItem label="网上申报：">
                    <i-switch disabled v-model="formItem.isNet" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
              </Col>
              <Col span="16" v-if="formItem.isNet == true">
                <FormItem label="申报网址：">
                  {{projectSummaryInfo.netAcceptUrl}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isShowPhoneAccept == 0">
              <Col span="8">
                <FormItem label="电话申报：">
                    <i-switch disabled v-model="formItem.isPhoneAccept" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
              </Col>
              <Col span="16" v-if="formItem.isPhoneAccept == true">
                <FormItem label="电话号码：">
                  {{projectSummaryInfo.phoneAcceptNumber}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isShowAppAccept == 0">
              <Col span="8">
                <FormItem label="移动端申报：">
                    <i-switch disabled v-model="formItem.isAppAccept" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
              </Col>
              <Col span="16" v-if="formItem.isAppAccept == true">
                <FormItem label="下载地址：">
                  {{projectSummaryInfo.appDownloadUrl}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isShowAgmAccept == 0">
              <Col span="8">
                <FormItem label="自助终端申报：">
                    <i-switch disabled v-model="formItem.isAgmAccept" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
              </Col>
              <Col span="16" v-if="formItem.isAgmAccept == true">
                <FormItem label="终端地址：">
                  {{projectSummaryInfo.agmAddress}}
                </FormItem>
              </Col>
            </Row>
          </Row> 
         
          <Row class='guideFloor'>
            <Row v-if="hiddenConditionList.isShowDealForm == 0">
              <Col span="24">
                <FormItem label="办理形式：">
                  <Checkbox-group v-model="projectSummaryInfo.dealForm">
                      <Checkbox label="01">窗口办理</Checkbox>
                      <Checkbox label="02">网上办理</Checkbox>
                  </Checkbox-group>
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isShowSubscribe == 0">
              <Col span="8">
                <FormItem label="网上预约：">
                    <i-switch disabled v-model="formItem.isSubscribe" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
              </Col>
              <Col span="16" v-if="formItem.isSubscribe == true">
                <FormItem label="预约网址：">
                  {{projectSummaryInfo.netSubscribeUrl}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isShowPhoneSubscribe == 0">
              <Col span="8">
                <FormItem label="电话预约：">
                    <i-switch disabled v-model="formItem.isPhoneSubscribe" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
              </Col>
              <Col span="16" v-if="formItem.isPhoneSubscribe == true">
                <FormItem label="电话号码：">
                  {{projectSummaryInfo.phoneSubscribeNumber}}
                </FormItem>
              </Col>
            </Row>
          </Row>
          
          <!-- 1 -->
          <Row v-if="hiddenConditionList.isFoundation == 0" class='guideFloor'>
            <Col span="24" >
              <FormItem label="设立依据：">
                <Row>
                  <Col span="24" style="border: 1px dashed #d7dde4; padding:10px 20px 0;" v-if='levelist!=""'>
                    <template v-for="data in levelist">
                      <Alert type="success" show-icon>
                        <a href="javascript:;" @click="seeData(data.id)">【{{data.categoryName}}】{{data.name}}({{data.issueOrderno}})</a>
                      </Alert>
                    </template>
                  </Col>
                </Row>                       
              </FormItem>
            </Col>
          </Row>
         
          <Row v-if="hiddenConditionList.isApplyMaterial == 0" class='guideFloor'>
            <Col span="24">
              <FormItem label="申请材料清单：">
                {{projectSummaryInfo.applyMaterial}}
              </FormItem>
            </Col>
          </Row>

          <Row class='guideFloor'>
              <Row v-if="hiddenConditionList.isAcceptCondition == 0">
                <Col span="24">
                  <FormItem label="受理标准(条件)：">
                    {{projectSummaryInfo.acceptCondition}}
                  </FormItem>
                </Col>
              </Row>
              <Row v-if="hiddenConditionList.isPremitCond == 0">
                <Col span="24">
                  <FormItem label="办理(审批)条件：">
                    {{projectSummaryInfo.premitCond}}
                  </FormItem>
                </Col>
              </Row>
              <Row v-if="hiddenConditionList.isMaterAuditStandard == 0">
                <Col span="24">
                  <FormItem label="材料审核标准：">
                    {{projectSummaryInfo.materAuditStandard}}
                  </FormItem>
                </Col>
              </Row> 
          </Row>
          
          <!-- 2 -->
          <Row class='guideFloor'>
              <Row v-if="hiddenConditionList.isShowCharge == 0">
                <Col span="8">
                  <FormItem label="是否收费：">
                      <i-switch disabled v-model="formItem.isCharge" size="large">
                          <span slot="open">启用</span>
                          <span slot="close">关闭</span>
                      </i-switch>
                  </FormItem>
                </Col>
              </Row>
              <!-- 2 -->
              <Row v-if="formItem.isCharge == true">
                <Col span="24">
                  <FormItem label="收费标准：">
                    {{projectSummaryInfo.chargeStandard}}
                  </FormItem>
                </Col>
              </Row>
              <Row v-if="formItem.isCharge == true">
                <Col span="24">
                  <FormItem label="收费依据：">
                    {{projectSummaryInfo.chargeFoundation}}
                  </FormItem>
                </Col>
              </Row>  
              <!-- 3 -->
              <Row v-if="hiddenConditionList.isShowNetPay == 0">
                <Col span="8">
                  <FormItem label="是否网上支付：">
                      <i-switch disabled v-model="formItem.isNetPay" size="large">
                          <span slot="open">启用</span>
                          <span slot="close">关闭</span>
                      </i-switch>
                  </FormItem>
                </Col>
              </Row>
          </Row>
          
          <Row v-if="hiddenConditionList.isShowLogisticsExpress == 0" class='guideFloor'>
            <Col span="8">
              <FormItem label="是否支持物流快递：">
                  <i-switch disabled v-model="formItem.isLogisticsExpress" size="large">
                      <span slot="open">启用</span>
                      <span slot="close">关闭</span>
                  </i-switch>
              </FormItem>
            </Col>
          </Row>
          <Row v-if="hiddenConditionList.isShowInCentre == 0" class='guideFloor'>
            <Col span="8">
              <FormItem label="是否进驻大厅：">
                  <i-switch disabled v-model="formItem.isInCentre" size="large">
                      <span slot="open">启用</span>
                      <span slot="close">关闭</span>
                  </i-switch>
              </FormItem>
            </Col>
            <Col span="16" v-if="formItem.isInCentre == true">
              <FormItem label="大厅办理类型：">
                  <Radio-group v-model="projectSummaryInfo.isCentreType">
                      <Radio label="0">仅受理</Radio>
                      <Radio label="1">全程办理</Radio>
                  </Radio-group>
              </FormItem>
            </Col>
          </Row>
          <!-- 3 -->
          <Row class='guideFloor'>
            <Row v-if="hiddenConditionList.isStatutoryDays == 0">
              <Col span="24">
                <FormItem label="法定办理期限：">
                  {{projectSummaryInfo.statutoryDays}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isStatutoryDesc == 0">
              <Col span="8">
                <FormItem label="法定办理期限描述：">
                  {{projectSummaryInfo.statutoryDesc}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isPromiseDays == 0">
              <Col span="24">
                <FormItem label="承诺办理期限：">
                   {{projectSummaryInfo.promiseDays}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isPromiseDesc == 0">
              <Col span="8">
                <FormItem label="承诺办理期限描述：">
                  {{projectSummaryInfo.promiseDesc}}
                </FormItem>
              </Col>
            </Row>
          </Row>
          
          <Row class='guideFloor'>
            <Row v-if="hiddenConditionList.isExamAppDept == 0">
              <Col span="24">
                <FormItem label="业务主管部门：">
                  {{projectSummaryInfo.examAppDept}}
                </FormItem>
              </Col>
            </Row> 
            <Row v-if="hiddenConditionList.isAcceptName == 0">
              <Col span="24">
                <FormItem label="实施机构(实施主体)：">
                  {{projectSummaryInfo.acceptName}}
                </FormItem>
              </Col>
            </Row> 
            <Row v-if="hiddenConditionList.isJointlyOrganize == 0">
              <Col span="24">
                <FormItem label="联办机构：">
                  {{projectSummaryInfo.jointlyOrganize}}
                </FormItem>
              </Col>
            </Row> 
            <Row v-if="hiddenConditionList.isDealMain == 0">
              <Col span="24">
                <FormItem label="办理处（科）室：">
                  {{projectSummaryInfo.dealMain}}
                </FormItem>
              </Col>
            </Row> 
          </Row>
          
          <Row class='guideFloor'>
            <Row v-if="hiddenConditionList.isAcceptAddress == 0">
              <Col span="24">
                <FormItem label="办理地点：">
                  {{projectSummaryInfo.acceptAddress}}
                </FormItem>
              </Col>
            </Row> 
            <Row v-if="hiddenConditionList.isWindowAddress == 0">
              <Col span="24">
                <FormItem label="所在窗口：">
                  {{projectSummaryInfo.windowAddress}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isWorkTime == 0">
              <Col span="24">
                <FormItem label="办理时间：">
                  {{projectSummaryInfo.workTime}}
                </FormItem>
              </Col>
            </Row> 
          </Row>
          
          <!-- 4 -->
          <Row class='guideFloor'>
            <Row v-if="hiddenConditionList.isShowWindowConsult == 0">
              <Col span="8">
                <FormItem label="窗口咨询：">
                    <i-switch disabled v-model="formItem.isWindowConsult" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
              </Col>
              <Col span="16" v-if="formItem.isWindowConsult == true">
                <FormItem label="窗口咨询地址：">
                  {{projectSummaryInfo.windowConsultAddress}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isShowPhoneConsult == 0"
            >
              <Col span="8">
                <FormItem label="电话咨询：">
                    <i-switch disabled v-model="formItem.isPhoneConsult" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
              </Col>
              <Col span="16" v-if="formItem.isPhoneConsult == true">
                <FormItem label="电话号码：">
                  {{projectSummaryInfo.phoneConsultNumber}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isShowNetConsult == 0"
            >
              <Col span="8">
                <FormItem label="网上咨询：">
                    <i-switch disabled v-model="formItem.isNetConsult" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
              </Col>
              <Col span="16" v-if="formItem.isNetConsult == true">
                <FormItem label="咨询网址：">
                  {{projectSummaryInfo.netConsultUrl}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isShowEmailConsult == 0"
            >
              <Col span="8">
                <FormItem label="电子邮件咨询：">
                    <i-switch disabled v-model="formItem.isEmailConsult" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
              </Col>
              <Col span="16" v-if="formItem.isEmailConsult == true">
                <FormItem label="咨询邮箱：">
                  {{projectSummaryInfo.emailConsultUrl}}
                </FormItem>
              </Col>
            </Row>
          </Row>
          
          <Row class='guideFloor'>
            <Row v-if="hiddenConditionList.isShowPhoneMonitor == 0">
              <Col span="8">
                <FormItem label="监督电话：">
                    <i-switch disabled v-model="formItem.isPhoneMonitor" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
              </Col>
              <Col span="16" v-if="formItem.isPhoneMonitor == true">
                <FormItem label="监督部门电话：">
                  {{projectSummaryInfo.phoneMonitorNumber}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isShowWindowComplaint == 0">
              <Col span="8">
                <FormItem label="窗口投诉：">
                    <i-switch disabled v-model="formItem.isWindowComplaint" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
              </Col>
              <Col span="16" v-if="formItem.isWindowComplaint == true">
                <FormItem label="窗口投诉地址：">
                  {{projectSummaryInfo.windowComplaintAddress}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isShowPhoneComplaint == 0">
              <Col span="8">
                <FormItem label="电话投诉：">
                    <i-switch disabled v-model="formItem.isPhoneComplaint" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
              </Col>
              <Col span="16" v-if="formItem.isPhoneComplaint == true">
                <FormItem label="投诉电话：">
                  {{projectSummaryInfo.phoneComplaintNumber}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isShowNetComplaint == 0">
              <Col span="8">
                <FormItem label="网上投诉：">
                    <i-switch disabled v-model="formItem.isNetComplaint" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
              </Col>
              <Col span="16" v-if="formItem.isNetComplaint == true">
                <FormItem label="投诉网址：">
                  {{projectSummaryInfo.netComplaintUrl}}
                </FormItem>
              </Col>
            </Row>
          </Row>
          
          <Row class='guideFloor'>
            <Row v-if="hiddenConditionList.isShowPhoneProgress == 0">
              <Col span="8">
                <FormItem label="办理进度电话查询：">
                    <i-switch disabled v-model="formItem.isPhoneQueryprogress" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
              </Col>
              <Col span="16" v-if="formItem.isPhoneQueryprogress == true">
                <FormItem label="查询电话号码：">
                  {{projectSummaryInfo.phoneQueryprogressNumber}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isShowNetProgress == 0">
              <Col span="8">
                <FormItem label="办理进度网上查询：">
                    <i-switch disabled v-model="formItem.isNetQueryprogress" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
              </Col>
              <Col span="16" v-if="formItem.isNetQueryprogress == true">
                <FormItem label="查询网址：">
                  {{projectSummaryInfo.netQueryprogressUrl}}
                </FormItem>
              </Col>
            </Row>
          </Row>
          
          <!-- 4 -->
          <Row v-if="hiddenConditionList.isIntermediaryService == 0" class='guideFloor'>
            <Col span="24">
              <FormItem label="中介服务：">
                {{projectSummaryInfo.intermediaryService}}
              </FormItem>
            </Col>
          </Row>
          <Row v-if="hiddenConditionList.isQuantityRestriction == 0" class='guideFloor'>
            <Col span="8">
              <FormItem label="数量限制：">
                {{projectSummaryInfo.quantityRestriction}}
              </FormItem>
            </Col>
          </Row> 
          <Row v-if="hiddenConditionList.isAcceptAuthorityDesc == 0" class='guideFloor'>
            <Col span="24">
              <FormItem label="行使内容(权限说明)：">
                {{projectSummaryInfo.acceptAuthorityDesc}}
              </FormItem>
            </Col>
          </Row>
          <Row v-if="hiddenConditionList.isSpecialProcedureDay == 0" class='guideFloor'>
            <Col span="12">
              <FormItem label="特别程序及期限：">
                {{projectSummaryInfo.specialProcedure}}
              </FormItem>
            </Col>                  
          </Row>  

          <Row class='guideFloor'>
            <Row v-if="hiddenConditionList.isResponsibilityMatters == 0">
              <Col span="24">
                <FormItem label="责任事项：">
                  {{projectSummaryInfo.responsibilityMatters}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isResponsibilityFoundation == 0">
              <Col span="24">
                <FormItem label="责任事项依据：">
                  {{projectSummaryInfo.responsibilityFoundation}}
                </FormItem>
              </Col>
            </Row>                                     
            <Row v-if="hiddenConditionList.isResponsibilityBoundary == 0">
              <Col span="24">
                <FormItem label="职责边界：">
                  {{projectSummaryInfo.responsibilityBoundary}}
                </FormItem>
              </Col>
            </Row>
          </Row>  
          
          <Row v-if="hiddenConditionList.isSceneNum == 0" class='guideFloor'>
            <Col span="24">
              <FormItem label="平均去现场次数：">
                {{projectSummaryInfo.sceneNum}}
              </FormItem>
            </Col>
          </Row>

          <Row class='guideFloor'>
            <Row v-if="hiddenConditionList.isProcess == 0">
              <Col span="24">
                <FormItem label="办理流程：">
                  {{projectSummaryInfo.process}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isInsideProcessDesc == 0">
              <Col span="24">
                <FormItem label="内部流程描述：">
                  {{projectSummaryInfo.insideProcessDesc}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isFlowNode == 0">
              <Col span="24">
                <FormItem label="事项流动节点：">
                  <Checkbox-group  v-model="flowNode">
                    <template v-for="(option,index) in flowNodeType">
                        <Checkbox :label="option.dictId">{{option.dictName}}</Checkbox>
                        <span v-if='index != flowNodeType.length-1'>→</span>
                    </template>
                  </Checkbox-group>
                </FormItem>
              </Col>             
            </Row>
            <Row v-if="hiddenConditionList.isProcessImg == 0">
              <Col span="24">
                <FormItem label="流程图：">
                  <Row>
                    <template  v-for="option in levelsupimg">
                      <Col span="4" class="view">
                        <a href="javascript:;"  class="uploadArea">
                          <img v-if="/^.+\.png$/.test(option.fileName) == true" src="../../assets/img/icon_file_png.png">
                          <img v-else-if="/^.+\.jpg$/.test(option.fileName) == true " src="../../assets/img/icon_file_jpg.png">
                          <img v-else-if="/^.+\.bmp$/.test(option.fileName) == true " src="../../assets/img/icon_file_bmp.png">
                          <img v-else="/^.+\.jpeg$/.test(option.fileName) == true " src="../../assets/img/icon_file_jpeg.png">
                          <p :title="option.fileName">{{option.fileName}}</p> 
                          <div class="uploadHoverBtn">
                            <Button type="success" size="small" style="margin-top:10px; margin-bottom:3px;" @click="preview(option.id)">预览</Button>
                            <Button type="primary" size="small" style="margin-bottom:3px;"  @click="downImg(option.id)">下载</Button>
                          </div>  
                        </a>
                      </Col>
                    </template>
                  </Row>
                </FormItem>
              </Col>
            </Row>
          </Row>
          
          <Row class='guideFloor'>
            <Row v-if="hiddenConditionList.isCertName == 0">
              <Col span="24">
                <FormItem label="证照形式及有效期：">
                  {{projectSummaryInfo.certName}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isCertStandardNo == 0">
              <Col span="24">
                <FormItem label="证照批复标准资料：">
                  {{projectSummaryInfo.licenseName}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isProjectSample == 0">
              <Col span="24">
                <FormItem label="证照样例：">
                  <Row>
                    <template v-for="option in levelsup">
                      <Col span="4" class="view">
                        <a href="javascript:;"  class="uploadArea">
                          <img v-if="/^.+\.png$/.test(option.fileName) == true" src="../../assets/img/icon_file_png.png">
                          <img v-if="/^.+\.jpg$/.test(option.fileName) == true " src="../../assets/img/icon_file_jpg.png">
                          <img v-if="/^.+\.jpeg$/.test(option.fileName) == true " src="../../assets/img/icon_file_jpeg.png">
                          <img v-if="/^.+\.pdf$/.test(option.fileName) == true " src="../../assets/img/icon_file_pdf.png">
                          <img v-if="/^.+\.bmp$/.test(option.fileName) == true " src="../../assets/img/icon_file_bmp.png">
                          <img v-if="/^.+\.doc$/.test(option.fileName) == true " src="../../assets/img/icon_file_doc.png">
                          <img v-if="/^.+\.docx$/.test(option.fileName) == true " src="../../assets/img/icon_file_docx.png">
                          <img v-if="/^.+\.gif$/.test(option.fileName) == true " src="../../assets/img/icon_file_gif.png">
                          <img v-if="/^.+\.ppt$/.test(option.fileName) == true " src="../../assets/img/icon_file_ppt.png">
                          <!-- <img v-if="/^.+\.pptx$/.test(option.fileName) == true " src="../../assets/img/icon_file_pptx.png"> -->
                          <img v-if="/^.+\.txt$/.test(option.fileName) == true " src="../../assets/img/icon_file_txt.png">
                          <img v-if="/^.+\.xls$/.test(option.fileName) == true " src="../../assets/img/icon_file_xls.png">
                          <img v-if="/^.+\.xlsx$/.test(option.fileName) == true " src="../../assets/img/icon_file_xlsx.png">
                          <p :title="option.fileName">{{option.fileName}}</p>
                          <div class="uploadHoverBtn">
                            <Button type="success" size="small" style="margin-bottom:3px;" @click="previews(option.fileId,option.sampleName)">预览</Button>
                            <Button type="primary" size="small" style="margin-bottom:3px;"  @click="downImg(option.fileId)">下载</Button>
                          </div> 
                        </a>
                      </Col>
                    </template>
                  </Row>
                </FormItem>
              </Col>
            </Row>
          </Row>

          <Row class='guideFloor'>
            <Row v-if="hiddenConditionList.isReporter == 0">
              <Col span="24">
                <FormItem label="填报人：">
                  {{projectSummaryInfo.reporter}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isReporterPhone == 0">
              <Col span="24">
                <FormItem label="填报人联系方式：">
                  {{projectSummaryInfo.reporterPhone}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isRemark == 0">
              <Col span="24">
                <FormItem label="备注：">
                  {{projectSummaryInfo.remark}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isReserve1 == 0">
              <Col span="24">
                <FormItem label="预留字段1">
                  {{projectSummaryInfo.reserve1}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isReserve2 == 0">
              <Col span="24">
                <FormItem label="预留字段2">
                  {{projectSummaryInfo.reserve2}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isReserve3 == 0">
              <Col span="24">
                <FormItem label="预留字段3">
                  {{projectSummaryInfo.reserve3}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isReserve4 == 0">
              <Col span="24">
                <FormItem label="预留字段4">
                  {{projectSummaryInfo.reserve4}}
                </FormItem>
              </Col>
            </Row>
            <Row v-if="hiddenConditionList.isReserve5 == 0">
              <Col span="24">
                <FormItem label="预留字段5">
                  {{projectSummaryInfo.reserve5}}
                </FormItem>
              </Col>
            </Row>
          </Row>
        </Form>
      </Col>
      <Col span='4' push="1">
        <div id='guideNav'>
          <a href="javascript:;" v-show="hiddenConditionList.isShowWindowaccept == 0 || hiddenConditionList.isShowNet == 0 ||hiddenConditionList.isShowPhoneAccept == 0 || hiddenConditionList.isShowAppAccept == 0 || hiddenConditionList.isShowAgmAccept == 0">申报途径</a>
          
          <a href="javascript:;" v-show="hiddenConditionList.isShowDealForm == 0 || hiddenConditionList.isShowSubscribe == 0 || hiddenConditionList.isShowPhoneSubscribe == 0">预约办理</a>
       
          <a href="javascript:;" v-show="hiddenConditionList.isFoundation == 0">设立依据</a>
          <a href="javascript:;" v-show="hiddenConditionList.isApplyMaterial == 0">申请材料清单</a>

          <a href="javascript:;" v-show="hiddenConditionList.isAcceptCondition == 0 || hiddenConditionList.isPremitCond == 0 || hiddenConditionList.isMaterAuditStandard == 0">受理条件及办理条件</a>
         
          <a href="javascript:;" v-show="hiddenConditionList.isShowCharge == 0 || formItem.isCharge == true || formItem.isCharge == true || hiddenConditionList.isShowNetPay == 0">收费依据及标准</a>
        
          <a href="javascript:;" v-show="hiddenConditionList.isShowLogisticsExpress == 0">是否支持物流快递</a>
          <a href="javascript:;" v-show="hiddenConditionList.isShowInCentre == 0">是否进驻大厅</a>


          <a href="javascript:;" v-show="hiddenConditionList.isStatutoryDays == 0 || hiddenConditionList.isStatutoryDesc == 0 || hiddenConditionList.isPromiseDays == 0 || hiddenConditionList.isPromiseDesc == 0">办理时限及说明</a>
          
          <a href="javascript:;" v-show="hiddenConditionList.isExamAppDept == 0 || hiddenConditionList.isAcceptName == 0 || hiddenConditionList.isJointlyOrganize == 0 || hiddenConditionList.isDealMain == 0">业务机构科室</a>
         
          <a href="javascript:;" v-show="hiddenConditionList.isAcceptAddress == 0 || hiddenConditionList.isWindowAddress == 0 || hiddenConditionList.isWorkTime == 0">办理地点时间</a>
          
          <a href="javascript:;" v-show="hiddenConditionList.isShowWindowConsult == 0 || hiddenConditionList.isShowPhoneConsult == 0 || hiddenConditionList.isShowNetConsult == 0 || hiddenConditionList.isShowEmailConsult == 0">咨询途径</a>
         
          <a href="javascript:;" v-show="hiddenConditionList.isShowPhoneMonitor == 0 || hiddenConditionList.isShowWindowComplaint == 0 || hiddenConditionList.isShowPhoneComplaint == 0 || hiddenConditionList.isShowNetComplaint == 0">监督途径</a>
          
          <a href="javascript:;" v-show="hiddenConditionList.isShowPhoneProgress == 0 || hiddenConditionList.isShowNetProgress == 0">进程查询途径</a>
         

          <a href="javascript:;" v-show="hiddenConditionList.isIntermediaryService == 0">中介服务</a>
          <a href="javascript:;" v-show="hiddenConditionList.isQuantityRestriction == 0">数量限制</a>
          <a href="javascript:;" v-show="hiddenConditionList.isAcceptAuthorityDesc == 0">行使内容(权限说明)</a>

          <a href="javascript:;" v-show="hiddenConditionList.isSpecialProcedureDay == 0">特别程序及期限</a>

          <a href="javascript:;" v-show="hiddenConditionList.isResponsibilityMatters == 0 || hiddenConditionList.isResponsibilityFoundation == 0 || hiddenConditionList.isResponsibilityBoundary == 0">责任事项</a>

          <a href="javascript:;" v-show="hiddenConditionList.isSceneNum == 0">平均去现场次数</a>

          <a href="javascript:;" v-show="hiddenConditionList.isProcess == 0 || hiddenConditionList.isInsideProcessDesc == 0 || hiddenConditionList.isFlowNode == 0 || hiddenConditionList.isProcessImg == 0">办理流程</a>

          <a href="javascript:;" v-show="hiddenConditionList.isCertName == 0 || hiddenConditionList.isCertStandardNo == 0 || hiddenConditionList.isProjectSample == 0">证照批准形式</a>

          <a href="javascript:;" v-show="hiddenConditionList.isReporter == 0">填报人</a>
          <span class='bottomToTop'></span>
          <div class="side-bar">
            <em class="circle start"></em>
            <em class="circle end"></em>
          </div>
        </div>
      </Col>

      <Modal
        v-model="editModal"
        title="查看"
        width="800"
        class-name="ivu-modal-style"
        @on-ok="scrollFun"
        @on-cancel="scrollFun">
        <Row>
          <Col span="24">
            <Form :label-width="100">
              <Row>
                <Col span="12">
                  <FormItem label="依据类别：">
                    {{basis.category}}
                  </FormItem>                     
                </Col>
                <Col span="12">
                  <FormItem label="名称：">
                    {{basis.name}}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem label="发布令号：">
                    {{basis.issueOrderno}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="制定机关：">
                    {{basis.organization}}
                  </FormItem>
                </Col>                    
              </Row>                  
              <Row>
                <Col span="24">
                  <FormItem label="规定全文：">
                    {{basis.content}}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>                    
      </Modal> 
    </Row>
    <!--返回按钮-->
    <Row class="margin-bottom-10 center" v-if="showFlag=='1'">
      <Col span="24">
        <router-link :to="$route.query.path" style="margin-left:8px;" v-if="$route.query.path != ''"><Button type="primary">返回</Button></router-link>
        <router-link to="../index" style="margin-left:8px;" v-else><Button type="primary">返回</Button></router-link>
      </Col>
    </Row>
  </div>
</template>

<script>
  require('../../assets/js/jquery.min.js');
  export default {
    props: {
      showFlag: {//控制返回按钮的显示或隐藏
        type: String,
        default: ''
      }
    }, 
    data(){
      return{
        projectSummaryInfo:{},
        formItem:{},   //开关，必需传入Boolean
        flowNode:[],  //事项流动节点
        levelist:[],  //设立依据
        levelsupimg:[],  //流程图
        levelsup:[],  //证照样例
        //判断需要隐藏的填写条件
        hiddenConditionList:{},
        editModal: false, //设立依据编辑
        basis: {
          category: '',
          name: '',
          issueOrderno: '',
          organization: '',
          content: ''
        },
        //内部流程描述
        flowNodeType: [],
        guideShow:false,
        scrollLength:0,          //页面卷曲长度
      }
    }, 
    created(){
      let token = localStorage.getItem('token');
      //获取数据字典数据  事项流动节点   
      $.post(window.config.api + "/sys/sysDictInfo/queryList.do?token="+token,{dictCode: '2026'})
          .then(data=>{
        if(!data.success){
          //返回错误状态                    
          return false;
        }
        this.flowNodeType = data.obj;
      });
    }, 

    updated(){
      $("#guideNav a").unbind('click').click(function(){
        $("#guideNav a").removeClass("active");
        $(this).addClass("active");
        //改变楼层
        $(".layout-menu-right").scrollTop(0);
        var $index = $(this).index();
        var $height = $("#floorBox .guideFloor").eq($index).offset().top - 120;
        $(".layout-menu-right").scrollTop($height);
        
      });

      $('.layout-menu-right').scroll(function(){
        var $top = $(this).scrollTop();//7280
        // $("#floorBox .guideFloor").each(function() {
        //   var $t = $(this).offset().top - 100 ;   //当前元素在顶部时，卷曲高度
        //   var $index = $(this).index();
        //   if($top > $t){
        //     alert(1)
        //     $("#guideNav a").removeClass("active");
        //     $("#guideNav a").eq($index).addClass("active");
        //   }
        // });
        if($top > 160){
          $("#guideNav").css('top',$top-130);
        }else{
          $("#guideNav").css('top',0);
        }
        $(".bottomToTop").click(function(){
            $(".layout-menu-right").scrollTop(0);
        })
        return false;

      });
    },
    methods: {
      getList(){
        this.hiddenCondition();
      },
      //查询办事指南配置信息  判断需要隐藏的填写条件
      hiddenCondition(){
        axios.post("/cgaProjectSummary/queryCgaProjectSummaryConfigInfo.do", {projectId:this.$route.query.projectId})
        .then(data=>{
          this.hiddenConditionList = data.obj; 
          this.conditionMessage();
        });
      },
      //查询办事指南信息
      conditionMessage(){
        axios.post("/cgaProjectSummary/queryCgaProjectSummaryInfo.do", {projectId:this.$route.query.projectId})
        .then(data=>{
          this.guideShow = true;
          this.projectSummaryInfo = data.obj.projectSummaryInfo;
          
          for(var key in data.obj.projectSummaryInfo){
            if(key=='isFixedAssets' || key=='isWindowaccept' ||key=='isNet' ||key=='isPhoneAccept' ||key=='isAppAccept' ||key=='isAgmAccept' ||key=='isSubscribe' ||key=='isPhoneSubscribe' ||key=='isCharge' ||key=='isNetPay' ||key=='isLogisticsExpress' ||key=='isInCentre' ||key=='isWindowConsult' ||key=='isPhoneConsult' ||key=='isNetConsult' ||key=='isEmailConsult' ||key=='isPhoneMonitor' ||key=='isWindowComplaint' ||key=='isPhoneComplaint' ||key=='isNetComplaint' ||key=='isPhoneQueryprogress' ||key=='isNetQueryprogress'){
                data.obj.projectSummaryInfo[key] == 0?this.formItem[key]=true:this.formItem[key]=false;
            }
          }
          //办理形式
          //this.projectSummaryInfo.dealForm = [data.obj.projectSummaryInfo.dealForm];
          if(data.obj.projectSummaryInfo.dealForm=='' || data.obj.projectSummaryInfo.dealForm==undefined){
              data.obj.projectSummaryInfo.dealForm = [];
          }else{
            this.projectSummaryInfo.dealForm = data.obj.projectSummaryInfo.dealForm.split(',');
          }
          

          //设立依据
          this.levelist = data.obj.projectFoundationInfo;

          //流程图，证照样例
          if(data.obj.files == undefined){
            data.obj.files = {summaryImg:"", tmpExample:[]}
          }
          if(data.obj.files.summaryImg == undefined){
            data.obj.files.summaryImg = "";
          }
          if(data.obj.files.tmpExample == undefined){
            data.obj.files.tmpExample = [];
          }

          if(data.obj.files.summaryImg != ''){
              this.levelsupimg = [data.obj.files.summaryImg];   //流程图
          }
          this.levelsUp = data.obj.files.examples;   //流程样例

          //事项流动节点
          if(data.obj.projectSummaryInfo.flowNode == '' || data.obj.projectSummaryInfo.flowNode == undefined){
              this.flowNode = [];
          }else{
              this.flowNode = data.obj.projectSummaryInfo.flowNode.split(',');
          }
        });
      },


      //查看设立依据
      seeData(oid){
        this.scrollLength = document.documentElement.scrollTop || document.body.scrollTop;  //获取卷曲长度

        this.editModal = true;
        axios.post("/cgaProjectFoundation/findInfoByParams.do", {id:oid})
        .then(data=>{
            this.basis.name = data.obj.name;
            this.basis.category = data.obj.category;
            this.basis.organization = data.obj.organization;
            this.basis.issueOrderno = data.obj.issueOrderno;
            this.basis.content = data.obj.content;
        })
      },
      scrollFun(){
        let _this = this;
        let timeImg = setInterval(function(){
          var len = document.documentElement.scrollTop || document.body.scrollTop;  //获取卷曲长度
          if(len == _this.scrollLength){
            clearInterval(timeImg);
          }
          window.scrollTo(0,_this.scrollLength);
        },100)
      },

      //预览-流程图
      preview(id){
        this.$emit('previewsFun',id,'.jpg');
      },
      //下载
      downImg(id){
          let token = localStorage.getItem('token');
          //自定义form标签，初始化相关参数
          var form = $("<form>");
          form.attr('style', 'display:none');
          form.attr('target', '');
          form.attr('method', 'post');
          form.attr('action', window.config.api+'/attachment/onLinePre.do');

          var input1 = $('<input>');
          input1.attr('type', 'hidden');
          input1.attr('name', 'fileId');
          input1.attr('value', id);
          
          var input2 = $('<input>');
          input2.attr('type', 'hidden');
          input2.attr('name', 'token');
          input2.attr('value', token);

          var input3 = $('<input>');
          input3.attr('type', 'hidden');
          input3.attr('name', 'downloadType');
          input3.attr('value', 1);
          
          $('body').append(form);
          form.append(input1);
          form.append(input2);
          form.append(input3);
          
          form.submit();
          form.remove();
      },
      //预览-证照样例
      previews(id,name){
        this.viewFileId = id;
        let Png = /^.+\.png$/;
        let Jpg = /^.+\.jpg$/;
        let type='';
        if(Png.test(name) == false && Jpg.test(name) == false){
            type = '.jpg';
        
        }else{
            type='.pdf';
        }
        this.$emit('previewsFun',id,type);
      },
    }
  }
</script>

<style lang="scss" scoped>
.view{
  text-align: center;
  margin: 10px 0 20px;
  .uploadArea{
    position: relative;
    display: block;
    img{
      display: block;
    }
    p{
      width: 80px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis; 
      color: #1c2438;    
    }
    .uploadHoverBtn{
      display: none;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 100;
      width: 80px;
      height: 80px;
      text-align: center;    
      border-radius: 3px;
      background: rgba(0,0,0,0.5);
    }
    &:hover .uploadHoverBtn{
      display: block;
    }  
  }  
}

#guideNav{
  position:relative;
  background:#fff;
  padding-top:10px;
  padding-bottom:10px;
  a{
    display:block;
    padding-top:2px;
    padding-bottom:2px;
    padding-left:20px;
    color:#495060;
    &:before{
      content:'';
      position: absolute;
      display: block;
      width: 10px;
      height: 10px;
      cursor: pointer;
      margin-top: 4px;
      left: -5px;
      background: transparent url(../../assets/img/sideCatalog.gif) 3px -222px no-repeat;
    }
    &.active:before {
      content:'';
      display:block;
      left: -5px;
      z-index: 2;
      position: absolute;
      height: 13px;
      width: 18px;
      cursor: pointer;
      background: transparent url(../../assets/img/sideCatalog.gif) -271px -38px no-repeat;
    }
    &:hover{
      background:#ccc;
    }
    &.active{
      color:#2d8cf0;
    }
  }
  .side-bar{
    position: absolute;
    top: 0;
    bottom:0;
    width: 0;
    //height: 353px;
    background-color: #eaeaea;
    border: 1px solid #eaeaea;
    border-top: 0;
    border-bottom: 0;
    left: 0;
    .circle.start{
      position: absolute;
      left: -5px;
      top:0;
      width: 10px;
      height: 10px;
      background: transparent url(../../assets/img/sideCatalog.gif) 0 -199px no-repeat;
      zoom: 1;
      overflow: hidden;
    }
    .circle.end {
      position: absolute;
      left: -5px;
      bottom:0;
      width: 10px;
      height: 10px;
      background: transparent url(../../assets/img/sideCatalog.gif) 0 -199px no-repeat;
      zoom: 1;
      overflow: hidden;
    }
  }
  .bottomToTop{
    display: block;
    margin-left:18px;
    width: 45px;
    height: 45px;
    cursor: pointer;
    margin-top: 6px;
    background: transparent url(../../assets/img/sideCatalog.gif) no-repeat -1px -62px;
  }
}
</style>
