import { drive_v3 } from "googleapis";


interface foogleResponse extends drive_v3.Schema$File{
    cf_worker_link?: string
    player_link?: string
}



export function processResults(result: drive_v3.Schema$File[][] ){
    let files: foogleResponse[] = [];
    let name_idx = new Set()
    let id_idx = new Set()
    result.map((r: drive_v3.Schema$FileList[] ) => {
        r.map((file: foogleResponse) =>{
            if( !id_idx.has(file.id)){
                file.cf_worker_link = process.env.CF_URL === undefined? "nourl/" : process.env.CF_URL + file.id;
                file.player_link = file.cf_worker_link + "/" + encodeURIComponent(file?.name == undefined ? "" : file.name);
                files.push(file);
                name_idx.add(file.name);
                id_idx.add(file.id);
            }
        })
    });
    return files;
}
