var amqp=require('amqplib/callback_api')


amqp.connect('amqp://localhost',(err0,connection)=>{
    if(err0)throw err0;
    
    connection.createChannel((err1,channel)=>{
        if(err1)  throw err1;
        var queue='imageMinify1'
        
        channel.assertQueue(queue,{durable:true})
        channel.prefetch(1);
        channel.consume(queue,async(message)=>{
            
        var data=await JSON.parse(message.content.toString())
            
            
        await console.log("Received Message :",data[0])
            
            // Here you need to specify the image minification script!!

        },{
            noAck:true // If message is unsuccesfull then Ack is not received and message is requeued back to RabbitMQ
        })

    })

    setTimeout(()=>{
        connection.close()
        //process.exit(0)
    },5000)

})