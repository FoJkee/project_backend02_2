import dotenv from 'dotenv'
import {MongoClient} from "mongodb";

dotenv.config()


const mongoUrl = process.env.Mongo_Url || "mongodb://127.0.0.1:27017"

console.log(mongoUrl)

if(!mongoUrl) throw new Error('Not')


const client = new MongoClient(mongoUrl)

const db = client.db('social_network')


