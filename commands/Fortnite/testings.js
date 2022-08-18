const Canvas = require('canvas');
const moment = require('moment')
const tz = require('moment-timezone')
const fs = require('fs');
const tslib_1 = require("tslib");
const zlib_1 = (0, tslib_1.__importDefault)(require("zlib"));
const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const axios = require('axios')
const probe = require('probe-image-size')
const fnbr = require('fnbr')
const parseReplay = require('fortnite-replay-parser');
const wrap = require('word-wrap');
const Unreal = require('unreal.js');
const { FPackageStore } = require('unreal.js/dist/ue4/asyncloading2/FPackageStore');
const rgba = require('rgba-convert');
const itemFinder = require('../../Handlers/itemFinder');

module.exports = {
    commands: 't',
    type: 'Testings',
    expectedArgs: '<Test>',
    minArgs: 0,
    maxArgs: null,
    cooldown: 20,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        console.log(message.guild.roles.cache.get(text).name)
        
        // // Create new instance
        // await Unreal.Oodle.downloadDLL()
        // const usmap = new Unreal.UsmapTypeMappingsProvider(fs.readFileSync("C:/Users/ASUS/Desktop/Output/.data/++Fortnite+Release-21.10-CL-20829351-Windows_oo.usmap"))
        // const provider = new Unreal.FileProvider("D:/Games/Fortnite/FortniteGame/Content/Paks", Unreal.Ue4Version.GAME_UE5_LATEST, usmap)
        // provider.mappingsProvider.reload() // Loads .usmap
        // provider.populateIoStoreFiles = true
        // // 'start' the provider
        // await provider.initialize()
        // // submit aes key to decrypt paks
        // await provider.submitKey(Unreal.FGuid.mainGuid, "0x840a3c61b7ba7fdc58eab092ac9f29d23229da63c417f2f0add69f30f1b6980d")

        // //request a list of dynamic keys
        // const { data } = await axios.get("https://fortnite-api.com/v2/aes")

        // //loop through every fortnite pak in files
        // for (const reader of provider.unloadedPaks){

        //     //get the pak file path
        //     const readedPaks = reader.path.substring(reader.path.indexOf("FortniteGame"))
        //     const pakdata = data.data.dynamicKeys.find(pak => pak.pakFilename === readedPaks.replace("FortniteGame/Content/Paks/", "")) //check if the pak file has a key

        //     //if a key found then submit it
        //     if (pakdata) await provider.submitKey(reader.pakInfo.encryptionKeyGuid, pakdata.key)
        //     else console.warn("Missing aes key for: " + readedPaks)
        // }

        // if(pkg){
        //     const json = pkg.toJson()[0]
            
        //     const objImage = pkg.getExportOfTypeOrNull(Unreal.UTexture2D)
        //     if(objImage){

        //         //creating canvas
        //         const canvas = Canvas.createCanvas(1024, 1024);
        //         const ctx = canvas.getContext('2d');
        //         const img = Unreal.Image.convert(objImage)
        //         const skin = await Canvas.loadImage(img)
        //         ctx.drawImage(skin, 0, 0, 1024, 1024)

        //         const att = new Discord.AttachmentBuilder(canvas.toBuffer(), `${json.name}.png`)
        //         await message.reply({files: [att]})

        //     }else{
                
        //         const objSound = pkg.getExportOfTypeOrNull(Unreal.SoundWave)
        //         if(objSound){
        //             const music = Unreal.SoundWave.convert(objSound)
        //             const att = new Discord.AttachmentBuilder(music.data, `${objSound.name}.${music.format}`)
        //             await message.reply({files: [att]})

        //         }else{
        //             const att = new Discord.AttachmentBuilder(Buffer.from(JSON.stringify(json, null, 2)), `${json.name}.json`)
        //             await message.reply({files: [att]})
        //         }
        //     }

        // }else{
        //     const obj = provider.loadObject(text)
        //     if(obj){

        //         //creating canvas
        //         const canvas = Canvas.createCanvas(1024, 1024);
        //         const ctx = canvas.getContext('2d');
        //         const img = Unreal.Image.convert(obj)
        //         const skin = await Canvas.loadImage(img)
        //         ctx.drawImage(skin, 0, 0, 1024, 1024)

        //         const att = new Discord.AttachmentBuilder(canvas.toBuffer(), `${obj.name}.png`)
        //         await message.reply({files: [att]})
        //     }
        // }
    }
}