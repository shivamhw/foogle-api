import { drive_v3, google } from 'googleapis';


export class GdriveHelper{
    service: drive_v3.Drive 
    public constructor() {

        const oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URI
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN
        });


        this.service = google.drive({
            version: 'v3',
            auth: oauth2Client,
        });
    }

    // async listFiles() {
    //     try {
    //         const response = await this.service.files.list({});
    //         console.log(response.data, response.status);
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // }

    // async getFilePermissions(fileId) {
    //     try {
    //         const response = await this.service.files.get({
    //             fileId,
    //             fields: 'permissions',
    //             spaces: 'drive',
    //             Corpora: 'allDrives',
    //             includeItemsFromAllDrives: 'true',
    //             supportsAllDrives: 'true'
    //         });
    //         return response.data.permissions;
    //     } catch (error) {
    //         console.error('Error retrieving file permissions:', error);
    //         throw error;
    //     }
    // }

    bytesToMB(bytes: number): string {
        if (bytes === 0) return '0 MB';
      
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
      
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async searchFiles(query: string) {
        let files: drive_v3.Schema$File[] = [];
        let token: (string | undefined | null) = "";
        let pages = 1;
        try {
            
            do{
            let search_q: drive_v3.Params$Resource$Files$List = {
                q: query,
                fields: 'nextPageToken, files(id, name, size, thumbnailLink)',
                spaces: 'drive',
                corpora: 'allDrives',
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
                pageToken: token,
                pageSize: 100
            };
            let res  = await this.service.files.list(search_q);
            token = res.data.nextPageToken;
            res.data.files?.forEach(async (file) => {
                files.push(file)
            });
            pages--;
            
        } while(token && pages);
        return files;
        } catch (err) {
            console.log("err")
            throw err;
        }
    }

}

// const main = async ()=>{
//     const gd = new GdriveHelper()
//     let res = await gd.searchFiles(`name contains \'whatsapp\' and mimeType=\'image/jpeg\'`)
//     console.log(res.length)

// }


// main()