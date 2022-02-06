import axios from 'axios';

export const getCard = async () => { 
    try{
    const res = await axios.get("mongodb+srv://Skachkov:1234sk@cluster0.c0mdc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
return res 
    } catch (e){
        console.log(e)
    }
}