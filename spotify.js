const client_id = 'dd18c63dfde04bbbb1b74dee34f8a895'; // Your client id
const client_secret = '4e82f8232fab43bcaf1116c5f3aa315c'; // Your secret
const url_authToken = 'https://accounts.spotify.com/api/token';
const apiUrl = 'https://api.spotify.com/v1',
    router = require("express").Router(),
    request = require("request")

router.get("/", (req, res) => {
        let search_query = req.query.query
          let  search_type = req.query.tipo        
        authToken = {
            url: url_authToken,
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };
        request.post(authToken, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                access_token = body.access_token;
                if (search_type === "album") {
                    search_query = "album:" + search_query;
                }
                const buscar = {
                    url: `${apiUrl}/search`,
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    qs: {
                        q: search_query,
                        type: search_type
                    },
                    json: true
                }
                request.get(buscar, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        res.status(200).json(body)
                    } else {
                        res.status(400).json({
                            message: "No hay resultados para la busqueda"
                        })
                    }
                });
            }
        });
    })

    .get("/top", (req, res) => {
        const search_type = "top" + req.query.tipo;
        const url = `http://ws.audioscrobbler.com/2.0/?method=geo.get${search_type}&country=mexico&api_key=203e6a59318c48ae6a047fe86c6c4b3c&format=json&limit=10`;
        request.get(url, (error, response, body) =>{
            if (!error && response.statusCode === 200) {                
                result_busqueda = JSON.parse(body);
                res.status(200).json(result_busqueda)
            }else{
                res.status(400).json({
                    message: "No hay resultados para la busqueda"
                })
            }
        });
    })

    .get("/artista/:ID",(req,res)=>{
        
        const id=req.param("ID")
        console.log(id)
        const url=`${apiUrl}/artists/${id}/top-tracks?country=MX`
         authToken = {
            url: url_authToken,
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };
        request.post(authToken, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                access_token = body.access_token;                
                const buscar = {
                    url: url,
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    json: true
                }
                request.get(buscar, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        res.status(200).json(body)
                    } else {
                        res.status(400).json({
                            message: "No hay resultados para la busqueda"
                        })
                    }
                });
            }
        });
    })

    .get("/album/:ID",(req,res)=>{
        const id=req.param("ID")
        const url=`${apiUrl}/albums/${id}/tracks`
         authToken = {
            url: url_authToken,
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };
        request.post(authToken, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                access_token = body.access_token;                
                const buscar = {
                    url: url,
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    json: true
                }
                request.get(buscar, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        res.status(200).json(body)
                    } else {
                        res.status(400).json({
                            message: "No hay resultados para la busqueda"
                        })
                    }
                });
            }
        });
    })

module.exports = router