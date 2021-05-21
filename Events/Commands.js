module.exports = (client, admin, Arrays) => {
    for(const Command of Arrays){
        if(!Array.isArray(Command)){
            admin.database().ref("ERA's").child("Commands").child(Command).once('value', async data => {
                if(!data.exists()){
                    admin.database().ref("ERA's").child("Commands").child(Command).set({
                        Command: Command,
                        API: "null",
                        Active: {
                            Status: "true",
                        },
                        Perms: [
                            
                        ],
                    })
                }
                
            })
        }else{
            for(let i = 0; i < Command.length; i++){
                admin.database().ref("ERA's").child("Commands").child(Command[i]).once('value', async data => {
                    if(!data.exists()){
                        admin.database().ref("ERA's").child("Commands").child(Command[i]).set({
                            Command: Command[i],
                            API: "null",
                            Active: {
                                Status: "true",
                            },
                            Perms: [
                                
                            ],
                        })
                    }
                    
                })
            }
        }
    }
}