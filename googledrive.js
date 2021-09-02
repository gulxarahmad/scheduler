const {google} = require('googleapis')
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

async function downloadFile(){
    try {
        const dowloadPath = path.join(__dirname,'public/DriveImages/photo2.png')
        const dest = fs.createWriteStream(dowloadPath)

       const response = await drive.files.get({
            fileId:'1tiHhFyfnWHXuY_YsxWU_3uG344ho6MkB',
            alt:'media'
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

async function allFiles (){

    const response = await drive.files.list({
    
    })
    console.log(response.data)
}

downloadFile()