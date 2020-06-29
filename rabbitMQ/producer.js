const amqp=require('amqplib/callback_api')

//console.log("Inside producer",process.env.PORT)

module.exports.producer=(messageObj)=>{
    console.log("inside prod",messageObj)
    try{
        amqp.connect('amqp://localhost',(err,connection)=>{
            if(err)throw err;

            connection.createChannel(async(err1,channel)=>{
                if(err1)throw err1;
                    var queue='imageMinify1';
                    channel.assertQueue(queue,{durable:true})
                    var message=[messageObj];
                    await channel.sendToQueue(queue,Buffer.from(JSON.stringify(message)),{persistent:true});
                    await console.log("Meesage inside the Queue !!",message)
            })
        
            setTimeout(()=>{
                connection.close()
                //process.exit(0)
            },500)
        
        })
        return 1;
    }
    catch(err){
        console.log(err)
        return 0;
    }
    return 1;
}

