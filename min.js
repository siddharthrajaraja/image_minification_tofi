const chokidar = require('chokidar');
var sharp = require('sharp');
const fs = require('fs');
const paths = require('path');
const util = require('util');
const {
    exit
} = require('process');


const watcher = chokidar.watch('./uploads', {
    persistent: true,
    useFsEvents: true,
    usePolling: true,
    awaitWriteFinish: {
        stabilityThreshold: 3000,
        pollInterval: 100
    }

});

watcher.on('add', async function (path) {
    console.log(path);

    const filename =await paths.basename(path);
    const name =await paths.parse(filename).name;

    // get current file extension
    const ext = await paths.parse(filename).ext;
    console.log('file path:', path);
    console.log('file name:', name);
    console.log('file extension:', ext);

    debugger;

    var compress = async function () {
        const pipeline = await sharp(path).rotate().resize({
            width: 1500
        }).withMetadata();
        debugger;
       await pipeline
            .webp()
            .toFile(`compressed/${name}.webp`, function (err) { //note the directory needs to exist else will throw err
                if (err) console.log(err)
            });

        debugger;

        if (ext == '.JPG' || ext == '.jpg' || ext == '.jpeg' || ext == '.JPEG') {
           await pipeline
                .jpeg({
                    quality: 70
                })
                .toFile(`compressed/${name}.jpg`, function (err,info) {
                    if (err) console.log(err)
                    else console.log(info)
                });
        } else if (ext == '.png' || ext == '.PNG') {
           await pipeline
                .png()
                .toFile(`compressed/${name}.png`, function (err) {
                    if (err) console.log(err);
                })
        } else if (ext == '.gif' || ext == '.GIF') {
            exit(1);
        } else{
          await pipeline
                .jpeg()
                .toFile(`compressed/${name}.jpg`, function (err) {
                    if (err) console.log(err)
                })
        }
        //console.log('eol')
    };

    const rename = async function () {
        // Move file ./uploads/img.* to ./originals/img.*
        var original = `./uploads/${name}${ext}`;
        var target = `./originals/${name}${ext}`;
        console.log(target, original);
        debugger;
        await fs.copyFile(original, target, (err) => {
            if (err) {
                console.log(err)
            }
        });

    };

    (async () => {

            await compress().then(done=>{
                console.log("Compressed precessed!!")
            });
            await rename().then(done=>{
                console.log("Renamed processed!!")
            });
            /*const min =await util.promisify(compress);
            await min();
            console.log('eol');
            debugger;
            const mv =await util.promisify(rename);
            await mv();
            */

            console.log(`compressed image ${filename}`)
            debugger;
        }

    )();


});