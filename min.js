// const chokidar = require('chokidar');
const util = require('util');
var sharp = require('sharp');
const fs = require('fs');
const paths = require('path');
// const {
//     exit
// } = require('process');
const copy = util.promisify(fs.copyFile);
const del = util.promisify(fs.unlink);


// const watcher = chokidar.watch('./uploads', {
//     persistent: true,
//     useFsEvents: true,
//     usePolling: true,
//     awaitWriteFinish: {
//         stabilityThreshold: 0,
//         pollInterval: 100
//     }

// });

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const compress = async function (path, name, ext, compressed) {
    const pipeline = await sharp(path).rotate().resize({
        width: 1500
    }).withMetadata();
    // debugger;
    await pipeline
        .webp()
        .toFile(`${compressed}.webp`, function (err) { //note the directory needs to exist else will throw err
            if (err) console.log(err, '\n', `Illegal file : ${name}${ext}`, '\n')
        });

    // debugger;

    if (ext == '.JPG' || ext == '.jpg' || ext == '.jpeg' || ext == '.JPEG') {
        await pipeline
            .jpeg({
                quality: 70
            })
            .toFile(`${compressed}.jpg`, function (err, info) {
                if (err) console.log(err)
                else console.log(info)
            });
    } else if (ext == '.png' || ext == '.PNG') {
        await pipeline
            .png()
            .toFile(`${compressed}.png`, function (err) {
                if (err) console.log(err);
            })
    } else if (ext == '.gif' || ext == '.GIF') {
        await copy(path, `${compressed}.gif`);
    } else {
        await pipeline
            .jpeg()
            .toFile(`${compressed}.jpg`, function (err) {
                if (err) console.log(err)
            })
    }
    //console.log('eol')
};

const rename = async function (uploads, originals) {

    // Move file ./uploads/img.* to ./originals/img.*

    // console.log(uploads, originals);
    await copy(uploads, originals);
    //await timeout(1000);
    await del(uploads);

};



// watcher.on('add', async function (path) {
//console.log(path);
const imgProcess = async function (path,storageLocation) {
    const filename = await paths.basename(path);
    const name = await paths.parse(filename).name;
    const ext = await paths.parse(filename).ext;

    // console.log('file path:', path);
    // console.log('file name:', name);
    // console.log('file extension:', ext);
    // console.log('fileame:' , filename);

    (async () => {
            // console.log(path);
            // var uploads = `../uploads/${name}${ext}`;
            // var originals = `../originals/${name}${ext}`;
             var compressed = `${storageLocation}/${name}`;
            await compress(path, name, ext, compressed).then(done => {
                console.log("Compression processed!!")
                    // (async () => {
                        //rename(path, originals).then(done => {
                         //   console.log("File Moved")
                        //})
                    // })()
            });


        }

    )();
};

module.exports = {
    imgProcess: imgProcess
}