import * as Mongo from 'mongodb';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Puppy = {
  name: string;
  breed: string;
  dateOfBirth: string;
  _id: Mongo.ObjectId;
};

function PuppyList(): JSX.Element {
  const [puppies, setPuppies] = useState<Puppy[]>([]);
  const [editingPuppy, setEditingPuppy] = useState<Puppy | null>(null);
  const [selectedPuppy, setSelectedPuppy] = useState<Puppy | null>(null);


  useEffect(() => {
    async function fetchPuppies() {
      const response = await fetch('http://localhost:5000/api/puppies');
      const data: Puppy[] = await response.json();
      setPuppies(data);
    }
    fetchPuppies();
  }, []);

  const handleDelete = async (id: Mongo.ObjectId) => {
    try {
      await axios.delete(`http://localhost:5000/api/puppies/${id}`);
      setPuppies(puppies.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if(!editingPuppy) return;
    const updatedData = {
        name: editingPuppy.name,
        breed: editingPuppy.breed,
        dateOfBirth: editingPuppy.dateOfBirth
    }
    try {
      await axios.patch(`http://localhost:5000/api/puppies/${editingPuppy._id}`, updatedData);
      const updatedPuppies = puppies.map((p) => p._id === editingPuppy._id ? {...p, ...updatedData} : p);
      setPuppies(updatedPuppies);
      setEditingPuppy(null);
    } catch (err) {
      console.error(err);
    }
};

  const handleEdit = (puppy: Puppy) => {
    setEditingPuppy(puppy);
};

const handleDetails = (puppy: Puppy) => {
  setSelectedPuppy(puppy);
};

  return (
    <div>
    <ul>
      {puppies.map( (puppy, i) => (
        <li key={i}>
          <h3>{puppy.name}</h3>
          <p>
            Breed: {puppy.breed}<br />
            BirthDate: {puppy.dateOfBirth}
          </p>
          <button onClick={() => handleDelete(puppy._id)}>Delete</button>
          <button onClick={() => handleEdit(puppy)}>Edit</button>
          <button onClick={() => handleDetails(puppy)}>Show Details</button>

        </li>
      ))}
    </ul>
    {editingPuppy && (
    <form onSubmit={handleUpdate}>
        <input type="text" value={editingPuppy.name} onChange={(e) => setEditingPuppy({...editingPuppy, name: e.target.value})} placeholder="Name" />
        <input type="text" value={editingPuppy.breed} onChange={(e) => setEditingPuppy({...editingPuppy, breed: e.target.value})} placeholder="Breed" />
        <input type="date" value={editingPuppy.dateOfBirth} onChange={(e) => setEditingPuppy({...editingPuppy, dateOfBirth: e.target.value})} placeholder="BirthDate" />
        <button type="submit">Update Puppy</button>
        <button onClick={() => setEditingPuppy(null)}>Cancel</button>
    </form>
)}

{selectedPuppy && (
      <div>
        <h3>Details for: {selectedPuppy.name}</h3>
        <p>
          Breed: {selectedPuppy.breed}<br />
          BirthDate: {selectedPuppy.dateOfBirth}
        </p>
      </div>
    )}

    </div>
  );
}

export default PuppyList;
