/*
Primary files for the API: 
 */

//Dependencies
const http=require('http')
const PORT=3000
const url =require('url')
const StringDecoder=require('string_decoder').StringDecoder
//The server should respond to all requests with a string
const server=http.createServer((req,res)=>{
    //Get the URL and parse it
    const parsedUrl=url.parse(req.url,true)


    //Get the path from the URL
    const path=parsedUrl.pathname
    const trimmedPath=path.replace(/^\/+|\/+$/g, '')

    // Get the query string as an object from the URL
    const queryStringObject=parsedUrl.query
    // Get the HTTP method
    const method=req.method.toLowerCase()

    //Get the headers as an object
    const headers=req.headers

    /// Get the payload(it comes into HTTP server as a stream-bits of information), if any
    const decoder=new StringDecoder('utf-8')
    var buffer=''
    req.on('data',(data)=>{
        buffer+=decoder.write(data)


    })
    req.on('end',()=>{
        buffer+=decoder.end()
        //Choose the handler this request goes to
        const chosenHandler=typeof(router[trimmedPath])!=='undefined'?router[trimmedPath]:handlers.notFound
        //Construct the data object to send to the handler
        const data={
            'trimmedPath':trimmedPath,
            'queryStringObject':queryStringObject,
            'method':method,
            'headers':headers,
            'payload':buffer
        }
        //Route the request to the handler specified
        chosenHandler(data,(statusCode,payload)=>{
            // Use default status code 200 or callback from the handler
            //USE DEFAULT PAYLOAD AS EMTY
            statusCode=typeof(statusCode)=='number'?statusCode:200
            payload=typeof(payload)=='object'?payload:{}

            //convert payload to string
            const payloadString=JSON.stringify(payload)

            //Return the response
            res.writeHead(statusCode)
            res.end(payloadString)
            console.log('Return the response: ',statusCode,payloadString)


        })
        //Send the response
        


        //Log the path
        

        //
    })

    

    
    //console.log('Request received on path:'+ trimmedPath+' with this method:'+method+' and with these query string parameters',queryStringObject)
    
})


//Start The server and listen on Port 3000
server.listen(PORT,()=>{
    console.log(`The server has started on Port: ${PORT}`)
})
//Define the handlers
const handlers={}

//Sample handler
handlers.sample=(data, callback)=>{

    //Callback a http status code, and a payload object
     callback(406,{'name':'sample handler'})
    

}
//Not Found Handler
handlers.notFound=(data,callback)=>{

}
// Define a request router
const router={
    'sample': handlers.sample
}