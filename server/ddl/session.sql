DROP TABLE IF EXISTS `user_sessions`;

CREATE TABLE `user_sessions` (
  `session_id` varchar(200) NOT NULL COMMENT 'session唯一id',
  `expires_time` int(11) unsigned NOT NULL COMMENT '过期时间',
  `session_info` text COMMENT 'session内容',
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户session表';
