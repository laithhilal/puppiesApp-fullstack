import Header from './components/Header';
import { Routes, Route } from "react-router-dom";
import AddPuppy from './components/AddPuppy';
import PuppyList from './components/PuppyList'

function App(): JSX.Element {

  return (
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<PuppyList />} />
        <Route path='/addPuppy' element={<AddPuppy />} />
      </Routes>
    </div>
  );
}

export default App;
