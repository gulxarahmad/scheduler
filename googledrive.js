const {google} = require('googleapis')
const getfilelist = require("google-drive-getfilelist");
const path = require('path')
const fs = require('fs')

const clientID = '561208463336-kh1m65tepso3siiq849bga07c01ob47p.apps.googleusercontent.com'
const clientSecret = '_FMIUZ0LN1hkO2eNGxPp_mNz'
const redirectURI = 'https://developers.google.com/oauthplayground'
const refreshToken = '1//04C3GWPM1-YQDCgYIARAAGAQSNgF-L9IremJhdz9VbvHsB-mHtByCGc2yoF2-kOwbfg4WP8WtwXPTfiiTUZ1CZ5BwctUNJpYVSQ'

const oauth2Client = new google.auth.OAuth2(

    clientID,
    clientSecret,
    redirectURI

)

oauth2Client.setCredentials({refresh_token:refreshToken})

const drive = google.drive({
    version:'v3',
    auth:oauth2Client
})

const filePath = path.join(__dirname, '1.png')

async function uploadFile (){

    try {

        const response = await drive.files.create({
            requestBody:{
                name:'oh yes.png',
                mimeType:'image/png',
                parents:['10GZ6z6tBqTb1VOBlfq1uMGgAAcDF3NJR']
            },
            media:{
                mimeType:'image/png',
                body:fs.createReadStream(filePath)
            }
        })
        console.log(response.data)
        
    } catch (error) {
        console.log(error.message)
        
    }

}

async function downloadFile(id, name){
    try {
        
        const dowloadPath = path.join(__dirname,`public/DriveImages/${name}.xlsx`)
        const dest = fs.createWriteStream(dowloadPath)

       const response = await drive.files.export({
            fileId:`${id}`,
            //alt:'media'
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }, {responseType: 'stream'} ,
        function(err, res){
            res.data
            .on('end', () => {
                console.log('Done');
            })
            .on('error', err => {
                console.log('Error', err);
            })
            .pipe(dest);
        });
        
    } catch (error) {
        console.log(error.message)
        
    }
}


async function listFromFolder(){
    const topFolderId = "10GZ6z6tBqTb1VOBlfq1uMGgAAcDF3NJR" // Please set the top folder ID.
    getfilelist.GetFileList(
      {
        auth: oauth2Client,
        fields: "files(id), files(name), files(mimeType)",
        id: topFolderId,
      },
      (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
        const fileList = res.fileList.flatMap(({ files }) => files);
        console.log(fileList);

        for(let i=0; i< fileList.length;i++){
            downloadFile(fileList[i].id,fileList[i].name)
            
        }
      }
    );
}

listFromFolder()