module.exports = (client, admin, Array) => {
    for(const Command of Array){
        admin.database().ref("ERA's").child("Commands").child(Command).once('value', async data => {
            if(!data.exists()){
                admin.database().ref("ERA's").child("Commands").child(Command).set({
                    Command: Command,
                    Active: {
                        ON: "true",
                        Reason: null,
                        Status: "This command is fully functional"
                    },
                    Perms: [
                        
                    ],
                    BannedUsers: {
                        
                    }
                })
            }
        })
    }
}