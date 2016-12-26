DROP TABLE IF EXISTS `activity`;

CREATE TABLE `activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一id',
  `publisher_id` varchar(200) NOT NULL COMMENT '发布者id',
  `activity_name` varchar(200) DEFAULT '' COMMENT '活动名称',
  `activity_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '活动时间',
  `activity_desc` text COMMENT '活动简介',
  `expect_num` int(5) COMMENT '预计人数',
  `actual_num` int(5) COMMENT '实际人数',
  `background_url` varchar(200) COMMENT '活动图片地址',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='发布活动列表';

DROP TABLE IF EXISTS `attend`;

CREATE TABLE `attend` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一id',
  `activity_id` int(11) NOT NULL COMMENT '活动id',
  `participant_id` varchar(200) DEFAULT '' COMMENT '参加者身份信息id',
  `isAttend` int(2) NOT NULL DEFAULT 0 COMMENT '是否已参加',
  `apply_id` varchar(200) COMMENT ' 报名者微信id',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='报名列表';

DROP TABLE IF EXISTS `contact`;

CREATE TABLE `contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一id',
  `wechat_id` varchar(200) DEFAULT '' COMMENT '微信id',
  `IDCard` varchar(200) NOT NULL COMMENT '身份信息id',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='联系信息';

DROP TABLE IF EXISTS `wechat_account`;

CREATE TABLE `wechat_account` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一id',
  `wechat_id` varchar(200) DEFAULT '' COMMENT '微信id',
  `wechat_name` varchar(200) DEFAULT '' COMMENT '微信昵称',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='微信';

DROP TABLE IF EXISTS `id_account`;

CREATE TABLE `id_account` (
  `IDCard` varchar(20) NOT NULL COMMENT '身份证号',
  `telephone` varchar(30) DEFAULT '' COMMENT '手机号码',
  `name` varchar(100) DEFAULT '' COMMENT '姓名',
  `payName` varchar(100) DEFAULT '' COMMENT '支付账号',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`IDCard`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='身份信息';
