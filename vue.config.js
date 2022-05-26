 module.exports = {
   lintOnSave:false,
   publicPath: "",
   devServer:{
	 publicPath: "",
     proxy:{
       "/api":{
         target:"http://www.qulvyuefan.com",
         changeOrigin:true,
         ws:true,
         pathRewrite:{
           "^/api":""
         }
       }
     }
   },
   css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require('postcss-px2rem')({remUnit:40}), // 换算的基数
                ]
            }
        }
    }
 }

 