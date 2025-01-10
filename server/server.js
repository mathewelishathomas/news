require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app =express();

app.use(cors());
app.use(express.urlencoded({extended:true})); 

const API_KEY = process.env.API_KEY;

function fetchnews(url, res){
    axios.get(url)
    .then(response => {
        if (response.data && response.data.articles && response.data.articles.length > 0) {
            res.json({
                status: 200,
                success: true,
                message: "Successfully fetched the data",
                data: response.data
            });
        } else {
            res.json({
                status: 200,
                success: true,
                message: "No data found",
            });
        }
    })
    .catch(error => {
        res.json({
            status: 500,
            success: false,
            message: "An error occurred while fetching data",
            error: error.message
        });
    });
}  

//all ne3ws

app.get("/all-news",(req,res)=>{
    let pageSize= parseInt(req.query.pageSize) || 40 ;
    let page=parseInt(req.query.page) || 1 ;
    let url=`https://newsapi.org/v2/everything?q=page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    fetchnews(url,res);
});


//top-headlines
app.options("/top-heads",cors());
app.get("/top-heads",(req,res)=>{
    let pageSize= parseInt(req.query.pageSize) || 80 ;
    let page=parseInt(req.query.page) || 1 ;
  let category =req.query.category || "business";
    let url =`https://newsapi.org/v2/top-headlines?category=${category}&language=en&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    fetchnews(url,res);
});

//country
app.options("/country/:iso",cors());
app.get("/country/:iso",(req,res)=>{
    let pageSize= parseInt(req.query.pageSize) || 80;
    let page =parseInt(req.query.page) || 1 ;
    const country =req.params.iso;

    let url =`https://newsapi.org/v2/top-headlines?country=${country}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    fetchnews(url,res);
});

//port
const PORT= process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`);
});