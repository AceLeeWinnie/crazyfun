#### API

- 背景图片


- 获取发布活动列表

  ```javascript
  url: "/activity/publishlist"
  method: GET
  input: 
  {
    wechatId: '', //发布者id
  }
  output:
  {
    data: [{
      id: '',
      activity_name: '栖霞坑',
      activity_desc: '这里是简介',
      activity_time: 1421230414123,
      expect_num: 100,
      actual_num: 88,
      background_url: ''
    }], 
    success: true
  }
  ```

  ​

- 添加活动

  ```javascript
  url: "/activity/publishlist"
  method: POST
  input: 
  {
    wechatId: '',
    wechatName: '',
    data: {
      name: '',
      time: 12341241234,
      desc: '',
      expectnum: 100
    }
  }
  output:
  { 
    data: '', //活动id
    success: true
  }
  ```

- 活动报名情况

  ```javascript
  url: "/activity/publishlist/:activityid"
  method: GET,
  input: {
    publisherId: '',
  }
  output:
  { 
    data: [{
      wechat_id: '',
      wechat_name: '',
      name: '',
      IDCard: '',
      telephone: '',
      payName: ''
    }],
    success: true
  }
  ```

- 报名

  ```javascript
  url: "/activity/attendlist/:activityid"
  method: POST
  input: {
    wechatId: '',
    wechatName: '',
    name: '',
    idCard: '',
    tel: '',
    paymentId: ''
  }
  output:
  { 
    success: true
  }
  ```

- 查看已报名的活动

  ```javascript
  url: "/activity/attendlist"
  method: GET
  input: {
    wechatId: '',
  }
  output:
  {
    data: [{
      id: '',
      activity_name: '栖霞坑',
      activity_desc: '这里是简介',
      activity_time: 1421230414123,
      publisher_id: '',
      publisher_name: '',
      background_url: '',
      paticipant: [{
        id: '',
        name: ''
      }]
    }],
    success: true
  }
  ```

- 查看已报名的活动的报名人列表

  ```javascript
  url: "/activity/attendlist/:activityid"
  method: GET
  input: {
    wechatId: '',
  }
  output:
  {
    data: [{
      IDCard: '',
      name: '',
      telephone: '',
      payName: ''
    }],
    success: true
  }
  ```

- 取消报名

  ```javascript
  url: "/activity/cancelattend"
  method: POST
  input: {
    activityid: '',
    wechatId: '',
    participantId: '',
  }
  output:
  {
    success: true
  }
  ```
