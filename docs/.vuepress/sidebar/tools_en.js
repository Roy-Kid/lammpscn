module.exports = function() {
    return[
        {
            title: 'moduling',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/tools/', 'overview'],
                ['/zh/tools/moduling/moltemplate', 'moltemplate'],
                
            ]
        },

        {
            title: 'post process',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/tools/postprocess/', 'overview'],
                ['/zh/tools/postprocess/use_guide', 'manual'],
                ['/zh/tools/postprocess/dev_guide', 'developer guide'],
                
            ]            
        }
    ]
}