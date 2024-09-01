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
const wrap = require('word-wrap');
const itemFinder = require('../../Handlers/itemFinder');
var shortUrl = require("turl");
const { generateDependencyReport } = require('@discordjs/voice');



module.exports = {
    commands: 't',
    type: 'Testings',
    expectedArgs: '<Test>',
    minArgs: 0,
    maxArgs: null,
    cooldown: 20,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

      console.log(generateDependencyReport());

      // shortUrl.shorten("https://rr4---sn-nuj-g0iek.googlevideo.com/videoplayback?expire=1681337436&ei=_Nc2ZNiHE4OLp-oPvO28uAY&ip=35.180.111.27&id=o-AARAb0RIHpnC63IMSptz_3XW-m0afD355aIckcQ6D1Tz&itag=22&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&ns=BSxEclBqR5mjpjdbuGstTfgM&cnr=14&ratebypass=yes&dur=9.729&lmt=1672678502471073&fexp=24007246&c=WEB&txp=6318224&n=5GWlngkKAR2xBUhpYy8&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIhAOsBOckM7hHbEsxnuqIBJwx1ob7-y1JLyOudHmHGlox4AiB6VVBev_6hPuuU94cn45XkJOGLjM4qLyvokabCPhyZtw%3D%3D&redirect_counter=1&rm=sn-25grd7e&req_id=346ce5b160dca3ee&cms_redirect=yes&cmsv=e&ipbypass=yes&mh=22&mip=2001:16a4:5:9462:5834:4111:e5a4:225b&mm=31&mn=sn-nuj-g0iek&ms=au&mt=1681315252&mv=u&mvi=4&pl=48&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRgIhALvTY4j61ZpfSadmPrMRlNXYdrCj6YsrsEBkBGdFRHuXAiEAoeg6XPxIoPu0Rzsk9AHscidt3csEIFY7uwKPtTlVwQ4%3D")
      // .then(res => {
      //     console.log(res)
      // }).catch((err) => {
      //   console.log(err);
      // })

      // const att = new Discord.AttachmentBuilder('https://scontent.cdninstagram.com/v/t66.30100-16/54649525_1581227302359485_7225531746693097138_n.mp4?_nc_ht=scontent.cdninstagram.com&_nc_cat=105&_nc_ohc=l0eUtsTmdDkAX_Cl-QA&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfBrPOHPa54zKPdfym7c6qPD63t9am_ZMvYFKeWRnj1xTg&oe=643929DE&_nc_sid=978cb9', {name: `a.mp4`})
      // message.reply({files: [att]})
        
        
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