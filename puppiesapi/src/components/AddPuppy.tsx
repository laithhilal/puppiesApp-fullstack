import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

type FormData = {
  name: string;
  breed: string;
  dateOfBirth: string;
};

export function AddPuppy() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    breed: '',
    dateOfBirth: '',
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/puppies', formData);
      setFormData({ name: '', breed: '', dateOfBirth: '' }); 
    } catch (err) {
      setError(String(err));
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
    <Link to='/'>PuppyList</Link>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="breed">Breed:</label>
        <input
          type="text"
          id="breed"
          name="breed"
          value={formData.breed}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="dateOfBirth">Date of Birth:</label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />
      </div>
      {error && <p>{error}</p>}
      <button type="submit">Add Puppy</button>
    </form>
    </div>
  );
}

export default AddPuppy;