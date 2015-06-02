用Myo控制AR.Drone
================

这里写一点介绍性文字。

Overview
--------

我们使用[myo-mqtt][3]让Myo能够通过MQTT发送手势，在Borgnix设计器中接受这些的手势，把它们转换成AR.Drone的控制命令，并通过MQTT发送，用[ardrone-mqtt][2]让AR.Drone接收并执行这些命令。

Step1: 创建场景
--------------

**(1) 创建场景**

在Borgnix设计器中，创建一个场景。设计器的基本使用方法可以参考[这篇帖子][设计器使用教程]。

**(2) 增加MQTT收发节点**

增加一个MQTT INPUT节点，用于接收Myo的手势，增加一个MQTT OUTPUT节点，用于发送AR.Drone控制命令。

！我是图！

**(3) 增加命令转换节点**

！我是图！

要让Myo能够控制AR.Drone，我们需要将Myo的手势“翻译”成AR.Drone的控制命令。我们用一个函数节点来实现这个功能，示例代码如下：

```javascript
var gesture = JSON.parse(msg.payload)
  , command = {"type":"pilot","pilot":{"action":""}}

switch(gesture.gesture.name) {
  // 握拳以降落
  case 'fist':
    command.pilot.action = 'land'
    break
  // 张开五指以起飞
  case 'fingers_spread':
    command.pilot.action = 'takeoff'
    break
  // 向外挥手以前进
  case 'wave_out':
    command.pilot.action = 'front'
    command.pilot.speed = 0.2
    break
  // 向内挥手以后退
  case 'wave_in':
    command.pilot.action = 'back'
    command.pilot.speed = 0.1
    break
  default:
    // nothing
    break
}

msg.payload = JSON.stringify(command)
return msg
```

**(4) 增加Myo手势过滤节点**

Myo



Step2: 连接AR.Drone
------------------

**(1) 将AR.Drone接入无线网络**

首先启动AR.Drone并连接其wifi, 然后使用util目录下的[ardrone-wpa2][1]将AR.Drone连接到无线路由网络中。[ardrone-wpa2][1]需要在Liunx环境下运行，Windows用户可以在[Cygwin][cygwin]中使用这个工具。

如果AR.Drone上没有安装过ardrone-wpa2, 执行以下命令进行安装:

```
util/ardrone-wpa2/script/install
```

完成安装后， 执行以下命令将AR.Drone接入WiFi网络:

```
util/ardrone-wpa2/script/connect "WIFI_SSID" -p "WIFI_PASSWORD"
```

该命令可以指定AR.Drone的IP地址，但在不同的路由设置下，可能出现问题，具体可以参考其[文档][1]。不进行其他设置的情况下，需要在路由器管理页面中找到AR.Drone的IP地址，AR.Drone的主机名默认为空。

**(2) 启动AR.Drone**

```
var drone = require('ardrone-mqtt')( 'DRONE_IP'
                                   , 'MQTT_BROKER'
                                   , 'SUBSCRIBE_TOPIC')
```

Setp3: 连接Myo
------

Step4: Takeoff and enjoy
---

戴上你的Myo，让你的AR.Drone飞起来吧！还记得第一步中的控制指令么？
张开五指：起飞
向外挥手：前进
向内挥手：后退
握拳：降落

总结
---

[1]: https://github.com/daraosn/ardrone-wpa2
[2]: https://github.com/Orientsoft/ardrone-mqtt
[3]: https://github.com/Orientsoft/myo-mqtt
[cygwin]: https://www.cygwin.com/