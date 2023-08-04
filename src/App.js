import React,{useState, useEffect} from 'react';
import axios from "axios"
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  const [notes,setNotes]=useState(null);
  const [create,setCreate]=useState(null);
  const [edit,setEdit]=useState({_id:null,title:"",body:""});
  const [toggle,setToggle]=useState(false);
  //
  const url = "https://notesbackend-0gyn.onrender.com";
  //fns>>
  const fetchNotes=async ()=>{
    const res= await axios.get (`${url}/notes`)
    setNotes(res.data.notes);
    // console.log(res);
  }
  useEffect(()=>{
    fetchNotes();
  },[]);
  //
  const updateCreate=async(event)=>{
    const {name,value}=event.target;
    setCreate({
      ...create,[name]:value,
    });
  }
  const createNew=async(event)=>{
    event.preventDefault();
    //create notes
    const res=await axios.post(`${url}/notes`,create)

    //update state of notes
    setNotes([...notes,res.data.note]);
    setCreate({title:"", body:"",});
    // setNotes({title:'', body:''});
    // console.log("new");
  }
  //
  const deleteNote=async(id)=>{
    await axios.delete(`${url}/notes/${id}`);
    // console.log(res);
    const Nnotes=[...notes].filter(note=>{
      return note._id!==id;
    })
    setNotes(Nnotes);
  }
  //recording changes in edit and uplading those to the db
  const load=(note)=>{
    // const {val,name}=event.target;
    // console.log(note);
    setToggle(true);
    setEdit({_id:note._id,title:note.title, body:note.body});
  }
  const handleUpdation=(event)=>{
    // console.log("updation");
    const {value,name}=event.target;
    // console.log(event.target);
    setEdit({...edit,
    [name]:value,});
  }
  const updateNote=async(event)=>{
    event.preventDefault();
    setToggle(false);
    const res=await axios.put(`${url}/notes/${edit._id}`,{
      title:edit.title,
      body:edit.body,
    });
    //
    const newNotes=[...notes];
    const noteitobeup=notes.findIndex((note)=>{
      return note._id === edit._id;
    })
    newNotes[noteitobeup]=edit;
    setNotes(newNotes);
    setEdit({
      _id:null,
      title:"",
      body:"",
    });
  }
  return(
    <div className='App m-5 text-align-center'>
      <h2 className='p-3 bg-warning text-center rounded-2'>Notes</h2>
      <div className='row d-flex justify-content-between align-content-center'>
      {notes&& notes.map((note)=>{
        return (
            <div key={note._id} className='bg-light col-sm-6 col-md-4 col-lg-3 m-2 p-4 border rounded-2'>
              <h3 className=''>{note.title}</h3>
              {/* //event can access all the props of the thing being clicked
              //here we cant access notes therefore we cant use event */}
              <div className='d-flex flex-column align-content-center'>
                <Button className='bg-danger border-danger p-1 m-1' onClick={()=>deleteNote(note._id)}>Delete</Button>
                <Button className='bg-success border-success p-1 m-1' onClick={()=>load(note)}>Update</Button>
              </div>
            </div>
        );
      })}
      </div>
      <div className='row d-flex justify-content-around'>
        {toggle&&(<div className='mt-5 col-lg-2 col-md-3  col-sm-6'>
              <h3 className='text-light'>Update Note</h3>
              <form onSubmit={updateNote}>
                <input className='form-control  border-success p-1 m-0 rounded-2' name="title" onChange={handleUpdation} placeholder="enter title" value={edit.title} ></input>
                <textarea  className='form-control  border-success p-1 m-0 rounded-2 '  name="body" value={edit.body}  placeholder='enter body' onChange={handleUpdation}/>
                <Button type="submit" className='bg-success border-success p-2 m-0'>update</Button>
              </form>
        </div>)}
        <div className=' mt-5 col-md-6 col-sm-12 align-items-center'>
              <h3 className='text-light'>Create Note</h3>
              <form onSubmit={createNew}>
                <input className='col-12 border-success p-1 m-0 rounded-2'  name="title" placeholder="enter title" onChange={updateCreate} value={create? create.title : ""}></input>
                <textarea  className='col-12 border-success p-1 m-0 rounded-2'  name="body" placeholder='enter body' onChange={updateCreate} value={create? create.body : ""}/>
                <Button type="submit" className='col-12 bg-success border-success p-2 m-0'>Create</Button>
              </form>
        </div>
      </div>
    </div>
  );
}
export default App;
