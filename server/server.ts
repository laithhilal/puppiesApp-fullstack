import express from 'express';
import * as Mongo from 'mongodb';
import { MongoClient, ObjectId, MongoClientOptions } from 'mongodb';
import cors from 'cors';

declare module 'mongodb' {
  interface MongoClientOptions {
    useNewUrlParser: boolean;
  }
}

interface Puppy {
  name: string;
  breed: string;
  dateOfBirth: Date;
  _id: Mongo.ObjectId;
}

const app: express.Application = express();
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}));

const uri = "mongodb+srv://puppies:987654321@cluster0.sjkvwze.mongodb.net/?retryWrites=true&w=majority"

const client: MongoClient = new MongoClient(uri, { useNewUrlParser: true }); 

client.connect().then(() => {
  console.log('Successfully connected to the database!');
}).catch((err) => {
  console.log(err);
});

const db = client.db('puppiesapi');
const puppiesCollection: Mongo.Collection<Puppy> = db.collection('puppies');

app.get('/api/puppies', async (req: express.Request, res: express.Response) => {
  const puppies: Puppy[] = await puppiesCollection.find({}).toArray();
  res.status(200).json(puppies);
});

app.get('/api/puppies/:id', async (req: express.Request, res: express.Response) => {
  const puppyId: string = req.params.id;
  const puppies: Puppy[] = await puppiesCollection.find({ _id: new ObjectId(puppyId) }).toArray();
  res.status(200).json(puppies);
});

app.post('/api/puppies', async (req: express.Request, res: express.Response) => {
  if(!req.body.name || !req.body.breed || !req.body.dateOfBirth) {
    res.status(401).send('Insufficient information');
  }
  const newPuppy: Puppy = req.body;
  await puppiesCollection.insertOne(newPuppy);
  res.status(201).send('Puppy created :)');
});

app.patch('/api/puppies/:id', async (req: express.Request, res: express.Response) => {
  const puppyId: string = req.params.id;
  const updatedPuppy: Puppy = req.body;
  await puppiesCollection.updateOne( { _id: new ObjectId(puppyId) }, { $set: updatedPuppy } );
  res.status(204).send('Updated successfully');
});

app.delete('/api/puppies/:id', async (req: express.Request, res: express.Response) => {
  const puppyId: string = req.params.id;
  await puppiesCollection.deleteOne({ _id: new ObjectId(puppyId) });
  res.status(204).send('Deleted successfully');
});


app.listen(5000, () => console.log('Server started on port 5000'));