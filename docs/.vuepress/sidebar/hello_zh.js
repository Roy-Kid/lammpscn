module.exports = function () {
    return [
        'zh/hello/',
        {
            title: '第一堂课: Linux',
            collapsable: true,
            sidebarDepth: 2,
            children: [

                ['/zh/hello/linux/', '前言'],
                ['/zh/hello/linux/SUMMARY', '目录'],
                ['/zh/hello/linux/chap01', '第一章: 引言'],
                ['/zh/hello/linux/chap02', '第二章: 什么是 shell'],
                ['/zh/hello/linux/chap03', '第三章：文件系统中跳转'],
                ['/zh/hello/linux/chap04', '第四章：探究操作系统'],
                ['/zh/hello/linux/chap05', '第五章：操作文件和目录'],
                ['/zh/hello/linux/chap06', '第六章：使用命令'],
                ['/zh/hello/linux/chap07', '第七章：重定向'],
                ['/zh/hello/linux/chap08', '第八章：从 shell眼中看世界'],
                ['/zh/hello/linux/chap09', '第九章：键盘操作技巧'],
                ['/zh/hello/linux/chap10', '第十章：权限'],
                ['/zh/hello/linux/chap11', '第十一章：进程'],
                ['/zh/hello/linux/chap12', '第十二章: shell 环境'],
                ['/zh/hello/linux/chap13', '第十三章: vim 简介'],
                ['/zh/hello/linux/chap14', '第十四章: 定制 shell 提示符'],
                ['/zh/hello/linux/chap15', '第十五章: 软件包管理'],
                ['/zh/hello/linux/chap16', '第十六章: 存储媒介'],
                ['/zh/hello/linux/chap17', '第十七章: 网络系统'],
                ['/zh/hello/linux/chap18', '第十八章: 查找文件'],
                ['/zh/hello/linux/chap19', '第十九章: 归档和备份'],
                ['/zh/hello/linux/chap20', '第二十章: 正则表达式'],
                ['/zh/hello/linux/chap21', '第二十一章: 文本处理'],
                ['/zh/hello/linux/chap22', '第二十二章: 格式化输出'],
                ['/zh/hello/linux/chap23', '第二十三章: 打印'],
                ['/zh/hello/linux/chap24', '第二十四章: 编译程序'],
                ['/zh/hello/linux/chap25', '第二十五章: 编写Shell脚本'],
                ['/zh/hello/linux/chap26', '第二十六章: 启动一个项目'],
                ['/zh/hello/linux/chap27', '第二十七章: 自顶向下设计'],
                ['/zh/hello/linux/chap28', '第二十八章: if 分支结构'],
                ['/zh/hello/linux/chap29', '第二十九章: 读取键盘输入'],
                ['/zh/hello/linux/chap30', '第三十章: while/until 循环'],
                ['/zh/hello/linux/chap31', '第三十一章: 疑难排解'],
                ['/zh/hello/linux/chap32', '第三十二章: 流程控制：case 分支'],
                ['/zh/hello/linux/chap33', '第三十三章: 位置参数'],
                ['/zh/hello/linux/chap34', '第三十四章: 流程控制：for 循环'],
                ['/zh/hello/linux/chap35', '第三十五章: 字符串和数字'],
                ['/zh/hello/linux/chap36', '第三十六章: 数组'],
                ['/zh/hello/linux/chap37', '第三十七章: 奇珍异宝'],

            ]
        },


        {
            title: '第二堂课: 编译简介',
            collapsable: true,
            sidebarDepth: 3,
            children: [

                ['/zh/hello/c++/', '前言'],
                ['/zh/hello/c++/compile', 'GCC编译基础'],
                ['/zh/hello/c++/compile_with_python', 'C++与Python混编'],

            ]
        },

        {
            title: 'LAMMPS入门篇',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/hello/novice/install', '安装'],
                ['/zh/hello/novice/script_ele', '脚本入门'],
                ['/zh/hello/novice/run', '启动计算'],
                ['/zh/hello/novice/output', '系统输出'],
                ['/zh/hello/novice/data_format', '数据类型'],
                ['/zh/hello/novice/dump', '数据转储'],
                ['/zh/hello/novice/restart', '暂停与重启'],
                ['/zh/hello/novice/reducedunit', '约化单位'],
                ['/zh/hello/novice/pairwrite', '检查修订过的势函数'],
            ]
        },

        {
            title: 'LAMMPS进阶篇',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/hello/advanced/conception', '术语概念'],
                ['/zh/hello/advanced/script_adv', '脚本进阶'],
                ['/zh/hello/advanced/neiborlist', '临近表'],
                ['/zh/hello/advanced/balance', '负载均衡'],

            ]
        },
        {
            title: '一般命令',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/hello/general/', '概览'],
                ['/zh/hello/general/mass', '质量设定'],
                ['/zh/hello/general/group', '群设定'],
                ['/zh/hello/general/neighbor', '临近表设定'],
                ['/zh/hello/general/set', '属性设定'],
                ['/zh/hello/general/timestep', '步长设定'],
                ['/zh/hello/general/reset_timestep', '重置步长'],
                ['/zh/hello/general/velocity', '速度设定'],

            ]
        },

        {
            title: 'fix命令',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/hello/fix/', '概览'],

            ]
        },

        {
            title: 'compute命令',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/hello/compute/', '概览'],

            ]
        },

    ]

}