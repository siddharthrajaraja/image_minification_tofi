var amqp=require('amqplib/callback_api')
var {imgProcess}=require('../min');

amqp.connect('amqp://localhost',(err0,connection)=>{
    if(err0)throw err0;
    
    connection.createChannel((err1,channel)=>{
        if(err1)  throw err1;
        var queue='imageMinify1'

        channel.assertQueue(queue,{durable:true})
        channel.prefetch(1);
        channel.consume(queue,async(message)=>{
            
        var data=await JSON.parse(message.content.toString())
        var filePath;
        var storageLocation=`../../Temples_of_India/assets/compressed`;
        
        if(data[0].typeOfFile=='profilePic'){
            filePath = `../../Temples_of_India/assets/profilePic`;   // Need to Alter this to at server 
        }
        else{
            filePath = `../../Temples_of_India/assets/uploads`;   // Need to Alter this to at server 
        }
            
        await console.log("Received Message :",data[0])
        imgProcess(`${filePath}/${data[0].fileName}`,storageLocation);

        },{
            noAck:true // If message is unsuccesfull then Ack is not received and message is requeued back to RabbitMQ
        })

    })

    setTimeout(()=>{
        connection.close()
        //process.exit(0)
    },5000)

})